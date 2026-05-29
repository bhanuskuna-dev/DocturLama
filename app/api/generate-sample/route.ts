import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function POST(_req: NextRequest) {
  try {
    const message = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: `Generate 3 complete, realistic patient medical records for a clinical decision support system demo. Write them as an attending physician would document an actual outpatient encounter.

Cover these presentations (one patient per record):
1. A middle-aged patient with uncontrolled Type 2 diabetes, hypertension, and early CKD presenting for follow-up
2. An older patient with known CAD and heart failure with reduced EF presenting with worsening dyspnea and lower-extremity edema
3. A patient with hypothyroidism, metabolic syndrome (obesity, dyslipidemia, insulin resistance), and GERD presenting for annual physical

For EACH patient include ALL of the following sections:
- PATIENT DEMOGRAPHICS: name, age, sex, DOB, MRN
- CHIEF COMPLAINT
- HISTORY OF PRESENT ILLNESS (narrative, 3-5 sentences)
- PAST MEDICAL HISTORY (bulleted list)
- CURRENT MEDICATIONS (drug, dose, frequency)
- ALLERGIES
- REVIEW OF SYSTEMS (positives and pertinent negatives)
- PHYSICAL EXAMINATION: vitals (BP, HR, RR, Temp, SpO2, weight, BMI) and system findings
- LABORATORY RESULTS: include actual numeric values with reference ranges for CBC, BMP or CMP, lipid panel, HbA1c where indicated, TSH/Free T4 where indicated, urinalysis where indicated, BNP where indicated
- IMAGING / ECG FINDINGS (where clinically appropriate)
- ASSESSMENT: numbered problem list with ICD-10 codes
- PLAN: specific interventions with drug names, doses, and follow-up timeline

Use realistic slightly-abnormal lab values that reflect each disease state. Write in standard clinical style with appropriate medical abbreviations. Separate the three records with a line of equals signs.`,
      }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    if (!text) throw new Error("Empty response from model");

    return Response.json({ text, model: "claude-haiku-4-5-20251001" });
  } catch (err) {
    console.error("Generate sample error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to generate sample data" },
      { status: 500 },
    );
  }
}
