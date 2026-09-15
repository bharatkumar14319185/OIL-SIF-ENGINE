const API_BASE_URL =
    "https://oil-sif-engine.onrender.com";


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

const resultSection =
    document.getElementById("resultSection");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");


// =====================================================
// DEMO SELECT
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


            reportInput.value =
                demoReports[selected];


            resultSection.classList.add(
                "hidden"
            );


            hideError();
        }
    );
}


// =====================================================
// CLEAR
// =====================================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            reportInput.value = "";

            if (demoSelect) {
                demoSelect.value = "";
            }

            resultSection.classList.add(
                "hidden"
            );

            hideError();

        }
    );
}


// =====================================================
// ERROR
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
// ANALYZE REPORT
// =====================================================

async function analyzeReport() {

    const report =
        reportInput.value.trim();


    if (!report) {

        showError(
            "Please enter a safety report."
        );

        return;
    }


    hideError();


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
                        report: report
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        const data =
            await response.json();


        renderResult(data);


        resultSection.classList.remove(
            "hidden"
        );


        // Refresh dashboard

        await loadDashboard();


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
// RENDER RESULT
// =====================================================

function renderResult(data) {

    const riskScore =
        document.getElementById(
            "riskScore"
        );

    const riskLevel =
        document.getElementById(
            "riskLevel"
        );

    const category =
        document.getElementById(
            "category"
        );


    if (riskScore) {

        riskScore.textContent =
            data.risk_score ?? "-";
    }


    if (riskLevel) {

        riskLevel.textContent =
            data.risk_level ?? "-";
    }


    if (category) {

        category.textContent =
            data.category ?? "-";
    }


    // -----------------------------------------------
    // Analysis
    // -----------------------------------------------

    const analysisText =
        document.getElementById(
            "analysisText"
        );


    if (analysisText) {

        analysisText.textContent =
            data.analysis ?? "-";
    }


    // -----------------------------------------------
    // Score
    // -----------------------------------------------

    setText(
        "baseScore",
        data.base_score ?? 0
    );


    setText(
        "detectedPoints",
        data.detected_points ?? 0
    );


    setText(
        "finalScore",
        data.risk_score ?? 0
    );


    // -----------------------------------------------
    // Original Report
    // -----------------------------------------------

    setText(
        "originalReport",
        data.original_report ??
        reportInput.value
    );


    // -----------------------------------------------
    // Risk Colour
    // -----------------------------------------------

    const level =
        String(
            data.risk_level || ""
        ).toUpperCase();


    if (riskScore) {
        riskScore.style.color = "";
    }


    if (riskLevel) {
        riskLevel.style.color = "";
    }


    if (level === "CRITICAL") {

        if (riskScore) {
            riskScore.style.color =
                "#dc2626";
        }

        if (riskLevel) {
            riskLevel.style.color =
                "#dc2626";
        }

    }


    else if (level === "HIGH") {

        if (riskScore) {
            riskScore.style.color =
                "#ea580c";
        }

        if (riskLevel) {
            riskLevel.style.color =
                "#ea580c";
        }

    }


    else if (level === "MEDIUM") {

        if (riskScore) {
            riskScore.style.color =
                "#ca8a04";
        }

        if (riskLevel) {
            riskLevel.style.color =
                "#ca8a04";
        }

    }


    else if (level === "LOW") {

        if (riskScore) {
            riskScore.style.color =
                "#16a34a";
        }

        if (riskLevel) {
            riskLevel.style.color =
                "#16a34a";
        }
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
// SET TEXT
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;
    }
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
                String(item);
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

    setText(
        "totalReports",
        data.total_reports ?? 0
    );


    setText(
        "criticalCount",
        data.critical ?? 0
    );


    setText(
        "highCount",
        data.high ?? 0
    );


    setText(
        "mediumCount",
        data.medium ?? 0
    );


    setText(
        "lowCount",
        data.low ?? 0
    );


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
                    risk.value /
                    total *
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
        (a, b) =>
            b[1] - a[1]
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
        return;
    }


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

            <td colspan="5">
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
                    report.report ?? "-"
                )}
            </td>

            <td>

                <span
                    class="badge ${badgeClass}"
                >

                    ${escapeHtml(
                        report.risk_level ?? "-"
                    )}

                    -

                    ${report.risk_score ?? 0}

                </span>

            </td>

            <td>
                ${escapeHtml(
                    report.category ?? "-"
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

if (analyzeBtn) {

    analyzeBtn.addEventListener(
        "click",
        analyzeReport
    );
}


const refreshButton =
    document.getElementById(
        "refreshDashboard"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        refreshDashboard
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
                (
                    event.ctrlKey ||
                    event.metaKey
                ) &&
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