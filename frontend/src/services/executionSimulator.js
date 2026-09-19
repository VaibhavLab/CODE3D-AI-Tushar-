/**
 * CODE3D AI - Execution Simulator Service
 *
 * Implements the execution-state model specified in Section 7 & 35.
 * Each state represents an atomic snapshot of:
 * - Current line number
 * - Variable values (with diff tracking)
 * - Condition evaluation status
 * - 3D Data structure state
 * - Terminal output
 * - Pedagogical explanation
 */

export const ARRAY_LOOP_EXECUTION_TRACE = [
  {
    stepNumber: 1,
    lineNumber: 4,
    eventType: "ARRAY_CREATION",
    variables: {
      arr: "[10, 20, 30, 40]",
    },
    changedVariable: "arr",
    previousValue: null,
    currentValue: "[10, 20, 30, 40]",
    condition: null,
    output: [],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: null,
      label: "Array Created: arr[4]",
      focusInfo: "Memory allocated for 4 continuous integers."
    },
    explanation: "Memory allocated for integer array 'arr' with 4 contiguous slots: [10, 20, 30, 40].",
    aiHint: "Notice that array indices in Java are 0-indexed: index 0 to index 3."
  },
  {
    stepNumber: 2,
    lineNumber: 6,
    eventType: "LOOP_INIT",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 0,
    },
    changedVariable: "i",
    previousValue: null,
    currentValue: 0,
    condition: null,
    output: [],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: null,
      label: "Loop Initialized",
      focusInfo: "Variable i initialized to 0."
    },
    explanation: "Loop initialization: Loop index variable 'i' is declared and initialized to 0.",
    aiHint: "i = 0 points to the starting element of the array."
  },
  {
    stepNumber: 3,
    lineNumber: 6,
    eventType: "CONDITION_CHECK",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 0,
    },
    changedVariable: null,
    previousValue: null,
    currentValue: null,
    condition: {
      expression: "i < arr.length",
      evaluation: "0 < 4",
      result: true,
      branch: "ENTER LOOP BODY"
    },
    output: [],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 0,
      previousIndex: null,
      label: "Condition True (0 < 4)",
      focusInfo: "Accessing index 0"
    },
    explanation: "Loop condition 'i < arr.length' (0 < 4) evaluates to TRUE. The loop body executes.",
    aiHint: "Since the condition is true, execution enters inside the braces '{ ... }'."
  },
  {
    stepNumber: 4,
    lineNumber: 7,
    eventType: "ARRAY_ACCESS",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 0,
      "arr[i]": 10
    },
    changedVariable: "output",
    previousValue: null,
    currentValue: "10",
    condition: null,
    output: ["10"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 0,
      previousIndex: null,
      label: "Reading arr[0] = 10",
      focusInfo: "Current Index: 0 | Current Value: 10"
    },
    explanation: "Read element at arr[0] (value 10). System.out.println() prints 10 to standard output.",
    aiHint: "Element arr[0] is accessed and sent to console output."
  },
  {
    stepNumber: 5,
    lineNumber: 6,
    eventType: "LOOP_INCREMENT",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 1,
    },
    changedVariable: "i",
    previousValue: 0,
    currentValue: 1,
    condition: null,
    output: ["10"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: 0,
      label: "i++ Increment (i: 0 → 1)",
      focusInfo: "Variable i updated to 1"
    },
    explanation: "Increment step 'i++' executed: Loop counter 'i' advances from 0 to 1.",
    aiHint: "After the loop body executes, the increment clause runs before the next condition check."
  },
  {
    stepNumber: 6,
    lineNumber: 6,
    eventType: "CONDITION_CHECK",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 1,
    },
    changedVariable: null,
    previousValue: null,
    currentValue: null,
    condition: {
      expression: "i < arr.length",
      evaluation: "1 < 4",
      result: true,
      branch: "CONTINUE LOOP"
    },
    output: ["10"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 1,
      previousIndex: 0,
      label: "Condition True (1 < 4)",
      focusInfo: "Accessing index 1"
    },
    explanation: "Condition 'i < arr.length' (1 < 4) evaluates to TRUE. Executing iteration 2.",
    aiHint: "Index 1 is within bounds [0..3]."
  },
  {
    stepNumber: 7,
    lineNumber: 7,
    eventType: "ARRAY_ACCESS",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 1,
      "arr[i]": 20
    },
    changedVariable: "output",
    previousValue: null,
    currentValue: "20",
    condition: null,
    output: ["10", "20"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 1,
      previousIndex: 0,
      label: "Reading arr[1] = 20",
      focusInfo: "Current Index: 1 | Current Value: 20"
    },
    explanation: "Read element at arr[1] (value 20). System.out.println() prints 20 to standard output.",
    aiHint: "Element at index 1 is printed."
  },
  {
    stepNumber: 8,
    lineNumber: 6,
    eventType: "LOOP_INCREMENT",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 2,
    },
    changedVariable: "i",
    previousValue: 1,
    currentValue: 2,
    condition: null,
    output: ["10", "20"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: 1,
      label: "i++ Increment (i: 1 → 2)",
      focusInfo: "Variable i updated to 2"
    },
    explanation: "Increment step 'i++' executed: Loop counter 'i' advances from 1 to 2.",
    aiHint: "i is now pointing halfway through the array."
  },
  {
    stepNumber: 9,
    lineNumber: 6,
    eventType: "CONDITION_CHECK",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 2,
    },
    changedVariable: null,
    previousValue: null,
    currentValue: null,
    condition: {
      expression: "i < arr.length",
      evaluation: "2 < 4",
      result: true,
      branch: "CONTINUE LOOP"
    },
    output: ["10", "20"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 2,
      previousIndex: 1,
      label: "Condition True (2 < 4)",
      focusInfo: "Accessing index 2"
    },
    explanation: "Condition 'i < arr.length' (2 < 4) evaluates to TRUE. Executing iteration 3.",
    aiHint: "2 is less than 4, so loop continues."
  },
  {
    stepNumber: 10,
    lineNumber: 7,
    eventType: "ARRAY_ACCESS",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 2,
      "arr[i]": 30
    },
    changedVariable: "output",
    previousValue: null,
    currentValue: "30",
    condition: null,
    output: ["10", "20", "30"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 2,
      previousIndex: 1,
      label: "Reading arr[2] = 30",
      focusInfo: "Current Index: 2 | Current Value: 30"
    },
    explanation: "Read element at arr[2] (value 30). System.out.println() prints 30 to standard output.",
    aiHint: "30 is printed."
  },
  {
    stepNumber: 11,
    lineNumber: 6,
    eventType: "LOOP_INCREMENT",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 3,
    },
    changedVariable: "i",
    previousValue: 2,
    currentValue: 3,
    condition: null,
    output: ["10", "20", "30"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: 2,
      label: "i++ Increment (i: 2 → 3)",
      focusInfo: "Variable i updated to 3"
    },
    explanation: "Increment step 'i++' executed: Loop counter 'i' advances from 2 to 3.",
    aiHint: "Approaching the last index."
  },
  {
    stepNumber: 12,
    lineNumber: 6,
    eventType: "CONDITION_CHECK",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 3,
    },
    changedVariable: null,
    previousValue: null,
    currentValue: null,
    condition: {
      expression: "i < arr.length",
      evaluation: "3 < 4",
      result: true,
      branch: "CONTINUE LOOP"
    },
    output: ["10", "20", "30"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 3,
      previousIndex: 2,
      label: "Condition True (3 < 4)",
      focusInfo: "Accessing index 3"
    },
    explanation: "Condition 'i < arr.length' (3 < 4) evaluates to TRUE. Executing final element iteration.",
    aiHint: "Index 3 is the final valid index for an array of length 4."
  },
  {
    stepNumber: 13,
    lineNumber: 7,
    eventType: "ARRAY_ACCESS",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 3,
      "arr[i]": 40
    },
    changedVariable: "output",
    previousValue: null,
    currentValue: "40",
    condition: null,
    output: ["10", "20", "30", "40"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: 3,
      previousIndex: 2,
      label: "Reading arr[3] = 40",
      focusInfo: "Current Index: 3 | Current Value: 40"
    },
    explanation: "Read element at arr[3] (value 40). System.out.println() prints 40 to standard output.",
    aiHint: "All 4 elements have now been visited and printed."
  },
  {
    stepNumber: 14,
    lineNumber: 6,
    eventType: "LOOP_INCREMENT",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 4,
    },
    changedVariable: "i",
    previousValue: 3,
    currentValue: 4,
    condition: null,
    output: ["10", "20", "30", "40"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: 3,
      label: "i++ Increment (i: 3 → 4)",
      focusInfo: "Variable i updated to 4"
    },
    explanation: "Increment step 'i++' executed: Loop counter 'i' advances from 3 to 4.",
    aiHint: "i is now 4, which equals arr.length."
  },
  {
    stepNumber: 15,
    lineNumber: 6,
    eventType: "CONDITION_CHECK",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 4,
    },
    changedVariable: null,
    previousValue: null,
    currentValue: null,
    condition: {
      expression: "i < arr.length",
      evaluation: "4 < 4",
      result: false,
      branch: "EXIT LOOP"
    },
    output: ["10", "20", "30", "40"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: null,
      label: "Condition False (4 < 4)",
      focusInfo: "Loop Terminated"
    },
    explanation: "Condition 'i < arr.length' (4 < 4) evaluates to FALSE. Loop terminates.",
    aiHint: "Since 4 is not strictly less than 4, the condition fails and loop ends."
  },
  {
    stepNumber: 16,
    lineNumber: 9,
    eventType: "PROGRAM_END",
    variables: {
      arr: "[10, 20, 30, 40]",
      i: 4,
    },
    changedVariable: null,
    previousValue: null,
    currentValue: null,
    condition: null,
    output: ["10", "20", "30", "40"],
    dataStructureState: {
      type: "array",
      name: "arr",
      values: [10, 20, 30, 40],
      activeIndex: null,
      previousIndex: null,
      label: "Execution Finished",
      focusInfo: "Return code 0"
    },
    explanation: "Main method execution finished successfully. Process exited with code 0.",
    aiHint: "Complete array traversal executed in O(n) time and O(1) auxiliary space."
  }
];

/**
 * Retrieves execution trace for the specified code or program ID.
 * Defaults to ARRAY_LOOP_EXECUTION_TRACE for the MVP.
 */
export function getExecutionTrace(code) {
  // In Phase 1, we provide the curated execution trace for the default Java loop.
  // In later phases, this will communicate with the JavaParser / AST backend.
  return ARRAY_LOOP_EXECUTION_TRACE;
}
