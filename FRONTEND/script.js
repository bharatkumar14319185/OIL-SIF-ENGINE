// ======================================================
// API
// ======================================================

const API_BASE_URL = "https://oil-sif-engine.onrender.com";


// ======================================================
// DEMO REPORTS
// ======================================================

const demoReports = {

    confined: {
        location: "Underground valve chamber",
        activity: "Pipeline maintenance",
        incident: "Worker entered the underground valve chamber for maintenance inspection.",
        unsafe_act: "Worker entered without gas testing and without obtaining the required entry permit.",
        controls: "Atmospheric gas testing and confined-space entry permit were required.",
        ppe: "Safety helmet and safety shoes.",
        details: "The activity involved entry into an underground chamber during maintenance."
    },

    electrical: {
        location: "Electrical maintenance room",
        activity: "Maintenance of electrical panel",
        incident: "Worker was performing maintenance on an electrical panel.",
        unsafe_act: "LOTO was not applied and electrical isolation was not performed.",
        controls: "Electrical isolation and Lockout/Tagout were required before maintenance.",
        ppe: "Electrical safety PPE.",
        details: "Maintenance was performed while hazardous electrical energy could be present."
    },

    height: {
        location: "Elevated equipment platform",
        activity: "Equipment maintenance",
        incident: "Worker was performing maintenance at an elevated work area.",
        unsafe_act: "Worker was working without a safety harness and without guardrail.",
        controls: "Fall protection and suitable guardrails were required.",
        ppe: "Helmet and safety shoes.",
        details: "The worker was exposed to an unprotected fall hazard."
    },

    fire: {
        location: "Hydrocarbon handling area",
        activity: "Hot work activity",
        incident: "A hydrocarbon leak was observed near a hot work area.",
        unsafe_act: "Hot work was being performed near flammable hydrocarbon material.",
        controls: "Hot-work controls and removal of flammable materials were required.",
        ppe: "Standard industrial PPE.",
        details: "The combination of hydrocarbon release and ignition source created a potential fire and explosion hazard."
    },

    chemical: {
        location: "Chemical handling area",
        activity: "Hazardous material handling",
        incident: "Worker was handling hazardous material.",
        unsafe_act: "Worker handled the material without suitable gloves and helmet.",
        controls: "Chemical handling procedures and appropriate PPE were required.",
        ppe: "Required chemical PPE was not fully used.",
        details: "The activity created potential skin, eye and respiratory exposure."
    },

    vessel: {
        location: "Process vessel",
        activity: "Internal vessel inspection",
        incident: "Worker entered the process vessel for internal inspection.",
        unsafe_act: "Gas testing was not carried out and the entry permit was not obtained.",
        controls: "Atmospheric testing and vessel entry permit were required.",
        ppe: "Safety helmet and safety shoes.",
        details: "The worker entered the vessel during maintenance inspection."
    },

    energized: {
        location: "Electrical panel area",
        activity: "Electrical maintenance",
        incident: "Maintenance activity was performed near an energized electrical panel.",
        unsafe_act: "LOTO was not applied and electrical energy was not isolated.",
        controls: "Electrical isolation and LOTO were required before maintenance.",
        ppe: "Electrical safety PPE.",
        details: "Unexpected energization could expose the worker to hazardous electrical energy."
    },

    ventilation: {
        location: "Underground process chamber",
        activity: "Confined-space inspection",
        incident: "Poor ventilation was observed inside the chamber before entry.",
        unsafe_act: "The confined space had inadequate ventilation before entry.",
        controls: "Adequate ventilation and atmospheric testing were required.",
        ppe: "Safety helmet and safety shoes.",
        details: "Poor ventilation could allow hazardous gases to accumulate."
    }
};


// ======================================================
// DOM ELEMENTS
// ======================================================

const sampleReport = document.getElementById("sampleReport");

const locationInput = document.getElementById("locationInput");

const activityInput = document.getElementById("activityInput");

const incidentInput = document.getElementById("incidentInput");

const unsafeInput = document.getElementById("unsafeInput");

const controlsInput = document.getElementById("controlsInput");

const ppeInput = document.getElementById("ppeInput");

const detailsInput = document.getElementById("detailsInput");

const reportInput = document.getElementById("reportInput");

const analyzeBtn = document.getElementById("analyzeBtn");

const loading = document.getElementById("loading");

const resultSection = document.getElementById("resultSection");


// ======================================================
// GENERATE REPORT
// ======================================================

function generateReport() {

    const location = locationInput.value.trim();

    const activity = activityInput.value.trim();

    const incident = incidentInput.value.trim();

    const unsafeAct = unsafeInput.value.trim();

    const controls = controlsInput.value.trim();

    const ppe = ppeInput.value.trim();

    const details = detailsInput.value.trim();


    const parts = [];


    if (location) {

        parts.push(
            `Location / Work Area: ${location}`
        );

    }


    if (activity) {

        parts.push(
            `Activity / Task: ${activity}`
        );

    }


    if (incident) {

        parts.push(
            `Incident / Observation: ${incident}`
        );

    }


    if (unsafeAct) {

        parts.push(
            `Unsafe Act / Unsafe Condition: ${unsafeAct}`
        );

    }


    if (controls) {

        parts.push(
            `Existing Safety Controls: ${controls}`
        );

    }


    if (ppe) {

        parts.push(
            `PPE: ${ppe}`
        );

    }


    if (details) {

        parts.push(
            `Additional Details: ${details}`
        );

    }


    reportInput.value = parts.join(". ");
}


// ======================================================
// LISTEN FOR INPUT CHANGES
// ======================================================

[
    locationInput,
    activityInput,
    incidentInput,
    unsafeInput,
    controlsInput,
    ppeInput,
    detailsInput
].forEach(input => {

    input.addEventListener(
        "input",
        generateReport
    );

});


// ======================================================
// LOAD DEMO
// ======================================================

sampleReport.addEventListener(
    "change",
    function () {

        const selected = sampleReport.value;

        if (!selected) {

            return;

        }


        const demo = demoReports[selected];

        if (!demo) {

            return;

        }


        locationInput.value = demo.location;

        activityInput.value = demo.activity;

        incidentInput.value = demo.incident;

        unsafeInput.value = demo.unsafe_act;

        controlsInput.value = demo.controls;

        ppeInput.value = demo.ppe;

        detailsInput.value = demo.details;


        generateReport();

    }
);


// ======================================================
// CLEAR RESULTS
// ======================================================

function clearResults() {

    resultSection.style.display = "none";

}


// ======================================================
// SET LIST CONTENT
// ======================================================

function renderList(elementId, items) {

    const element = document.getElementById(elementId);

    element.innerHTML = "";


    if (!items || items.length === 0) {

        const li = document.createElement("li");

        li.textContent = "None detected.";

        element.appendChild(li);

        return;

    }


    items.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        element.appendChild(li);

    });

}


// ======================================================
// RISK LEVEL CLASS
// ======================================================

function applyRiskClass(element, level) {

    element.classList.remove(
        "risk-low",
        "risk-medium",
        "risk-high",
        "risk-critical"
    );


    const normalized = String(level || "")
        .toLowerCase();


    if (normalized === "low") {

        element.classList.add(
            "risk-low"
        );

    }

    else if (normalized === "medium") {

        element.classList.add(
            "risk-medium"
        );

    }

    else if (normalized === "high") {

        element.classList.add(
            "risk-high"
        );

    }

    else if (normalized === "critical") {

        element.classList.add(
            "risk-critical"
        );

    }

}


// ======================================================
// DISPLAY RESULT
// ======================================================

function displayResult(data) {

    resultSection.style.display = "block";


    // -----------------------------------------------
    // SUMMARY
    // -----------------------------------------------

    document.getElementById(
        "riskScore"
    ).textContent = data.risk_score ?? 0;


    const riskLevelElement =
        document.getElementById("riskLevel");


    riskLevelElement.textContent =
        data.risk_level ?? "-";


    applyRiskClass(
        riskLevelElement,
        data.risk_level
    );


    document.getElementById(
        "category"
    ).textContent =
        data.category ?? "-";


    // -----------------------------------------------
    // ANALYSIS
    // -----------------------------------------------

    document.getElementById(
        "analysisText"
    ).textContent =
        data.analysis ?? "";


    // -----------------------------------------------
    // WHY RISK
    // -----------------------------------------------

    renderList(
        "whyRiskList",
        data.why_risk
    );


    // -----------------------------------------------
    // SCORE
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
    // BREAKDOWN
    // -----------------------------------------------

    const breakdownList =
        document.getElementById("breakdownList");


    breakdownList.innerHTML = "";


    if (
        data.score_breakdown &&
        data.score_breakdown.length > 0
    ) {

        data.score_breakdown.forEach(item => {

            const li =
                document.createElement("li");


            li.textContent =
                `${item.factor}: +${item.points} points`;


            breakdownList.appendChild(li);

        });

    }

    else {

        const li =
            document.createElement("li");


        li.textContent =
            "No scoring factors detected.";


        breakdownList.appendChild(li);

    }


    // -----------------------------------------------
    // EVIDENCE
    // -----------------------------------------------

    renderList(
        "evidenceList",
        data.evidence
    );


    // -----------------------------------------------
    // PRECURSORS
    // -----------------------------------------------

    renderList(
        "precursorsList",
        data.precursors
    );


    // -----------------------------------------------
    // HAZARDS
    // -----------------------------------------------

    renderList(
        "hazardsList",
        data.detected_hazards
    );


    // -----------------------------------------------
    // CONSEQUENCES
    // -----------------------------------------------

    renderList(
        "consequencesList",
        data.consequences
    );


    // -----------------------------------------------
    // ACTIONS
    // -----------------------------------------------

    renderList(
        "actionsList",
        data.actions
    );


    // -----------------------------------------------
    // ORIGINAL REPORT
    // -----------------------------------------------

    document.getElementById(
        "originalReport"
    ).textContent =
        data.original_report ?? "";


    // -----------------------------------------------
    // SCROLL
    // -----------------------------------------------

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ======================================================
// ANALYZE REPORT
// ======================================================

async function analyzeReport() {

    generateReport();


    const report =
        reportInput.value.trim();


    if (!report) {

        alert(
            "Please provide safety report details."
        );

        return;

    }


    analyzeBtn.disabled = true;

    loading.style.display = "block";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/analyze-structured`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        location:
                            locationInput.value.trim(),

                        activity:
                            activityInput.value.trim(),

                        incident:
                            incidentInput.value.trim(),

                        unsafe_act:
                            unsafeInput.value.trim(),

                        controls:
                            controlsInput.value.trim(),

                        ppe:
                            ppeInput.value.trim(),

                        details:
                            detailsInput.value.trim()

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


        if (data.error) {

            alert(data.error);

            return;

        }


        displayResult(data);


        // Refresh dashboard
        loadDashboard();

    }


    catch (error) {

        console.error(
            "Analysis error:",
            error
        );


        alert(
            "Unable to analyze the report. Please check whether the backend is running."
        );

    }


    finally {

        analyzeBtn.disabled = false;

        loading.style.display = "none";

    }

}


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/dashboard`
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
        ).textContent =
            data.total_reports ?? 0;


        document.getElementById(
            "criticalReports"
        ).textContent =
            data.critical_reports ?? 0;


        document.getElementById(
            "highReports"
        ).textContent =
            data.high_reports ?? 0;


        document.getElementById(
            "mediumReports"
        ).textContent =
            data.medium_reports ?? 0;


        document.getElementById(
            "lowReports"
        ).textContent =
            data.low_reports ?? 0;


        renderRiskDistribution(data);

        renderPrecursorCounts(
            data.precursor_counts
        );

        renderRecentReports(
            data.reports
        );

    }


    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// ======================================================
// RISK DISTRIBUTION
// ======================================================

function renderRiskDistribution(data) {

    const container =
        document.getElementById("riskBars");


    container.innerHTML = "";


    const levels = [

        {
            name: "Critical",
            value: data.critical_reports ?? 0
        },

        {
            name: "High",
            value: data.high_reports ?? 0
        },

        {
            name: "Medium",
            value: data.medium_reports ?? 0
        },

        {
            name: "Low",
            value: data.low_reports ?? 0
        }

    ];


    const max =
        Math.max(
            ...levels.map(item => item.value),
            1
        );


    levels.forEach(item => {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "bar-row";


        const label =
            document.createElement("div");

        label.className =
            "bar-label";

        label.innerHTML =
            `<span>${item.name}</span>
             <strong>${item.value}</strong>`;


        const barContainer =
            document.createElement("div");

        barContainer.className =
            "bar-container";


        const bar =
            document.createElement("div");

        bar.className =
            `bar ${item.name.toLowerCase()}`;


        bar.style.width =
            `${(item.value / max) * 100}%`;


        barContainer.appendChild(bar);

        wrapper.appendChild(label);

        wrapper.appendChild(barContainer);

        container.appendChild(wrapper);

    });

}


// ======================================================
// PRECURSOR COUNTS
// ======================================================

function renderPrecursorCounts(counts) {

    const container =
        document.getElementById(
            "precursorBars"
        );


    container.innerHTML = "";


    if (
        !counts ||
        Object.keys(counts).length === 0
    ) {

        container.innerHTML =
            "<p>No precursor data available.</p>";

        return;

    }


    const entries =
        Object.entries(counts)
            .sort((a, b) => b[1] - a[1]);


    const max =
        Math.max(
            ...entries.map(item => item[1]),
            1
        );


    entries.forEach(
        ([name, count]) => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "bar-row";


            const label =
                document.createElement("div");

            label.className =
                "bar-label";

            label.innerHTML =
                `<span>${name}</span>
                 <strong>${count}</strong>`;


            const barContainer =
                document.createElement("div");

            barContainer.className =
                "bar-container";


            const bar =
                document.createElement("div");

            bar.className =
                "bar precursor";


            bar.style.width =
                `${(count / max) * 100}%`;


            barContainer.appendChild(bar);

            wrapper.appendChild(label);

            wrapper.appendChild(barContainer);

            container.appendChild(wrapper);

        }
    );

}


// ======================================================
// RECENT REPORTS
// ======================================================

function renderRecentReports(reports) {

    const container =
        document.getElementById(
            "reportsTable"
        );


    container.innerHTML = "";


    if (
        !reports ||
        reports.length === 0
    ) {

        container.innerHTML =
            "<p>No reports analyzed yet.</p>";

        return;

    }


    reports
        .slice()
        .reverse()
        .forEach(report => {

            const row =
                document.createElement("div");

            row.className =
                "report-row";


            const category =
                document.createElement("div");

            category.className =
                "report-category";

            category.textContent =
                report.category || "General Safety";


            const risk =
                document.createElement("div");

            risk.className =
                "report-risk";

            risk.textContent =
                `${report.risk_score}/100`;


            const level =
                document.createElement("div");

            level.className =
                "report-level";

            level.textContent =
                report.risk_level;


            applyRiskClass(
                level,
                report.risk_level
            );


            row.appendChild(category);

            row.appendChild(risk);

            row.appendChild(level);


            container.appendChild(row);

        });

}


// ======================================================
// BUTTON EVENT
// ======================================================

analyzeBtn.addEventListener(
    "click",
    analyzeReport
);


// ======================================================
// CTRL + ENTER
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            analyzeReport();

        }

    }
);


// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);