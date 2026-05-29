const EXPANSIONS: Record<string, string> = {
  // Cardiac
  "mi": "myocardial infarction heart attack",
  "acs": "acute coronary syndrome",
  "stemi": "ST-elevation myocardial infarction",
  "nstemi": "non-ST-elevation myocardial infarction",
  "chf": "congestive heart failure",
  "hf": "heart failure",
  "cad": "coronary artery disease",
  "afib": "atrial fibrillation",
  "vfib": "ventricular fibrillation",
  "vt": "ventricular tachycardia",
  "svt": "supraventricular tachycardia",
  "cabg": "coronary artery bypass graft",
  "pci": "percutaneous coronary intervention",
  "hocm": "hypertrophic obstructive cardiomyopathy",
  "pacs": "premature atrial contractions",
  "pvcs": "premature ventricular contractions",
  "map": "mean arterial pressure",
  // Pulmonary
  "copd": "chronic obstructive pulmonary disease",
  "pe": "pulmonary embolism",
  "ards": "acute respiratory distress syndrome",
  "sob": "shortness of breath dyspnea",
  // Metabolic / endocrine
  "dka": "diabetic ketoacidosis",
  "hhs": "hyperosmolar hyperglycemic state",
  "dm": "diabetes mellitus",
  "dm2": "type 2 diabetes mellitus",
  "dm1": "type 1 diabetes mellitus",
  "htn": "hypertension high blood pressure",
  // Renal
  "ckd": "chronic kidney disease",
  "aki": "acute kidney injury",
  "egfr": "estimated glomerular filtration rate kidney",
  "gfr": "glomerular filtration rate kidney",
  // Neuro
  "cva": "cerebrovascular accident stroke",
  "tia": "transient ischemic attack",
  "icp": "intracranial pressure",
  // Infectious / critical care
  "sepsis": "sepsis systemic infection bacteremia",
  "sirs": "systemic inflammatory response syndrome",
  "uti": "urinary tract infection",
  "dvt": "deep vein thrombosis",
  // Vitals / labs
  "bp": "blood pressure",
  "hr": "heart rate",
  "spo2": "oxygen saturation",
  "o2": "oxygen",
  "wbc": "white blood cell count leukocytes",
  "hgb": "hemoglobin",
  "hct": "hematocrit",
  "plt": "platelets thrombocytes",
  "inr": "international normalized ratio coagulation",
  "bnp": "brain natriuretic peptide heart failure marker",
  "creatinine": "creatinine kidney renal function",
  "troponin": "troponin cardiac biomarker",
  "cbc": "complete blood count",
  "bmp": "basic metabolic panel",
  "cmp": "comprehensive metabolic panel",
  // Drug classes
  "acei": "ACE inhibitor angiotensin converting enzyme inhibitor",
  "ace": "angiotensin converting enzyme",
  "arb": "angiotensin receptor blocker",
  "ccb": "calcium channel blocker",
  "statin": "statin HMG-CoA reductase inhibitor cholesterol",
  "tpa": "tissue plasminogen activator thrombolytic",
  "lmwh": "low molecular weight heparin",
  "ufh": "unfractionated heparin",
  "noac": "novel oral anticoagulant",
  "doac": "direct oral anticoagulant",
  "warfarin": "warfarin coumadin anticoagulant",
  "abx": "antibiotics",
  "pcn": "penicillin",
  // Routes / frequency
  "iv": "intravenous",
  "po": "oral by mouth",
  "sq": "subcutaneous",
  "im": "intramuscular",
  "prn": "as needed",
  "bid": "twice daily",
  "tid": "three times daily",
  "qid": "four times daily",
  "qd": "daily once daily",
  // GI
  "gerd": "gastroesophageal reflux disease acid reflux",
  "ibd": "inflammatory bowel disease",
  "gi": "gastrointestinal",
};

export function expandQuery(query: string): string {
  const tokens = query.toLowerCase().split(/\s+/);
  const extra: string[] = [];

  for (const token of tokens) {
    const clean = token.replace(/[^a-z0-9/]/g, "");
    if (clean && EXPANSIONS[clean]) extra.push(EXPANSIONS[clean]);
  }

  return extra.length ? `${query} ${extra.join(" ")}` : query;
}
