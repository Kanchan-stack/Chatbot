// Lightweight CSV loader and in-memory index for healthcare_dataset.csv
// Place your Kaggle CSV file at: public/healthcare_dataset.csv
// The loader will try to auto-detect column names like "disease" and "symptom".

let healthcareIndex = null;
let healthcareMeta = {
  loaded: false,
  error: null,
  rowCount: 0,
  headers: [],
  diseaseColumn: null,
  symptomColumn: null,
  severityColumn: null,
};

function normalizeHeader(header) {
  return header.trim().toLowerCase().replace(/[_\s]/g, '');
}

function detectColumns(headers) {
  const norm = headers.map(normalizeHeader);

  const findCol = (keywords) =>
    norm.findIndex((h) => keywords.some((kw) => h.includes(kw)));

  // More flexible disease column detection
  const diseaseIdx = findCol([
    "disease", "condition", "diagnosis", "disorder", "illness", 
    "diseasename", "conditionname", "diseasetype"
  ]);
  
  // More flexible symptom column detection (can be multiple)
  const symptomIdx = findCol([
    "symptom", "symptoms", "symptom1", "symptom_1", "symptomname",
    "symptomdescription", "signs", "sign"
  ]);
  
  // Find ALL symptom columns (Symptom_1, Symptom_2, etc.)
  const allSymptomIndices = [];
  headers.forEach((h, idx) => {
    const normalized = normalizeHeader(h);
    if (normalized.includes("symptom") || normalized.includes("sign")) {
      allSymptomIndices.push(idx);
    }
  });
  
  // Severity column detection
  const severityIdx = findCol([
    "severity", "risk", "level", "risklevel", "severitylevel",
    "urgency", "priority", "criticality"
  ]);

  return {
    diseaseIdx,
    symptomIdx: allSymptomIndices.length > 0 ? allSymptomIndices[0] : symptomIdx,
    allSymptomIndices: allSymptomIndices.length > 0 ? allSymptomIndices : (symptomIdx !== -1 ? [symptomIdx] : []),
    severityIdx,
  };
}

// Improved CSV parser that handles quoted fields and commas inside quotes
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  return result;
}

function parseCsv(text) {
  try {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) return { headers: [], rows: [] };

    const headers = parseCsvLine(lines[0]).map((h) => h.replace(/^"|"$/g, '').trim());
    const rows = lines.slice(1).map((line) => {
      const values = parseCsvLine(line).map(v => v.replace(/^"|"$/g, '').trim());
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] !== undefined ? values[idx] : "";
      });
      return row;
    }).filter(row => {
      // Filter out completely empty rows
      return Object.values(row).some(val => val && val.trim().length > 0);
    });

    return { headers, rows };
  } catch (err) {
    console.error("[HealthGuard] CSV parsing error:", err);
    return { headers: [], rows: [] };
  }
}

function buildIndex(headers, rows) {
  const { diseaseIdx, symptomIdx, allSymptomIndices, severityIdx } = detectColumns(headers);

  healthcareMeta.headers = headers;
  healthcareMeta.rowCount = rows.length;

  if (diseaseIdx === -1) {
    healthcareMeta.error =
      `Could not detect disease column. Found columns: ${headers.join(', ')}. Please ensure your CSV has a column with 'disease', 'condition', or 'diagnosis' in the name.`;
    return null;
  }

  if (allSymptomIndices.length === 0) {
    healthcareMeta.error =
      `Could not detect symptom column(s). Found columns: ${headers.join(', ')}. Please ensure your CSV has a column with 'symptom' in the name.`;
    return null;
  }

  const diseaseHeader = headers[diseaseIdx];
  const symptomHeaders = allSymptomIndices.map(idx => headers[idx]);
  const severityHeader = severityIdx !== -1 ? headers[severityIdx] : null;

  healthcareMeta.diseaseColumn = diseaseHeader;
  healthcareMeta.symptomColumn = symptomHeaders.length === 1 ? symptomHeaders[0] : `${symptomHeaders.length} columns`;
  healthcareMeta.severityColumn = severityHeader;

  // Map disease name -> { name, symptoms: Set<string>, severities: Set<string> }
  const diseaseMap = new Map();

  for (const row of rows) {
    const diseaseName = String(row[diseaseHeader] || "").trim();
    if (!diseaseName) continue;

    const lowerDisease = diseaseName.toLowerCase();

    if (!diseaseMap.has(lowerDisease)) {
      diseaseMap.set(lowerDisease, {
        name: diseaseName,
        symptoms: new Set(),
        severities: new Set(),
      });
    }

    const entry = diseaseMap.get(lowerDisease);

    // Process all symptom columns
    for (const symptomHeader of symptomHeaders) {
      const symptomText = String(row[symptomHeader] || "").trim();
      if (symptomText) {
        // Handle multiple symptoms in one cell (separated by semicolon, comma, or newline)
        const symptoms = symptomText.split(/[;,\n]/).map(s => s.trim()).filter(s => s.length > 0);
        symptoms.forEach(symptom => {
          entry.symptoms.add(symptom.toLowerCase());
        });
      }
    }

    if (severityHeader) {
      const sev = String(row[severityHeader] || "").trim();
      if (sev) entry.severities.add(sev.toLowerCase());
    }
  }

  return {
    diseases: diseaseMap,
  };
}

async function initHealthcareDataset() {
  try {
    const response = await fetch("/healthcare_dataset.csv");
    if (!response.ok) {
      // If the file is not found, treat it as "no external dataset" instead of a hard error.
      // The app will continue using the built-in knowledge base only.
      if (response.status === 404) {
        // eslint-disable-next-line no-console
        console.warn(
          "[HealthGuard] healthcare_dataset.csv not found in /public. Using built-in disease database only."
        );
        // Don't set error - this is expected if file doesn't exist
        return;
      }

      // Only set error for actual server errors, not 404
      healthcareMeta.error = `Failed to load healthcare_dataset.csv (HTTP ${response.status}). Please check if the file exists and the server is running.`;
      // eslint-disable-next-line no-console
      console.error("[HealthGuard] CSV load error:", healthcareMeta.error);
      return;
    }

    const text = await response.text();
    
    // Check if HTML was returned instead of CSV (common when file doesn't exist)
    if (text.trim().toLowerCase().startsWith('<!doctype html>') || 
        text.trim().toLowerCase().startsWith('<html') ||
        text.includes('<html')) {
      healthcareMeta.error = "healthcare_dataset.csv file not found. The file should be placed at: public/healthcare_dataset.csv";
      // eslint-disable-next-line no-console
      console.warn("[HealthGuard] CSV file not found - HTML response received. Please create public/healthcare_dataset.csv");
      return;
    }
    
    if (!text || text.trim().length === 0) {
      healthcareMeta.error = "healthcare_dataset.csv is empty.";
      // eslint-disable-next-line no-console
      console.error("[HealthGuard] CSV file is empty");
      return;
    }

    const { headers, rows } = parseCsv(text);

    if (!headers.length) {
      healthcareMeta.error = "Could not parse CSV headers. Please check the file format.";
      // eslint-disable-next-line no-console
      console.error("[HealthGuard] No headers found in CSV");
      return;
    }

    if (!rows.length) {
      healthcareMeta.error = "healthcare_dataset.csv has headers but no data rows.";
      // eslint-disable-next-line no-console
      console.error("[HealthGuard] No data rows found in CSV");
      return;
    }

    const index = buildIndex(headers, rows);
    if (!index) {
      // Error already set in buildIndex
      // eslint-disable-next-line no-console
      console.error("[HealthGuard] Failed to build index:", healthcareMeta.error);
      return;
    }

    healthcareIndex = index;
    healthcareMeta.loaded = true;
    healthcareMeta.error = null; // Clear any previous errors

    // Helpful log for debugging in the browser console
    // eslint-disable-next-line no-console
    console.log(
      "[HealthGuard] ✅ healthcare_dataset.csv loaded successfully:",
      {
        rows: healthcareMeta.rowCount,
        diseases: index.diseases.size,
        diseaseColumn: healthcareMeta.diseaseColumn,
        symptomColumns: healthcareMeta.symptomColumn,
        severityColumn: healthcareMeta.severityColumn || "none"
      }
    );
  } catch (err) {
    // Catch any unexpected errors and log them, but don't crash the app
    healthcareMeta.error = `Unexpected error: ${err.message || String(err)}`;
    // eslint-disable-next-line no-console
    console.error("[HealthGuard] Unexpected error loading CSV:", err);
  }
}

// Kick off loading as soon as the module is imported.
// We do NOT await it here, so the rest of the app stays synchronous.
initHealthcareDataset();

export function getHealthcareIndex() {
  return healthcareIndex;
}

export function getHealthcareMeta() {
  return healthcareMeta;
}


