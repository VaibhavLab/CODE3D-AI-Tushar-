# CODE3D project review

## Assessment

A substantial exhibition prototype with useful 3D data structure views, an editor, playback, and a large catalog. It is not yet a reliable arbitrary-code debugger. The highest priority is trace correctness and a clear demo scope, followed by interface simplification and measured performance work.

## Findings from source inspection

| Priority | Finding | Evidence / consequence |
| --- | --- | --- |
| Critical | Authentication is a demo stub | `backend/.../service/AuthService.java` stores and compares plaintext passwords, allows blank passwords and a universal demo password, and registers unknown users during login. |
| High | History is global | `HistoryController.java` returns shared records without user scoping. Client authentication state is localStorage, not server authorization. |
| High | Results are inferred | `executionSimulator.js` and `MultiLanguageExecutionService.java` detect keywords and generate traces. Several advanced algorithms use fixed examples. Edited source does not guarantee corresponding execution. |
| High | Main-thread trace generation | The simulator is over 6,000 lines and runs synchronously; large generated traces can block input. Needs input/step budgets and a cancellable Web Worker. |
| Medium | Expensive scene decoration | Continuous contact shadows and particles added rendering work; removed in this pass. Other per-frame animations remain. |
| Medium | Async races | Visualizer mixes async backend calls, local traces, and delayed autoplay. Rapid selection can apply stale results; needs a single cancellable run controller. |
| Medium | Output contract was inconsistent | Some generators emit events, others full snapshots. Set-based deduplication erased legitimate repeated output. Local snapshots now carry explicit metadata. Legacy backend and personal solver traces need the same contract audit. |
| Medium | Network-dependent assets | Monaco and some 3D text assets may load remotely. Java-free does not yet mean a fully offline demo. |
| Medium | Dependency audit | Installation reported four advisories (one high, two moderate, one low). Dependency upgrades and compatibility checks remain. |
| Medium | UI overload and claims | Many competing controls, repeated result overlays, and unverified success labels. Main output surfaces now say simulation; other catalog/assistant claims still need review. |

## Changes made

- Local demo opens without authentication when no backend URL is configured. Configured backend mode retains its existing login gate.
- Remote API requests require an explicit URL, time out after eight seconds, and never silently redirect code or credentials to a cloud service.
- Heavier pages and the global code doctor are lazy loaded.
- Removed continuous contact shadows and ambient particles; limited render pixel ratio to 1.5 and disabled antialiasing. FPS improvement is not benchmarked.
- Added explicit snapshot output metadata and regression coverage for duplicate output and rewind behavior.
- Removed invented fallback execution/quiz history from the client.
- Closed Striver drawer no longer mounts 182 problem cards. Corrected the initial concept label and reduced the scene minimum height so output stays visible. Replaced fabricated dashboard usage/mastery statistics with capability labels.
- Main result banners appear at completion and describe simulation results, not verification.

## Next implementation priorities

1. Define a trace schema with provenance, output mode, source locations, and supported/unsupported status. Pick three competition examples and validate every step against expected results.
2. Replace keyword guessing for custom code with a deliberately limited JavaScript interpreter in a worker. Enforce time, memory, input and step limits; reject unsupported syntax. Do not use unrestricted eval as a sandbox.
3. Consolidate the workspace around editor, scene, current-step explanation, and timeline. Move quizzes, problem sheets, and assistant tools outside the primary demo flow.
4. Add cancellation for run/sample changes, WebGL failure recovery, local editor/font assets, and a reduced-motion option. Profile frame times on the actual exhibition laptop.
5. Rebuild backend authentication and per-user persistence only if accounts are needed. Remove demo bypasses, hash passwords, validate requests, restrict origins, and add authorization tests.

## Validation limits

Node regression tests cover local output behavior. A Vite production build checks frontend integration. Browser smoke check confirmed the dashboard, Monaco editor, and 3D scene load without login or Java, and the result no longer appears at step one. Java backend was inspected, not executed. No measured before/after FPS claim is made. This pass does not constitute a complete UI redesign or a replacement execution engine.
