"use strict";

// ========================================
// DIGITAL AFTERLIFE
// Local browser-based project inspection
// ========================================

const $ = (selector) => document.querySelector(selector);

const folderInput = $("#folderInput");
const dropZone = $("#dropZone");
const uploadButton = $("#uploadButton");
const analyzeButton = $("#analyzeButton");
const demoButton = $("#demoButton");
const clearProjectButton = $("#clearProject");
const newInvestigationButton = $("#newInvestigationButton");
const themeButton = $("#themeButton");

const selectedProject = $("#selectedProject");
const projectName = $("#projectName");
const projectDetails = $("#projectDetails");

const progressPanel = $("#progressPanel");
const progressTitle = $("#progressTitle");
const progressPercent = $("#progressPercent");
const progressFill = $("#progressFill");
const progressLog = $("#progressLog");

const resultsSection = $("#resultsSection");

const MAX_FILES = 1000;
const MAX_FILE_SIZE = 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

const IGNORED_DIRECTORIES = new Set([
    "node_modules",
    ".git",
    ".next",
    ".nuxt",
    "dist",
    "build",
    "coverage",
    "__pycache__",
    ".venv",
    "venv",
    "vendor",
    ".idea",
    ".vscode"
]);

const ALLOWED_EXTENSIONS = new Set([
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".sass",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".c",
    ".h",
    ".cpp",
    ".hpp",
    ".java",
    ".go",
    ".rs",
    ".php",
    ".rb",
    ".sql",
    ".json",
    ".md",
    ".txt",
    ".yml",
    ".yaml",
    ".xml",
    ".sh",
    ".bat",
    ".ps1",
    ".toml",
    ".ini"
]);

let selectedFiles = [];
let activeToastTimer = null;
let investigationRunning = false;

// ========================================
// UTILITIES
// ========================================

function showToast(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(activeToastTimer);

    activeToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

function getExtension(path) {
    const filename = path.split("/").pop();
    const index = filename.lastIndexOf(".");

    return index > 0
        ? filename.slice(index).toLowerCase()
        : "";
}

function getSafeRelativePath(file) {
    return file.webkitRelativePath || file.name;
}

function isIgnoredPath(path) {
    const parts = path.split("/");

    return parts.some(part =>
        IGNORED_DIRECTORIES.has(part)
    );
}

function isAllowedFile(file) {
    const path = getSafeRelativePath(file);

    if (isIgnoredPath(path)) {
        return false;
    }

    return ALLOWED_EXTENSIONS.has(
        getExtension(path)
    );
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

function getProjectName(files) {
    if (!files.length) {
        return "Unknown project";
    }

    const path = getSafeRelativePath(files[0]);
    const parts = path.split("/");

    return parts.length > 1
        ? parts[0]
        : "Selected project";
}

function scrollToResults() {
    resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ========================================
// FILE SELECTION
// ========================================

uploadButton.addEventListener("click", () => {
    if (!investigationRunning) {
        folderInput.click();
    }
});

folderInput.addEventListener("change", () => {
    setProjectFiles(Array.from(folderInput.files));
});

function setProjectFiles(files) {
    if (investigationRunning) {
        return;
    }

    const usableFiles = files.filter(isAllowedFile);

    if (!usableFiles.length) {
        showToast(
            "No supported source files found. Select a project containing code or documentation."
        );

        return;
    }

    if (usableFiles.length > MAX_FILES) {
        showToast(
            `Please select a project with no more than ${MAX_FILES} source files.`
        );

        return;
    }

    const oversizedCount = usableFiles.filter(
        file => file.size > MAX_FILE_SIZE
    ).length;

    const totalSize = usableFiles.reduce(
        (sum, file) => sum + file.size,
        0
    );

    if (oversizedCount > 0) {
        showToast(
            "Some files are too large to inspect and will be skipped."
        );
    }

    if (totalSize > MAX_TOTAL_SIZE) {
        showToast(
            "The selected source files exceed the 25 MB demo limit."
        );

        return;
    }

    selectedFiles = usableFiles;

    const totalBytes = selectedFiles.reduce(
        (sum, file) => sum + file.size,
        0
    );

    projectName.textContent = getProjectName(selectedFiles);

    projectDetails.textContent =
        `${selectedFiles.length} source files · ${formatBytes(totalBytes)}`;

    selectedProject.classList.remove("hidden");
    analyzeButton.disabled = false;

    resultsSection.classList.add("hidden");
    progressPanel.classList.add("hidden");

    $("#systemStatus").textContent = "PROJECT LOADED";

    showToast(
        `${selectedFiles.length} source files ready for inspection.`
    );
}

function formatBytes(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

clearProjectButton.addEventListener("click", () => {
    if (investigationRunning) {
        return;
    }

    resetProject();
});

function resetProject() {
    selectedFiles = [];

    folderInput.value = "";

    selectedProject.classList.add("hidden");
    progressPanel.classList.add("hidden");
    resultsSection.classList.add("hidden");

    analyzeButton.disabled = true;

    $("#systemStatus").textContent = "SYSTEM ONLINE";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ========================================
// DRAG AND DROP
// ========================================

dropZone.addEventListener("dragover", event => {
    event.preventDefault();

    if (!investigationRunning) {
        dropZone.classList.add("drag-over");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", event => {
    event.preventDefault();

    dropZone.classList.remove("drag-over");

    if (investigationRunning) {
        return;
    }

    const files = Array.from(event.dataTransfer.files);

    if (!files.length) {
        return;
    }

    setProjectFiles(files);

    showToast(
        "For folder imports, use Browse your files. Folder selection is the most reliable option in this demo."
    );
});

// ========================================
// ANALYSIS ENGINE
// ========================================

async function readFileText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(String(reader.result || ""));
        };

        reader.onerror = () => {
            reject(
                new Error(`Could not read ${file.name}`)
            );
        };

        reader.readAsText(file);
    });
}

function getCommentPattern(extension) {
    if ([".html", ".htm", ".xml"].includes(extension)) {
        return /<!--[\s\S]*?-->/g;
    }

    if ([".sql"].includes(extension)) {
        return /--.*|\/\*[\s\S]*?\*\//g;
    }

    if ([".css", ".scss", ".sass"].includes(extension)) {
        return /\/\*[\s\S]*?\*\//g;
    }

    if ([".py", ".sh", ".rb", ".yaml", ".yml", ".toml", ".ini"].includes(extension)) {
        return /#.*|'''[\s\S]*?'''|"""[\s\S]*?"""/g;
    }

    return /\/\/.*|\/\*[\s\S]*?\*\//g;
}

function extractMarkers(content, filePath) {
    const extension = getExtension(filePath);
    const commentPattern = getCommentPattern(extension);

    const matches = [];
    let match;

    while ((match = commentPattern.exec(content)) !== null) {
        const comment = match[0];

        const markerPattern = /\b(TODO|FIXME|HACK|XXX)\b\s*:?\s*(.*)/gi;

        let markerMatch;

        while ((markerMatch = markerPattern.exec(comment)) !== null) {
            const precedingText = content.slice(0, match.index);

            const lineNumber =
                precedingText.split("\n").length;

            matches.push({
                type: markerMatch[1].toUpperCase(),
                message: markerMatch[2].trim() ||
                    "No description provided",
                file: filePath,
                line: lineNumber
            });
        }
    }

    return matches;
}

async function inspectProject(files) {
    const findings = [];
    const inspectedFiles = [];
    const errors = [];

    let totalLines = 0;
    let skippedFiles = 0;

    const fileNames = files.map(getSafeRelativePath);

    const projectSignals = {
        readme: fileNames.some(path =>
            /(^|\/)readme\.md$/i.test(path)
        ),

        packageJson: fileNames.some(path =>
            /(^|\/)package\.json$/i.test(path)
        ),

        requirements: fileNames.some(path =>
            /(^|\/)requirements\.txt$/i.test(path)
        ),

        tests: fileNames.some(path =>
            /(^|\/)(tests?|__tests__)(\/|$)/i.test(path) ||
            /\.(test|spec)\.[a-z0-9]+$/i.test(path)
        ),

        gitignore: fileNames.some(path =>
            /(^|\/)\.gitignore$/i.test(path)
        ),

        license: fileNames.some(path =>
            /(^|\/)license(\..*)?$/i.test(path)
        )
    };

    const sourceFiles = files.filter(file => {
        return ![
            ".md",
            ".txt",
            ".json",
            ".yml",
            ".yaml",
            ".xml",
            ".toml",
            ".ini"
        ].includes(getExtension(file.name));
    });

    let processed = 0;

    for (const file of files) {
        const path = getSafeRelativePath(file);

        processed++;

        if (file.size > MAX_FILE_SIZE) {
            skippedFiles++;
            continue;
        }

        try {
            const content = await readFileText(file);

            inspectedFiles.push({
                path,
                size: file.size,
                extension: getExtension(path)
            });

            totalLines += content
                ? content.split("\n").length
                : 0;

            findings.push(
                ...extractMarkers(content, path)
            );

        } catch (error) {
            errors.push({
                file: path,
                message: error.message
            });
        }

        updateProgress(
            Math.round((processed / files.length) * 100),
            `Examining ${path}`
        );

        // Yield briefly to keep the interface responsive.
        if (processed % 10 === 0) {
            await new Promise(resolve =>
                setTimeout(resolve, 0)
            );
        }
    }

    const extensionCounts = {};

    for (const file of inspectedFiles) {
        const ext = file.extension || "(no extension)";

        extensionCounts[ext] =
            (extensionCounts[ext] || 0) + 1;
    }

    return {
        inspectedFiles,
        findings,
        errors,
        totalLines,
        skippedFiles,
        sourceFileCount: sourceFiles.length,
        projectSignals,
        extensionCounts
    };
}

// ========================================
// PROJECT HEALTH ESTIMATE
// ========================================

function calculateHealth(analysis) {
    let score = 100;

    const todoCount = analysis.findings.filter(
        item => item.type === "TODO"
    ).length;

    const fixmeCount = analysis.findings.filter(
        item => item.type === "FIXME"
    ).length;

    const hackCount = analysis.findings.filter(
        item => ["HACK", "XXX"].includes(item.type)
    ).length;

    score -= Math.min(todoCount * 3, 15);
    score -= Math.min(fixmeCount * 6, 24);
    score -= Math.min(hackCount * 4, 12);

    const signals = analysis.projectSignals;

    if (!signals.readme) score -= 8;
    if (!signals.tests) score -= 10;
    if (!signals.gitignore) score -= 4;
    if (!signals.license) score -= 3;

    if (analysis.errors.length > 0) {
        score -= Math.min(analysis.errors.length * 2, 10);
    }

    return Math.max(0, Math.min(100, score));
}

// ========================================
// RESURRECTION RECOMMENDATIONS
// ========================================

function createRecommendations(analysis) {
    const recommendations = [];

    const signals = analysis.projectSignals;

    const fixmeCount = analysis.findings.filter(
        item => item.type === "FIXME"
    ).length;

    const todoCount = analysis.findings.filter(
        item => item.type === "TODO"
    ).length;

    if (!signals.readme) {
        recommendations.push(
            "Create a README explaining the project's purpose, setup instructions, and current status."
        );
    }

    if (!signals.tests) {
        recommendations.push(
            "Add tests for the project's most important functionality before making major changes."
        );
    }

    if (fixmeCount > 0) {
        recommendations.push(
            `Review the ${fixmeCount} FIXME marker(s). Determine whether each issue is still relevant and reproduce it before fixing.`
        );
    }

    if (todoCount > 0) {
        recommendations.push(
            `Prioritize the ${todoCount} TODO marker(s) by user impact. Turn actionable items into small, testable tasks.`
        );
    }

    if (!signals.gitignore) {
        recommendations.push(
            "Check whether the repository needs a .gitignore file to exclude generated files, local environments, and secrets."
        );
    }

    if (!signals.license) {
        recommendations.push(
            "Review the project's licensing requirements before publishing or accepting contributions."
        );
    }

    if (analysis.errors.length > 0) {
        recommendations.push(
            "Some files could not be read. Inspect them separately before treating this report as complete."
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "No obvious documentation or marker-based issues were detected. Run the existing test suite and review the latest changes."
        );

        recommendations.push(
            "Inspect the core user workflow manually. This browser-based scan cannot establish whether the application works correctly."
        );
    }

    recommendations.push(
        "Review the findings with a developer before changing or deleting project files."
    );

    return recommendations.slice(0, 6);
}

// ========================================
// GHOST PERSONALITY
// ========================================

function createGhostMessage(analysis, health) {
    const todoCount = analysis.findings.length;

    if (todoCount >= 10) {
        return {
            persona: "THE HAUNTED ARCHIVIST",
            quote:
                "\"So many unfinished stories remain in these files. Start with one. Even forgotten code can find its purpose again.\""
        };
    }

    if (health < 50) {
        return {
            persona: "THE DETECTIVE",
            quote:
                "\"The evidence is scattered, but this project is not beyond recovery. Let us establish what works before changing what does not.\""
        };
    }

    if (analysis.projectSignals.tests) {
        return {
            persona: "THE QUIET GUARDIAN",
            quote:
                "\"Someone left behind a safety net of tests. Follow it carefully, and you may discover how this project was meant to live.\""
        };
    }

    return {
        persona: "THE OBSERVER",
        quote:
            "\"I have examined what remains. There are clues here, but not every unanswered question is a defect. Investigate before you resurrect.\""
    };
}

// ========================================
// DISPLAY RESULTS
// ========================================

function renderFindings(findings) {
    const container = $("#findingsList");

    $("#findingBadge").textContent = findings.length;

    if (!findings.length) {
        container.innerHTML = `
            <div class="empty-state">
                No TODO, FIXME, HACK, or XXX markers were found
                in the supported comment formats.
                This does not prove the project is complete.
            </div>
        `;

        return;
    }

    container.innerHTML = findings
        .slice(0, 30)
        .map(item => `
            <article class="finding-item">

                <div class="finding-symbol">⚑</div>

                <div class="finding-content">

                    <h4>
                        ${escapeHTML(item.type)}
                        · ${escapeHTML(item.file)}:${item.line}
                    </h4>

                    <p>${escapeHTML(item.message)}</p>

                </div>

            </article>
        `)
        .join("");

    if (findings.length > 30) {
        container.insertAdjacentHTML(
            "beforeend",
            `<div class="empty-state">
                Showing 30 of ${findings.length} findings.
            </div>`
        );
    }
}

function renderRecommendations(recommendations) {
    const container = $("#recommendationsList");

    container.innerHTML = recommendations
        .map((recommendation, index) => `
            <div class="recommendation-item">

                <div class="recommendation-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <p>${escapeHTML(recommendation)}</p>

            </div>
        `)
        .join("");
}

function renderResults(analysis) {
    const health = calculateHealth(analysis);

    const scoreElement = $("#healthScore");
    const ringElement = $("#healthRing");

    scoreElement.textContent = health;

    ringElement.style.setProperty(
        "--score-angle",
        `${health * 3.6}deg`
    );

    let status;
    let description;

    if (health >= 80) {
        status = "Looking healthy";
        description =
            "The basic repository signals look promising. More testing is needed.";
    } else if (health >= 55) {
        status = "Needs attention";
        description =
            "Some issues or missing project signals deserve a closer look.";
    } else {
        status = "Recovery needed";
        description =
            "Review the findings and establish a working baseline.";
    }

    $("#healthStatus").textContent = status;
    $("#healthDescription").textContent = description;

    $("#filesCount").textContent =
        analysis.inspectedFiles.length;

    $("#todoCount").textContent =
        analysis.findings.length;

    renderFindings(analysis.findings);

    const recommendations = createRecommendations(analysis);

    renderRecommendations(recommendations);

    const ghost = createGhostMessage(analysis, health);

    $("#ghostQuote").textContent = ghost.quote;
    $("#ghostPersona").textContent = ghost.persona;

    resultsSection.classList.remove("hidden");

    $("#systemStatus").textContent = "SCAN COMPLETE";

    scrollToResults();
}

// ========================================
// PROGRESS UI
// ========================================

function addProgressLog(message) {
    const paragraph = document.createElement("p");

    paragraph.textContent = `> ${message}`;

    progressLog.appendChild(paragraph);

    // Keep the most recent messages visible.
    while (progressLog.children.length > 6) {
        progressLog.removeChild(
            progressLog.firstElementChild
        );
    }
}

function updateProgress(percent, message) {
    const safePercent = Math.max(
        0,
        Math.min(100, percent)
    );

    progressFill.style.width = `${safePercent}%`;
    progressPercent.textContent = `${safePercent}%`;

    if (message) {
        addProgressLog(message);
    }
}

// ========================================
// MAIN INVESTIGATION
// ========================================

analyzeButton.addEventListener("click", async () => {
    if (investigationRunning || selectedFiles.length === 0) {
        return;
    }

    investigationRunning = true;

    analyzeButton.disabled = true;
    clearProjectButton.disabled = true;
    uploadButton.disabled = true;

    resultsSection.classList.add("hidden");
    progressPanel.classList.remove("hidden");

    progressTitle.textContent = "Examining the remains...";
    progressLog.replaceChildren();

    updateProgress(0, "Initializing local file inspection...");

    $("#systemStatus").textContent = "INVESTIGATING";

    try {
        await new Promise(resolve =>
            setTimeout(resolve, 250)
        );

        addProgressLog("Reading repository source files...");

        const analysis = await inspectProject(selectedFiles);

        updateProgress(100, "Preparing the resurrection report...");

        await new Promise(resolve =>
            setTimeout(resolve, 400)
        );

        progressTitle.textContent = "Investigation complete.";

        renderResults(analysis);

        if (analysis.errors.length > 0) {
            showToast(
                `${analysis.errors.length} file(s) could not be read. Review the limitations of this report.`
            );
        } else {
            showToast(
                "The repository inspection is complete."
            );
        }

    } catch (error) {
        console.error("Investigation failed:", error);

        progressTitle.textContent =
            "The investigation encountered an error.";

        addProgressLog(
            "Unable to complete the repository inspection."
        );

        showToast(
            "Something went wrong while analyzing the selected files."
        );

        $("#systemStatus").textContent = "SCAN FAILED";

    } finally {
        investigationRunning = false;

        analyzeButton.disabled = selectedFiles.length === 0;
        clearProjectButton.disabled = false;
        uploadButton.disabled = false;
    }
});

// ========================================
// DEMO MODE
// ========================================

demoButton.addEventListener("click", () => {
    if (investigationRunning) {
        return;
    }

    resetDemo();

    const demoAnalysis = {
        inspectedFiles: [
            { path: "src/main.py" },
            { path: "src/auth.py" },
            { path: "src/database.py" },
            { path: "tests/test_auth.py" },
            { path: "README.md" },
            { path: ".gitignore" }
        ],

        findings: [
            {
                type: "TODO",
                file: "src/auth.py",
                line: 24,
                message: "Implement password reset flow"
            },
            {
                type: "FIXME",
                file: "src/database.py",
                line: 81,
                message: "Handle database connection failures"
            },
            {
                type: "TODO",
                file: "src/main.py",
                line: 47,
                message: "Add request validation"
            }
        ],

        errors: [],
        totalLines: 620,
        skippedFiles: 0,
        sourceFileCount: 5,

        projectSignals: {
            readme: true,
            packageJson: false,
            requirements: true,
            tests: true,
            gitignore: true,
            license: false
        },

        extensionCounts: {
            ".py": 4,
            ".md": 1,
            "(no extension)": 1
        }
    };

    projectName.textContent = "forgotten-project";
    projectDetails.textContent = "6 example files · Demo dataset";

    selectedProject.classList.remove("hidden");

    progressPanel.classList.remove("hidden");
    resultsSection.classList.add("hidden");

    progressLog.replaceChildren();

    progressTitle.textContent = "Loading demo investigation...";

    updateProgress(25, "Loading sample repository...");
    updateProgress(60, "Preparing example findings...");
    updateProgress(100, "Generating example report...");

    $("#modeBadge").textContent = "DEMO DATA";
    $("#systemStatus").textContent = "DEMO LOADED";

    setTimeout(() => {
        progressTitle.textContent = "Demo investigation complete.";

        renderResults(demoAnalysis);

        showToast(
            "You're viewing illustrative results, not a real AI analysis."
        );
    }, 500);
});

function resetDemo() {
    selectedFiles = [];

    folderInput.value = "";

    analyzeButton.disabled = true;

    selectedProject.classList.add("hidden");

    $("#modeBadge").textContent = "DEMO MODE";
}

newInvestigationButton.addEventListener("click", () => {
    resetProject();

    $("#modeBadge").textContent = "DEMO MODE";

    showToast("Ready for a new investigation.");
});

// ========================================
// INTERFACE GLOW
// ========================================

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-glow");

    const enabled =
        document.body.classList.contains("light-glow");

    themeButton.setAttribute(
        "aria-label",
        enabled
            ? "Disable extra interface glow"
            : "Enable extra interface glow"
    );

    showToast(
        enabled
            ? "Extra interface glow enabled."
            : "Default interface glow restored."
    );
});

// ========================================
// INITIALIZATION
// ========================================

$("#systemStatus").textContent = "SYSTEM ONLINE";

console.log(
    "Digital Afterlife initialized. Local browser inspection is ready."
);