import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function POST(_req: NextRequest) {
  try {
    const message = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8096,
      messages: [{
        role: "user",
        content: `Generate 3 complete, realistic longitudinal patient medical records for a clinical decision support system demo. Write each as a current-visit note for a patient this physician has managed for 5–10 years — include the full arc of disease progression, prior therapies tried and discontinued, hospitalizations, and specialist involvement over that time.

Cover these presentations (one patient per record):
1. A 57-year-old male with Type 2 diabetes, hypertension, and CKD stage 3 — diagnosed ~9 years ago, progressively harder to control
2. A 71-year-old female with CAD, HFrEF (EF 30–35%), and atrial fibrillation — known to physician for 7 years, presenting with decompensation
3. A 48-year-old female with hypothyroidism, metabolic syndrome, GERD, and OSA — followed for 6 years, struggling with weight and lipid control

For EACH patient include ALL of the following sections:

PATIENT DEMOGRAPHICS: name, age, sex, DOB, MRN, established patient since (year)

CHIEF COMPLAINT

HISTORY OF PRESENT ILLNESS: 4–6 sentence narrative of current visit

LONGITUDINAL HISTORY (this is the key section — write 2–3 paragraphs):
- Year-by-year disease course since diagnosis: when each condition was first diagnosed, how it progressed
- Prior medications tried and why they were changed or stopped (side effects, inadequate control, cost, interactions)
- Relevant hospitalizations or ED visits with dates and outcomes
- Specialist referrals and their findings/recommendations
- Lifestyle interventions attempted (diet, weight loss programs, cardiac rehab, etc.) and adherence
- Lab trend narrative (e.g., "HbA1c was 7.1% at diagnosis, rose to 9.4% by 2022 despite medication intensification, now 8.7%")

PAST MEDICAL HISTORY: bulleted list with year of diagnosis

SURGICAL / PROCEDURAL HISTORY: relevant procedures with years

FAMILY HISTORY: first-degree relatives with relevant conditions

SOCIAL HISTORY: occupation, smoking/alcohol/drug history, activity level, diet

CURRENT MEDICATIONS: drug, dose, frequency, how long on this regimen

PREVIOUSLY TRIED MEDICATIONS (discontinued): drug, dates used, reason stopped

ALLERGIES: drug and reaction type

REVIEW OF SYSTEMS: positives and pertinent negatives across 8+ systems

PHYSICAL EXAMINATION: complete vitals (BP, HR, RR, Temp, SpO2, weight, BMI) and detailed system findings

LABORATORY RESULTS — CURRENT VISIT: actual numeric values with units and reference ranges for CBC, CMP or BMP, lipid panel, HbA1c (Patient 1 & 3), TSH/Free T4 (Patient 3), urinalysis with microalbumin (Patient 1), BNP/NT-proBNP (Patient 2), coagulation studies (Patient 2)

LABORATORY TREND (prior 3 visits): a small table showing key values (HbA1c, creatinine, LDL, BNP, TSH, etc.) across the last 3 dates to show trajectory

IMAGING / ECG / PROCEDURE FINDINGS: current and relevant historical results with dates

ASSESSMENT: numbered problem list with ICD-10 codes and brief clinical rationale

PLAN: specific next steps with drug names, doses, titration schedule, referrals, and follow-up timeline

Write in authentic attending-physician style with standard medical abbreviations. Make the history feel lived-in — include realistic setbacks, partial responses, patient adherence issues, and clinical judgment calls made over the years. Separate the three records with a line of equals signs (===).`,
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
