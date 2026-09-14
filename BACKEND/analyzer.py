import re


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text):

    text = text.lower()

    replacements = {
        "lock out tag out": "loto",
        "lock-out tag-out": "loto",
        "lockout/tagout": "loto",
        "lock out/tag out": "loto",
        "atmospheric testing": "gas testing",
        "atmosphere testing": "gas testing",
        "gas test": "gas testing",
        "confined-space": "confined space",
        "work-at-height": "working at height"
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    text = re.sub(r"[^\w\s/-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


# ============================================================
# HELPERS
# ============================================================

def contains_any(text, phrases):
    return any(phrase in text for phrase in phrases)


def add_unique(items, value):
    if value not in items:
        items.append(value)


# ============================================================
# MAIN ANALYZER
# ============================================================

def analyze_report(text):

    original_text = text
    text = normalize_text(text)

    risk_score = 10

    category = "General Safety"

    precursors = []
    consequences = []
    actions = []
    detected_hazards = []
    evidence = []

    score_breakdown = []

    # ========================================================
    # CONFINED SPACE
    # ========================================================

    confined_phrases = [
        "confined space",
        "tank",
        "vessel",
        "manhole",
        "enclosed space"
    ]

    if contains_any(text, confined_phrases):

        category = "Confined Space"

        add_unique(
            detected_hazards,
            "Confined Space"
        )

        for phrase in confined_phrases:
            if phrase in text:
                add_unique(evidence, phrase)

        # GAS TESTING

        gas_phrases = [
            "without gas testing",
            "no gas testing",
            "gas testing not done",
            "gas testing was not done",
            "gas testing not carried out",
            "gas testing was not carried out",
            "atmosphere was not tested",
            "atmospheric testing not done",
            "atmospheric testing was not done",
            "atmospheric test not performed",
            "atmosphere not checked",
            "gas monitoring not done",
            "gas monitoring was not done"
        ]

        matched = next(
            (phrase for phrase in gas_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "No Gas Testing"
            )

            risk_score += 45

            score_breakdown.append({
                "factor": "No Gas Testing",
                "points": 45,
                "reason": "Atmospheric hazards may remain undetected."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Toxic gas exposure"
            )

            add_unique(
                actions,
                "Perform atmospheric gas testing before entry"
            )

        # PERMIT

        permit_phrases = [
            "without permit",
            "no permit",
            "permit violation",
            "permit was not obtained",
            "permit not obtained",
            "entry permit not obtained",
            "permit was missing",
            "without entry permit"
        ]

        matched = next(
            (phrase for phrase in permit_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "Permit Violation"
            )

            risk_score += 25

            score_breakdown.append({
                "factor": "Permit Violation",
                "points": 25,
                "reason": "Required authorization and safety controls may not have been verified."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Serious injury or fatality"
            )

            add_unique(
                actions,
                "Verify confined-space entry permit"
            )

        # VENTILATION

        ventilation_phrases = [
            "poor ventilation",
            "without ventilation",
            "no ventilation",
            "ventilation was inadequate",
            "inadequate ventilation",
            "ventilation not provided"
        ]

        matched = next(
            (phrase for phrase in ventilation_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "Poor Ventilation"
            )

            risk_score += 35

            score_breakdown.append({
                "factor": "Poor Ventilation",
                "points": 35,
                "reason": "Hazardous atmosphere or oxygen deficiency may develop."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Toxic atmosphere and oxygen deficiency"
            )

            add_unique(
                actions,
                "Ensure adequate ventilation before entry"
            )

    # ========================================================
    # WORKING AT HEIGHT
    # ========================================================

    height_phrases = [
        "working at height",
        "work at height",
        "elevated work",
        "scaffold",
        "roof",
        "ladder",
        "platform"
    ]

    if contains_any(text, height_phrases):

        category = "Working at Height"

        add_unique(
            detected_hazards,
            "Working at Height"
        )

        # HARNESS

        harness_phrases = [
            "without harness",
            "no harness",
            "harness not used",
            "harness was not used",
            "without safety harness",
            "fall protection not used",
            "fall protection was not used"
        ]

        matched = next(
            (phrase for phrase in harness_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "Missing Fall Protection"
            )

            risk_score += 50

            score_breakdown.append({
                "factor": "Missing Fall Protection",
                "points": 50,
                "reason": "Unprotected elevated work creates a significant fall hazard."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Fall from height causing serious injury or fatality"
            )

            add_unique(
                actions,
                "Use appropriate fall protection and safety harness"
            )

        # GUARDRAIL

        guardrail_phrases = [
            "without guardrail",
            "no guardrail",
            "missing guardrail",
            "guardrail was missing",
            "guardrail not installed",
            "guardrail was not installed"
        ]

        matched = next(
            (phrase for phrase in guardrail_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "Missing Guardrail"
            )

            risk_score += 40

            score_breakdown.append({
                "factor": "Missing Guardrail",
                "points": 40,
                "reason": "An edge-protection control is absent."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Fall from elevated platform"
            )

            add_unique(
                actions,
                "Install and verify proper guardrails"
            )

    # ========================================================
    # ELECTRICAL
    # ========================================================

    electrical_phrases = [
        "electrical",
        "electrical panel",
        "electric panel",
        "power panel",
        "energized equipment",
        "live electrical"
    ]

    if contains_any(text, electrical_phrases):

        category = "Electrical"

        add_unique(
            detected_hazards,
            "Electrical Hazard"
        )

        # LOTO

        loto_phrases = [
            "without loto",
            "no loto",
            "loto not applied",
            "loto was not applied",
            "loto not followed",
            "loto was not followed",
            "without lockout",
            "lockout not applied",
            "lockout was not applied",
            "lockout procedure not followed"
        ]

        matched = next(
            (phrase for phrase in loto_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "LOTO Violation"
            )

            risk_score += 50

            score_breakdown.append({
                "factor": "LOTO Violation",
                "points": 50,
                "reason": "Hazardous energy may not have been isolated before work."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Electric shock, arc flash or fatality"
            )

            add_unique(
                actions,
                "Apply Lockout/Tagout before starting work"
            )

        # ISOLATION

        isolation_phrases = [
            "without isolation",
            "no isolation",
            "isolation not done",
            "isolation was not done",
            "isolation not carried out",
            "energy isolation not performed",
            "electrical isolation not performed"
        ]

        matched = next(
            (phrase for phrase in isolation_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "No Electrical Isolation"
            )

            risk_score += 45

            score_breakdown.append({
                "factor": "No Electrical Isolation",
                "points": 45,
                "reason": "Electrical energy may remain present during maintenance."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Electric shock or fatality"
            )

            add_unique(
                actions,
                "Isolate and verify zero energy before work"
            )

    # ========================================================
    # FIRE / EXPLOSION
    # ========================================================

    fire_phrases = [
        "hydrocarbon",
        "oil spill",
        "gas leak",
        "flammable",
        "fire",
        "explosion",
        "combustible"
    ]

    if contains_any(text, fire_phrases):

        category = "Fire / Explosion"

        add_unique(
            detected_hazards,
            "Fire / Explosion Hazard"
        )

        leak_phrases = [
            "spill",
            "leak",
            "leakage",
            "released",
            "release"
        ]

        matched = next(
            (phrase for phrase in leak_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "Hydrocarbon Leak/Spill"
            )

            risk_score += 40

            score_breakdown.append({
                "factor": "Hydrocarbon Leak/Spill",
                "points": 40,
                "reason": "Flammable material may create an ignition and fire hazard."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Fire or explosion"
            )

            add_unique(
                actions,
                "Control the leak and remove ignition sources"
            )

        hot_work_detected = contains_any(
            text,
            [
                "hot work",
                "welding",
                "cutting",
                "grinding"
            ]
        )

        nearby = contains_any(
            text,
            [
                "near",
                "close to",
                "adjacent to",
                "without"
            ]
        )

        if hot_work_detected and nearby:

            add_unique(
                precursors,
                "Hot Work Near Flammable Material"
            )

            risk_score += 45

            score_breakdown.append({
                "factor": "Hot Work Near Flammable Material",
                "points": 45,
                "reason": "An ignition source is present near potentially flammable material."
            })

            add_unique(
                evidence,
                "hot work"
            )

            add_unique(
                consequences,
                "Fire or explosion"
            )

            add_unique(
                actions,
                "Follow hot-work permit and gas-testing requirements"
            )

    # ========================================================
    # PPE
    # ========================================================

    ppe_phrases = [
        "helmet",
        "gloves",
        "ppe",
        "safety shoes",
        "protective equipment"
    ]

    if contains_any(text, ppe_phrases):

        category = "PPE"

        add_unique(
            detected_hazards,
            "PPE Hazard"
        )

        helmet_phrases = [
            "without helmet",
            "no helmet",
            "helmet not worn",
            "helmet was not worn",
            "helmet not used"
        ]

        matched = next(
            (phrase for phrase in helmet_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "Improper PPE"
            )

            risk_score += 20

            score_breakdown.append({
                "factor": "Missing Helmet",
                "points": 20,
                "reason": "Head protection is not being used."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Head injury"
            )

            add_unique(
                actions,
                "Wear approved safety helmet"
            )

        gloves_phrases = [
            "without gloves",
            "no gloves",
            "gloves not worn",
            "gloves were not worn",
            "gloves not used"
        ]

        matched = next(
            (phrase for phrase in gloves_phrases if phrase in text),
            None
        )

        if matched:

            add_unique(
                precursors,
                "Improper PPE"
            )

            risk_score += 15

            score_breakdown.append({
                "factor": "Missing Gloves",
                "points": 15,
                "reason": "Hand protection is not being used."
            })

            add_unique(evidence, matched)

            add_unique(
                consequences,
                "Hand injury or hazardous exposure"
            )

            add_unique(
                actions,
                "Wear appropriate protective gloves"
            )

    # ========================================================
    # CHEMICAL
    # ========================================================

    chemical_phrases = [
        "chemical exposure",
        "toxic chemical",
        "hazardous chemical"
    ]

    if contains_any(text, chemical_phrases):

        add_unique(
            detected_hazards,
            "Chemical Exposure"
        )

        add_unique(
            precursors,
            "Potential Chemical Exposure"
        )

        risk_score += 30

        score_breakdown.append({
            "factor": "Chemical Exposure",
            "points": 30,
            "reason": "Hazardous substances may cause exposure or poisoning."
        })

        add_unique(
            evidence,
            "chemical exposure"
        )

        add_unique(
            consequences,
            "Chemical exposure or poisoning"
        )

        add_unique(
            actions,
            "Use appropriate chemical controls and PPE"
        )

    # ========================================================
    # SCORE
    # ========================================================

    risk_score = min(
        risk_score,
        100
    )

    # ========================================================
    # RISK LEVEL
    # ========================================================

    if risk_score >= 76:
        risk_level = "CRITICAL"

    elif risk_score >= 51:
        risk_level = "HIGH"

    elif risk_score >= 26:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    # ========================================================
    # EXPLAINABILITY
    # ========================================================

    if score_breakdown:

        total_detected_points = sum(
            item["points"]
            for item in score_breakdown
        )

        why_risk = []

        for item in score_breakdown:

            why_risk.append(
                f"{item['factor']} (+{item['points']}) — {item['reason']}"
            )

        explanation = (
            f"The NLP safety engine identified "
            f"{len(precursors)} potential SIF precursor(s). "
            f"The primary hazard category is {category}. "
            f"The prioritization score is {risk_score}/100. "
            f"The score is driven by the safety conditions detected "
            f"in the report."
        )

    else:

        total_detected_points = 0

        why_risk = [
            "No major risk factor was triggered by the current detection rules."
        ]

        explanation = (
            "The NLP safety engine did not identify a major SIF precursor "
            "using the current detection rules. Further human safety review "
            "is recommended."
        )

    # ========================================================
    # DEFAULT OUTPUTS
    # ========================================================

    if not consequences:

        consequences.append(
            "No major consequence identified by the current rule set"
        )

    if not actions:

        actions.append(
            "Review the report and follow applicable safety procedures"
        )

    if not evidence:

        evidence.append(
            "No specific evidence phrase detected"
        )

    if not detected_hazards:

        detected_hazards.append(
            "General Safety"
        )

    # ========================================================
    # RETURN
    # ========================================================

    return {

        "risk_score":
            risk_score,

        "risk_level":
            risk_level,

        "category":
            category,

        "precursors":
            precursors,

        "consequences":
            consequences,

        "actions":
            actions,

        "detected_hazards":
            detected_hazards,

        "evidence":
            evidence,

        "analysis":
            explanation,

        "why_risk":
            why_risk,

        "score_breakdown":
            score_breakdown,

        "base_score":
            10,

        "detected_points":
            total_detected_points,

        "original_report":
            original_text

    }