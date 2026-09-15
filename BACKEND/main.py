from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from analyzer import analyze_report, build_report


# ======================================================
# APP
# ======================================================

app = FastAPI(
    title="OIL SIF Safety Intelligence Engine",
    description="Hybrid NLP + Rule-Based Safety Intelligence Prototype",
    version="1.0"
)


# ======================================================
# CORS
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# IN-MEMORY REPORT STORAGE
# ======================================================

reports = []


# ======================================================
# REQUEST MODELS
# ======================================================

class ReportRequest(BaseModel):

    report: str = ""


class StructuredReportRequest(BaseModel):

    location: str = ""
    activity: str = ""
    incident: str = ""
    unsafe_act: str = ""
    controls: str = ""
    ppe: str = ""
    details: str = ""


# ======================================================
# ROOT
# ======================================================

@app.get("/")
def root():

    return {
        "message": "OIL SIF Safety Intelligence Engine is running"
    }


# ======================================================
# ANALYZE NORMAL REPORT
# ======================================================

@app.post("/analyze")
def analyze(request: ReportRequest):

    report = request.report.strip()

    if not report:

        return {
            "error": "Safety report cannot be empty."
        }

    result = analyze_report(report)

    reports.append(result)

    return result


# ======================================================
# ANALYZE STRUCTURED REPORT
# ======================================================

@app.post("/analyze-structured")
def analyze_structured(request: StructuredReportRequest):

    report = build_report(
        location=request.location,
        activity=request.activity,
        incident=request.incident,
        unsafe_act=request.unsafe_act,
        controls=request.controls,
        ppe=request.ppe,
        details=request.details
    )

    if not report.strip():

        return {
            "error": "Please provide at least one safety-report field."
        }

    result = analyze_report(report)

    reports.append(result)

    return result


# ======================================================
# DASHBOARD
# ======================================================

@app.get("/dashboard")
def dashboard():

    total_reports = len(reports)

    critical_reports = sum(
        1 for report in reports
        if report["risk_level"] == "CRITICAL"
    )

    high_reports = sum(
        1 for report in reports
        if report["risk_level"] == "HIGH"
    )

    medium_reports = sum(
        1 for report in reports
        if report["risk_level"] == "MEDIUM"
    )

    low_reports = sum(
        1 for report in reports
        if report["risk_level"] == "LOW"
    )

    precursor_counts = {}

    for report in reports:

        for precursor in report["precursors"]:

            precursor_counts[precursor] = (
                precursor_counts.get(precursor, 0) + 1
            )

    recent_reports = reports[-10:]

    return {

        "total_reports": total_reports,

        "critical_reports": critical_reports,

        "high_reports": high_reports,

        "medium_reports": medium_reports,

        "low_reports": low_reports,

        "precursor_counts": precursor_counts,

        "reports": recent_reports
    }


# ======================================================
# HEALTH CHECK
# ======================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }