const API_BASE_URL = "https://oil-sif-engine.onrender.com";


// =====================================================
// DEMO REPORTS
// =====================================================

const demoReports = {

    confined:
        "Worker entered a confined space without gas testing and without permit.",

    electrical:
        "Worker was working on an electrical panel without LOTO and without electrical isolation.",

    height:
        "Worker was working at height without a safety harness and without guardrail.",

    hydrocarbon:
        "A hydrocarbon leak was observed near a hot work area.",

    ppe:
        "Worker was handling hazardous material without gloves and without helmet.",

    vessel:
        "Worker entered a vessel after gas testing was not carried out and the entry permit was not obtained.",

    energized:
        "Maintenance activity was performed near an energized electrical panel. LOTO was not applied.",

    ventilation:
        "Poor ventilation was observed inside a confined space before entry."
};


// =====================================================
// GET ELEMENTS
// =====================================================

const reportInput = document.getElementById("reportInput");

const demoSelect = document.getElementById("demoSelect");

const analyzeBtn = document.getElementById("analyzeBtn");

const clearBtn = document.getElementById("clearBtn");

const reporterRole = document.getElementById("reporterRole");

const reportType = document.getElementById("reportType");

const locationInput = document.getElementById("locationInput");

const workActivity = document.getElementById("workActivity");

const resultSection = document.getElementById("resultSection");

const loadingMessage = document.getElementById("loadingMessage");

const errorMessage = document.getElementById("errorMessage");


// =====================================================
// DEMO SCENARIO SELECT
// =====================================================

demoSelect.addEventListener("change", function () {

    const selected = this.value;

    if (!selected) {
        return;
    }

    if (!demoReports[selected]) {
        return;
    }


    // Fill report

    reportInput.value =
        demoReports[selected];


    // Automatically fill useful demo metadata

    if (selected === "confined") {

        reporterRole.value =
            "Worker / Employee";

        reportType.value =
            "Unsafe Act";

        locationInput.value =
            "Confined Space Area";

        workActivity.value =
            "Confined Space Entry";
    }


    else if (selected === "electrical") {

        reporterRole.value =
            "Supervisor / Shift In-charge";

        reportType.value =
            "Unsafe Act";

        locationInput.value =
            "Electrical Panel Area";

        workActivity.value =
            "Electrical Maintenance";
    }


    else if (selected === "height") {

        reporterRole.value =
            "Safety / HSE Officer";

        reportType.value =
            "Unsafe Condition";

        locationInput.value =
            "Construction Area";

        workActivity.value =
            "Working at Height";
    }


    else if (selected === "hydrocarbon") {

        reporterRole.value =
            "Worker / Employee";

        reportType.value =
            "Near Miss";

        locationInput.value =
            "Hot Work Area";

        workActivity.value =
            "Hot Work";
    }


    else if (selected === "ppe") {

        reporterRole.value =
            "Worker / Employee";

        reportType.value =
            "Unsafe Act";

        locationInput.value =
            "Chemical Handling Area";

        workActivity.value =
            "Hazardous Material Handling";
    }


    else if (selected === "vessel") {

        reporterRole.value =
            "Supervisor / Shift In-charge";

        reportType.value =
            "Unsafe Act";

        locationInput.value =
            "Vessel Area";

        workActivity.value =
            "Vessel Entry";
    }


    else if (selected === "energized") {

        reporterRole.value =
            "Maintenance / Operations";

        reportType.value =
            "Unsafe Act";

        locationInput.value =
            "Electrical Maintenance Area";

        workActivity.value =
            "Electrical Maintenance";
    }


    else if (selected === "ventilation") {

        reporterRole.value =
            "Safety / HSE Officer";

        reportType.value =
            "Unsafe Condition";

        locationInput.value =
            "Confined Space";

        workActivity.value =
            "Confined Space Inspection";
    }


    // Hide previous result

    resultSection.classList.add("hidden");

    hideError();

});


// =====================================================
// CLEAR FORM
// =====================================================

clearBtn.addEventListener("click", function () {

    reportInput.value = "";

    locationInput.value = "";

    workActivity.value = "";

    demoSelect.value = "";

    reporterRole.value =
        "Worker / Employee";

    reportType.value =
        "Unsafe Act";

    resultSection.classList.add("hidden");

    hideError();

});


// =====================================================
// SHOW ERROR
// =====================================================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );
}


// =====================================================
// HIDE ERROR
// =====================================================

function hideError() {

    errorMessage.classList.add(
        "hidden"
    );
}


// =====================================================
// ANALYZE SAFETY REPORT
// =====================================================

async function analyzeReport() {

    const report =
        reportInput.value.trim();


    // Validate report

    if (!report) {

        showError(
            "Please enter a safety report."
        );

        return;
    }


    hideError();


    // Loading state

    loadingMessage.classList.remove(
        "hidden"
    );

    resultSection.classList.add(
        "hidden"
    );

    analyzeBtn.disabled = true;

    analyzeBtn.textContent =
        "Analyzing...";


    try {

        // =============================================
        // SEND DATA TO BACKEND
        // =============================================

        const response = await fetch(
            `${API_BASE_URL}/analyze`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    report:
                        report,

                    reporter_role:
                        reporterRole.value,

                    report_type:
                        reportType.value,

                    location:
                        locationInput.value,

                    work_activity:
                        workActivity.value
                })
            }
        );


        // =============================================
        // CHECK RESPONSE
        // =============================================

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        // =============================================
        // GET JSON
        // =============================================

        const data =
            await response.json();


        // =============================================
        // RENDER RESULT
        // =============================================

        renderResult(data);


        resultSection.classList.remove(
            "hidden"
        );


        // =============================================
        // REFRESH DASHBOARD
        // =============================================

        await loadDashboard();


        // =============================================
        // SCROLL TO RESULT
        // =============================================

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    catch (error) {

        console.error(
            "Analysis Error:",
            error
        );


        showError(
            "Unable to analyze report. Please check the backend connection."
        );

    }


    finally {

        loadingMessage.classList.add(
            "hidden"
        );

        analyzeBtn.disabled = false;

        analyzeBtn.textContent =
            "🔍 Analyze Safety Report";
    }
}


// =====================================================
// RENDER ANALYSIS RESULT
// =====================================================

function renderResult(data) {

    // -----------------------------------------------
    // Basic result
    // -----------------------------------------------

    document.getElementById(
        "riskScore"
    ).textContent =
        data.risk_score ?? "-";


    document.getElementById(
        "riskLevel"
    ).textContent =
        data.risk_level ?? "-";


    document.getElementById(
        "category"
    ).textContent =
        data.category ?? "-";


    // -----------------------------------------------
    // Analysis
    // -----------------------------------------------

    document.getElementById(
        "analysisText"
    ).textContent =
        data.analysis ?? "-";


    // -----------------------------------------------
    // Score
    // -----------------------------------------------

    document.getElementById(
        "baseScore"
    ).textContent =
        data.base_score ?? 0;


    document.getElementById(
        "detectedPoints"
    ).textContent =
        data.detected_points ?? 0;


    document.getElementById(
        "finalScore"
    ).textContent =
        data.risk_score ?? 0;


    // -----------------------------------------------
    // Original report
    // -----------------------------------------------

    document.getElementById(
        "originalReport"
    ).textContent =
        data.original_report ??
        reportInput.value;


    // -----------------------------------------------
    // Risk colour
    // -----------------------------------------------

    const riskLevel =
        String(
            data.risk_level || ""
        ).toUpperCase();


    const riskScoreElement =
        document.getElementById(
            "riskScore"
        );


    const riskLevelElement =
        document.getElementById(
            "riskLevel"
        );


    riskScoreElement.style.color =
        "";


    riskLevelElement.style.color =
        "";


    if (riskLevel === "CRITICAL") {

        riskScoreElement.style.color =
            "#dc2626";

        riskLevelElement.style.color =
            "#dc2626";
    }


    else if (riskLevel === "HIGH") {

        riskScoreElement.style.color =
            "#ea580c";

        riskLevelElement.style.color =
            "#ea580c";
    }


    else if (riskLevel === "MEDIUM") {

        riskScoreElement.style.color =
            "#ca8a04";

        riskLevelElement.style.color =
            "#ca8a04";
    }


    else if (riskLevel === "LOW") {

        riskScoreElement.style.color =
            "#16a34a";

        riskLevelElement.style.color =
            "#16a34a";
    }


    // -----------------------------------------------
    // Lists
    // -----------------------------------------------

    renderList(
        "whyRiskList",
        data.why_risk || []
    );


    renderBreakdown(
        data.score_breakdown || []
    );


    renderList(
        "evidenceList",
        data.evidence || []
    );


    renderList(
        "precursorsList",
        data.precursors || []
    );


    renderList(
        "consequencesList",
        data.consequences || []
    );


    renderList(
        "actionsList",
        data.actions || []
    );
}


// =====================================================
// GENERIC LIST RENDER
// =====================================================

function renderList(
    elementId,
    items
) {

    const element =
        document.getElementById(
            elementId
        );


    element.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        const li =
            document.createElement("li");


        li.textContent =
            "No information detected.";


        element.appendChild(li);

        return;
    }


    items.forEach(item => {

        const li =
            document.createElement("li");


        if (
            typeof item === "object"
        ) {

            li.textContent =
                JSON.stringify(item);

        }

        else {

            li.textContent =
                item;
        }


        element.appendChild(li);
    });
}


// =====================================================
// SCORE BREAKDOWN
// =====================================================

function renderBreakdown(items) {

    const element =
        document.getElementById(
            "breakdownList"
        );


    element.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        const li =
            document.createElement("li");


        li.textContent =
            "No score factors detected.";


        element.appendChild(li);

        return;
    }


    items.forEach(item => {

        const li =
            document.createElement("li");


        if (
            typeof item === "object"
        ) {

            if (
                item.factor !== undefined &&
                item.points !== undefined
            ) {

                li.textContent =
                    `${item.factor}: +${item.points}`;
            }

            else {

                li.textContent =
                    JSON.stringify(item);
            }

        }

        else {

            li.textContent =
                item;
        }


        element.appendChild(li);
    });
}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/dashboard`,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Dashboard error: ${response.status}`
            );
        }


        const data =
            await response.json();


        renderDashboard(data);

    }

    catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );
    }
}


// =====================================================
// RENDER DASHBOARD
// =====================================================

function renderDashboard(data) {

    // -----------------------------------------------
    // Statistics
    // -----------------------------------------------

    document.getElementById(
        "totalReports"
    ).textContent =
        data.total_reports ?? 0;


    document.getElementById(
        "criticalCount"
    ).textContent =
        data.critical ?? 0;


    document.getElementById(
        "highCount"
    ).textContent =
        data.high ?? 0;


    document.getElementById(
        "mediumCount"
    ).textContent =
        data.medium ?? 0;


    document.getElementById(
        "lowCount"
    ).textContent =
        data.low ?? 0;


    // -----------------------------------------------
    // Charts
    // -----------------------------------------------

    renderRiskDistribution(
        data
    );


    renderPrecursorCounts(
        data.precursor_counts || {}
    );


    renderRecentReports(
        data.reports || []
    );
}


// =====================================================
// RISK DISTRIBUTION
// =====================================================

function renderRiskDistribution(data) {

    const container =
        document.getElementById(
            "riskBars"
        );


    container.innerHTML = "";


    const total =
        data.total_reports || 0;


    const risks = [

        {
            name: "Critical",
            value: data.critical || 0
        },

        {
            name: "High",
            value: data.high || 0
        },

        {
            name: "Medium",
            value: data.medium || 0
        },

        {
            name: "Low",
            value: data.low || 0
        }

    ];


    risks.forEach(risk => {

        const percentage =
            total > 0
                ? (
                    (risk.value / total) *
                    100
                ).toFixed(1)
                : 0;


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "risk-bar";


        wrapper.innerHTML = `

            <div class="risk-bar-label">

                <span>
                    ${risk.name}
                </span>

                <span>
                    ${risk.value}
                    (${percentage}%)
                </span>

            </div>


            <div class="bar-container">

                <div
                    class="bar"
                    style="width:${percentage}%"
                ></div>

            </div>
        `;


        container.appendChild(
            wrapper
        );
    });
}


// =====================================================
// PRECURSOR COUNTS
// =====================================================

function renderPrecursorCounts(data) {

    const container =
        document.getElementById(
            "precursorCounts"
        );


    container.innerHTML = "";


    const entries =
        Object.entries(data);


    if (
        entries.length === 0
    ) {

        container.textContent =
            "No precursor data available.";

        return;
    }


    entries.sort(
        (a, b) => b[1] - a[1]
    );


    entries.forEach(
        ([precursor, count]) => {

            const div =
                document.createElement(
                    "div"
                );


            div.style.padding =
                "10px 0";


            div.style.borderBottom =
                "1px solid #e2e8f0";


            div.innerHTML = `

                <strong>
                    ${escapeHtml(precursor)}
                </strong>

                <span style="float:right;">
                    ${count}
                </span>
            `;


            container.appendChild(
                div
            );
        }
    );
}


// =====================================================
// RECENT REPORTS
// =====================================================

function renderRecentReports(reports) {

    const tbody =
        document.getElementById(
            "recentReports"
        );


    tbody.innerHTML = "";


    if (
        !reports ||
        reports.length === 0
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `
            <td colspan="7">
                No reports available.
            </td>
        `;


        tbody.appendChild(row);

        return;
    }


    // Latest reports first

    const sortedReports =
        [...reports].sort(
            (a, b) =>
                Number(b.id || 0) -
                Number(a.id || 0)
        );


    sortedReports.forEach(report => {

        const row =
            document.createElement(
                "tr"
            );


        const risk =
            String(
                report.risk_level || ""
            ).toLowerCase();


        let badgeClass =
            "badge-low";


        if (
            risk === "critical"
        ) {

            badgeClass =
                "badge-critical";
        }

        else if (
            risk === "high"
        ) {

            badgeClass =
                "badge-high";
        }

        else if (
            risk === "medium"
        ) {

            badgeClass =
                "badge-medium";
        }


        const precursors =
            Array.isArray(
                report.precursors
            )
                ? report.precursors.join(
                    ", "
                )
                : "-";


        row.innerHTML = `

            <td>
                ${report.id ?? "-"}
            </td>


            <td>
                ${escapeHtml(
                    report.reporter_role ??
                    "-"
                )}
            </td>


            <td>
                ${escapeHtml(
                    report.report_type ??
                    "-"
                )}
            </td>


            <td>
                ${escapeHtml(
                    report.location ??
                    "-"
                )}
            </td>


            <td>

                <span class="badge ${badgeClass}">

                    ${escapeHtml(
                        report.risk_level ??
                        "-"
                    )}

                    -
                    ${report.risk_score ?? 0}

                </span>

            </td>


            <td>
                ${escapeHtml(
                    report.category ??
                    "-"
                )}
            </td>


            <td>
                ${escapeHtml(
                    precursors
                )}
            </td>

        `;


        tbody.appendChild(
            row
        );
    });
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// REFRESH DASHBOARD
// =====================================================

function refreshDashboard() {

    loadDashboard();
}


// =====================================================
// BUTTON EVENTS
// =====================================================

analyzeBtn.addEventListener(
    "click",
    analyzeReport
);


document
    .getElementById(
        "refreshDashboard"
    )
    .addEventListener(
        "click",
        refreshDashboard
    );


// =====================================================
// CTRL + ENTER
// =====================================================

reportInput.addEventListener(
    "keydown",
    function (event) {

        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            analyzeReport();
        }
    }
);


// =====================================================
// INITIAL DASHBOARD LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);