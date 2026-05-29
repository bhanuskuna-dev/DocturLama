import { EvalPair } from "./types";

export const GOLDEN_DATASET: EvalPair[] = [
  {
    id: "eval-001",
    question: "What is the recommended first-line treatment for type 2 diabetes?",
    expectedAnswer: "Metformin is the recommended first-line pharmacotherapy for type 2 diabetes, alongside lifestyle modifications including diet and exercise.",
    category: "Pharmacology",
  },
  {
    id: "eval-002",
    question: "What are the major risk factors for myocardial infarction?",
    expectedAnswer: "Major risk factors include hypertension, hyperlipidemia, smoking, diabetes mellitus, obesity, family history, age, and sedentary lifestyle.",
    category: "Cardiology",
  },
  {
    id: "eval-003",
    question: "What are the diagnostic criteria for sepsis?",
    expectedAnswer: "Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection, identified by a SOFA score increase of 2 or more.",
    category: "Critical Care",
  },
  {
    id: "eval-004",
    question: "What is the mechanism of action of ACE inhibitors?",
    expectedAnswer: "ACE inhibitors block the angiotensin-converting enzyme, preventing conversion of angiotensin I to angiotensin II, thereby reducing vasoconstriction and aldosterone secretion.",
    category: "Pharmacology",
  },
  {
    id: "eval-005",
    question: "What are the hallmark signs of Cushing syndrome?",
    expectedAnswer: "Hallmarks include central obesity, moon face, buffalo hump, purple striae, proximal muscle weakness, hypertension, and glucose intolerance.",
    category: "Endocrinology",
  },
  {
    id: "eval-006",
    question: "What is the recommended antibiotic for community-acquired pneumonia in outpatient adults?",
    expectedAnswer: "Amoxicillin or doxycycline is recommended for healthy adults without comorbidities; azithromycin is an alternative in areas with low macrolide resistance.",
    category: "Infectious Disease",
  },
  {
    id: "eval-007",
    question: "What are the stages of chronic kidney disease?",
    expectedAnswer: "CKD has 5 stages based on GFR: Stage 1 (≥90), Stage 2 (60–89), Stage 3a (45–59), Stage 3b (30–44), Stage 4 (15–29), Stage 5 (<15 mL/min/1.73m²).",
    category: "Nephrology",
  },
  {
    id: "eval-008",
    question: "What is the Glasgow Coma Scale and how is it scored?",
    expectedAnswer: "The GCS assesses consciousness via Eye (1–4), Verbal (1–5), and Motor (1–6) responses. Total score ranges 3–15; ≤8 typically indicates severe impairment.",
    category: "Neurology",
  },
  {
    id: "eval-009",
    question: "What are contraindications to thrombolytic therapy in stroke?",
    expectedAnswer: "Contraindications include hemorrhagic stroke history, recent surgery, active bleeding, severe hypertension (>185/110), and stroke onset >4.5 hours prior.",
    category: "Neurology",
  },
  {
    id: "eval-010",
    question: "What is the normal range for serum potassium and what are symptoms of hypokalemia?",
    expectedAnswer: "Normal serum potassium is 3.5–5.0 mEq/L. Hypokalemia symptoms include muscle weakness, cramps, constipation, polyuria, and cardiac arrhythmias.",
    category: "Electrolytes",
  },
];
