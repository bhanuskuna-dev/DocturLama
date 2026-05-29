export const SAMPLE_DOCUMENT_NAME = "Clinical Reference — Cardiology, Critical Care & Pharmacology (Sample)";

export const SAMPLE_DOCUMENT_TEXT = `
COMPREHENSIVE CLINICAL REFERENCE MANUAL
Cardiology, Critical Care, Endocrinology & Pharmacology
Version 4.2 | Internal Use Only

═══════════════════════════════════════════════════════════
SECTION 1: ACUTE CORONARY SYNDROMES (ACS)
═══════════════════════════════════════════════════════════

1.1 PATHOPHYSIOLOGY OF ACS
Acute coronary syndromes encompass a spectrum of myocardial ischemia including unstable angina (UA), non-ST-elevation myocardial infarction (NSTEMI), and ST-elevation myocardial infarction (STEMI). The unifying mechanism is rupture or erosion of an atherosclerotic plaque with subsequent thrombus formation, leading to partial or complete coronary artery occlusion. Plaque vulnerability is determined by lipid core size, fibrous cap thickness, inflammatory cell infiltration (macrophages, T-lymphocytes), and local hemodynamic shear stress. Thin-cap fibroatheromas (TCFAs) with caps <65 μm are at highest rupture risk.

In STEMI, complete occlusion leads to transmural ischemia. Time-to-reperfusion is the dominant determinant of myocardial salvage. Each 30-minute delay in primary PCI is associated with a 7.5% relative increase in 1-year mortality. The wavefront phenomenon of ischemic injury progresses from subendocardium to epicardium within 20-40 minutes of complete occlusion in the absence of collateral circulation.

1.2 DIAGNOSIS AND RISK STRATIFICATION
High-sensitivity troponin I (hsTnI) and troponin T (hsTnT) are the preferred biomarkers. The 0h/1h ESC algorithm uses hsTnI <5 ng/L at 0h with absolute change <6 ng/L at 1h to rule out NSTEMI with 99.6% negative predictive value. Troponin elevation alone is insufficient for diagnosis — clinical context, ECG changes, and symptom correlation are mandatory.

TIMI Risk Score for NSTEMI/UA (0-7 points):
- Age ≥65 years (1 point)
- ≥3 CAD risk factors (1 point)
- Prior coronary stenosis ≥50% (1 point)
- ST deviation on presenting ECG (1 point)
- ≥2 anginal events in prior 24h (1 point)
- Aspirin use in prior 7 days (1 point)
- Elevated serum cardiac markers (1 point)
Score 0-2: low risk (4.7% 14-day MACE); Score 3-4: intermediate (13.2%); Score 5-7: high (40.9%)

GRACE 2.0 Score incorporates: age, heart rate, systolic BP, serum creatinine, Killip class, cardiac arrest at admission, ST deviation, and elevated cardiac biomarkers. Score >140 indicates high in-hospital mortality risk (>3%).

1.3 MANAGEMENT PROTOCOLS

STEMI Management:
Primary PCI is the preferred reperfusion strategy when door-to-balloon time can be achieved within 120 minutes. Fibrinolysis is indicated when PCI-capable facility is unavailable within 120 minutes of symptom onset. Tenecteplase (TNK-tPA) dosing: 30mg IV if weight <60kg; 35mg if 60-70kg; 40mg if 70-80kg; 45mg if 80-90kg; 50mg if >90kg. Contraindications: prior intracranial hemorrhage, ischemic stroke within 3 months, active internal bleeding, suspected aortic dissection, significant closed head trauma within 3 months.

Dual Antiplatelet Therapy (DAPT):
Aspirin 325mg loading dose, then 81mg daily indefinitely. P2Y12 inhibitor choice:
- Ticagrelor 180mg loading, 90mg BID (preferred in ACS; reversible, faster onset) — contraindicated in prior intracranial hemorrhage, active bleeding
- Prasugrel 60mg loading, 10mg daily (avoid in age >75, weight <60kg, prior TIA/stroke; 5mg daily if age >75 or weight <60kg)
- Clopidogrel 600mg loading, 75mg daily (preferred if ticagrelor/prasugrel contraindicated or fibrinolysis given)
DAPT duration: 12 months post-ACS for bare-metal or drug-eluting stent; can extend to 30 months in high-ischemic/low-bleeding risk (DAPT score ≥2).

Anticoagulation in ACS:
Unfractionated Heparin (UFH): 60 U/kg IV bolus (max 4000U), 12 U/kg/hr infusion (max 1000 U/hr); target aPTT 50-70 seconds.
Enoxaparin: 1mg/kg SQ BID (adjust for CrCl <30: 1mg/kg SQ daily); if age >75 without loading dose: 0.75mg/kg SQ BID.
Bivalirudin: 0.75mg/kg IV bolus, 1.75mg/kg/hr infusion during PCI (preferred in HIT or high bleeding risk).
Fondaparinux: 2.5mg SQ daily (avoid as sole anticoagulant during PCI — catheter thrombosis risk without UFH supplementation).

1.4 CARDIOGENIC SHOCK
Defined as: SBP <90mmHg >30 minutes OR vasopressor requirement to maintain SBP ≥90mmHg, PLUS evidence of hypoperfusion (cool extremities, altered mentation, oliguria <0.5mL/kg/hr, lactate >2mmol/L). Mortality: 40-50% despite revascularization.

Hemodynamic profile: CI <2.2 L/min/m², PCWP >15mmHg (wet and cold). Management: immediate revascularization (PCI/CABG), inotropic support.
- Dobutamine 2-20 mcg/kg/min: positive inotrope, mild vasodilator; may exacerbate hypotension
- Norepinephrine 0.01-3 mcg/kg/min: preferred vasopressor over dopamine (lower arrhythmia risk, SOAP II trial)
- Dopamine 5-20 mcg/kg/min: increased arrhythmia risk; avoid as first-line
Mechanical circulatory support: Intra-aortic balloon pump (IABP) — no mortality benefit in SHOCK II trial; Impella CP/5.5 — 3.7L/min support, may improve outcomes in severe shock (RECOVER IV ongoing); ECMO (VA-ECMO) — 4-6L/min support, indicated for refractory cardiogenic shock.

═══════════════════════════════════════════════════════════
SECTION 2: HEART FAILURE MANAGEMENT
═══════════════════════════════════════════════════════════

2.1 CLASSIFICATION AND PHENOTYPES
HFrEF: EF <40%; HFmrEF: EF 40-49%; HFpEF: EF ≥50%.
NYHA Classification: Class I (no symptoms with ordinary activity); Class II (slight limitation); Class III (marked limitation, comfortable at rest); Class IV (symptoms at rest, bedbound).

2.2 GUIDELINE-DIRECTED MEDICAL THERAPY (GDMT) FOR HFrEF
The four pillars of GDMT reduce mortality by 60-73% in combination:

1. ACE Inhibitors/ARBs/ARNI:
Lisinopril: Start 2.5-5mg daily, target 20-40mg daily (ATLAS trial)
Sacubitril/Valsartan (ARNI): Start 24/26mg BID, target 97/103mg BID. PARADIGM-HF: 20% reduction in CV death/HF hospitalization vs. enalapril. Washout 36 hours required when switching from ACEi to prevent angioedema.

2. Beta-Blockers (only 3 are mortality-proven in HFrEF):
Carvedilol: Start 3.125mg BID, target 25mg BID (<85kg) or 50mg BID (>85kg)
Metoprolol succinate (XL): Start 12.5-25mg daily, target 200mg daily
Bisoprolol: Start 1.25mg daily, target 10mg daily
Initiate only when euvolemic; avoid in decompensated HF, HR <60, SBP <90mmHg, PR interval >0.24s, advanced AV block.

3. Mineralocorticoid Receptor Antagonists (MRA):
Spironolactone: 12.5-25mg daily, target 25-50mg daily; monitor K+ at 1 week, 1 month, then q3 months
Eplerenone: preferred in males (less gynecomastia); 25mg daily, target 50mg daily
Contraindicated: K+ >5.0 mEq/L, GFR <30 mL/min, concurrent use of potassium supplements or strong CYP3A4 inhibitors (with eplerenone)

4. SGLT2 Inhibitors (now first-line regardless of diabetes):
Dapagliflozin 10mg daily (DAPA-HF: 26% reduction in worsening HF/CV death)
Empagliflozin 10mg daily (EMPEROR-Reduced: 25% reduction)
Mechanism beyond glycosuria: natriuresis, erythropoietin stimulation, ketone utilization, mitochondrial protection
Contraindicated: eGFR <20 mL/min (dapagliflozin), eGFR <20 (empagliflozin); type 1 diabetes (DKA risk)

Additional therapies:
Ivabradine: 5mg BID (target 7.5mg BID); indicated if HR ≥70 bpm in SR despite max beta-blocker or beta-blocker intolerant; SHIFT trial: 18% reduction in CV death/HF hospitalization
Hydralazine/Isosorbide Dinitrate: A-HeFT trial demonstrated 43% mortality reduction in self-identified Black patients; consider in ACEi/ARB/ARNI-intolerant patients
Vericiguat 10mg daily: soluble guanylate cyclase stimulator; VICTORIA trial: modest reduction in CV death/HF hospitalization in high-risk patients

Device Therapy:
ICD: EF ≤35%, NYHA II-III, >1 year expected survival on optimal GDMT, >40 days post-MI or >3 months on GDMT
CRT: EF ≤35%, LBBB with QRS ≥150ms (greatest benefit); QRS 130-149ms with LBBB or non-LBBB with QRS ≥150ms
LVAD: INTERMACS profile 2-4; bridge to transplant or destination therapy; HeartMate 3 — 88% survival at 2 years (MOMENTUM 3)

═══════════════════════════════════════════════════════════
SECTION 3: CRITICAL CARE — SEPSIS & SEPTIC SHOCK
═══════════════════════════════════════════════════════════

3.1 DEFINITIONS (SEPSIS-3, 2016)
Sepsis: Life-threatening organ dysfunction caused by dysregulated host response to infection.
Organ dysfunction defined by SOFA score increase ≥2 points.
Quick SOFA (qSOFA): ≥2 of: RR ≥22/min, altered mentation (GCS <15), SBP ≤100mmHg — screen tool only, not diagnostic.

Septic Shock: Sepsis + vasopressor requirement to maintain MAP ≥65mmHg + lactate >2 mmol/L despite adequate fluid resuscitation. In-hospital mortality >40%.

3.2 THE HOUR-1 BUNDLE (Surviving Sepsis Campaign 2018)
1. Measure lactate; remeasure if initial >2 mmol/L
2. Obtain blood cultures before antibiotics (do not delay antibiotics >45 min to obtain cultures)
3. Administer broad-spectrum antibiotics
4. Begin 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L
5. Apply vasopressors for MAP <65 mmHg during/after fluid resuscitation

3.3 ANTIBIOTIC SELECTION
Empiric therapy should be initiated within 1 hour of sepsis recognition. Each hour of delay increases mortality by 7-8%.

Community-acquired sepsis, unknown source:
Piperacillin-tazobactam 4.5g IV q6h (or q8h extended infusion 3-4h)
+ Vancomycin 25-30 mg/kg IV loading dose (target AUC/MIC 400-600; trough-based monitoring no longer recommended per ASHP/SIDP 2020)

Hospital-acquired/VAP/high MDR risk:
Meropenem 1g IV q8h (2g q8h for CNS penetration)
OR Imipenem-cilastatin 500mg IV q6h
+ Vancomycin (if MRSA risk) OR Linezolid 600mg IV/PO q12h (superior lung tissue penetration; serotonin syndrome risk with SSRIs/SNRIs)
+ Consider: Caspofungin 70mg IV loading then 50mg daily if Candida risk (TPN, broad-spectrum antibiotics >4 days, renal replacement therapy, immunosuppression)

Neutropenic fever/febrile neutropenia:
Cefepime 2g IV q8h (preferred; covers Pseudomonas)
OR Piperacillin-tazobactam 4.5g IV q6h
Add vancomycin only if: hemodynamic instability, skin/catheter infection, known MRSA, severe mucositis

3.4 FLUID RESUSCITATION AND HEMODYNAMIC MANAGEMENT
Initial resuscitation: 30 mL/kg IV crystalloid within 3 hours. Balanced crystalloids (Lactated Ringer's, PlasmaLyte) preferred over normal saline — SMART trial: NS associated with higher MAKE30 (major adverse kidney events). Avoid albumin as primary resuscitation fluid; use albumin 20% if aggressive resuscitation required.

Dynamic fluid responsiveness assessment (preferred over static CVP/PCWP):
- Passive Leg Raise (PLR): >10% increase in CO/pulse pressure = fluid responsive (90% sensitivity/specificity)
- Pulse Pressure Variation (PPV): >13% in mechanically ventilated, sinus rhythm = fluid responsive
- Stroke Volume Variation (SVV): >10-15% = fluid responsive

Vasopressors (target MAP ≥65mmHg; individualize for chronic hypertension):
- Norepinephrine: first-line; 0.01-3 mcg/kg/min; α>β adrenergic effects
- Vasopressin 0.03-0.04 U/min: add if NE dose >0.25 mcg/kg/min; VASST trial: no overall mortality benefit but reduced NE requirements
- Epinephrine: second-line; add for refractory shock; increases lactate (glycolysis stimulation — not necessarily worsened perfusion)
- Angiotensin II (Giapreza): 20 ng/kg/min, titrate to 200 ng/kg/min; ATHOS-3: reduced vasopressor requirements; thrombotic risk, supplement with VTE prophylaxis
- Phenylephrine: avoid in septic shock (pure alpha; reduces CO); acceptable in tachyarrhythmias where NE contraindicated

Corticosteroids: Hydrocortisone 200mg/day IV (50mg q6h or 200mg continuous infusion) if septic shock refractory to adequate fluid resuscitation + vasopressors. ADRENAL trial: no 90-day mortality benefit but faster shock reversal. Add Fludrocortisone 50mcg daily (APROCCHSS trial: improved 90-day survival with combination).

3.5 MECHANICAL VENTILATION IN ARDS
Berlin Definition ARDS:
- Mild: PaO2/FiO2 200-300 mmHg
- Moderate: PaO2/FiO2 100-200 mmHg
- Severe: PaO2/FiO2 <100 mmHg

Lung-Protective Ventilation (ARDSNet protocol):
Tidal volume: 6 mL/kg predicted body weight (PBW)
PBW male: 50 + 2.3 × (height in inches - 60)
PBW female: 45.5 + 2.3 × (height in inches - 60)
Plateau pressure: ≤30 cmH2O
Driving pressure (Pplat - PEEP): target <15 cmH2O (independent mortality predictor)
PEEP: titrate per ARDSNet PEEP/FiO2 table or esophageal pressure monitoring
Permissive hypercapnia: pH ≥7.20 acceptable to maintain lung-protective targets

Rescue therapies for severe ARDS (PaO2/FiO2 <150):
Prone positioning: ≥16h/day; PROSEVA trial: 28-day mortality 32.8% vs 16.0% (NNT=6)
Neuromuscular blockade: Cisatracurium 37.5mg bolus then 37.5mg/hr; benefit mainly if initiated within 48h, P-SILI prevention
Inhaled nitric oxide: 5-40 ppm; improves oxygenation in 60% but no mortality benefit
VV-ECMO: EOLIA trial: 60-day mortality 35% vs 46% (NS, but crossover confounded); consider for PaO2/FiO2 <80 despite optimal conventional ventilation

═══════════════════════════════════════════════════════════
SECTION 4: ENDOCRINOLOGY — DIABETES & ENDOCRINE EMERGENCIES
═══════════════════════════════════════════════════════════

4.1 DIABETIC KETOACIDOSIS (DKA) MANAGEMENT
Diagnostic criteria: glucose >250 mg/dL (may be euglycemic in SGLT2i use), pH <7.30, bicarbonate <18 mEq/L, anion gap >12, positive ketones (serum/urine).

Severity: Mild (pH 7.25-7.30, bicarb 15-18, AG >12, alert); Moderate (pH 7.00-7.24, bicarb 10-14, drowsy); Severe (pH <7.00, bicarb <10, stupor/coma).

Fluid resuscitation: 0.9% NS 1L IV over 1st hour. Subsequent rate based on hemodynamic status, Na, urine output:
- Hypo/normonatremic: 0.9% NS at 250-500 mL/hr
- Hypernatremic: 0.45% NS at 250-500 mL/hr
Add dextrose (D5W or D5 0.45NS) when glucose reaches 200-250 mg/dL

Insulin therapy: Regular insulin 0.1 U/kg IV bolus then 0.1 U/kg/hr infusion. Target glucose drop: 50-75 mg/dL/hr. Do NOT start insulin until K+ ≥3.5 mEq/L (replace first). Switch to SQ basal-bolus when: pH >7.30, bicarb >15, AG <12, tolerating PO — overlap IV insulin with SQ by 2 hours.

Potassium replacement: K+ <3.5: hold insulin, give KCl 20-40 mEq/hr IV until ≥3.5; K+ 3.5-5.0: add 20-30 mEq/L to IV fluids; K+ >5.0: no replacement, monitor q2h.

Bicarbonate: Only if pH <6.9 — 100 mEq NaHCO3 in 400mL sterile water + 20mEq KCl over 2 hours; reassess. Associated risks: paradoxical CNS acidosis, hypokalemia, delayed ketone clearance.

Phosphate: Replace if <1.0 mg/dL or symptomatic (hemolytic anemia, respiratory muscle weakness, cardiac dysfunction).

4.2 HYPEROSMOLAR HYPERGLYCEMIC STATE (HHS)
Glucose typically >600 mg/dL, osmolarity >320 mOsm/kg, pH >7.30, bicarbonate >18, minimal ketonemia. Higher mortality than DKA (10-20% vs 1-5%).

Fluid deficit: typically 8-12L. Correct half in first 12h, remainder over next 12-24h.
Insulin: more cautious approach; start 0.05 U/kg/hr. Avoid rapid glucose correction — cerebral edema risk.
Thromboprophylaxis: mandatory (hyperosmolarity + dehydration = hypercoagulable state).

4.3 THYROID STORM (THYROTOXIC CRISIS)
Burch-Wartofsky Point Scale (BWPS) ≥45 = thyroid storm:
Thermoregulatory: 37-37.7°C (5pts); 37.8-38.3°C (10); 38.4-38.8°C (15); 38.9-39.4°C (20); 39.5-39.9°C (25); ≥40°C (30pts)
CNS: absent (0); mild agitation (10); delirium/psychosis/extreme lethargy (20); seizure/coma (30)
GI: absent (0); diarrhea/nausea/vomiting/abdominal pain (10); unexplained jaundice (20)
Cardiovascular: HR 99-109 (5); 110-119 (10); 120-129 (15); 130-139 (20); ≥140 (25); absent AF (0); AF (10); HF (15); HF+AF (25)

Management sequence (order critical):
1. PTU 200mg q4h (blocks synthesis AND peripheral T4→T3 conversion; preferred over methimazole in storm)
2. Iodine (1 hour AFTER PTU — Wolff-Chaikoff effect): Lugol's solution 5-10 drops TID OR SSKI 2-3 drops BID OR lithium 300mg TID if iodine allergic
3. Propranolol 1-2mg IV q15min (max 6mg) then 60-80mg PO q4h — blocks peripheral conversion + sympathomimetic effects
4. Hydrocortisone 300mg IV loading, then 100mg IV q8h (blocks T4→T3 conversion, addresses adrenal insufficiency)
5. Cholestyramine 4g TID (interrupts enterohepatic recirculation of thyroid hormones)
6. Treat precipitant (infection, surgery, radioiodine, contrast media, amiodarone, parturition)

═══════════════════════════════════════════════════════════
SECTION 5: PHARMACOLOGY — HIGH-ALERT MEDICATIONS
═══════════════════════════════════════════════════════════

5.1 ANTICOAGULANT PHARMACOLOGY AND REVERSAL

Warfarin:
Mechanism: Inhibits vitamin K epoxide reductase (VKOR), blocking γ-carboxylation of factors II, VII, IX, X, protein C, protein S.
CYP2C9 metabolizes warfarin; significant interactions: amiodarone, fluconazole, metronidazole (increase effect); rifampin, carbamazepine, St. John's Wort (decrease effect).
Reversal: Supratherapeutic INR without bleeding — hold warfarin ± vitamin K1 PO 1-2.5mg (INR 4-10) or 2.5-5mg (INR >10). Major/life-threatening bleeding: 4-factor PCC (Kcentra) 25-50 IU/kg IV + vitamin K1 10mg IV slow infusion.

Direct Oral Anticoagulants (DOACs):
Dabigatran (direct thrombin inhibitor, IIa): renal clearance 80%; avoid if CrCl <30. Reversal: Idarucizumab (Praxbind) 5g IV (two 2.5g doses); dialyzable.
Rivaroxaban/Apixaban/Edoxaban (direct Xa inhibitors): hepatic/renal clearance variable. Reversal: Andexanet alfa (Andexxa): Rivaroxaban/Edoxaban — low dose (400mg bolus + 480mg 2hr infusion); Apixaban >5mg or within 8h — high dose (800mg + 960mg 2hr). Ciraparantag (universal reversal agent): Phase III trials; reverses all DOACs and heparin.
Non-specific reversal (if specific agents unavailable): 4-factor PCC 50 IU/kg (for Xa inhibitors); aPCC (FEIBA) 50-100 U/kg for dabigatran.

Heparin-Induced Thrombocytopenia (HIT):
4T Score: Thrombocytopenia (magnitude/timing), Timing of platelet fall, Thrombosis, other causes of Thrombocytopenia. Score ≥4 = intermediate/high probability.
Immediate management: STOP all heparin (including flushes, heparin-coated catheters). Start non-heparin anticoagulant: Argatroban (hepatic metabolism — preferred in renal failure) 2 mcg/kg/min infusion, target aPTT 1.5-3x normal; Fondaparinux 7.5mg SQ daily (off-label, lower bleeding risk); Bivalirudin (preferred in PCI/hepatic failure).
Do NOT give warfarin until platelet count >150,000 (protein C depletion risk → limb gangrene).

5.2 VASOPRESSOR AND INOTROPE PHARMACOLOGY

Receptor pharmacology:
α1: vasoconstriction (arterial + venous), ↑SVR
β1: ↑HR, ↑contractility, ↑conduction velocity
β2: bronchodilation, vasodilation, ↓SVR, hypokalemia
Dopaminergic (D1/D2): renal/mesenteric vasodilation at low doses (1-3 mcg/kg/min)

Agent profiles:
Norepinephrine: α1 >> β1 (minimal β2); reliable MAP ↑, modest CO effect
Epinephrine: β1=β2 >> α1 at low doses; α1 dominant at high doses; increases lactate (not perfusion failure)
Dopamine: D1 (1-3), β1 (3-10), α1 (>10 mcg/kg/min); variable, unpredictable
Dobutamine: β1 >> β2 >> α1; ↑CO, ↓SVR; may ↓MAP — combine with vasopressor if hypotensive
Milrinone: PDE3 inhibitor; ↑cAMP → ↑contractility + vasodilation; half-life 2.5h; renal clearance; avoid in hypotension; useful in β-blocker toxicity
Vasopressin: V1 receptor (vascular smooth muscle) → vasoconstriction independent of adrenergic pathway; V2 receptor (renal) → water reabsorption; reduces NE requirements; no tachycardia; mesenteric ischemia at doses >0.04 U/min
Levosimendan: calcium sensitizer + KATP channel opener; ↑contractility without ↑O2 demand; half-life 80h (active metabolite); not available in USA; REVIVE II/SURVIVE trials: no mortality benefit over dobutamine

5.3 NEUROMUSCULAR BLOCKING AGENTS (NMBAs)

Depolarizing:
Succinylcholine: rapid onset (45-60s), short duration (10-15min); ACh receptor agonist → persistent depolarization; dose 1.5 mg/kg IV (RSI). Contraindications: >24h post-burn/crush/spinal cord injury (hyperkalemia risk — upregulation of acetylcholine receptors); personal/family history of malignant hyperthermia; myopathies with potential for rhabdomyolysis; penetrating eye injury (raises IOP).

Non-depolarizing agents:
Rocuronium: 1.2 mg/kg IV for RSI (equivalent onset to succinylcholine at this dose); duration 60-90min. Reversal: Sugammadex 16 mg/kg IV (immediate reversal of 1.2 mg/kg dose) — encapsulates rocuronium/vecuronium. 4 mg/kg if 2 twitches on TOF. 2 mg/kg if spontaneous recovery to T2. Note: sugammadex renders hormonal contraception ineffective for 7 days.
Cisatracurium: Hofmann elimination (spontaneous non-enzymatic degradation — preferred in hepatic/renal failure); no histamine release; intermediate duration 45-75min. Used for prolonged paralysis in ARDS (37.5 mg bolus + 37.5 mg/hr). Reversal: Neostigmine 0.03-0.07 mg/kg + Glycopyrrolate 0.2mg per 1mg neostigmine (to prevent muscarinic side effects).

TOF monitoring: peripheral nerve stimulator at adductor pollicis. Four twitches = minimal block; zero twitches = full block for RSI/intubation. Sugammadex preferred over neostigmine for reversal (faster, more complete, no ceiling effect).

5.4 DRUG INTERACTIONS IN THE ICU — HIGH-RISK COMBINATIONS

QT prolongation (additive risk — monitor ECG, correct electrolytes):
Amiodarone + azithromycin/fluoroquinolones + haloperidol + methadone + ondansetron (>32mg IV — FDA warning). Threshold for concern: QTc >500ms or increase >60ms from baseline.

Serotonin syndrome (triad: altered mental status, autonomic instability, neuromuscular abnormalities):
Linezolid (weak MAOI) + SSRIs/SNRIs/tramadol/fentanyl/meperidine/dextromethorphan
Fentanyl (less serotonergic than meperidine); methadone (moderate risk); treatment: cyproheptadine 4-8mg PO/NG, supportive care, benzos for agitation.

Nephrotoxic combinations:
Vancomycin + piperacillin-tazobactam: AKI risk 2-3x higher vs. vancomycin + cefepime (ACCP/ASHP 2020 guidance: prefer cefepime combination when piptazo not specifically needed)
NSAIDs + ACEi/ARB + diuretics: "triple whammy" — high AKI risk in volume-depleted patients
Aminoglycosides + amphotericin B + cyclosporine/tacrolimus: synergistic nephrotoxicity

CYP interactions (clinical significance):
CYP3A4 inhibitors (↑levels): azole antifungals, clarithromycin, diltiazem, verapamil, grapefruit — increase levels of: fentanyl, midazolam, tacrolimus, cyclosporine, statins, many DOACs
CYP3A4 inducers (↓levels): rifampin, phenytoin, carbamazepine, St. John's Wort — markedly reduce efficacy of DOACs (avoid concurrent use), tacrolimus (requires dose tripling), oral contraceptives
CYP2D6 inhibitors: fluoxetine, paroxetine — inhibit codeine/tramadol conversion to active metabolites (reduced analgesia), increase metoprolol/carvedilol levels (bradycardia risk)

═══════════════════════════════════════════════════════════
SECTION 6: NEUROLOGY — STROKE AND ELEVATED ICP
═══════════════════════════════════════════════════════════

6.1 ACUTE ISCHEMIC STROKE
Time windows:
IV Alteplase (tPA) 0.9 mg/kg (max 90mg; 10% bolus, 90% over 60min): 0-4.5h from symptom onset. WAKE-UP trial: MRI-guided thrombolysis (DWI-FLAIR mismatch) in wake-up stroke.
Exclusions for tPA beyond standard: Age >80 + NIHSS >25 + prior stroke + diabetes (relative); oral anticoagulation regardless of INR; NIHSS >25 (relative); glucose <50 or >400.
Endovascular thrombectomy (EVT): 0-24h (DAWN/DEFUSE3 criteria); large vessel occlusion (ICA, M1, proximal M2, basilar); ASPECTS ≥6; mismatch criteria for 6-24h window. tPA does not preclude EVT (bridge therapy).

Blood pressure management:
Pre-tPA: treat if BP ≥185/110 (labetalol 10-20mg IV, nicardipine 5mg/hr titrated, clevidipine 1-2mg/hr)
Post-tPA: maintain <180/105 for 24 hours
No tPA: permissive hypertension (do not treat unless >220/120) — lowering BP may worsen penumbral perfusion
Hemorrhagic transformation risk factors: large infarct volume, late treatment, hyperglycemia, anticoagulation, hypertension post-tPA.

6.2 ELEVATED INTRACRANIAL PRESSURE (ICP) MANAGEMENT
Cerebral perfusion pressure (CPP) = MAP - ICP. Target CPP 60-70 mmHg.
ICP >20 mmHg is pathological; sustained ICP >40 mmHg is typically fatal.

Tier 1 (first-line):
Head of bed 30°; avoid neck flexion/compression of jugular veins; treat pain/agitation (↑ICP with Valsalva)
Osmotherapy: Mannitol 0.25-1g/kg IV over 20min (onset 20min, duration 4-6h); maintain serum osmolarity <320 mOsm/kg, hold if >320; contraindicated in renal failure
Hypertonic saline: 23.4% NaCl 30mL IV bolus (central line only) or 3% NaCl 150-250mL over 20-30min; target Na 145-155 mEq/L for intracranial hypertension. Preferred over mannitol in hemorrhagic stroke/hypovolemia.

Tier 2 (refractory ICP):
Sedation/paralysis: propofol 5-50 mcg/kg/min + fentanyl; benzodiazepines for refractory ICP spikes
Hyperventilation: target PaCO2 30-35 mmHg; temporary bridge only (vasoconstriction reduces CBF — use only for impending herniation); PaCO2 <30 causes ischemia
Therapeutic hypothermia: 33-35°C; reduces cerebral metabolic rate ~7% per °C; limited RCT evidence for ICP reduction but used in TBI

Tier 3 (last resort):
Barbiturate coma: pentobarbital 10mg/kg loading (over 30min) then 1-3mg/kg/hr; EEG burst suppression target; hypotension common — vasopressor support required; predictable immunosuppression
Decompressive craniectomy: DECRA trial (TBI): reduces ICP but worsens functional outcomes; DESTINY II (malignant MCA infarction): reduces mortality, functional outcomes age-dependent (benefit in <60y)

═══════════════════════════════════════════════════════════
SECTION 7: NEPHROLOGY — AKI AND RENAL REPLACEMENT THERAPY
═══════════════════════════════════════════════════════════

7.1 ACUTE KIDNEY INJURY (AKI) — KDIGO STAGING
Stage 1: Creatinine 1.5-1.9x baseline OR increase ≥0.3 mg/dL within 48h; UO <0.5 mL/kg/hr for 6-12h
Stage 2: Creatinine 2.0-2.9x baseline; UO <0.5 mL/kg/hr for ≥12h
Stage 3: Creatinine ≥3x baseline OR ≥4.0 mg/dL OR initiation of RRT OR age <18 with GFR <35 mL/min; UO <0.3 mL/kg/hr for ≥24h or anuria ≥12h

Biomarkers beyond creatinine: NGAL (neutrophil gelatinase-associated lipocalin) — early marker (rises within 2h vs. 24-48h for creatinine); KIM-1 (kidney injury molecule-1) — tubular injury; IGFBP7 and TIMP-2 (NephroCheck) — G1 cell cycle arrest markers, predict severe AKI within 12h.

7.2 INDICATIONS FOR RENAL REPLACEMENT THERAPY (RRT)
AEIOU mnemonic:
A — Acidosis (pH <7.1 refractory to medical management)
E — Electrolyte abnormalities (K+ >6.5 or rapidly rising; severe hyponatremia/hypernatremia refractory to management)
I — Intoxication (dialyzable: methanol, ethylene glycol, lithium, salicylates, theophylline)
O — Overload (fluid overload >10% body weight with respiratory compromise refractory to diuresis)
U — Uremia (BUN >100 OR uremic symptoms: encephalopathy, pericarditis, bleeding)

RRT modalities:
CRRT (CVVHDF/CVVHD/CVVH): preferred in hemodynamically unstable ICU patients; slow, continuous; 20-25 mL/kg/hr effluent dose (KDIGO recommendation); anticoagulation with UFH or citrate (regional anticoagulation — preferred, reduces systemic bleeding, extends filter life).
IHD (Intermittent hemodialysis): hemodynamically stable patients; 3-4h sessions 3x/week; more efficient urea clearance; better for intoxications requiring rapid solute removal.
SLED (Sustained Low-Efficiency Dialysis): 6-12h sessions; compromise between IHD efficiency and CRRT hemodynamic tolerance.

Drug dosing in RRT: significant adjustments required. Examples: meropenem — standard dose CRRT (continuous adequate clearance); vancomycin — load 25-30 mg/kg, then guided by AUC monitoring (CRRT clearance variable); piperacillin-tazobactam — 2.25-3.375g q6-8h extended infusion; cefepime — reduce to 1-2g q12-24h in CRRT.

This reference document is for clinical educational purposes. All treatment decisions must be individualized based on patient-specific factors, current evidence, institutional protocols, and clinical judgment. Refer to primary literature and current guidelines for definitive guidance.
`;
