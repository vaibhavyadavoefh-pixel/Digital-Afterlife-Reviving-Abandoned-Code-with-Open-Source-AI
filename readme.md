# 👻 Digital Afterlife

### Some code deserves a second life.

Digital Afterlife is a spooky, AI-inspired developer tool designed to help resurrect abandoned software projects. It examines source files, discovers unfinished tasks, and creates a preliminary recovery plan to help developers bring forgotten code back to life.

Built for the **Ghost in the Machine — Open-Source AI Challenge**.

> Every abandoned repository has a story. Let's uncover what was left behind.

---

## ✨ Features

### 🔍 Repository Investigation
- Select a local project folder.
- Inspect supported source files directly in your browser.
- Detect TODO, FIXME, HACK, and XXX markers in supported comment formats.
- Identify basic project signals such as README files, tests, and `.gitignore`.
- Display findings with file paths and line numbers.

### 📊 Project Health Dashboard
- Generate a preliminary project health score using simple heuristics.
- Display the number of inspected files.
- Count detected unfinished-work markers.
- Identify missing project documentation and other basic repository signals.

### 🪦 Resurrection Plan
- Generate rule-based recommendations based on the inspection results.
- Highlight potential areas requiring developer attention.
- Provide a starting point for recovering an abandoned project.

### 👻 Haunted Interface
- Dark, developer-focused dashboard.
- Animated ghost and atmospheric effects.
- Spooky messages from different ghost personas.
- Responsive layout for desktop and mobile screens.

### 🔒 Local-First Approach
The current frontend reads selected files in the browser rather than uploading them to a remote server.

This is an initial privacy-conscious design, not a guarantee of complete security. Avoid selecting sensitive files, and review the code before using it with confidential repositories.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Dashboard structure |
| CSS3 | Styling, animations, and responsive layout |
| JavaScript | File inspection and dashboard functionality |
| File API | Reading user-selected files in the browser |

### Planned AI Technologies

The following technologies are candidates for future development and are not yet integrated into the current frontend.

| Technology | Planned Purpose |
|---|---|
| Python | Repository analysis |
| FastAPI | Backend API |
| GitPython | Git history analysis |
| Ollama | Local model inference |
| Open-weight language model | Code understanding and recovery suggestions |

The final model and inference setup will depend on hardware compatibility, licensing, and testing.

---

## 🚀 Getting Started

### Prerequisites

You need:

- A modern web browser.
- A code editor such as Visual Studio Code.
- The Live Server extension for VS Code (recommended).

No paid API key or AI model is required for the current frontend.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/digital-afterlife.git
````

Replace `YOUR_USERNAME` with your GitHub username and adjust the repository name if necessary.

**2. Navigate to the project directory**

```bash
cd digital-afterlife
```

**3. Open the project in VS Code**

```bash
code .
```

**4. Launch the application**

Open `index.html` with Live Server.

Alternatively, open `index.html` directly in a supported browser.

**5. Explore the demo**

Click **Explore demo** to see the dashboard populated with illustrative repository findings.

To inspect your own project, select a supported source folder and click **Analyze repository**.

---

## 📂 Project Structure

```text
digital-afterlife/
│
├── index.html       # Main application interface
├── style.css        # Dashboard styling and animations
├── script.js        # Browser-based inspection logic
├── README.md        # Project documentation
└── LICENSE          # Planned open-source license
```

---

## 🧠 How It Works

The current implementation uses browser-based static inspection.

1. The user selects a project folder.
2. The application filters supported file types and excludes common generated or dependency directories.
3. JavaScript reads eligible files within configured size limits.
4. The inspection engine searches supported comment formats for TODO, FIXME, HACK, and XXX markers.
5. The application checks for basic project files and testing-related paths.
6. A heuristic score and rule-based recommendations are generated.
7. The dashboard presents the results in a haunted developer interface.

### Important Limitations

The current version does **not** use an AI model.

It does not yet:

* Understand the full meaning of source code.
* Inspect Git commit history.
* Detect arbitrary bugs or security vulnerabilities.
* Execute the repository's code or tests.
* Verify whether a project actually works.
* Automatically repair or modify source files.
* Generate model-based explanations.

The health score is an illustrative heuristic, not a validated measure of software quality.

The comment-marker detector supports common comment formats but is not a complete parser for every language.

---

## 🌐 Why Open-Source AI?

Digital Afterlife is being designed around the idea that developers should be able to investigate their own code without depending entirely on proprietary AI services.

A future local-model implementation aims to support:

* **Privacy:** Keep source code on the developer's machine during local inference.
* **Control:** Allow developers to inspect and modify the analysis workflow.
* **Model flexibility:** Experiment with compatible open-weight models.
* **Offline operation:** Support investigations without an internet connection after the necessary software and model files have been installed.
* **Community contributions:** Let developers improve the tool and adapt it to their own workflows.

These capabilities depend on the final implementation. They are design goals, not claims about the current frontend.

Open weights and open-source software are not interchangeable terms; model and dependency licenses must be reviewed individually.

---

## 🗺️ Roadmap

* [x] Build the dark, responsive dashboard.
* [x] Implement local browser-based file selection.
* [x] Detect common unfinished-work markers.
* [x] Display a preliminary project health score.
* [x] Generate rule-based recovery recommendations.
* [x] Add a demonstration mode.
* [ ] Build a Python backend with FastAPI.
* [ ] Integrate Git history analysis.
* [ ] Connect a compatible open-weight language model.
* [ ] Generate AI-assisted project summaries.
* [ ] Produce evidence-backed recovery plans.
* [ ] Add optional test execution in a safe, isolated environment.
* [ ] Evaluate findings against real abandoned repositories.

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application.
5. Open a pull request describing your contribution.

Please do not submit private source code, credentials, API keys, or other sensitive information in issues or pull requests.

---

## 🔐 Security

Digital Afterlife is an early-stage project.

* Review the files you select for inspection.
* Never commit secrets or credentials.
* Treat automated findings as suggestions requiring human review.
* Do not execute untrusted repositories without suitable isolation.
* Review dependency and model licenses before distributing the application.

---

## 📜 License

A license has not yet been selected.

Before publishing the repository as open source, add a `LICENSE` file containing the terms you choose.

---

## 👨‍💻 Project Vision

Digital Afterlife explores how open-weight AI could help developers understand unfinished projects, recover lost context, and preserve software that might otherwise be forgotten.

Instead of abandoning old code forever, give it another chance.

**Inspect the evidence. Recover the context. Resurrect the project.**

Built for the **Ghost in the Machine** challenge. 👻

```

### Before you publish it on GitHub

Three things to keep in mind:

1. **License:** Choose an appropriate license and add the actual `LICENSE` file before claiming the repository is open source.
2. **AI integration:** The current version is a frontend prototype, so the README doesn't falsely claim that an AI model is already running.
3. **GitHub repository URL:** Replace `YOUR_USERNAME` with your actual GitHub username.

**My suggestion:** Once the frontend is working, the next meaningful milestone is connecting FastAPI and a locally running open-weight model. That's what will make Digital Afterlife a genuine open-source AI project rather than just an AI-themed dashboard.