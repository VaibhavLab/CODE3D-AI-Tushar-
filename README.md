# CODE3D AI

## Local demo (no Java required)

```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The default mode runs educational simulations in your browser without an account or backend. Three.js is already the 3D renderer. Source examples may use Java syntax; no JVM is needed to visualize them.

These are pattern-based learning simulations, **not verified executions of arbitrary source code**. Some advanced examples use canned data. See [project review](docs/PROJECT_REVIEW.md) for findings and next priorities.

Backend access is opt-in: copy `frontend/.env.example` to `frontend/.env.local` and configure `VITE_BACKEND_URL` only if needed. Restart Vite after changing it. No automatic cloud fallback is used. The legacy Java backend requires security work before public use.

Validation: `cd frontend`, then `npm test` and `npm run build`.

The original project overview follows; roadmap and feature claims below may describe intended rather than implemented behavior.

> *"Don't just read the code. See the code execute."*

An interactive 3D code execution visualizer and pedagogical learning platform built for computer science students and technology exhibitions.

---

## 📌 Problem Statement
Traditional code learning environments present source code in 2D text and print outputs to a static terminal. Students struggling with concepts like memory addressing, array indexing, loop invariants, pointer traversals, and recursion cannot visualize what is happening inside the computer's memory during runtime.

## 💡 The Solution
**CODE3D AI** bridges the gap between static text and computer architecture. It turns code into a living 3D world where variables, data structures, and execution flows materialize as interactive 3D physical entities in real-time. Students can step forwards and backwards through execution with a built-in **Time Machine**.

---

## 🚀 Key Features (Phase 1 MVP)

- **3D Array Visualization**: Interactive 3D memory cells with dynamic height elevation, neon glowing shaders, and animated pointer indicators targeting currently accessed elements.
- **Monaco Code Editor**: Professional Java 21 editor with syntax highlighting, line numbers, and live active-line execution indicators.
- **Time Machine (State Scrubber)**: Move backward and forward in execution history (`Previous`, `Next`, `Play`, `Pause`, `Reset`) with step-speed throttling (`0.5x` to `2.0x`).
- **Program State Inspector**: Real-time stack frame tracking, variable memory cards with previous-to-current value transition indicators, and loop condition evaluation status (`TRUE` / `FALSE`).
- **Standard Output Terminal**: Streaming console simulating `System.out.println` output synchronized with each statement execution.
- **Exhibition Dashboard**: Modern dark developer landing view with metric counters and module navigation.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18
- **Bundler**: Vite 5
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Styling**: Tailwind CSS (Dark Cybernetic / Developer Aesthetic)
- **Icons**: Lucide React

### Backend (Roadmap - Phase 7+)
- **Runtime**: Java 21 LTS
- **Framework**: Spring Boot 3.x
- **Code Parsing**: JavaParser (AST-based code analysis)
- **Database**: MySQL

---

## 📁 Project Structure

```
CODE3D-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx         # Monaco Editor with line decoration & execution controls
│   │   │   ├── Navbar.jsx             # Header navigation and view switcher
│   │   │   ├── OutputConsole.jsx      # Streaming terminal simulator
│   │   │   ├── StatePanel.jsx         # Stack, variables diffs, and condition evaluation
│   │   │   └── Timeline.jsx           # Time Machine timeline scrubber & playback bar
│   │   ├── hooks/
│   │   │   └── useExecutionTimeline.js# State hook managing timeline cursor & playback loop
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Exhibition landing page with statistics & module cards
│   │   │   └── Visualizer.jsx         # 3-column workspace (Editor | 3D Scene | State Panel)
│   │   ├── services/
│   │   │   └── executionSimulator.js  # Atomic execution-state engine with 16-step trace
│   │   ├── utils/
│   │   │   └── sampleCodes.js         # Curated Java sample programs and metadata
│   │   ├── visualizers/
│   │   │   ├── ArrayVisualizer3D.jsx  # 3D boxes, values, index labels, and active pointer
│   │   │   └── SceneContainer.jsx     # R3F Canvas, lighting, floor grid, OrbitControls
│   │   ├── App.jsx                    # Root view controller
│   │   ├── index.css                  # Dark developer theme styling
│   │   └── main.jsx                   # Vite entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── CONTRIBUTING.md
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Running the MVP

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)

### Steps

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 🧪 Testing the MVP Checklist

- [x] **Dashboard**: Verify title, subtitle, metric cards, and "Launch 3D Visualizer" button.
- [x] **Code Editor**: Verify Monaco loads default Java array loop code with line numbers.
- [x] **Time Machine Play**: Click "Run" or "Play"; verify simulation steps forward automatically.
- [x] **Active Line**: Verify the editor highlights the exact executing line (Line 4 -> Line 6 -> Line 7).
- [x] **3D Array Highlights**:
  - Element `0` (`[10]`) elevates and glows cyan when `i = 0`.
  - Element `1` (`[20]`) elevates and glows when `i = 1`.
  - Element `2` (`[30]`) elevates and glows when `i = 2`.
  - Element `3` (`[40]`) elevates and glows when `i = 3`.
- [x] **3D Orbit Controls**: Rotate (Left-click drag), Zoom (Scroll wheel), Pan (Right-click drag).
- [x] **Variable Tracker**: Verify `i` updates from `0 → 1 → 2 → 3 → 4`.
- [x] **Condition Inspector**: Verify `i < arr.length` shows `TRUE` for iterations 0..3 and `FALSE` at iteration 4.
- [x] **Time Travel**: Click "Prev" or click any step dot in the bottom timeline; verify complete state rolls back instantly.
- [x] **Terminal Output**: Verify numbers `10`, `20`, `30`, `40` stream into standard output console.

---

## 👥 Exhibition Team Roles (5 Members)

| Person | Focus Area | Key Responsibilities |
|---|---|---|
| **Person 1** | **Frontend / UI Lead** | React dashboard, Monaco editor integration, responsive layout, CSS design |
| **Person 2** | **3D Visualization Lead** | Three.js, React Three Fiber, 3D data structure geometries, camera animations |
| **Person 3** | **Java Analysis / Execution** | JavaParser AST integration, statement stepping, variable diff tracking, complexity |
| **Person 4** | **Backend & Database** | Spring Boot REST API, MySQL history, user sessions, execution sandbox |
| **Person 5** | **AI & Documentation** | AI explanation prompts, hints, quiz generation, documentation, demo flow |
