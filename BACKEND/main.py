from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from analyzer import analyze_report


app = FastAPI(

    title="OIL SIF Safety Intelligence Engine",

    description=
        "Hybrid NLP + Rule-Based Safety Intelligence Prototype",

    version="1.0"

)


# ============================================================
# CORS
# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


# ============================================================
# REQUEST MODEL
# ============================================================

class ReportRequest(BaseModel):

    report: str


# ============================================================
# DEMO REPORTS
# ============================================================

demo_reports = [

    {
        "id": 1,
        "report":
            "Worker entered a confined space without gas testing and without permit."
    },

    {
        "id": 2,
        "report":
            "Worker was working on an electrical panel without LOTO and without electrical isolation."
    },

    {
        "id": 3,
        "report":
            "Worker was working at height without a safety harness and without guardrail."
    },

    {
        "id": 4,
        "report":
            "A hydrocarbon leak was observed near a hot work area."
    },

    {
        "id": 5,
        "report":
            "Worker was handling hazardous material without gloves and without helmet."
    },

    {
        "id": 6,
        "report":
            "Worker entered a vessel after gas testing was not carried out and the entry permit was not obtained."
    },

    {
        "id": 7,
        "report":
            "Maintenance activity was performed near an energized electrical panel. LOTO was not applied."
    },

    {
        "id": 8,
        "report":
            "Poor ventilation was observed inside a confined space before entry."
    }

]


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {

        "message":
            "OIL SIF Safety Intelligence Engine is running"

    }


# ============================================================
# ANALYZE
# ============================================================

@app.post("/analyze")
def analyze(request: ReportRequest):

    return analyze_report(
        request.report
    )


# ============================================================
# DASHBOARD
# ============================================================

@app.get("/dashboard")
def dashboard():

    analyzed_reports = []

    critical = 0
    high = 0
    medium = 0
    low = 0

    precursor_counts = {}


    for item in demo_reports:

        result = analyze_report(
            item["report"]
        )

        analyzed_reports.append({

            "id":
                item["id"],

            "report":
                item["report"],

            "risk_score":
                result["risk_score"],

            "risk_level":
                result["risk_level"],

            "category":
                result["category"],

            "precursors":
                result["precursors"]

        })


        if result["risk_level"] == "CRITICAL":
            critical += 1

        elif result["risk_level"] == "HIGH":
            high += 1

        elif result["risk_level"] == "MEDIUM":
            medium += 1

        else:
            low += 1


        for precursor in result["precursors"]:

            precursor_counts[precursor] = (
                precursor_counts.get(
                    precursor,
                    0
                ) + 1
            )


    return {

        "total_reports":
            len(analyzed_reports),

        "critical":
            critical,

        "high":
            high,

        "medium":
            medium,

        "low":
            low,

        "precursor_counts":
            precursor_counts,

        "reports":
            analyzed_reports

    }