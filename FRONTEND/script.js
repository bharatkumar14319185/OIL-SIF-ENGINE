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

const reportInput =
    document.getElementById("reportInput");

const demoSelect =
    document.getElementById("demoSelect");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const clearBtn =
    document.getElementById("clearBtn");

const reporterRole =
    document.getElementById("reporterRole");

const reportType =
    document.getElementById("reportType");


// IMPORTANT:
// HTML uses id="locationInput"

const locationInput =
    document.getElementById("locationInput");


const workActivity =
    document.getElementById("workActivity");

const resultSection =
    document.getElementById("resultSection");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const refreshDashboardBtn =
    document.getElementById("refreshDashboard");


// =====================================================
// CHECK REQUIRED ELEMENTS
// =====================================================

const requiredElements = {

    reportInput,
    demoSelect,
    analyzeBtn,
    clearBtn,
    reporterRole,
    reportType,
    locationInput,
    workActivity,
    resultSection,
    loadingMessage,
    errorMessage
};


Object.entries(requiredElements).forEach(
    ([name, element]) => {

        if (!element) {

            console.error(
                `HTML element not found: ${name}`
            );
        }
    }
);


// =====================================================
// DEMO SCENARIO SELECT
// =====================================================

if (demoSelect) {

    demoSelect.addEventListener(
        "change",
        function () {

            const selected =
                this.value;


            if (!selected) {
                return;
            }


            if (!demoReports[selected]) {
                return;
            }


            // Fill safety report

            reportInput.value =
                demoReports[selected];


            // -----------------------------------------
            // CONFined SPACE
            // -----------------------------------------

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


            // -----------------------------------------
            // ELECTRICAL
            // -----------------------------------------

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


            // -----------------------------------------
            // WORKING AT HEIGHT
            // -----------------------------------------

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


            // -----------------------------------------
            // HYDROCARBON
            // -----------------------------------------

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


            // -----------------------------------------
            // PPE
            // -----------------------------------------

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


            // -----------------------------------------
            // VESSEL
            // -----------------------------------------

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


            // -----------------------------------------
            // ENERGIZED ELECTRICAL
            // -----------------------------------------

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


            // -----------------------------------------
            // POOR VENTILATION
            // -----------------------------------------

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


            // Hide old result

            resultSection.classList.add("hidden");

            hideError();

        }
    );
}


// =====================================================
// CLEAR FORM
// =====================================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            reportInput.value = "";

            locationInput.value = "";

            workActivity.value = "";

            demoSelect.value = "";

            reporterRole.value =
                "Worker / Employee";

            reportType.value =
                "Unsafe Act";

            resultSection.classList.add(
                "hidden"
            );

            hideError();

        }
    );
}


// =====================================================
// SHOW ERROR
// =====================================================

function showError(message) {

    if (!errorMessage) {
        return;
    }

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

    if (!errorMessage) {
        return;
    }

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


    // Validate

    if (!report) {

        showError(
            "Please enter a safety report."
        );

        return;
    }


    hideError();


    // Loading

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

        // =========================================
        // SEND DATA
        // =========================================

        const response =
            await fetch(
                `${API_BASE_URL}/analyze`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
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


        // =========================================
        // CHECK RESPONSE
        // =========================================

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        // =========================================
        // JSON
        // =========================================

        const data =
            await response.json();


        console.log(
            "Analysis result:",
            data
        );


        // =========================================
        // RENDER
        // =========================================

        renderResult(data);


        resultSection.classList.remove(
            "hidden"
        );


        // =========================================
        // DASHBOARD
        // =========================================

        await loadDashboard();


        // =========================================
        // SCROLL
        // =========================================

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


    document.getElementById(
        "analysisText"
    ).textContent =
        data.analysis ?? "-";


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


    document.getElementById(
        "originalReport"
    ).textContent =
        data.original_report ??
        reportInput.value;


    // =========================================
    // RISK COLOR
    // =========================================

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


    // =========================================
    // LISTS
    // =========================================

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
// GENERIC LIST
// =====================================================

function renderList(
    elementId,
    items
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        console.error(
            `Element not found: ${elementId}`
        );

        return;
    }


    element.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "No information detected.";


        element.appendChild(li);

        return;
    }


    items.forEach(item => {

        const li =
            document.createElement(
                "li"
            );


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


    if (!element) {

        console.error(
            "breakdownList not found"
        );

        return;
    }


    element.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "No score factors detected.";


        element.appendChild(li);

        return;
    }


    items.forEach(item => {

        const li =
            document.createElement(
                "li"
            );


        if (
            typeof item === "object" &&
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
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Dashboard error: ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "Dashboard data:",
            data
        );


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


    renderRiskDistribution(data);


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


    if (!container) {
        return;
    }


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


    if (!container) {
        return;
    }


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
// RECENT SAFETY REPORTS
// =====================================================

function renderRecentReports(reports) {

    const tbody =
        document.getElementById(
            "recentReports"
        );


    if (!tbody) {

        console.error(
            "recentReports element not found in HTML."
        );

        return;
    }


    tbody.innerHTML = "";


    if (
        !Array.isArray(reports) ||
        reports.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7">
                    No reports available.
                </td>

            </tr>

        `;

        return;
    }


    // =========================================
    // LATEST REPORTS FIRST
    // =========================================

    const sortedReports =
        [...reports].sort(
            (a, b) =>
                Number(b.id || 0) -
                Number(a.id || 0)
        );


    // =========================================
    // CREATE ROWS
    // =========================================

    sortedReports.forEach(
        report => {

            const row =
                document.createElement(
                    "tr"
                );


            const risk =
                String(
                    report.risk_level || ""
                ).toUpperCase();


            let badgeClass =
                "badge-low";


            if (
                risk === "CRITICAL"
            ) {

                badgeClass =
                    "badge-critical";
            }

            else if (
                risk === "HIGH"
            ) {

                badgeClass =
                    "badge-high";
            }

            else if (
                risk === "MEDIUM"
            ) {

                badgeClass =
                    "badge-medium";
            }


            // =================================
            // PRECURSORS
            // =================================

            const precursors =
                Array.isArray(
                    report.precursors
                )
                    ? report.precursors.join(
                        ", "
                    )
                    : "-";


            // =================================
            // ROW HTML
            // =================================

            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        report.id ?? "-"
                    )}
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
                        report.location ||
                        "-"
                    )}
                </td>


                <td>

                    <span
                        class="badge ${badgeClass}"
                    >

                        ${escapeHtml(
                            report.risk_level ??
                            "-"
                        )}

                        -

                        ${escapeHtml(
                            report.risk_score ??
                            0
                        )}

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

        }
    );
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


if (refreshDashboardBtn) {

    refreshDashboardBtn.addEventListener(
        "click",
        refreshDashboard
    );
}


// =====================================================
// ANALYZE BUTTON
// =====================================================

if (analyzeBtn) {

    analyzeBtn.addEventListener(
        "click",
        analyzeReport
    );
}


// =====================================================
// CTRL + ENTER
// =====================================================

if (reportInput) {

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
}


// =====================================================
// INITIAL DASHBOARD LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);