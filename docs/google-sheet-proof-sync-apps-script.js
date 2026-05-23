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

function jsonOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function getProofSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (firstRow[0] !== "id") {
    sheet.clear();
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function checkSecret(secret) {
  if (secret !== SECRET) {
    throw new Error("Invalid secret");
  }
}

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    checkSecret(params.secret);

    if (params.action !== "proofs") {
      return jsonOutput({ ok: false, error: "Unknown action" });
    }

    const sheet = getProofSheet();
    const values = sheet.getDataRange().getValues();
    const proofs = [];

    for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
      const row = values[rowIndex];
      if (!row[0]) continue;

      const proof = {};
      for (let columnIndex = 0; columnIndex < HEADERS.length; columnIndex += 1) {
        const key = HEADERS[columnIndex];
        const value = row[columnIndex];
        if (value !== "") proof[key] = value;
      }
      proofs.push(proof);
    }

    return jsonOutput({ ok: true, proofs });
  } catch (error) {
    return jsonOutput({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const payload = JSON.parse(body);
    checkSecret(payload.secret);

    if (payload.action === "deleteProof") {
      const proofId = payload.proofId;
      if (!proofId) {
        return jsonOutput({ ok: false, error: "Missing proofId" });
      }

      const sheet = getProofSheet();
      const values = sheet.getDataRange().getValues();

      for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
        if (values[rowIndex][0] === proofId) {
          sheet.deleteRow(rowIndex + 1);
          return jsonOutput({ ok: true });
        }
      }

      return jsonOutput({ ok: true });
    }

    if (payload.action !== "saveProof") {
      return jsonOutput({ ok: false, error: "Unknown action" });
    }

    const proof = payload.proof;
    if (!proof || !proof.id) {
      return jsonOutput({ ok: false, error: "Missing proof" });
    }

    const sheet = getProofSheet();
    const values = sheet.getDataRange().getValues();
    const existingIds = values.slice(1).map((row) => row[0]);

    if (existingIds.indexOf(proof.id) === -1) {
      const row = HEADERS.map((key) => proof[key] || "");
      sheet.appendRow(row);
    }

    return jsonOutput({ ok: true });
  } catch (error) {
    return jsonOutput({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}
