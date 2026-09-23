/** Output is an event list unless explicitly marked as a complete snapshot. */
export function collectOutput(trace = [], index = trace.length - 1) {
  let output = [];
  for (let i = 0; i <= index && i < trace.length; i++) {
    const step = trace[i];
    if (!Array.isArray(step?.output)) continue;
    if (step.outputMode === 'snapshot') output = [...step.output];
    else output.push(...step.output);
  }
  return output;
}
