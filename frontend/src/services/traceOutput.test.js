import test from 'node:test';
import assert from 'node:assert/strict';
import { collectOutput } from './traceOutput.js';
import { getExecutionTrace } from './executionSimulator.js';

test('preserves repeated values and blank output events', () => {
  assert.deepEqual(collectOutput([{output: ['7']}, {output: ['', '7']}]), ['7', '', '7']);
});
test('snapshots replace prior output and rewind correctly', () => {
  const trace = [{outputMode: 'snapshot', output: ['7']}, {outputMode: 'snapshot', output: ['7', '7']}];
  assert.deepEqual(collectOutput(trace, 0), ['7']);
  assert.deepEqual(collectOutput(trace, 1), ['7', '7']);
  assert.deepEqual(collectOutput([], 0), []);
});
test('array traversal keeps duplicate printed values without multiplying snapshots', () => {
  const trace = getExecutionTrace('const arr = [7, 7, 3]; for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }', 'javascript');
  assert.deepEqual(collectOutput(trace), ['7', '7', '3', 'Execution Finished: size = 3, i = 3']);
});
