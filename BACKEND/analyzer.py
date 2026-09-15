import re


# =====================================================
# TEXT NORMALIZATION
# =====================================================

def normalize_text(text):

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =====================================================
# CATEGORY DETECTION
# =====================================================

def detect_category(text):

    text = normalize_text(text)


    # Confined Space

    if any(
        keyword in text
        for keyword in [
            "confined space",
            "vessel entry",
            "vessel",
            "tank entry",
            "manhole"
        ]
    ):

        return "Confined Space"


    # Working at Height

    if any(
        keyword in text
        for keyword in [
            "working at height",
            "height",
            "scaffold",
            "scaffolding",
            "fall",
            "harness",
            "guardrail"
        ]
    ):

        return "Working at Height"


    # Electrical

    if any(
        keyword in text
        for keyword in [
            "electrical",
            "electrical panel",
            "energized",
            "electric shock",
            "loto",
            "isolation"
        ]
    ):

        return "Electrical"


    # Fire / Explosion

    if any(
        keyword in text
        for keyword in [
            "hydrocarbon",
            "flammable",
            "fire",
            "explosion",
            "hot work",
            "leak",
            "spill"
        ]
    ):

        return "Fire / Explosion"


    # Chemical

    if any(
        keyword in text
        for keyword in [
            "chemical",
            "hazardous material",
            "toxic",
            "chemical exposure",
            "gas exposure"
        ]
    ):

        return "Chemical Exposure"


    # PPE

    if any(
        keyword in text
        for keyword in [
            "ppe",
            "helmet",
            "gloves",
            "safety shoes",
            "safety harness",
            "protective equipment"
        ]
    ):

        return "PPE"


    return "General Safety"


# =====================================================
# RISK FACTORS
# =====================================================

RISK_FACTORS = [

    {
        "name":
            "No Gas Testing",

        "points":
            45,

        "keywords":
            [
                "without gas testing",
                "no gas testing",
                "gas testing was not carried out",
                "gas test not done",
                "without gas test"
            ],

        "reason":
            "Atmospheric hazards may remain undetected."
    },


    {
        "name":
            "Permit Violation",

        "points":
            25,

        "keywords":
            [
                "without permit",
                "no permit",
                "permit was not obtained",
                "without entry permit",
                "permit violation"
            ],

        "reason":
            "Required authorization and safety controls may not have been verified."
    },


    {
        "name":
            "Poor Ventilation",

        "points":
            35,

        "keywords":
            [
                "poor ventilation",
                "inadequate ventilation",
                "no ventilation"
            ],

        "reason":
            "Hazardous gases or oxygen deficiency may accumulate."
    },


    {
        "name":
            "Missing Fall Protection",

        "points":
            50,

        "keywords":
            [
                "without safety harness",
                "without harness",
                "no harness",
                "without fall protection"
            ],

        "reason":
            "A fall from height can result in serious injury or fatality."
    },


    {
        "name":
            "Missing Guardrail",

        "points":
            40,

        "keywords":
            [
                "without guardrail",
                "no guardrail",
                "missing guardrail"
            ],

        "reason":
            "Lack of edge protection increases fall risk."
    },


    {
        "name":
            "LOTO Violation",

        "points":
            50,

        "keywords":
            [
                "without loto",
                "loto was not applied",
                "no loto",
                "loto violation"
            ],

        "reason":
            "Unexpected energization can cause severe injury or fatality."
    },


    {
        "name":
            "No Electrical Isolation",

        "points":
            45,

        "keywords":
            [
                "without electrical isolation",
                "no electrical isolation",
                "electrical isolation was not done",
                "without isolation"
            ],

        "reason":
            "Uncontrolled electrical energy can cause electric shock or fatality."
    },


    {
        "name":
            "Hydrocarbon Leak / Spill",

        "points":
            40,

        "keywords":
            [
                "hydrocarbon leak",
                "hydrocarbon spill",
                "hydrocarbon leakage",
                "oil leak",
                "fuel leak"
            ],

        "reason":
            "Hydrocarbon release can create fire, explosion and exposure hazards."
    },


    {
        "name":
            "Hot Work Near Flammable Material",

        "points":
            45,

        "keywords":
            [
                "hot work",
                "flammable material",
                "hot work area"
            ],

        "reason":
            "Ignition sources near flammable materials can trigger fire or explosion."
    },


    {
        "name":
            "Missing Helmet",

        "points":
            20,

        "keywords":
            [
                "without helmet",
                "no helmet",
                "missing helmet"
            ],

        "reason":
            "Head protection is not being used."
    },


    {
        "name":
            "Missing Gloves",

        "points":
            15,

        "keywords":
            [
                "without gloves",
                "no gloves",
                "missing gloves"
            ],

        "reason":
            "Hand protection is not being used."
    },


    {
        "name":
            "Chemical Exposure",

        "points":
            30,

        "keywords":
            [
                "chemical exposure",
                "hazardous material",
                "toxic exposure",
                "chemical leak"
            ],

        "reason":
            "Exposure to hazardous substances can cause serious health effects."
    }

]


# =====================================================
# DETECT RISK FACTORS
# =====================================================

def detect_risk_factors(text):

    text = normalize_text(text)

    detected = []


    for factor in RISK_FACTORS:

        matched = False


        for keyword in factor["keywords"]:

            if keyword in text:

                matched = True

                break


        if matched:

            detected.append({

                "factor":
                    factor["name"],

                "points":
                    factor["points"],

                "reason":
                    factor["reason"]

            })


    return detected


# =====================================================
# SIF PRECURSORS
# =====================================================

def get_precursors(factors):

    names = [
        factor["factor"]
        for factor in factors
    ]

    precursors = []


    if (
        "No Gas Testing" in names or
        "Permit Violation" in names
    ):

        precursors.append(
            "Confined Space Entry Risk"
        )


    if (
        "LOTO Violation" in names or
        "No Electrical Isolation" in names
    ):

        precursors.append(
            "Energy Isolation Failure"
        )


    if (
        "Missing Fall Protection" in names or
        "Missing Guardrail" in names
    ):

        precursors.append(
            "Fall From Height"
        )


    if (
        "Hydrocarbon Leak / Spill" in names or
        "Hot Work Near Flammable Material" in names
    ):

        precursors.append(
            "Fire / Explosion Risk"
        )


    if (
        "Missing Helmet" in names or
        "Missing Gloves" in names
    ):

        precursors.append(
            "Improper PPE"
        )


    if (
        "Chemical Exposure" in names
    ):

        precursors.append(
            "Hazardous Substance Exposure"
        )


    return precursors


# =====================================================
# CONSEQUENCES
# =====================================================

def get_consequences(category, factors):

    names = [
        factor["factor"]
        for factor in factors
    ]

    consequences = []


    if "No Gas Testing" in names:

        consequences.append(
            "Toxic gas exposure"
        )


    if "Permit Violation" in names:

        consequences.append(
            "Serious injury or fatality"
        )


    if (
        "LOTO Violation" in names or
        "No Electrical Isolation" in names
    ):

        consequences.append(
            "Electric shock or fatality"
        )


    if (
        "Missing Fall Protection" in names or
        "Missing Guardrail" in names
    ):

        consequences.append(
            "Fall-related serious injury"
        )


    if "Hydrocarbon Leak / Spill" in names:

        consequences.append(
            "Fire or explosion"
        )


    if "Hot Work Near Flammable Material" in names:

        consequences.append(
            "Fire or explosion"
        )


    if "Missing Helmet" in names:

        consequences.append(
            "Head injury"
        )


    if "Missing Gloves" in names:

        consequences.append(
            "Hand injury or hazardous exposure"
        )


    if "Chemical Exposure" in names:

        consequences.append(
            "Toxic exposure"
        )


    if not consequences:

        consequences.append(
            "Potential serious safety incident"
        )


    return consequences


# =====================================================
# CORRECTIVE ACTIONS
# =====================================================

def get_actions(factors):

    names = [
        factor["factor"]
        for factor in factors
    ]

    actions = []


    if "No Gas Testing" in names:

        actions.append(
            "Perform atmospheric gas testing before entry"
        )


    if "Permit Violation" in names:

        actions.append(
            "Verify confined-space entry permit"
        )


    if "Poor Ventilation" in names:

        actions.append(
            "Provide adequate ventilation before entry"
        )


    if "Missing Fall Protection" in names:

        actions.append(
            "Use approved fall protection equipment"
        )


    if "Missing Guardrail" in names:

        actions.append(
            "Install and verify required guardrails"
        )


    if "LOTO Violation" in names:

        actions.append(
            "Apply Lockout/Tagout before maintenance"
        )


    if "No Electrical Isolation" in names:

        actions.append(
            "Verify electrical isolation before work"
        )


    if "Hydrocarbon Leak / Spill" in names:

        actions.append(
            "Isolate and control the hydrocarbon leak"
        )


    if "Hot Work Near Flammable Material" in names:

        actions.append(
            "Control flammable materials and verify hot-work controls"
        )


    if "Missing Helmet" in names:

        actions.append(
            "Wear approved safety helmet"
        )


    if "Missing Gloves" in names:

        actions.append(
            "Wear appropriate protective gloves"
        )


    if "Chemical Exposure" in names:

        actions.append(
            "Use appropriate chemical PPE and exposure controls"
        )


    if not actions:

        actions.append(
            "Review the hazard and implement appropriate controls"
        )


    return actions


# =====================================================
# EVIDENCE
# =====================================================

def get_evidence(text, factors):

    text = normalize_text(text)

    evidence = []


    for factor in RISK_FACTORS:

        factor_detected = any(
            item["factor"] == factor["name"]
            for item in factors
        )


        if factor_detected:

            for keyword in factor["keywords"]:

                if keyword in text:

                    evidence.append(
                        keyword
                    )

                    break


    return evidence


# =====================================================
# WHY RISK
# =====================================================

def create_why_risk(factors):

    why = []


    for factor in factors:

        why.append(
            f'{factor["factor"]} (+{factor["points"]}) — {factor["reason"]}'
        )


    return why


# =====================================================
# RISK LEVEL
# =====================================================

def get_risk_level(score):

    if score >= 76:

        return "CRITICAL"

    elif score >= 51:

        return "HIGH"

    elif score >= 26:

        return "MEDIUM"

    else:

        return "LOW"


# =====================================================
# ANALYZE REPORT
# =====================================================

def analyze_report(report):

    original_report = report

    text = normalize_text(report)


    # -----------------------------------------------
    # CATEGORY
    # -----------------------------------------------

    category = detect_category(text)


    # -----------------------------------------------
    # FACTORS
    # -----------------------------------------------

    factors = detect_risk_factors(text)


    # -----------------------------------------------
    # SCORE
    # -----------------------------------------------

    base_score = 10


    detected_points = sum(
        factor["points"]
        for factor in factors
    )


    risk_score = min(
        base_score + detected_points,
        100
    )


    risk_level = get_risk_level(
        risk_score
    )


    # -----------------------------------------------
    # OTHER RESULTS
    # -----------------------------------------------

    precursors = get_precursors(
        factors
    )


    consequences = get_consequences(
        category,
        factors
    )


    actions = get_actions(
        factors
    )


    evidence = get_evidence(
        text,
        factors
    )


    why_risk = create_why_risk(
        factors
    )


    # -----------------------------------------------
    # ANALYSIS
    # -----------------------------------------------

    analysis = (

        f"The NLP safety engine identified "
        f"{len(precursors)} potential SIF precursor(s). "

        f"The primary hazard category is "
        f"{category}. "

        f"The prioritization score is "
        f"{risk_score}/100. "

        f"The score is driven by the safety "
        f"conditions detected in the report."

    )


    # -----------------------------------------------
    # RESULT
    # -----------------------------------------------

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
            [category],

        "evidence":
            evidence,

        "analysis":
            analysis,

        "why_risk":
            why_risk,

        "score_breakdown":
            factors,

        "base_score":
            base_score,

        "detected_points":
            detected_points,

        "original_report":
            original_report

    }