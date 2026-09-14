// ============================================================
// SAMPLE REPORTS
// ============================================================

const sampleReports = {

    confined:
        "Worker entered a confined space without gas testing and without permit.",

    electrical:
        "Worker was working on an electrical panel without LOTO and without electrical isolation.",

    height:
        "Worker was working at height without a safety harness and without guardrail.",

    hydrocarbon:
        "A hydrocarbon leak was observed near a hot work area.",

    ppe:
        "Worker was handling hazardous material without gloves and without helmet."

};


// ============================================================
// LOAD SAMPLE
// ============================================================

function loadSampleReport() {

    const dropdown =
        document.getElementById("sampleReport");

    const reportInput =
        document.getElementById("reportInput");

    const selected =
        dropdown.value;


    if (
        selected &&
        sampleReports[selected]
    ) {

        reportInput.value =
            sampleReports[selected];

    }

    else {

        reportInput.value = "";

    }

}


// ============================================================
// ANALYZE REPORT
// ============================================================

async function analyzeReport() {

    const reportInput =
        document.getElementById("reportInput");

    const analyzeBtn =
        document.getElementById("analyzeBtn");

    const loading =
        document.getElementById("loading");

    const resultSection =
        document.getElementById("resultSection");


    const report =
        reportInput.value.trim();


    if (!report) {

        alert(
            "Please enter a safety report."
        );

        return;

    }


    analyzeBtn.disabled =
        true;

    analyzeBtn.innerText =
        "ANALYZING...";

    loading.classList.remove(
        "hidden"
    );

    resultSection.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/analyze",
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            report:
                                report
                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Backend request failed"
            );

        }


        const data =
            await response.json();


        // ====================================================
        // RISK SCORE
        // ====================================================

        const score =
            data.risk_score;


        document.getElementById(
            "riskScore"
        ).innerText =
            score;


        document.getElementById(
            "finalScore"
        ).innerText =
            score;


        document.getElementById(
            "baseScore"
        ).innerText =
            data.base_score;


        document.getElementById(
            "detectedPoints"
        ).innerText =
            data.detected_points;


        // ====================================================
        // SCORE CIRCLE
        // ====================================================

        const scoreCircle =
            document.querySelector(
                ".score-circle"
            );


        const degrees =
            (score / 100) * 360;


        let scoreColor;


        if (score >= 76) {

            scoreColor =
                "#ef4444";

        }

        else if (score >= 51) {

            scoreColor =
                "#f97316";

        }

        else if (score >= 26) {

            scoreColor =
                "#eab308";

        }

        else {

            scoreColor =
                "#22c55e";

        }


        scoreCircle.style.background = `

            radial-gradient(
                circle,
                #0d1522 58%,
                transparent 59%
            ),

            conic-gradient(
                ${scoreColor} 0deg,
                ${scoreColor} ${degrees}deg,
                #26384d ${degrees}deg,
                #26384d 360deg
            )

        `;


        // ====================================================
        // RISK LEVEL
        // ====================================================

        const riskLevel =
            document.getElementById(
                "riskLevel"
            );


        riskLevel.innerText =
            data.risk_level;


        if (
            data.risk_level ===
            "CRITICAL"
        ) {

            riskLevel.style.color =
                "#ef4444";

        }

        else if (
            data.risk_level ===
            "HIGH"
        ) {

            riskLevel.style.color =
                "#f97316";

        }

        else if (
            data.risk_level ===
            "MEDIUM"
        ) {

            riskLevel.style.color =
                "#eab308";

        }

        else {

            riskLevel.style.color =
                "#22c55e";

        }


        // ====================================================
        // CATEGORY
        // ====================================================

        document.getElementById(
            "category"
        ).innerText =
            data.category;


        // ====================================================
        // ANALYSIS
        // ====================================================

        document.getElementById(
            "analysisText"
        ).innerText =
            data.analysis;


        // ====================================================
        // WHY RISK
        // ====================================================

        const whyRiskList =
            document.getElementById(
                "whyRiskList"
            );


        whyRiskList.innerHTML =
            "";


        data.why_risk.forEach(
            item => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "why-item";


                div.innerText =
                    item;


                whyRiskList.appendChild(
                    div
                );

            }
        );


        // ====================================================
        // SCORE BREAKDOWN
        // ====================================================

        const breakdownList =
            document.getElementById(
                "breakdownList"
            );


        breakdownList.innerHTML =
            "";


        data.score_breakdown.forEach(
            item => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "breakdown-item";


                div.innerHTML = `

                    <div>

                        <strong>
                            ${item.factor}
                        </strong>

                        <span>
                            ${item.reason}
                        </span>

                    </div>

                    <b>
                        +${item.points}
                    </b>

                `;


                breakdownList.appendChild(
                    div
                );

            }
        );


        // ====================================================
        // LISTS
        // ====================================================

        fillList(
            "evidenceList",
            data.evidence,
            "No specific evidence phrase detected."
        );


        fillList(
            "precursorsList",
            data.precursors,
            "No major SIF precursor detected."
        );


        fillList(
            "consequencesList",
            data.consequences,
            "No consequence identified."
        );


        fillList(
            "actionsList",
            data.actions,
            "No corrective action identified."
        );


        // SHOW

        resultSection.classList.remove(
            "hidden"
        );


        resultSection.scrollIntoView({
            behavior:
                "smooth"
        });


    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to connect to backend. Make sure FastAPI is running."
        );

    }


    finally {

        loading.classList.add(
            "hidden"
        );

        analyzeBtn.disabled =
            false;

        analyzeBtn.innerText =
            "ANALYZE REPORT";

    }

}


// ============================================================
// FILL LIST
// ============================================================

function fillList(
    elementId,
    items,
    emptyMessage
) {

    const list =
        document.getElementById(
            elementId
        );


    list.innerHTML =
        "";


    if (
        items &&
        items.length > 0
    ) {

        items.forEach(
            item => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.innerText =
                    item;

                list.appendChild(
                    li
                );

            }
        );

    }

    else {

        const li =
            document.createElement(
                "li"
            );

        li.innerText =
            emptyMessage;

        list.appendChild(
            li
        );

    }

}


// ============================================================
// DASHBOARD
// ============================================================

async function loadDashboard() {

    const status =
        document.getElementById(
            "reportStatus"
        );


    status.innerText =
        "Loading...";


    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/dashboard"
            );


        if (!response.ok) {

            throw new Error(
                "Dashboard request failed"
            );

        }


        const data =
            await response.json();


        document.getElementById(
            "totalReports"
        ).innerText =
            data.total_reports;


        document.getElementById(
            "criticalReports"
        ).innerText =
            data.critical;


        document.getElementById(
            "highReports"
        ).innerText =
            data.high;


        document.getElementById(
            "mediumReports"
        ).innerText =
            data.medium;


        document.getElementById(
            "lowReports"
        ).innerText =
            data.low;


        createRiskBars(data);

        createPrecursorBars(
            data.precursor_counts
        );


        const table =
            document.getElementById(
                "reportsTable"
            );


        table.innerHTML =
            "";


        data.reports.forEach(
            report => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const riskClass =
                    report.risk_level.toLowerCase();


                row.innerHTML = `

                    <td>
                        #${report.id}
                    </td>

                    <td class="report-text">
                        ${report.report}
                    </td>

                    <td>
                        ${report.category}
                    </td>

                    <td>

                        <span class="risk-badge ${riskClass}">
                            ${report.risk_level}
                        </span>

                    </td>

                    <td>
                        <strong>
                            ${report.risk_score}
                        </strong>
                    </td>

                `;


                table.appendChild(
                    row
                );

            }
        );


        status.innerText =
            `${data.total_reports} reports analyzed`;


    }

    catch (error) {

        console.error(
            error
        );

        status.innerText =
            "Dashboard unavailable";

    }

}


// ============================================================
// RISK BARS
// ============================================================

function createRiskBars(data) {

    const container =
        document.getElementById(
            "riskBars"
        );


    container.innerHTML =
        "";


    const risks = [

        {
            name: "Critical",
            count: data.critical,
            className: "critical"
        },

        {
            name: "High",
            count: data.high,
            className: "high"
        },

        {
            name: "Medium",
            count: data.medium,
            className: "medium"
        },

        {
            name: "Low",
            count: data.low,
            className: "low"
        }

    ];


    const max =
        Math.max(
            ...risks.map(
                r => r.count
            ),
            1
        );


    risks.forEach(
        risk => {

            const percentage =
                (risk.count / max) * 100;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "bar-row";


            row.innerHTML = `

                <div class="bar-label">

                    <span>
                        ${risk.name}
                    </span>

                    <strong>
                        ${risk.count}
                    </strong>

                </div>


                <div class="bar-background">

                    <div
                        class="bar-fill ${risk.className}"
                        style="width:${percentage}%"
                    >
                    </div>

                </div>

            `;


            container.appendChild(
                row
            );

        }
    );

}


// ============================================================
// PRECURSOR BARS
// ============================================================

function createPrecursorBars(
    precursorCounts
) {

    const container =
        document.getElementById(
            "precursorBars"
        );


    container.innerHTML =
        "";


    const entries =
        Object.entries(
            precursorCounts
        );


    entries.sort(
        (a, b) =>
            b[1] - a[1]
    );


    const top =
        entries.slice(
            0,
            6
        );


    const max =
        Math.max(
            ...top.map(
                item => item[1]
            ),
            1
        );


    top.forEach(
        item => {

            const percentage =
                (item[1] / max) * 100;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "bar-row";


            row.innerHTML = `

                <div class="bar-label">

                    <span>
                        ${item[0]}
                    </span>

                    <strong>
                        ${item[1]}
                    </strong>

                </div>


                <div class="bar-background">

                    <div
                        class="bar-fill precursor"
                        style="width:${percentage}%"
                    >
                    </div>

                </div>

            `;


            container.appendChild(
                row
            );

        }
    );

}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const dropdown =
            document.getElementById(
                "sampleReport"
            );


        const analyzeBtn =
            document.getElementById(
                "analyzeBtn"
            );


        dropdown.addEventListener(
            "change",
            loadSampleReport
        );


        analyzeBtn.addEventListener(
            "click",
            analyzeReport
        );


        loadDashboard();

    }
);