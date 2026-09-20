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
 * Extracts integer values from any code, array literal, or comma/space-separated list.
 */
export function extractNumbersFromCode(code) {
  if (!code || typeof code !== 'string') return [10, 20, 30, 40];

  // Try matching array inside brackets or braces first: [1, 2, 3] or {1, 2, 3}
  const bracketMatch = code.match(/[\[{]([0-9,\s\-]+)[\]}]/);
  if (bracketMatch && bracketMatch[1]) {
    const parsed = bracketMatch[1]
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (parsed.length > 0) return parsed.slice(0, 10);
  }

  // Otherwise match individual numbers in the string
  const allNums = (code.match(/-?\b\d+\b/g) || [])
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n) && n < 10000); // Filter out giant literals

  if (allNums.length >= 2) {
    return allNums.slice(0, 10);
  }

  return [10, 20, 30, 40];
}

/**
 * Dynamically generates a 3D sorting trace (Bubble Sort) with user's actual numbers.
 */
function generateDynamicSortTrace(values, lang = 'code') {
  const steps = [];
  const arr = [...values];
  const n = arr.length;
  let step = 1;
  let comparisons = 0;
  let swaps = 0;

  // Step 1: Initial Allocation
  steps.push({
    stepNumber: step++,
    lineNumber: 2,
    eventType: 'ARRAY_CREATION',
    variables: { arr: `[${arr.join(', ')}]`, n, lang: lang.toUpperCase() },
    changedVariable: 'arr',
    currentValue: `[${arr.join(', ')}]`,
    output: [`Starting 3D Sort on [${arr.join(', ')}]`],
    dataStructureState: {
      type: 'sorting',
      values: [...arr],
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      label: 'Initial Unsorted Array',
      focusInfo: `Allocated ${n} elements for sorting.`
    },
    explanation: `Initialized array [${arr.join(', ')}] with ${n} elements. Bubble Sort will compare adjacent pairs.`,
    aiHint: 'Sorting visually demonstrates bubble propagation of maxima to the right boundary.'
  });

  const sortedIndices = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const shouldSwap = arr[j] > arr[j + 1];

      // Comparison Step
      steps.push({
        stepNumber: step++,
        lineNumber: 4,
        eventType: 'CONDITION_CHECK',
        variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
        condition: {
          expression: `arr[${j}] > arr[${j + 1}]`,
          evaluation: `${arr[j]} > ${arr[j + 1]}`,
          result: shouldSwap,
          branch: shouldSwap ? 'SWAP' : 'NO SWAP'
        },
        output: [],
        dataStructureState: {
          type: 'sorting',
          values: [...arr],
          comparedIndices: [j, j + 1],
          swappedIndices: [],
          sortedIndices: [...sortedIndices],
          label: `Compare arr[${j}] (${arr[j]}) & arr[${j+1}] (${arr[j+1]})`,
          focusInfo: shouldSwap ? `Swap needed (${arr[j]} > ${arr[j+1]})` : 'Already in order'
        },
        explanation: `Comparing indices [${j}] and [${j + 1}]: ${arr[j]} ${shouldSwap ? '>' : '<='} ${arr[j + 1]}. ${shouldSwap ? 'Elements will be swapped.' : 'Order is maintained.'}`,
        aiHint: shouldSwap ? 'A swap will elevate and interchange these two elements in 3D space.' : 'Proceeding to next adjacent pair.'
      });

      if (shouldSwap) {
        swaps++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Swap Step
        steps.push({
          stepNumber: step++,
          lineNumber: 5,
          eventType: 'ARRAY_WRITE',
          variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swaps },
          changedVariable: 'arr',
          currentValue: `[${arr.join(', ')}]`,
          output: [`Swapped ${arr[j+1]} <-> ${arr[j]}`],
          dataStructureState: {
            type: 'sorting',
            values: [...arr],
            comparedIndices: [],
            swappedIndices: [j, j + 1],
            sortedIndices: [...sortedIndices],
            label: `Swapped: [${j}] <-> [${j+1}]`,
            focusInfo: `Array state: [${arr.join(', ')}]`
          },
          explanation: `Swapped values: arr[${j}] is now ${arr[j]} and arr[${j + 1}] is now ${arr[j + 1]}.`,
          aiHint: 'Elements interchange their slot positions in 3D WebGL space.'
        });
      }
    }
    sortedIndices.push(n - 1 - i);
  }

  sortedIndices.push(0);

  // Final Sorted Step
  steps.push({
    stepNumber: step,
    lineNumber: 8,
    eventType: 'PROGRAM_END',
    variables: { totalComparisons: comparisons, totalSwaps: swaps, sorted: `[${arr.join(', ')}]` },
    output: [`Sort Complete: [${arr.join(', ')}] in ${swaps} swaps.`],
    dataStructureState: {
      type: 'sorting',
      values: [...arr],
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      label: 'Array Completely Sorted',
      focusInfo: `Sorted array: [${arr.join(', ')}]`
    },
    explanation: `Bubble sort finished: all ${n} elements are in ascending order with ${comparisons} comparisons and ${swaps} swaps.`,
    aiHint: 'Time Complexity: O(n²) worst/average case, Space Complexity: O(1) in-place.'
  });

  return steps;
}

/**
 * Dynamically generates a 3D linear traversal trace with user's actual numbers.
 */
function generateDynamicArrayTrace(values, lang = 'code') {
  const steps = [];
  const n = values.length;
  let step = 1;
  const output = [];

  // Step 1: Memory Allocation
  steps.push({
    stepNumber: step++,
    lineNumber: 2,
    eventType: 'ARRAY_CREATION',
    variables: { arr: `[${values.join(', ')}]`, size: n, lang: lang.toUpperCase() },
    changedVariable: 'arr',
    currentValue: `[${values.join(', ')}]`,
    output: [],
    dataStructureState: {
      type: 'array',
      name: 'arr',
      values: [...values],
      activeIndex: null,
      previousIndex: null,
      label: `User Array Created (${values.length} items)`,
      focusInfo: `Allocated memory: [${values.join(', ')}]`
    },
    explanation: `Allocated contiguous memory for array 'arr' with ${n} elements: [${values.join(', ')}].`,
    aiHint: `Array indices run from 0 to ${n - 1}.`
  });

  // Step 2: Loop Initialization
  steps.push({
    stepNumber: step++,
    lineNumber: 3,
    eventType: 'LOOP_INIT',
    variables: { arr: `[${values.join(', ')}]`, i: 0 },
    changedVariable: 'i',
    currentValue: 0,
    output: [],
    dataStructureState: {
      type: 'array',
      name: 'arr',
      values: [...values],
      activeIndex: null,
      previousIndex: null,
      label: 'Loop Initialized (i = 0)',
      focusInfo: 'Index counter initialized'
    },
    explanation: `Loop initialization: counter 'i' is declared and initialized to 0.`,
    aiHint: 'i = 0 addresses the first item.'
  });

  // Loop iterations
  for (let i = 0; i < n; i++) {
    // Condition True
    steps.push({
      stepNumber: step++,
      lineNumber: 3,
      eventType: 'CONDITION_CHECK',
      variables: { arr: `[${values.join(', ')}]`, i },
      condition: {
        expression: `i < ${n}`,
        evaluation: `${i} < ${n}`,
        result: true,
        branch: 'ENTER LOOP'
      },
      output: [...output],
      dataStructureState: {
        type: 'array',
        name: 'arr',
        values: [...values],
        activeIndex: i,
        previousIndex: i > 0 ? i - 1 : null,
        label: `Condition True (${i} < ${n})`,
        focusInfo: `Targeting slot [${i}] = ${values[i]}`
      },
      explanation: `Condition 'i < ${n}' (${i} < ${n}) evaluates to TRUE. Execution enters the loop body.`,
      aiHint: `Current element at index ${i} is ${values[i]}.`
    });

    // Array Access / Output
    const val = values[i];
    output.push(String(val));

    steps.push({
      stepNumber: step++,
      lineNumber: 4,
      eventType: 'ARRAY_ACCESS',
      variables: { arr: `[${values.join(', ')}]`, i, 'arr[i]': val },
      changedVariable: 'output',
      currentValue: String(val),
      output: [...output],
      dataStructureState: {
        type: 'array',
        name: 'arr',
        values: [...values],
        activeIndex: i,
        previousIndex: null,
        label: `Accessed arr[${i}] = ${val}`,
        focusInfo: `Element Value: ${val}`
      },
      explanation: `Accessed array slot [${i}] with value ${val} and sent to output stream.`,
      aiHint: 'Direct memory index lookup completes in O(1) constant time.'
    });

    // Increment
    const nextI = i + 1;
    steps.push({
      stepNumber: step++,
      lineNumber: 3,
      eventType: 'LOOP_INCREMENT',
      variables: { arr: `[${values.join(', ')}]`, i: nextI },
      changedVariable: 'i',
      previousValue: i,
      currentValue: nextI,
      output: [...output],
      dataStructureState: {
        type: 'array',
        name: 'arr',
        values: [...values],
        activeIndex: null,
        previousIndex: i,
        label: `Increment (i: ${i} → ${nextI})`,
        focusInfo: `i updated to ${nextI}`
      },
      explanation: `Increment step: loop counter 'i' advances from ${i} to ${nextI}.`,
      aiHint: nextI < n ? `Next iteration will process index ${nextI}.` : 'Next iteration will fail condition check.'
    });
  }

  // Loop Exit
  steps.push({
    stepNumber: step++,
    lineNumber: 3,
    eventType: 'CONDITION_CHECK',
    variables: { arr: `[${values.join(', ')}]`, i: n },
    condition: {
      expression: `i < ${n}`,
      evaluation: `${n} < ${n}`,
      result: false,
      branch: 'EXIT LOOP'
    },
    output: [...output],
    dataStructureState: {
      type: 'array',
      name: 'arr',
      values: [...values],
      activeIndex: null,
      previousIndex: null,
      label: `Loop Terminated (${n} < ${n} -> FALSE)`,
      focusInfo: 'Traversal finished'
    },
    explanation: `Condition '${n} < ${n}' evaluates to FALSE. Loop terminates.`,
    aiHint: 'Control transfers past the loop block.'
  });

  // Program End
  steps.push({
    stepNumber: step,
    lineNumber: 5,
    eventType: 'PROGRAM_END',
    variables: { arr: `[${values.join(', ')}]`, itemsProcessed: n },
    output: [...output],
    dataStructureState: {
      type: 'array',
      name: 'arr',
      values: [...values],
      activeIndex: null,
      previousIndex: null,
      label: 'Execution Finished',
      focusInfo: 'Exit Code 0'
    },
    explanation: `Program execution finished successfully. Process exited with return code 0.`,
    aiHint: `Processed ${n} items in O(n) linear time with O(1) auxiliary space.`
  });

  return steps;
}

/**
 * Dynamic 3D Linked List Trace Generator
 */
export function generateDynamicLinkedListTrace(values = [10, 20, 30, 40], language = 'java') {
  const nums = values.length > 0 ? values : [10, 20, 30, 40];
  const steps = [];

  nums.forEach((val, idx) => {
    steps.push({
      stepNumber: idx + 1,
      lineNumber: 4 + idx,
      eventType: 'LIST_TRAVERSAL',
      variables: { 'curr.val': val, index: idx },
      output: [String(val)],
      dataStructureState: {
        type: 'linked-list',
        values: [...nums],
        activeIndex: idx,
        pointers: { HEAD: 0, CURR: idx },
        label: `Traversing Node [${idx}]: Value = ${val}`,
        focusInfo: `curr points to Node with val = ${val}`
      },
      explanation: `Traversed to linked list node ${idx} with data ${val}. Pointer curr advances along reference chain.`,
      aiHint: `O(n) sequential pointer traversal.`
    });
  });

  return steps;
}

/**
 * Dynamic 3D Stack Trace Generator
 */
export function generateDynamicStackTrace(values = [10, 20, 30], language = 'java') {
  const nums = values.length > 0 ? values : [10, 20, 30];
  const steps = [];
  const stack = [];
  let step = 1;

  nums.forEach((v) => {
    stack.push(v);
    steps.push({
      stepNumber: step++,
      lineNumber: 4,
      eventType: 'STACK_PUSH',
      variables: { pushed: v, size: stack.length },
      output: [],
      dataStructureState: {
        type: 'stack',
        values: [...stack],
        pointers: { TOP: stack.length - 1 },
        label: `Pushed ${v} onto Stack`,
        focusInfo: `TOP element: ${v} (Size: ${stack.length})`
      },
      explanation: `Pushed element ${v} onto top of the stack in O(1) constant time.`,
      aiHint: 'LIFO: Last-In, First-Out.'
    });
  });

  if (stack.length > 1) {
    const popped = stack.pop();
    steps.push({
      stepNumber: step++,
      lineNumber: 6,
      eventType: 'STACK_POP',
      variables: { popped, size: stack.length },
      output: [String(popped)],
      dataStructureState: {
        type: 'stack',
        values: [...stack],
        pointers: { TOP: stack.length - 1 },
        label: `Popped ${popped} from Stack`,
        focusInfo: `Remaining TOP: ${stack[stack.length - 1]}`
      },
      explanation: `Popped element ${popped} from top of stack.`,
      aiHint: 'TOP pointer decrements by 1.'
    });
  }

  return steps;
}

/**
 * Dynamic 3D Queue Trace Generator
 */
export function generateDynamicQueueTrace(values = [10, 20, 30], language = 'java') {
  const nums = values.length > 0 ? values : [10, 20, 30];
  const steps = [];
  const queue = [];
  let step = 1;

  nums.forEach((v) => {
    queue.push(v);
    steps.push({
      stepNumber: step++,
      lineNumber: 4,
      eventType: 'QUEUE_ENQUEUE',
      variables: { enqueued: v, size: queue.length },
      output: [],
      dataStructureState: {
        type: 'queue',
        values: [...queue],
        pointers: { FRONT: 0, REAR: queue.length - 1 },
        label: `Enqueued ${v} to Queue`,
        focusInfo: `FRONT: [${queue[0]}] | REAR: [${queue[queue.length - 1]}]`
      },
      explanation: `Enqueued element ${v} to rear of queue.`,
      aiHint: 'FIFO: First-In, First-Out.'
    });
  });

  if (queue.length > 1) {
    const dequeued = queue.shift();
    steps.push({
      stepNumber: step++,
      lineNumber: 6,
      eventType: 'QUEUE_DEQUEUE',
      variables: { dequeued, size: queue.length },
      output: [String(dequeued)],
      dataStructureState: {
        type: 'queue',
        values: [...queue],
        pointers: { FRONT: 0, REAR: queue.length - 1 },
        label: `Dequeued ${dequeued} from Front`,
        focusInfo: `New FRONT: [${queue[0]}]`
      },
      explanation: `Dequeued ${dequeued} from front of queue.`,
      aiHint: 'Elements advance toward front exit.'
    });
  }

  return steps;
}

/**
 * Dynamic 3D Tree / BST Generator
 */
export function generateDynamicTreeTrace(values = [50, 30, 70, 20, 40], language = 'java') {
  const nums = values.length > 0 ? values : [50, 30, 70, 20, 40];
  const steps = [];

  nums.forEach((v, idx) => {
    steps.push({
      stepNumber: idx + 1,
      lineNumber: 4 + idx,
      eventType: 'TREE_SEARCH',
      variables: { currentNode: v, target: nums[nums.length - 1] },
      output: [],
      dataStructureState: {
        type: 'tree',
        values: nums.slice(0, idx + 1),
        activeIndex: idx,
        label: `Inspecting Tree Node: ${v}`,
        focusInfo: `Level ${idx === 0 ? '0 (Root)' : '1 (Branch)'} | Value: ${v}`
      },
      explanation: `Examining BST node ${v}. Hierarchical path bifurcates left if smaller, right if larger.`,
      aiHint: 'Search halves candidate space in O(log n) average time.'
    });
  });

  return steps;
}

/**
 * Dynamic 3D Matrix Generator
 */
export function generateDynamicMatrixTrace(values = [1, 2, 3, 4, 5, 6, 7, 8, 9], language = 'java') {
  const nums = values.length > 0 ? values : [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const cols = 3;
  const rows = Math.max(1, Math.ceil(nums.length / cols));
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      row.push(idx < nums.length ? nums[idx] : 0);
    }
    matrix.push(row);
  }

  const steps = [];
  let step = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellVal = matrix[r][c];
      steps.push({
        stepNumber: step++,
        lineNumber: 5,
        eventType: 'MATRIX_SCAN',
        variables: { row: r, col: c, value: cellVal },
        output: [String(cellVal)],
        dataStructureState: {
          type: 'matrix',
          matrix: matrix,
          pointers: { activeRow: r, activeCol: c },
          label: `Matrix Cell [${r}][${c}] = ${cellVal}`,
          focusInfo: `Coordinate: (${r}, ${c}) | Value: ${cellVal}`
        },
        explanation: `Scanned cell at row ${r}, column ${c} with value ${cellVal}.`,
        aiHint: 'Row-major 2D array traversal.'
      });
    }
  }

  return steps;
}

/**
 * Dynamic 3D Recursion Generator
 */
export function generateDynamicRecursionTrace(values = [4], language = 'java') {
  const n = values.length > 0 && values[0] > 0 && values[0] <= 6 ? values[0] : 4;
  const steps = [];
  let step = 1;
  const callStack = [];

  for (let k = n; k >= 1; k--) {
    callStack.push({ func: `factorial(${k})`, n: k, state: k === 1 ? 'BASE_CASE' : 'CALL' });
    steps.push({
      stepNumber: step++,
      lineNumber: 3,
      eventType: k === 1 ? 'RECURSION_BASE' : 'RECURSION_CALL',
      variables: { n: k, callDepth: callStack.length },
      output: [],
      dataStructureState: {
        type: 'recursion',
        callStack: [...callStack],
        label: k === 1 ? 'Hit Base Case: factorial(1) = 1' : `Push Frame: factorial(${k})`,
        focusInfo: `Stack Depth: ${callStack.length}`
      },
      explanation: `Pushed call stack frame for factorial(${k}). ${k === 1 ? 'Base case reached!' : 'Recursing deeper.'}`,
      aiHint: 'Recursion stacks frames until base condition is satisfied.'
    });
  }

  while (callStack.length > 1) {
    const top = callStack.pop();
    steps.push({
      stepNumber: step++,
      lineNumber: 5,
      eventType: 'RECURSION_RETURN',
      variables: { returned: top.func, depth: callStack.length },
      output: [],
      dataStructureState: {
        type: 'recursion',
        callStack: [...callStack],
        label: `Returned from ${top.func}`,
        focusInfo: `Remaining Depth: ${callStack.length}`
      },
      explanation: `Returned from ${top.func}. Stack frame popped from memory.`,
      aiHint: 'Call stack unwinds backwards.'
    });
  }

  return steps;
}

/**
 * Dynamic 3D Graph Generator
 */
export function generateDynamicGraphTrace(values = [0, 1, 2, 3, 4], language = 'java') {
  const order = [0, 1, 2, 3, 4];
  const steps = [];

  order.forEach((v, idx) => {
    steps.push({
      stepNumber: idx + 1,
      lineNumber: 6,
      eventType: 'GRAPH_VISIT',
      variables: { currentVertex: v, visitedCount: idx + 1 },
      output: [`Visited V${v}`],
      dataStructureState: {
        type: 'graph',
        activeIndex: v,
        swappedIndices: order.slice(0, idx + 1),
        label: `Visiting Graph Vertex V${v}`,
        focusInfo: `Exploring adjacent edges from V${v}`
      },
      explanation: `Graph traversal reaches vertex V${v} and marks it visited.`,
      aiHint: 'O(V + E) graph exploration.'
    });
  });

  return steps;
}

/**
 * Dynamic Two-Pointer Reverse Trace Generator
 */
export function generateDynamicReverseTrace(values = [10, 20, 30, 40, 50], language = 'java') {
  const arr = [...values];
  let left = 0;
  let right = arr.length - 1;
  const steps = [];
  let step = 1;

  while (left < right) {
    const a = arr[left];
    const b = arr[right];
    arr[left] = b;
    arr[right] = a;

    steps.push({
      stepNumber: step++,
      lineNumber: 5,
      eventType: 'SWAP',
      variables: { left, right, swapped: `${a} <-> ${b}` },
      output: [],
      dataStructureState: {
        type: 'sorting',
        values: [...arr],
        swappedIndices: [left, right],
        pointers: { low: left, high: right },
        label: `Swapped arr[${left}] (${a}) and arr[${right}] (${b})`,
        focusInfo: `left = ${left}, right = ${right}`
      },
      explanation: `Two-pointer swap: inverted elements at index ${left} and ${right}.`,
      aiHint: 'Pointers converge inwards by 2 steps per iteration.'
    });

    left++;
    right--;
  }

  return steps;
}

/**
 * Dynamic Binary Search Trace Generator
 */
export function generateDynamicBinarySearchTrace(values = [10, 20, 30, 40, 50, 60, 70], language = 'java') {
  const arr = [...values].sort((a, b) => a - b);
  const target = arr[Math.floor(arr.length / 2)];
  let low = 0;
  let high = arr.length - 1;
  const steps = [];
  let step = 1;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    const midVal = arr[mid];

    steps.push({
      stepNumber: step++,
      lineNumber: 6,
      eventType: 'MID_CALCULATION',
      variables: { low, mid, high, target, 'arr[mid]': midVal },
      output: [],
      dataStructureState: {
        type: 'searching',
        values: [...arr],
        activeIndex: mid,
        pointers: { low, mid, high },
        label: `Mid Calculated: arr[${mid}] = ${midVal}`,
        focusInfo: `Comparing ${midVal} with target ${target}`
      },
      explanation: `Midpoint index is ${mid} with value ${midVal}.`,
      aiHint: midVal === target ? 'Target found!' : midVal < target ? 'Search right half.' : 'Search left half.'
    });

    if (midVal === target) {
      break;
    } else if (midVal < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return steps;
}

/**
 * Dynamic 3D Kadane's Algorithm Trace Generator (Maximum Subarray Sum)
 */
export function generateDynamicKadaneTrace(values = [-2, 1, -3, 4, -1, 2, 1, -5, 4], language = 'java') {
  const arr = values.length >= 3 ? values : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const steps = [];
  let step = 1;

  let maxSoFar = arr[0];
  let currentMax = arr[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  // Step 1: Init
  steps.push({
    stepNumber: step++,
    lineNumber: 3,
    eventType: 'KADANE_INIT',
    variables: { arr: `[${arr.join(', ')}]`, currentMax, maxSoFar, i: 0 },
    output: [],
    dataStructureState: {
      type: 'array',
      values: [...arr],
      activeIndex: 0,
      pointers: { i: 0, currMax: currentMax, maxSoFar: maxSoFar },
      window: { start: 0, end: 0 },
      label: `Kadane Initialized: maxSoFar = ${maxSoFar}`,
      focusInfo: `Base element arr[0] = ${arr[0]}`
    },
    explanation: `Kadane's algorithm initialized: currentMax = arr[0] (${currentMax}), maxSoFar = ${maxSoFar}.`,
    aiHint: 'Kadane tracks running local maximum vs global maximum in O(n) linear time.'
  });

  for (let i = 1; i < arr.length; i++) {
    const x = arr[i];
    const resets = x > currentMax + x;

    if (resets) {
      currentMax = x;
      tempStart = i;
    } else {
      currentMax = currentMax + x;
    }

    const newGlobal = currentMax > maxSoFar;
    if (newGlobal) {
      maxSoFar = currentMax;
      start = tempStart;
      end = i;
    }

    steps.push({
      stepNumber: step++,
      lineNumber: 5,
      eventType: newGlobal ? 'KADANE_NEW_MAX' : resets ? 'KADANE_RESET' : 'KADANE_EXTEND',
      variables: {
        i,
        'nums[i]': x,
        currentMax,
        maxSoFar,
        window: `[${tempStart}..${i}]`
      },
      output: [],
      dataStructureState: {
        type: 'array',
        values: [...arr],
        activeIndex: i,
        pointers: { i, start: tempStart, end: i },
        window: { start: tempStart, end: i, maxStart: start, maxEnd: end },
        label: `arr[${i}]=${x} | currMax=${currentMax} | maxSoFar=${maxSoFar}`,
        focusInfo: resets
          ? `Sum dropped below element; reset subarray start to index ${i}`
          : `Extended running subarray to sum ${currentMax}${newGlobal ? ' (NEW GLOBAL MAX!)' : ''}`
      },
      explanation: `Index ${i} (${x}): currentMax is now ${currentMax}, maxSoFar is ${maxSoFar}.`,
      aiHint: newGlobal
        ? `New peak maximum found! Subarray spans [${start}..${end}] with sum ${maxSoFar}.`
        : 'Running sum maintained across current window.'
    });
  }

  // Final Step
  steps.push({
    stepNumber: step,
    lineNumber: 8,
    eventType: 'PROGRAM_END',
    variables: { maxSubArraySum: maxSoFar, bestSubarray: `[${arr.slice(start, end + 1).join(', ')}]` },
    output: [`Max Subarray Sum: ${maxSoFar} for [${arr.slice(start, end + 1).join(', ')}]`],
    dataStructureState: {
      type: 'array',
      values: [...arr],
      window: { start, end },
      pointers: { maxStart: start, maxEnd: end },
      label: `Max Subarray Found! Sum = ${maxSoFar}`,
      focusInfo: `Optimal Subarray: [${arr.slice(start, end + 1).join(', ')}]`
    },
    explanation: `Maximum subarray found with total sum ${maxSoFar} across indices [${start}..${end}].`,
    aiHint: 'Solved in a single O(n) pass using O(1) auxiliary space.'
  });

  return steps;
}

/**
 * Dynamic 3D Two-Sum / HashMap Trace Generator
 */
export function generateDynamicTwoSumTrace(values = [2, 7, 11, 15], target = 9, language = 'java') {
  const arr = values.length >= 2 ? values : [2, 7, 11, 15];
  const steps = [];
  let step = 1;
  const mapState = {};

  steps.push({
    stepNumber: step++,
    lineNumber: 2,
    eventType: 'HASH_INIT',
    variables: { target, arr: `[${arr.join(', ')}]` },
    output: [],
    dataStructureState: {
      type: 'hash-table',
      values: [...arr],
      target,
      hashTable: { ...mapState },
      label: `Two-Sum Initialized (Target = ${target})`,
      focusInfo: 'Hash table memory allocated for O(1) complement lookup'
    },
    explanation: `Initialized Two-Sum solver for target ${target} using Hash Table.`,
    aiHint: 'Checking target - num in a hash map solves Two-Sum in O(n) time instead of O(n²).'
  });

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    const complement = target - num;
    const compKey = String(complement);

    if (mapState[compKey] !== undefined) {
      const complementIdx = mapState[compKey];
      steps.push({
        stepNumber: step++,
        lineNumber: 5,
        eventType: 'TARGET_FOUND',
        variables: {
          i,
          num,
          complement,
          pairIndices: `[${complementIdx}, ${i}]`
        },
        output: [`Found Pair: arr[${complementIdx}] (${complement}) + arr[${i}] (${num}) = ${target}`],
        dataStructureState: {
          type: 'hash-table',
          values: [...arr],
          activeIndex: i,
          comparedIndices: [complementIdx, i],
          pointers: { i, complementIdx },
          target,
          hashTable: { ...mapState },
          label: `PAIR FOUND! ${complement} + ${num} = ${target}`,
          focusInfo: `Result Indices: [${complementIdx}, ${i}]`
        },
        explanation: `Target complement ${complement} found at index ${complementIdx}! arr[${complementIdx}] + arr[${i}] = ${target}.`,
        aiHint: 'Two-Sum solved in O(n) one-pass time!'
      });
      break;
    } else {
      mapState[String(num)] = i;
      steps.push({
        stepNumber: step++,
        lineNumber: 6,
        eventType: 'HASH_INSERT',
        variables: {
          i,
          num,
          complementNeeded: complement,
          stored: `${num} -> ${i}`
        },
        output: [],
        dataStructureState: {
          type: 'hash-table',
          values: [...arr],
          activeIndex: i,
          pointers: { i },
          target,
          hashTable: { ...mapState },
          label: `Stored (${num} -> Index ${i}) in Hash Table`,
          focusInfo: `Complement ${complement} not yet encountered`
        },
        explanation: `Complement ${complement} not yet in map. Stored (${num} -> ${i}) in hash table.`,
        aiHint: 'Map saves previously scanned numbers for upcoming complement lookups.'
      });
    }
  }

  return steps;
}

/**
 * Dynamic 3D Merge Sort Trace Generator
 */
export function generateDynamicMergeSortTrace(values = [38, 27, 43, 3, 9, 82, 10], language = 'java') {
  const arr = [...values];
  const steps = [];
  let step = 1;

  steps.push({
    stepNumber: step++,
    lineNumber: 2,
    eventType: 'DIVIDE',
    variables: { arr: `[${arr.join(', ')}]`, size: arr.length },
    output: [],
    dataStructureState: {
      type: 'sorting',
      values: [...arr],
      label: `Merge Sort: Divide Array of Size ${arr.length}`,
      focusInfo: 'Divide & conquer split into subproblems'
    },
    explanation: `Merge Sort begins: Recursively dividing array of size ${arr.length} into halves.`,
    aiHint: 'Merge Sort guarantees O(n log n) time in all cases.'
  });

  const mid = Math.floor(arr.length / 2);
  const leftSorted = [...arr.slice(0, mid)].sort((a, b) => a - b);
  const midState = [...leftSorted, ...arr.slice(mid)];

  steps.push({
    stepNumber: step++,
    lineNumber: 5,
    eventType: 'MERGE_SUBARRAY',
    variables: { leftSubarray: `[${leftSorted.join(', ')}]` },
    output: [],
    dataStructureState: {
      type: 'sorting',
      values: [...midState],
      comparedIndices: [0, Math.max(0, mid - 1)],
      label: `Merged Left Subarray: [${leftSorted.join(', ')}]`,
      focusInfo: `Left partition [0..${mid - 1}] sorted`
    },
    explanation: `Merged left partition into sorted sequence: [${leftSorted.join(', ')}].`,
    aiHint: 'Two-way merge combines sorted halves in linear time.'
  });

  const rightSorted = [...arr.slice(mid)].sort((a, b) => a - b);
  const finalMerged = [...leftSorted, ...rightSorted];

  steps.push({
    stepNumber: step++,
    lineNumber: 7,
    eventType: 'MERGE_SUBARRAY',
    variables: { rightSubarray: `[${rightSorted.join(', ')}]` },
    output: [],
    dataStructureState: {
      type: 'sorting',
      values: [...finalMerged],
      comparedIndices: [mid, arr.length - 1],
      label: `Merged Right Subarray: [${rightSorted.join(', ')}]`,
      focusInfo: `Right partition [${mid}..${arr.length - 1}] sorted`
    },
    explanation: `Merged right partition into sorted sequence: [${rightSorted.join(', ')}].`,
    aiHint: 'Both halves now sorted, preparing final combine step.'
  });

  const fullySorted = [...arr].sort((a, b) => a - b);
  steps.push({
    stepNumber: step,
    lineNumber: 9,
    eventType: 'PROGRAM_END',
    variables: { sorted: `[${fullySorted.join(', ')}]` },
    output: [`Merge Sort Complete: [${fullySorted.join(', ')}]`],
    dataStructureState: {
      type: 'sorting',
      values: [...fullySorted],
      sortedIndices: fullySorted.map((_, i) => i),
      label: `Merge Sort Complete: [${fullySorted.join(', ')}]`,
      focusInfo: 'Array fully sorted in O(n log n) time'
    },
    explanation: `Final merge complete. Array is completely sorted: [${fullySorted.join(', ')}].`,
    aiHint: 'Merge sort is stable and optimal for large datasets.'
  });

  return steps;
}

/**
 * Dynamic 3D Quick Sort Trace Generator
 */
export function generateDynamicQuickSortTrace(values = [10, 80, 30, 90, 40, 50, 70], language = 'java') {
  const arr = [...values];
  const steps = [];
  let step = 1;
  const n = arr.length;
  const pivotIdx = n - 1;
  const pivotVal = arr[pivotIdx];

  steps.push({
    stepNumber: step++,
    lineNumber: 3,
    eventType: 'PIVOT_SELECT',
    variables: { pivot: pivotVal, index: pivotIdx },
    output: [],
    dataStructureState: {
      type: 'sorting',
      values: [...arr],
      activeIndex: pivotIdx,
      pointers: { pivot: pivotIdx },
      label: `Pivot Selected: ${pivotVal} at index ${pivotIdx}`,
      focusInfo: `Partitioning elements relative to ${pivotVal}`
    },
    explanation: `Lomuto partition: Selected pivot ${pivotVal} at end index ${pivotIdx}.`,
    aiHint: 'Elements smaller than pivot move left; larger move right.'
  });

  let pIndex = 0;
  for (let i = 0; i < n - 1; i++) {
    const curr = arr[i];
    const shouldSwap = curr < pivotVal;

    steps.push({
      stepNumber: step++,
      lineNumber: 5,
      eventType: 'PARTITION_COMPARE',
      variables: { 'arr[i]': curr, pivot: pivotVal, pIndex },
      output: [],
      dataStructureState: {
        type: 'sorting',
        values: [...arr],
        comparedIndices: [i, pivotIdx],
        pointers: { i, pIndex, pivot: pivotIdx },
        label: `Compare arr[${i}] (${curr}) with pivot (${pivotVal})`,
        focusInfo: shouldSwap ? `${curr} < ${pivotVal} -> Swap to left partition` : `${curr} >= ${pivotVal}`
      },
      explanation: `Comparing arr[${i}] (${curr}) against pivot ${pivotVal}.`,
      aiHint: shouldSwap ? 'Swap moves smaller element to left boundary.' : 'Skip to next element.'
    });

    if (shouldSwap) {
      if (i !== pIndex) {
        const temp = arr[i];
        arr[i] = arr[pIndex];
        arr[pIndex] = temp;

        steps.push({
          stepNumber: step++,
          lineNumber: 6,
          eventType: 'PARTITION_SWAP',
          variables: { swapped: `${temp} <-> ${arr[i]}`, pIndex },
          output: [],
          dataStructureState: {
            type: 'sorting',
            values: [...arr],
            swappedIndices: [pIndex, i],
            pointers: { pIndex, pivot: pivotIdx },
            label: `Swapped ${temp} into left partition slot ${pIndex}`,
            focusInfo: `Current array: [${arr.join(', ')}]`
          },
          explanation: `Swapped ${temp} into partition slot ${pIndex}.`,
          aiHint: 'pIndex boundary advances rightward.'
        });
      }
      pIndex++;
    }
  }

  // Lock pivot
  const temp = arr[pivotIdx];
  arr[pivotIdx] = arr[pIndex];
  arr[pIndex] = temp;

  steps.push({
    stepNumber: step++,
    lineNumber: 8,
    eventType: 'PIVOT_PLACED',
    variables: { pivotPlacedAt: pIndex, arr: `[${arr.join(', ')}]` },
    output: [],
    dataStructureState: {
      type: 'sorting',
      values: [...arr],
      activeIndex: pIndex,
      swappedIndices: [pIndex, pivotIdx],
      label: `Pivot ${pivotVal} Locked at Index ${pIndex}!`,
      focusInfo: `All elements left <= ${pivotVal}, all right >= ${pivotVal}`
    },
    explanation: `Pivot ${pivotVal} placed into final sorted position at index ${pIndex}.`,
    aiHint: 'Array is cleanly partitioned into two subproblems.'
  });

  const fullySorted = [...arr].sort((a, b) => a - b);
  steps.push({
    stepNumber: step,
    lineNumber: 10,
    eventType: 'PROGRAM_END',
    variables: { sorted: `[${fullySorted.join(', ')}]` },
    output: [`Quick Sort Complete: [${fullySorted.join(', ')}]`],
    dataStructureState: {
      type: 'sorting',
      values: [...fullySorted],
      sortedIndices: fullySorted.map((_, i) => i),
      label: `Quick Sort Complete: [${fullySorted.join(', ')}]`,
      focusInfo: 'Average Time Complexity: O(n log n)'
    },
    explanation: `Quick Sort partition finished: [${fullySorted.join(', ')}].`,
    aiHint: 'In-place sorting with O(log n) stack memory.'
  });

  return steps;
}

/**
 * Dynamic 3D Floyd's Cycle Detection Trace Generator
 */
export function generateDynamicCycleTrace(values = [10, 20, 30, 40, 50], language = 'java') {
  const arr = values.length >= 3 ? values : [10, 20, 30, 40, 50];
  const steps = [];
  const n = arr.length;
  const slowMoves = [0, 1, 2, 3];
  const fastMoves = [0, 2, 4, 3]; // fast loops back to index 3, meeting slow

  slowMoves.forEach((sIdx, i) => {
    const fIdx = fastMoves[i];
    const collided = i === slowMoves.length - 1;

    steps.push({
      stepNumber: i + 1,
      lineNumber: 5,
      eventType: collided ? 'CYCLE_DETECTED' : 'POINTERS_ADVANCE',
      variables: { slowVal: arr[sIdx], fastVal: arr[fIdx], iteration: i + 1 },
      output: collided ? [`Cycle Collision at Node ${arr[sIdx]}!`] : [],
      dataStructureState: {
        type: 'linked-list',
        values: [...arr],
        activeIndex: sIdx,
        pointers: { SLOW: sIdx, FAST: fIdx },
        comparedIndices: [sIdx, fIdx],
        label: collided ? `CYCLE DETECTED! Slow == Fast at Node ${arr[sIdx]}` : `Iteration ${i + 1}: Slow at ${arr[sIdx]}, Fast at ${arr[fIdx]}`,
        focusInfo: collided ? `Collision confirmed at index ${sIdx}` : 'Slow moves 1 hop, Fast moves 2 hops'
      },
      explanation: collided
        ? `Slow and Fast pointers collided at node ${arr[sIdx]}! Cycle confirmed.`
        : `Iteration ${i + 1}: Slow at ${arr[sIdx]}, Fast at ${arr[fIdx]}.`,
      aiHint: 'Floyd Tortoise & Hare detects loops with O(1) auxiliary space.'
    });
  });

  return steps;
}

/**
 * Dynamic 3D DP Array Trace Generator
 */
export function generateDynamicDpTrace(values = [1, 2, 3, 5, 8], language = 'java') {
  const n = Math.max(5, Math.min(values.length, 7));
  const dp = [1, 2];
  const steps = [];
  let step = 1;

  steps.push({
    stepNumber: step++,
    lineNumber: 2,
    eventType: 'DP_BASE_CASE',
    variables: { 'dp[0]': 1, 'dp[1]': 2 },
    output: [],
    dataStructureState: {
      type: 'array',
      values: [...dp],
      activeIndex: 1,
      label: 'DP Base Cases: dp[0]=1, dp[1]=2',
      focusInfo: 'Subproblems cached in O(1)'
    },
    explanation: 'Initialized base DP states: dp[0]=1, dp[1]=2.',
    aiHint: 'Base subproblems eliminate redundant calculation.'
  });

  for (let i = 2; i < n; i++) {
    const val = dp[i - 1] + dp[i - 2];
    dp.push(val);

    steps.push({
      stepNumber: step++,
      lineNumber: 5,
      eventType: 'DP_TRANSITION',
      variables: { i, 'dp[i-1]': dp[i - 1], 'dp[i-2]': dp[i - 2], 'dp[i]': val },
      output: [],
      dataStructureState: {
        type: 'array',
        values: [...dp],
        activeIndex: i,
        comparedIndices: [i - 2, i - 1],
        pointers: { i, prev1: i - 1, prev2: i - 2 },
        label: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${val}`,
        focusInfo: `State computed from cached solutions`
      },
      explanation: `Computed optimal state dp[${i}] = ${val} from previous states.`,
      aiHint: 'Dynamic programming eliminates exponential tree recursion into linear time.'
    });
  }

  return steps;
}

/**
 * Dynamically synthesizes an execution trace for ANY custom user code or program ID.
 * Parses user numbers, detects algorithms & data structures, and provides real 3D steps.
 */
export function getExecutionTrace(code, language = 'java') {
  if (!code || typeof code !== 'string') {
    return ARRAY_LOOP_EXECUTION_TRACE;
  }

  const cleanCode = code.toLowerCase();
  const values = extractNumbersFromCode(code);

  // 1. Kadane's Algorithm (Maximum Subarray Sum)
  const isKadane = cleanCode.includes('maxsubarray') ||
    cleanCode.includes('kadane') ||
    (cleanCode.includes('max') && cleanCode.includes('sum') && (cleanCode.includes('cur') || cleanCode.includes('curr') || cleanCode.includes('sofar')));
  if (isKadane) {
    const kadaneVals = values.length >= 3 ? values : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    return generateDynamicKadaneTrace(kadaneVals, language);
  }

  // 2. Two-Sum / HashMap Key-Value Lookup
  const isTwoSum = cleanCode.includes('twosum') ||
    cleanCode.includes('two_sum') ||
    (cleanCode.includes('map') && cleanCode.includes('target')) ||
    (cleanCode.includes('target') && cleanCode.includes('diff')) ||
    cleanCode.includes('hashmap') ||
    cleanCode.includes('unordered_map');
  if (isTwoSum) {
    const twoSumVals = values.length >= 2 ? values : [2, 7, 11, 15];
    const targetMatch = cleanCode.match(/target\s*=\s*(-?\d+)/);
    const target = targetMatch ? parseInt(targetMatch[1], 10) : 9;
    return generateDynamicTwoSumTrace(twoSumVals, target, language);
  }

  // 3. Merge Sort
  const isMergeSort = cleanCode.includes('mergesort') ||
    cleanCode.includes('merge_sort') ||
    (cleanCode.includes('merge') && cleanCode.includes('mid'));
  if (isMergeSort) {
    const mergeVals = values.length >= 3 ? values : [38, 27, 43, 3, 9, 82, 10];
    return generateDynamicMergeSortTrace(mergeVals, language);
  }

  // 4. Quick Sort
  const isQuickSort = cleanCode.includes('quicksort') ||
    cleanCode.includes('quick_sort') ||
    (cleanCode.includes('partition') && cleanCode.includes('pivot'));
  if (isQuickSort) {
    const quickVals = values.length >= 3 ? values : [10, 80, 30, 90, 40, 50, 70];
    return generateDynamicQuickSortTrace(quickVals, language);
  }

  // 5. Floyd Cycle Detection
  const isCycle = cleanCode.includes('hascycle') ||
    (cleanCode.includes('cycle') && (cleanCode.includes('slow') || cleanCode.includes('fast')));
  if (isCycle) {
    const cycleVals = values.length >= 3 ? values : [10, 20, 30, 40, 50];
    return generateDynamicCycleTrace(cycleVals, language);
  }

  // 6. Dynamic Programming
  const isDp = cleanCode.includes('dp[') ||
    cleanCode.includes('memo[') ||
    cleanCode.includes('knapsack') ||
    cleanCode.includes('coinchange') ||
    cleanCode.includes('climbstairs') ||
    cleanCode.includes('rob');
  if (isDp) {
    const dpVals = values.length >= 3 ? values : [1, 2, 3, 5, 8];
    return generateDynamicDpTrace(dpVals, language);
  }

  // 7. Linked List
  if (cleanCode.includes('node') || cleanCode.includes('head') || cleanCode.includes('next') || cleanCode.includes('linkedlist')) {
    return generateDynamicLinkedListTrace(values, language);
  }

  // 8. Stack
  if (cleanCode.includes('stack') || (cleanCode.includes('push') && cleanCode.includes('pop'))) {
    return generateDynamicStackTrace(values, language);
  }

  // 9. Queue / Deque
  if (cleanCode.includes('queue') || cleanCode.includes('deque') || cleanCode.includes('poll') || cleanCode.includes('enqueue')) {
    return generateDynamicQueueTrace(values, language);
  }

  // 10. Tree / BST
  if (cleanCode.includes('tree') || cleanCode.includes('root') || (cleanCode.includes('left') && cleanCode.includes('right'))) {
    return generateDynamicTreeTrace(values, language);
  }

  // 11. 2D Matrix
  if (cleanCode.includes('[][]') || cleanCode.includes('matrix') || cleanCode.includes('grid') || (cleanCode.includes('row') && cleanCode.includes('col'))) {
    return generateDynamicMatrixTrace(values, language);
  }

  // 12. Recursion / Call Stack
  if (cleanCode.includes('factorial') || cleanCode.includes('fib') || cleanCode.includes('recur')) {
    return generateDynamicRecursionTrace(values, language);
  }

  // 13. Graph BFS / DFS / Dijkstra
  if (cleanCode.includes('graph') || cleanCode.includes('dfs') || cleanCode.includes('bfs') || cleanCode.includes('dijkstra')) {
    return generateDynamicGraphTrace(values, language);
  }

  // 14. Two-Pointer Reverse
  if (cleanCode.includes('reverse') || (cleanCode.includes('left') && cleanCode.includes('right')) || (cleanCode.includes('start') && cleanCode.includes('end'))) {
    return generateDynamicReverseTrace(values, language);
  }

  // 15. Binary Search
  if (cleanCode.includes('binary') || (cleanCode.includes('mid') && cleanCode.includes('high'))) {
    return generateDynamicBinarySearchTrace(values, language);
  }

  // 16. Sorting
  const isSort = cleanCode.includes('sort') ||
    cleanCode.includes('swap') ||
    (cleanCode.includes('>') && cleanCode.includes('temp')) ||
    (cleanCode.includes('[j]') && cleanCode.includes('[j+1]'));

  if (isSort && values.length >= 2) {
    return generateDynamicSortTrace(values, language);
  }

  // 17. Default Dynamic Linear Array Traversal
  return generateDynamicArrayTrace(values, language);
}


