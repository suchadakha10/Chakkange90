const SECRET = "CHANGE_ME_SECRET";
const SHEET_NAME = "proofs";
const MISSION_OVERRIDE_SHEET_NAME = "mission_overrides";
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
const MISSION_OVERRIDE_HEADERS = [
  "day",
  "title",
  "focus",
  "full",
  "minimum",
  "emergency",
  "proofPrompt",
  "updatedAt",
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

function getMissionOverrideSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(MISSION_OVERRIDE_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(MISSION_OVERRIDE_SHEET_NAME);
  }

  const firstRow = sheet.getRange(1, 1, 1, MISSION_OVERRIDE_HEADERS.length).getValues()[0];
  if (firstRow[0] !== "day") {
    sheet.clear();
    sheet.appendRow(MISSION_OVERRIDE_HEADERS);
  }

  return sheet;
}

function rowsToObjects(sheet, headers) {
  const values = sheet.getDataRange().getValues();
  const rows = [];

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    if (!row[0]) continue;

    const item = {};
    for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
      const key = headers[columnIndex];
      const value = row[columnIndex];
      if (value !== "") item[key] = value;
    }
    rows.push(item);
  }

  return rows;
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

    if (params.action === "proofs") {
      return jsonOutput({ ok: true, proofs: rowsToObjects(getProofSheet(), HEADERS) });
    }

    if (params.action === "missionOverrides") {
      return jsonOutput({ ok: true, missionOverrides: rowsToObjects(getMissionOverrideSheet(), MISSION_OVERRIDE_HEADERS) });
    }

    return jsonOutput({ ok: false, error: "Unknown action" });
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

    if (payload.action === "deleteMissionOverride") {
      const day = Number(payload.day);
      if (!day) {
        return jsonOutput({ ok: false, error: "Missing day" });
      }

      const sheet = getMissionOverrideSheet();
      const values = sheet.getDataRange().getValues();

      for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
        if (Number(values[rowIndex][0]) === day) {
          sheet.deleteRow(rowIndex + 1);
          return jsonOutput({ ok: true });
        }
      }

      return jsonOutput({ ok: true });
    }

    if (payload.action === "saveMissionOverride") {
      const missionOverride = payload.missionOverride;
      if (!missionOverride || !missionOverride.day) {
        return jsonOutput({ ok: false, error: "Missing missionOverride" });
      }

      const sheet = getMissionOverrideSheet();
      const values = sheet.getDataRange().getValues();
      const day = Number(missionOverride.day);
      const row = MISSION_OVERRIDE_HEADERS.map((key) => missionOverride[key] || "");

      for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
        if (Number(values[rowIndex][0]) === day) {
          sheet.getRange(rowIndex + 1, 1, 1, MISSION_OVERRIDE_HEADERS.length).setValues([row]);
          return jsonOutput({ ok: true });
        }
      }

      sheet.appendRow(row);
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
