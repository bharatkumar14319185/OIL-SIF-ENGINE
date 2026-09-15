from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from analyzer import analyze_report


# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="OIL SIF Safety Intelligence Engine",
    description="Hybrid NLP + Rule-Based Safety Intelligence Prototype",
    version="1.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://oil-sif-engine.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ReportRequest(BaseModel):
    report: str

    reporter_role: Optional[str] = "Worker / Employee"

    report_type: Optional[str] = "Unsafe Act"

    location: Optional[str] = ""

    work_activity: Optional[str] = ""


# ============================================================
# DEMO REPORTS
# ============================================================

demo_reports = [

    {
        "id": 1,
        "reporter_role": "Worker / Employee",
        "report_type": "Unsafe Act",
        "location": "Tank Farm",
        "work_activity": "Confined Space Entry",
        "report": "Worker entered a confined space without gas testing and without permit."
    },

    {
        "id": 2,
        "reporter_role": "Maintenance / Operations",
        "report_type": "Unsafe Act",
        "location": "Electrical Panel Area",
        "work_activity": "Electrical Maintenance",
        "report": "Worker was working on an electrical panel without LOTO and without electrical isolation."
    },

    {
        "id": 3,
        "reporter_role": "Supervisor / Shift In-charge",
        "report_type": "Unsafe Condition",
        "location": "Construction Area",
        "work_activity": "Working at Height",
        "report": "Worker was working at height without a safety harness and without guardrail."
    },

    {
        "id": 4,
        "reporter_role": "Safety / HSE Officer",
        "report_type": "Unsafe Condition",
        "location": "Hot Work Area",
        "work_activity": "Hot Work",
        "report": "A hydrocarbon leak was observed near a hot work area."
    },

    {
        "id": 5,
        "reporter_role": "Worker / Employee",
        "report_type": "Unsafe Act",
        "location": "Chemical Handling Area",
        "work_activity": "Hazardous Material Handling",
        "report": "Worker was handling hazardous material without gloves and without helmet."
    },

    {
        "id": 6,
        "reporter_role": "Supervisor / Shift In-charge",
        "report_type": "Near Miss",
        "location": "Vessel Area",
        "work_activity": "Vessel Entry",
        "report": "Worker entered a vessel after gas testing was not carried out and the entry permit was not obtained."
    },

    {
        "id": 7,
        "reporter_role": "Maintenance / Operations",
        "report_type": "Unsafe Act",
        "location": "Electrical Substation",
        "work_activity": "Electrical Maintenance",
        "report": "Maintenance activity was performed near an energized electrical panel. LOTO was not applied."
    },

    {
        "id": 8,
        "reporter_role": "Safety / HSE Officer",
        "report_type": "Unsafe Condition",
        "location": "Confined Space",
        "work_activity": "Confined Space Entry",
        "report": "Poor ventilation was observed inside a confined space before entry."
    }

]


# ============================================================
# SUBMITTED REPORT STORAGE
# ============================================================

# Prototype storage.
#
# IMPORTANT:
# This is in-memory storage.
# Reports can disappear if Render restarts/redeploys the service.
#
# For the SIH prototype this is acceptable.
# Later we can replace this with SQLite/PostgreSQL.

submitted_reports = []


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "OIL SIF Safety Intelligence Engine is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "OIL SIF Safety Intelligence Engine"
    }


# ============================================================
# ANALYZE SAFETY REPORT
# ============================================================

@app.post("/analyze")
def analyze(request: ReportRequest):

    # --------------------------------------------------------
    # Analyze report using NLP + Rule Engine
    # --------------------------------------------------------

    result = analyze_report(request.report)


    # --------------------------------------------------------
    # Generate unique report ID
    # --------------------------------------------------------

    existing_ids = [
        item["id"]
        for item in demo_reports + submitted_reports
    ]

    if existing_ids:
        new_id = max(existing_ids) + 1
    else:
        new_id = 1


    # --------------------------------------------------------
    # Save submitted report
    # --------------------------------------------------------

    submitted_report = {

        "id": new_id,

        "reporter_role": request.reporter_role,

        "report_type": request.report_type,

        "location": request.location,

        "work_activity": request.work_activity,

        "report": request.report

    }


    submitted_reports.append(submitted_report)


    # --------------------------------------------------------
    # Add metadata to API response
    # --------------------------------------------------------

    result["id"] = new_id

    result["reporter_role"] = request.reporter_role

    result["report_type"] = request.report_type

    result["location"] = request.location

    result["work_activity"] = request.work_activity

    result["saved"] = True


    return result


# ============================================================
# DASHBOARD
# ============================================================

@app.get("/dashboard")
def dashboard():

    # --------------------------------------------------------
    # Combine demo + submitted reports
    # --------------------------------------------------------

    all_reports = demo_reports + submitted_reports


    analyzed_reports = []


    # --------------------------------------------------------
    # Risk counters
    # --------------------------------------------------------

    critical = 0

    high = 0

    medium = 0

    low = 0


    # --------------------------------------------------------
    # Precursor frequency
    # --------------------------------------------------------

    precursor_counts = {}


    # --------------------------------------------------------
    # Analyze every report
    # --------------------------------------------------------

    for item in all_reports:

        result = analyze_report(item["report"])


        analyzed_reports.append({

            "id": item["id"],

            "reporter_role": item.get(
                "reporter_role",
                "Worker / Employee"
            ),

            "report_type": item.get(
                "report_type",
                "Unsafe Act"
            ),

            "location": item.get(
                "location",
                ""
            ),

            "work_activity": item.get(
                "work_activity",
                ""
            ),

            "report": item["report"],

            "risk_score": result["risk_score"],

            "risk_level": result["risk_level"],

            "category": result["category"],

            "precursors": result["precursors"]

        })


        # ----------------------------------------------------
        # Count risk levels
        # ----------------------------------------------------

        if result["risk_level"] == "CRITICAL":

            critical += 1

        elif result["risk_level"] == "HIGH":

            high += 1

        elif result["risk_level"] == "MEDIUM":

            medium += 1

        else:

            low += 1


        # ----------------------------------------------------
        # Count SIF precursors
        # ----------------------------------------------------

        for precursor in result["precursors"]:

            precursor_counts[precursor] = (
                precursor_counts.get(precursor, 0) + 1
            )


    # --------------------------------------------------------
    # Dashboard response
    # --------------------------------------------------------

    return {

        "total_reports": len(analyzed_reports),

        "critical": critical,

        "high": high,

        "medium": medium,

        "low": low,

        "precursor_counts": precursor_counts,

        "reports": analyzed_reports

    }