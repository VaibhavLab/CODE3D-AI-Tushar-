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
 * Dynamically synthesizes an execution trace for ANY custom user code or program ID.
 * Parses user numbers, detects algorithms & data structures, and provides real 3D steps.
 */
export function getExecutionTrace(code, language = 'java') {
  if (!code || typeof code !== 'string') {
    return ARRAY_LOOP_EXECUTION_TRACE;
  }

  const cleanCode = code.toLowerCase();
  const values = extractNumbersFromCode(code);

  // 1. Linked List
  if (cleanCode.includes('node') || cleanCode.includes('head') || cleanCode.includes('next') || cleanCode.includes('linkedlist')) {
    return generateDynamicLinkedListTrace(values, language);
  }

  // 2. Stack
  if (cleanCode.includes('stack') || (cleanCode.includes('push') && cleanCode.includes('pop'))) {
    return generateDynamicStackTrace(values, language);
  }

  // 3. Queue / Deque
  if (cleanCode.includes('queue') || cleanCode.includes('deque') || cleanCode.includes('poll') || cleanCode.includes('enqueue')) {
    return generateDynamicQueueTrace(values, language);
  }

  // 4. Tree / BST
  if (cleanCode.includes('tree') || cleanCode.includes('root') || (cleanCode.includes('left') && cleanCode.includes('right'))) {
    return generateDynamicTreeTrace(values, language);
  }

  // 5. 2D Matrix
  if (cleanCode.includes('[][]') || cleanCode.includes('matrix') || cleanCode.includes('grid') || (cleanCode.includes('row') && cleanCode.includes('col'))) {
    return generateDynamicMatrixTrace(values, language);
  }

  // 6. Recursion / Call Stack
  if (cleanCode.includes('factorial') || cleanCode.includes('fib') || cleanCode.includes('recur')) {
    return generateDynamicRecursionTrace(values, language);
  }

  // 7. Graph BFS / DFS / Dijkstra
  if (cleanCode.includes('graph') || cleanCode.includes('dfs') || cleanCode.includes('bfs') || cleanCode.includes('dijkstra')) {
    return generateDynamicGraphTrace(values, language);
  }

  // 8. Two-Pointer Reverse
  if (cleanCode.includes('reverse') || (cleanCode.includes('left') && cleanCode.includes('right')) || (cleanCode.includes('start') && cleanCode.includes('end'))) {
    return generateDynamicReverseTrace(values, language);
  }

  // 9. Binary Search
  if (cleanCode.includes('binary') || (cleanCode.includes('mid') && cleanCode.includes('high'))) {
    return generateDynamicBinarySearchTrace(values, language);
  }

  // 10. Sorting
  const isSort = cleanCode.includes('sort') ||
    cleanCode.includes('swap') ||
    (cleanCode.includes('>') && cleanCode.includes('temp')) ||
    (cleanCode.includes('[j]') && cleanCode.includes('[j+1]'));

  if (isSort && values.length >= 2) {
    return generateDynamicSortTrace(values, language);
  }

  // 11. Default Dynamic Linear Array Traversal
  return generateDynamicArrayTrace(values, language);
}


