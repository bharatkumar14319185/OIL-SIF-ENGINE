const API_BASE_URL = "https://oil-sif-engine.onrender.com";

// ======================================================
// DEMO SCENARIOS
// ======================================================

const demoReports = {
    confined:
        "Worker entered a confined space without gas testing and without permit.",

    electrical:
        "Worker was working on an electrical panel without LOTO and without electrical isolation.",

    height:
        "Worker was working at height without a safety harness and without guardrail.",

    fire:
        "A hydrocarbon leak was observed near a hot work area.",

    chemical:
        "Worker was handling hazardous material without gloves and without helmet.",

    vessel:
        "Worker entered a vessel after gas testing was not carried out and the entry permit was not obtained.",

    energized:
        "Maintenance activity was performed near an energized electrical panel. LOTO was not applied.",

    ventilation:
        "Poor ventilation was observed inside a confined space before entry."
};


// ======================================================
// DOM ELEMENTS
// ======================================================

const reportInput = document.getElementById("reportInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const demoSelect = document.getElementById("demoSelect");


// ======================================================
// UTILITY FUNCTIONS
// ======================================================

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getRiskClass(level) {
    switch (String(level || "").toUpperCase()) {
        case "CRITICAL":
            return "critical";

        case "HIGH":
            return "high";

        case "MEDIUM":
            return "medium";

        case "LOW":
            return "low";

        default:
            return "";
    }
}


function formatList(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return "<p>No information detected.</p>";
    }

    return `
        <ul>
            ${items
                .map(item => `<li>${escapeHTML(item)}</li>`)
                .join("")}
        </ul>
    `;
}


// ======================================================
// DEMO DROPDOWN
// ======================================================

if (demoSelect) {
    demoSelect.addEventListener("change", function () {
        const selected = this.value;

        if (selected && demoReports[selected]) {
            if (reportInput) {
                reportInput.value = demoReports[selected];
            }
        }
    });
}


// ======================================================
// ANALYZE REPORT
// ======================================================

async function analyzeReport() {

    if (!reportInput) {
        console.error("Report input element not found.");
        return;
    }

    const report = reportInput.value.trim();

    if (!report) {
        alert("Please enter a safety report first.");
        return;
    }

    if (analyzeBtn) {
        analyzeBtn.disabled = true;
        analyzeBtn.innerText = "Analyzing...";
    }

    try {

        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                report: report
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        renderAnalysisResult(result);

    } catch (error) {

        console.error("Analysis error:", error);

        alert(
            "Unable to connect to the OIL SIF backend.\n\n" +
            "Please make sure the Render service is running."
        );

    } finally {

        if (analyzeBtn) {
            analyzeBtn.disabled = false;
            analyzeBtn.innerText = "Analyze Report";
        }
    }
}


// ======================================================
// RENDER ANALYSIS RESULT
// ======================================================

function renderAnalysisResult(result) {

    const resultsSection =
        document.getElementById("resultsSection");

    if (resultsSection) {
        resultsSection.style.display = "block";
    }


    // --------------------------------------------------
    // Risk Score
    // --------------------------------------------------

    const riskScore =
        document.getElementById("riskScore");

    if (riskScore) {
        riskScore.innerText =
            `${result.risk_score ?? 0}/100`;
    }


    // --------------------------------------------------
    // Risk Level
    // --------------------------------------------------

    const riskLevel =
        document.getElementById("riskLevel");

    if (riskLevel) {

        riskLevel.innerText =
            result.risk_level || "UNKNOWN";

        riskLevel.className =
            `risk-badge ${getRiskClass(result.risk_level)}`;
    }


    // --------------------------------------------------
    // Category
    // --------------------------------------------------

    const category =
        document.getElementById("riskCategory");

    if (category) {
        category.innerText =
            result.category || "Not detected";
    }


    // --------------------------------------------------
    // Explainable AI Analysis
    // --------------------------------------------------

    const analysis =
        document.getElementById("analysisText");

    if (analysis) {
        analysis.innerText =
            result.analysis ||
            "No analysis available.";
    }


    // --------------------------------------------------
    // Why This Risk Level?
    // --------------------------------------------------

    const whyRisk =
        document.getElementById("whyRisk");

    if (whyRisk) {
        whyRisk.innerText =
            result.why_risk ||
            "Risk level is calculated based on detected safety factors.";
    }


    // --------------------------------------------------
    // Risk Score Breakdown
    // --------------------------------------------------

    const breakdown =
        document.getElementById("scoreBreakdown");

    if (breakdown) {

        if (
            Array.isArray(result.score_breakdown) &&
            result.score_breakdown.length > 0
        ) {

            breakdown.innerHTML = result.score_breakdown
                .map(item => {

                    if (typeof item === "string") {
                        return `<div class="score-item">${escapeHTML(item)}</div>`;
                    }

                    const factor =
                        item.factor ||
                        item.name ||
                        item.label ||
                        "Risk Factor";

                    const points =
                        item.points ??
                        item.score ??
                        0;

                    return `
                        <div class="score-item">
                            <span>${escapeHTML(factor)}</span>
                            <strong>+${escapeHTML(points)}</strong>
                        </div>
                    `;
                })
                .join("");

        } else {

            const baseScore =
                result.base_score ?? 0;

            const detectedPoints =
                result.detected_points ?? 0;

            breakdown.innerHTML = `
                <div class="score-item">
                    <span>Base Score</span>
                    <strong>+${baseScore}</strong>
                </div>

                <div class="score-item">
                    <span>Detected Risk Factors</span>
                    <strong>+${detectedPoints}</strong>
                </div>

                <div class="score-item total">
                    <span>Final Risk Score</span>
                    <strong>${result.risk_score ?? 0}</strong>
                </div>
            `;
        }
    }


    // --------------------------------------------------
    // Detected Evidence
    // --------------------------------------------------

    const evidence =
        document.getElementById("evidenceList");

    if (evidence) {

        const evidenceData =
            result.evidence ||
            result.detected_hazards ||
            [];

        evidence.innerHTML =
            formatList(evidenceData);
    }


    // --------------------------------------------------
    // SIF Precursors
    // --------------------------------------------------

    const precursors =
        document.getElementById("precursorList");

    if (precursors) {

        precursors.innerHTML =
            formatList(result.precursors || []);
    }


    // --------------------------------------------------
    // Potential Consequences
    // --------------------------------------------------

    const consequences =
        document.getElementById("consequenceList");

    if (consequences) {

        consequences.innerHTML =
            formatList(result.consequences || []);
    }


    // --------------------------------------------------
    // Recommended Corrective Actions
    // --------------------------------------------------

    const actions =
        document.getElementById("actionList");

    if (actions) {

        actions.innerHTML =
            formatList(result.actions || []);
    }


    // --------------------------------------------------
    // Original Report
    // --------------------------------------------------

    const originalReport =
        document.getElementById("originalReport");

    if (originalReport) {

        originalReport.innerText =
            result.original_report || "";
    }


    // --------------------------------------------------
    // Scroll to results
    // --------------------------------------------------

    if (resultsSection) {

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/dashboard`);

        if (!response.ok) {
            throw new Error(
                `Dashboard API Error: ${response.status}`
            );
        }

        const data =
            await response.json();

        renderDashboard(data);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}


// ======================================================
// RENDER DASHBOARD
// ======================================================

function renderDashboard(data) {

    // --------------------------------------------------
    // Statistics
    // --------------------------------------------------

    const total =
        document.getElementById("totalReports");

    const critical =
        document.getElementById("criticalReports");

    const high =
        document.getElementById("highReports");

    const medium =
        document.getElementById("mediumReports");

    const low =
        document.getElementById("lowReports");


    if (total) {
        total.innerText =
            data.total_reports ?? 0;
    }

    if (critical) {
        critical.innerText =
            data.critical ?? 0;
    }

    if (high) {
        high.innerText =
            data.high ?? 0;
    }

    if (medium) {
        medium.innerText =
            data.medium ?? 0;
    }

    if (low) {
        low.innerText =
            data.low ?? 0;
    }


    // --------------------------------------------------
    // Risk Distribution
    // --------------------------------------------------

    const totalReports =
        data.total_reports || 1;


    updateRiskBar(
        "criticalBar",
        "criticalCount",
        data.critical || 0,
        totalReports
    );

    updateRiskBar(
        "highBar",
        "highCount",
        data.high || 0,
        totalReports
    );

    updateRiskBar(
        "mediumBar",
        "mediumCount",
        data.medium || 0,
        totalReports
    );

    updateRiskBar(
        "lowBar",
        "lowCount",
        data.low || 0,
        totalReports
    );


    // --------------------------------------------------
    // Precursor Distribution
    // --------------------------------------------------

    renderPrecursorCounts(
        data.precursor_counts || {}
    );


    // --------------------------------------------------
    // Recent Reports
    // --------------------------------------------------

    renderRecentReports(
        data.reports || []
    );
}


// ======================================================
// RISK BAR
// ======================================================

function updateRiskBar(
    barId,
    countId,
    count,
    total
) {

    const bar =
        document.getElementById(barId);

    const countElement =
        document.getElementById(countId);


    const percentage =
        total > 0
            ? Math.round((count / total) * 100)
            : 0;


    if (bar) {
        bar.style.width =
            `${percentage}%`;
    }

    if (countElement) {
        countElement.innerText =
            `${count} (${percentage}%)`;
    }
}


// ======================================================
// PRECURSOR COUNTS
// ======================================================

function renderPrecursorCounts(counts) {

    const container =
        document.getElementById("precursorBars");

    if (!container) {
        return;
    }


    const entries =
        Object.entries(counts);


    if (entries.length === 0) {

        container.innerHTML =
            "<p>No precursor data available.</p>";

        return;
    }


    entries.sort(
        (a, b) => b[1] - a[1]
    );


    const maxCount =
        Math.max(
            ...entries.map(item => item[1]),
            1
        );


    container.innerHTML =
        entries
            .map(([name, count]) => {

                const percentage =
                    Math.round(
                        (count / maxCount) * 100
                    );

                return `
                    <div class="precursor-row">

                        <div class="precursor-label">
                            <span>
                                ${escapeHTML(name)}
                            </span>

                            <strong>
                                ${escapeHTML(count)}
                            </strong>
                        </div>

                        <div class="precursor-track">

                            <div
                                class="precursor-fill"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                    </div>
                `;
            })
            .join("");
}


// ======================================================
// RECENT REPORTS TABLE
// ======================================================

function renderRecentReports(reports) {

    const tableBody =
        document.getElementById("reportsTableBody");

    if (!tableBody) {
        return;
    }


    if (!reports.length) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No reports available.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        reports
            .map(report => {

                const riskClass =
                    getRiskClass(
                        report.risk_level
                    );


                const precursorText =
                    Array.isArray(report.precursors)
                        ? report.precursors.join(", ")
                        : "None";


                return `
                    <tr>

                        <td>
                            #${escapeHTML(report.id)}
                        </td>

                        <td>
                            ${escapeHTML(report.report)}
                        </td>

                        <td>
                            ${escapeHTML(report.category)}
                        </td>

                        <td>
                            <span class="risk-badge ${riskClass}">
                                ${escapeHTML(report.risk_level)}
                            </span>
                        </td>

                        <td>
                            ${escapeHTML(report.risk_score)}
                        </td>

                    </tr>
                `;
            })
            .join("");
}


// ======================================================
// ANALYZE BUTTON
// ======================================================

if (analyzeBtn) {

    analyzeBtn.addEventListener(
        "click",
        analyzeReport
    );
}


// ======================================================
// ENTER KEY SUPPORT
// ======================================================

if (reportInput) {

    reportInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                (event.ctrlKey || event.metaKey)
            ) {

                analyzeReport();
            }
        }
    );
}


// ======================================================
// INITIAL DASHBOARD LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);