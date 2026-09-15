import re


# ======================================================
# TEXT NORMALIZATION
# ======================================================

def normalize_text(text):
    if not text:
        return ""

    text = str(text).lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ======================================================
# HELPER FUNCTIONS
# ======================================================

def contains_any(text, phrases):
    return any(phrase in text for phrase in phrases)


def unique_list(items):
    return list(dict.fromkeys(items))


# ======================================================
# STRUCTURED REPORT BUILDER
# ======================================================

def build_report(
    location="",
    activity="",
    incident="",
    unsafe_act="",
    controls="",
    ppe="",
    details=""
):
    parts = []

    if location:
        parts.append(f"Location / Work Area: {location}")

    if activity:
        parts.append(f"Activity / Task: {activity}")

    if incident:
        parts.append(f"Incident / Observation: {incident}")

    if unsafe_act:
        parts.append(f"Unsafe Act / Unsafe Condition: {unsafe_act}")

    if controls:
        parts.append(f"Existing Safety Controls: {controls}")

    if ppe:
        parts.append(f"PPE: {ppe}")

    if details:
        parts.append(f"Additional Details: {details}")

    return ". ".join(parts)


# ======================================================
# ANALYZER
# ======================================================

def analyze_report(report):

    text = normalize_text(report)

    base_score = 10
    detected_points = 0

    precursors = []
    consequences = []
    actions = []
    detected_hazards = []
    evidence = []
    score_breakdown = []

    categories = []

    # ==================================================
    # CONFINED SPACE
    # ==================================================

    confined_space_context = contains_any(text, [
        "confined space",
        "entered a confined",
        "entered the vessel",
        "entered vessel",
        "entered the tank",
        "entered tank",
        "inside the vessel",
        "inside vessel",
        "inside the tank",
        "inside tank",
        "entered the manhole",
        "entered manhole",
        "inside the manhole",
        "inside manhole",
        "underground chamber",
        "valve chamber",
        "process vessel",
        "storage tank",
        "internal inspection"
    ])

    if confined_space_context:

        categories.append("Confined Space")

        # ------------------------------
        # GAS TESTING
        # ------------------------------

        no_gas_testing = contains_any(text, [
            "without gas testing",
            "without gas test",
            "no gas testing",
            "no gas test",
            "gas testing was not carried out",
            "gas testing was not done",
            "gas test was not carried out",
            "gas test was not done",
            "gas testing not carried out",
            "gas testing not done",
            "gas test not carried out",
            "gas test not done",
            "gas testing was skipped",
            "gas testing skipped"
        ])

        gas_testing_completed = contains_any(text, [
            "gas testing was completed",
            "gas testing was carried out",
            "gas testing was done",
            "gas test was completed",
            "gas test was carried out",
            "gas test was done",
            "atmospheric testing was completed",
            "atmospheric testing was carried out"
        ])

        if no_gas_testing and not gas_testing_completed:

            precursors.append("No Gas Testing")

            consequences.append(
                "Exposure to toxic or oxygen-deficient atmosphere"
            )

            actions.append(
                "Conduct atmospheric gas testing before entry"
            )

            detected_hazards.append(
                "Atmospheric hazard in confined space"
            )

            evidence.append(
                "Gas testing was not carried out before entry"
            )

            detected_points += 45

            score_breakdown.append({
                "factor": "No Gas Testing",
                "points": 45
            })

        # ------------------------------
        # ENTRY PERMIT
        # ------------------------------

        no_permit = contains_any(text, [
            "without permit",
            "without entry permit",
            "no permit",
            "no entry permit",
            "permit violation",
            "entry permit was not obtained",
            "entry permit was not issued",
            "permit was not obtained",
            "permit was not issued"
        ])

        permit_available = contains_any(text, [
            "permit was obtained",
            "entry permit was obtained",
            "permit was issued",
            "entry permit was issued",
            "valid permit"
        ])

        if no_permit and not permit_available:

            precursors.append("Permit Violation")

            consequences.append(
                "Unauthorized entry and uncontrolled hazardous work"
            )

            actions.append(
                "Obtain and verify the required entry permit"
            )

            detected_hazards.append(
                "Permit control failure"
            )

            evidence.append(
                "Required entry permit was not obtained"
            )

            detected_points += 25

            score_breakdown.append({
                "factor": "Permit Violation",
                "points": 25
            })

        # ------------------------------
        # VENTILATION
        # ------------------------------

        if contains_any(text, [
            "poor ventilation",
            "poorly ventilated",
            "insufficient ventilation",
            "inadequate ventilation",
            "ventilation was inadequate",
            "ventilation was poor"
        ]):

            precursors.append("Poor Ventilation")

            consequences.append(
                "Accumulation of hazardous gases or oxygen deficiency"
            )

            actions.append(
                "Provide adequate ventilation before and during entry"
            )

            detected_hazards.append(
                "Inadequate ventilation"
            )

            evidence.append(
                "Poor or inadequate ventilation was observed"
            )

            detected_points += 35

            score_breakdown.append({
                "factor": "Poor Ventilation",
                "points": 35
            })

    # ==================================================
    # WORKING AT HEIGHT
    # ==================================================

    height_context = contains_any(text, [
        "working at height",
        "work at height",
        "working at an elevated",
        "elevated work area",
        "working on scaffold",
        "working on scaffolding",
        "working on a platform",
        "working on platform",
        "roof work",
        "height maintenance"
    ])

    if height_context:

        categories.append("Working at Height")

        # ------------------------------
        # FALL PROTECTION
        # ------------------------------

        if contains_any(text, [
            "without a safety harness",
            "without safety harness",
            "without harness",
            "no harness",
            "missing fall protection",
            "fall protection was missing",
            "fall protection was not used",
            "without fall protection"
        ]):

            precursors.append("Missing Fall Protection")

            consequences.append(
                "Fall from height causing serious injury or fatality"
            )

            actions.append(
                "Use approved fall protection and safety harness"
            )

            detected_hazards.append(
                "Fall hazard"
            )

            evidence.append(
                "Required fall protection was missing or not used"
            )

            detected_points += 50

            score_breakdown.append({
                "factor": "Missing Fall Protection",
                "points": 50
            })

        # ------------------------------
        # GUARDRAIL
        # ------------------------------

        if contains_any(text, [
            "without guardrail",
            "without a guardrail",
            "no guardrail",
            "missing guardrail",
            "guardrail was missing",
            "guardrail was not provided"
        ]):

            precursors.append("Missing Guardrail")

            consequences.append(
                "Unprotected fall from elevated work area"
            )

            actions.append(
                "Install and verify suitable guardrails"
            )

            detected_hazards.append(
                "Unprotected edge"
            )

            evidence.append(
                "Guardrail was missing or not provided"
            )

            detected_points += 40

            score_breakdown.append({
                "factor": "Missing Guardrail",
                "points": 40
            })

    # ==================================================
    # ELECTRICAL
    # ==================================================

    electrical_context = contains_any(text, [
        "electrical panel",
        "electrical equipment",
        "electrical maintenance",
        "electrical work",
        "energized panel",
        "energized electrical",
        "electrical system"
    ])

    if electrical_context:

        categories.append("Electrical")

        # ------------------------------
        # LOTO
        # ------------------------------

        loto_missing = contains_any(text, [
            "without loto",
            "loto was not applied",
            "loto not applied",
            "loto was not used",
            "without lockout",
            "without lockout tagout",
            "lockout was not applied",
            "lockout/tagout was not applied",
            "lockout tagout was not applied"
        ])

        loto_completed = contains_any(text, [
            "loto was applied",
            "loto was completed",
            "lockout was applied",
            "lockout tagout was applied"
        ])

        if loto_missing and not loto_completed:

            precursors.append("LOTO Violation")

            consequences.append(
                "Unexpected energization causing electric shock or fatality"
            )

            actions.append(
                "Apply Lockout/Tagout before maintenance activity"
            )

            detected_hazards.append(
                "Hazardous energy exposure"
            )

            evidence.append(
                "LOTO was not applied before electrical work"
            )

            detected_points += 50

            score_breakdown.append({
                "factor": "LOTO Violation",
                "points": 50
            })

        # ------------------------------
        # ELECTRICAL ISOLATION
        # ------------------------------

        isolation_missing = contains_any(text, [
            "without electrical isolation",
            "no electrical isolation",
            "electrical isolation was not done",
            "electrical isolation was not performed",
            "without isolation",
            "energy isolation was not done",
            "energy was not isolated"
        ])

        isolation_completed = contains_any(text, [
            "electrical isolation was completed",
            "electrical isolation was performed",
            "electrical energy was isolated",
            "energy was isolated"
        ])

        if isolation_missing and not isolation_completed:

            precursors.append("No Electrical Isolation")

            consequences.append(
                "Electric shock, arc flash or fatal electrical incident"
            )

            actions.append(
                "Isolate and verify electrical energy before work"
            )

            detected_hazards.append(
                "Electrical energy exposure"
            )

            evidence.append(
                "Electrical isolation was not performed"
            )

            detected_points += 45

            score_breakdown.append({
                "factor": "No Electrical Isolation",
                "points": 45
            })

    # ==================================================
    # FIRE / EXPLOSION
    # ==================================================

    fire_context = contains_any(text, [
        "hydrocarbon",
        "flammable",
        "hot work",
        "fire",
        "explosion",
        "oil leak",
        "fuel leak"
    ])

    if fire_context:

        categories.append("Fire / Explosion")

        # ------------------------------
        # HYDROCARBON LEAK
        # ------------------------------

        if contains_any(text, [
            "hydrocarbon leak",
            "hydrocarbon leak was observed",
            "hydrocarbon spill",
            "hydrocarbon release",
            "oil leak",
            "flammable leak",
            "fuel leak",
            "hydrocarbon leakage"
        ]):

            precursors.append("Hydrocarbon Leak/Spill")

            consequences.append(
                "Fire, explosion or hazardous substance release"
            )

            actions.append(
                "Control the leak and eliminate ignition sources"
            )

            detected_hazards.append(
                "Hydrocarbon release"
            )

            evidence.append(
                "Hydrocarbon leak or spill was observed"
            )

            detected_points += 40

            score_breakdown.append({
                "factor": "Hydrocarbon Leak/Spill",
                "points": 40
            })

        # ------------------------------
        # HOT WORK NEAR FLAMMABLE
        # ------------------------------

        if (
            "hot work" in text
            and contains_any(text, [
                "flammable",
                "hydrocarbon",
                "fuel",
                "combustible"
            ])
        ):

            precursors.append(
                "Hot Work Near Flammable Material"
            )

            consequences.append(
                "Ignition leading to fire or explosion"
            )

            actions.append(
                "Establish hot-work controls and remove flammable materials"
            )

            detected_hazards.append(
                "Ignition source near flammable material"
            )

            evidence.append(
                "Hot work was identified near flammable or hydrocarbon material"
            )

            detected_points += 45

            score_breakdown.append({
                "factor": "Hot Work Near Flammable Material",
                "points": 45
            })

    # ==================================================
    # PPE
    # ==================================================

    ppe_context = contains_any(text, [
        "ppe",
        "helmet",
        "gloves",
        "safety equipment",
        "protective equipment"
    ])

    if ppe_context:

        categories.append("PPE")

        # ------------------------------
        # HELMET
        # ------------------------------

        if contains_any(text, [
            "without helmet",
            "without a helmet",
            "no helmet",
            "missing helmet",
            "helmet was not used",
            "helmet was not worn"
        ]):

            precursors.append("Improper PPE")

            consequences.append(
                "Head injury due to falling or struck-by objects"
            )

            actions.append(
                "Ensure mandatory head protection is worn"
            )

            detected_hazards.append(
                "Missing head protection"
            )

            evidence.append(
                "Helmet was not used or worn"
            )

            detected_points += 20

            score_breakdown.append({
                "factor": "Missing Helmet",
                "points": 20
            })

        # ------------------------------
        # GLOVES
        # ------------------------------

        if contains_any(text, [
            "without gloves",
            "without protective gloves",
            "no gloves",
            "missing gloves",
            "gloves were not used",
            "gloves were not worn"
        ]):

            precursors.append("Improper PPE")

            consequences.append(
                "Hand injury or hazardous substance exposure"
            )

            actions.append(
                "Provide and enforce suitable protective gloves"
            )

            detected_hazards.append(
                "Missing hand protection"
            )

            evidence.append(
                "Gloves were not used or worn"
            )

            detected_points += 15

            score_breakdown.append({
                "factor": "Missing Gloves",
                "points": 15
            })

    # ==================================================
    # CHEMICAL EXPOSURE
    # ==================================================

    chemical_context = contains_any(text, [
        "hazardous material",
        "chemical",
        "chemical exposure",
        "toxic substance",
        "hazardous substance"
    ])

    if chemical_context:

        categories.append("Chemical Exposure")

        if contains_any(text, [
            "handling hazardous material",
            "handled hazardous material",
            "chemical exposure",
            "exposure to chemical",
            "exposure to hazardous material",
            "without chemical gloves",
            "hazardous substance exposure"
        ]):

            precursors.append("Chemical Exposure")

            consequences.append(
                "Skin, eye or respiratory exposure to hazardous substances"
            )

            actions.append(
                "Use appropriate chemical PPE and follow handling procedures"
            )

            detected_hazards.append(
                "Hazardous substance exposure"
            )

            evidence.append(
                "Hazardous material or chemical exposure was identified"
            )

            detected_points += 30

            score_breakdown.append({
                "factor": "Chemical Exposure",
                "points": 30
            })

    # ==================================================
    # GENERAL SIF SIGNALS
    # ==================================================

    if contains_any(text, [
        "near miss",
        "unsafe condition",
        "unsafe act",
        "serious injury",
        "fatality",
        "potential fatality"
    ]):

        if "General Safety" not in categories and not categories:
            categories.append("General Safety")

    # ==================================================
    # REMOVE DUPLICATES
    # ==================================================

    precursors = unique_list(precursors)
    consequences = unique_list(consequences)
    actions = unique_list(actions)
    detected_hazards = unique_list(detected_hazards)
    evidence = unique_list(evidence)
    categories = unique_list(categories)

    # ==================================================
    # CATEGORY
    # ==================================================

    if categories:
        category = " / ".join(categories)
    else:
        category = "General Safety"

    # ==================================================
    # FINAL SCORE
    # ==================================================

    risk_score = min(
        base_score + detected_points,
        100
    )

    if risk_score >= 76:
        risk_level = "CRITICAL"

    elif risk_score >= 51:
        risk_level = "HIGH"

    elif risk_score >= 26:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    # ==================================================
    # EXPLAINABLE AI
    # ==================================================

    why_risk = []

    if not score_breakdown:

        why_risk.append(
            "No major predefined SIF precursor was detected."
        )

    else:

        for item in score_breakdown:

            why_risk.append(
                f"{item['factor']} contributed "
                f"+{item['points']} points to the risk score."
            )

    # ==================================================
    # ANALYSIS
    # ==================================================

    if precursors:

        analysis = (
            f"The report was analyzed using a hybrid NLP and "
            f"rule-based safety intelligence engine. "
            f"The system detected {len(precursors)} SIF precursor(s) "
            f"and calculated a prioritization score of "
            f"{risk_score}/100, classified as {risk_level}."
        )

    else:

        analysis = (
            "The report was analyzed using a hybrid NLP and "
            "rule-based safety intelligence engine. "
            "No major predefined SIF precursor was detected."
        )

    # ==================================================
    # RETURN
    # ==================================================

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "category": category,

        "precursors": precursors,
        "consequences": consequences,
        "actions": actions,

        "detected_hazards": detected_hazards,
        "evidence": evidence,

        "analysis": analysis,
        "why_risk": why_risk,

        "score_breakdown": score_breakdown,

        "base_score": base_score,
        "detected_points": detected_points,

        "original_report": report
    }