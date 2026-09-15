import re


# ======================================================
# TEXT NORMALIZATION
# ======================================================

def normalize_text(text):
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


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

    if any(word in text for word in [
        "confined space",
        "vessel",
        "tank",
        "manhole"
    ]):

        categories.append("Confined Space")

        if any(phrase in text for phrase in [
            "without gas testing",
            "no gas testing",
            "gas testing was not carried out",
            "gas test not carried out"
        ]):

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
                "Gas testing was not carried out"
            )

            detected_points += 45

            score_breakdown.append({
                "factor": "No Gas Testing",
                "points": 45
            })

        if any(phrase in text for phrase in [
            "without permit",
            "no permit",
            "permit violation",
            "entry permit was not obtained",
            "without entry permit"
        ]):

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

        if any(phrase in text for phrase in [
            "poor ventilation",
            "poorly ventilated",
            "insufficient ventilation"
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
                "Poor ventilation was observed"
            )

            detected_points += 35

            score_breakdown.append({
                "factor": "Poor Ventilation",
                "points": 35
            })


    # ==================================================
    # WORKING AT HEIGHT
    # ==================================================

    if any(word in text for word in [
        "working at height",
        "work at height",
        "height"
    ]):

        categories.append("Working at Height")

        if any(phrase in text for phrase in [
            "without a safety harness",
            "without harness",
            "no harness",
            "missing fall protection"
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
                "Fall protection was missing"
            )

            detected_points += 50

            score_breakdown.append({
                "factor": "Missing Fall Protection",
                "points": 50
            })

        if any(phrase in text for phrase in [
            "without guardrail",
            "no guardrail",
            "missing guardrail"
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
                "Guardrail was missing"
            )

            detected_points += 40

            score_breakdown.append({
                "factor": "Missing Guardrail",
                "points": 40
            })


    # ==================================================
    # ELECTRICAL
    # ==================================================

    if any(word in text for word in [
        "electrical panel",
        "electrical",
        "energized panel",
        "electrical work"
    ]):

        categories.append("Electrical")

        if any(phrase in text for phrase in [
            "without loto",
            "loto was not applied",
            "loto not applied",
            "without lockout",
            "lockout was not applied"
        ]):

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
                "LOTO was not applied"
            )

            detected_points += 50

            score_breakdown.append({
                "factor": "LOTO Violation",
                "points": 50
            })

        if any(phrase in text for phrase in [
            "without electrical isolation",
            "no electrical isolation",
            "electrical isolation was not done"
        ]):

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

    if any(word in text for word in [
        "hydrocarbon",
        "flammable",
        "hot work",
        "fire",
        "explosion"
    ]):

        categories.append("Fire / Explosion")

        if any(phrase in text for phrase in [
            "hydrocarbon leak",
            "hydrocarbon leak was observed",
            "hydrocarbon spill",
            "oil leak",
            "flammable leak"
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

        if (
            "hot work" in text
            and any(word in text for word in [
                "flammable",
                "hydrocarbon"
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
                "Hot work was performed near flammable material"
            )

            detected_points += 45

            score_breakdown.append({
                "factor": "Hot Work Near Flammable Material",
                "points": 45
            })


    # ==================================================
    # PPE
    # ==================================================

    if any(word in text for word in [
        "ppe",
        "helmet",
        "gloves",
        "safety equipment"
    ]):

        categories.append("PPE")

        missing_ppe = False

        if any(phrase in text for phrase in [
            "without helmet",
            "no helmet",
            "missing helmet"
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
                "Helmet was not used"
            )

            detected_points += 20

            score_breakdown.append({
                "factor": "Missing Helmet",
                "points": 20
            })

            missing_ppe = True

        if any(phrase in text for phrase in [
            "without gloves",
            "no gloves",
            "missing gloves"
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
                "Gloves were not used"
            )

            detected_points += 15

            score_breakdown.append({
                "factor": "Missing Gloves",
                "points": 15
            })

            missing_ppe = True


    # ==================================================
    # CHEMICAL EXPOSURE
    # ==================================================

    if any(word in text for word in [
        "hazardous material",
        "chemical",
        "chemical exposure",
        "toxic substance"
    ]):

        categories.append("Chemical Exposure")

        if any(phrase in text for phrase in [
            "handling hazardous material",
            "chemical exposure",
            "exposure to chemical",
            "without gloves"
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
                "Hazardous material exposure was identified"
            )

            detected_points += 30

            score_breakdown.append({
                "factor": "Chemical Exposure",
                "points": 30
            })


    # ==================================================
    # REMOVE DUPLICATES
    # ==================================================

    precursors = list(dict.fromkeys(precursors))
    consequences = list(dict.fromkeys(consequences))
    actions = list(dict.fromkeys(actions))
    detected_hazards = list(dict.fromkeys(detected_hazards))
    evidence = list(dict.fromkeys(evidence))
    categories = list(dict.fromkeys(categories))


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


    analysis = (
        f"The report was analyzed using a hybrid NLP and "
        f"rule-based safety engine. "
        f"The system detected {len(precursors)} SIF precursor(s) "
        f"and calculated a prioritization score of "
        f"{risk_score}/100, classified as {risk_level}."
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