const SECRET = "CHANGE_ME_SECRET";
const SHEET_NAME = "proofs";
const HEADERS = [
  "id",
  "day",
  "level",
  "proofType",
  "title",
  "notes",
  "url",
  "createdAt",
  "downgradedFrom",
  "downgradeReason",
];

function getProofSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function outputJson(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function assertSecret(secret) {
  if (secret !== SECRET) throw new Error("Invalid secret");
}

function doGet(event) {
  try {
    assertSecret(event.parameter.secret);
    const action = event.parameter.action;
    if (action !== "proofs") return outputJson({ ok: false, error: "Unknown action" });

    const sheet = getProofSheet();
    const values = sheet.getDataRange().getValues();
    const rows = values.slice(1);
    const proofs = rows
      .filter((row) => row[0])
      .map((row) =>
        HEADERS.reduce((proof, key, index) => {
          if (row[index] !== "") proof[key] = row[index];
          return proof;
        }, {}),
      );

    return outputJson({ ok: true, proofs });
  } catch (error) {
    return outputJson({ ok: false, error: String(error.message || error) });
  }
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents);
    assertSecret(payload.secret);
    if (payload.action !== "saveProof") return outputJson({ ok: false, error: "Unknown action" });

    const proof = payload.proof;
    const sheet = getProofSheet();
    const values = sheet.getDataRange().getValues();
    const existingIds = values.slice(1).map((row) => row[0]);

    if (!existingIds.includes(proof.id)) {
      sheet.appendRow(HEADERS.map((key) => proof[key] || ""));
    }

    return outputJson({ ok: true });
  } catch (error) {
    return outputJson({ ok: false, error: String(error.message || error) });
  }
}
