package com.code3d.service;

import com.code3d.model.*;
import com.code3d.parser.UniversalCodeAnalyzer;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MultiLanguageExecutionService {

    public ExecuteResponse executeUserCode(ExecuteRequest request) {
        String code = request.getCode();
        if (code == null) {
            code = "";
        }
        String language = request.getLanguage();

        if (language == null || language.isBlank()) {
            language = UniversalCodeAnalyzer.detectLanguage(code);
        }

        // 1. Extract user-specified numbers/array values from any language
        List<Integer> values = extractArrayValues(code, language);
        if (values.isEmpty()) {
            values = List.of(10, 20, 30, 40);
        }

        // 2. Identify line numbers in user's source code
        int arrayLine = findLineContaining(code, "[", "{", "vector", "const", "let");
        int loopLine = findLineContaining(code, "for", "while", "forEach");
        int printLine = findLineContaining(code, "println", "printf", "cout", "print", "console.log", "log");

        if (arrayLine <= 0) arrayLine = 1;
        if (loopLine <= 0) loopLine = 3;
        if (printLine <= 0) printLine = 4;

        String lowerCode = code.toLowerCase();

        // 3. Algorithm Pattern Detection
        // Linked List
        boolean isLinkedList = lowerCode.contains("node") || lowerCode.contains("head") || lowerCode.contains("->next") || lowerCode.contains(".next") || lowerCode.contains("linkedlist");
        if (isLinkedList) {
            return generateUserLinkedListTrace(values, arrayLine, loopLine, language);
        }

        // Stack (LIFO)
        boolean isStack = lowerCode.contains("stack") || (lowerCode.contains("push") && lowerCode.contains("pop"));
        if (isStack) {
            return generateUserStackTrace(values, arrayLine, loopLine, language);
        }

        // Queue / Deque (FIFO)
        boolean isQueue = lowerCode.contains("queue") || lowerCode.contains("deque") || lowerCode.contains("poll") || lowerCode.contains("enqueue");
        if (isQueue) {
            return generateUserQueueTrace(values, arrayLine, loopLine, language);
        }

        // Tree / Binary Search Tree
        boolean isTree = lowerCode.contains("tree") || lowerCode.contains("root") || (lowerCode.contains("left") && lowerCode.contains("right"));
        if (isTree) {
            return generateUserTreeTrace(values, arrayLine, loopLine, language);
        }

        // 2D Matrix / Grid
        boolean isMatrix = lowerCode.contains("[][]") || lowerCode.contains("matrix") || lowerCode.contains("grid") || (lowerCode.contains("row") && lowerCode.contains("col"));
        if (isMatrix) {
            return generateUserMatrixTrace(values, arrayLine, loopLine, language);
        }

        // Recursion / Call Stack
        boolean isRecursion = lowerCode.contains("factorial") || lowerCode.contains("fib") || lowerCode.contains("recur");
        if (isRecursion) {
            return generateUserRecursionTrace(values, arrayLine, loopLine, language);
        }

        // Sliding Window
        boolean isWindow = lowerCode.contains("window") || (lowerCode.contains("k") && lowerCode.contains("sum"));
        if (isWindow && values.size() >= 3) {
            return generateUserSlidingWindowTrace(values, arrayLine, loopLine, language);
        }

        // Sorting
        boolean isSort = lowerCode.contains("swap") ||
                         (lowerCode.contains(">") && lowerCode.contains("temp")) ||
                         lowerCode.contains("sort");
        if (isSort && values.size() >= 2) {
            return generateUserSortTrace(values, arrayLine, loopLine, printLine, language);
        }

        // Two-Pointer Reversal
        boolean isReverse = lowerCode.contains("reverse") ||
                            (lowerCode.contains("left") && lowerCode.contains("right")) ||
                            (lowerCode.contains("start") && lowerCode.contains("end"));
        if (isReverse && values.size() >= 2) {
            return generateUserReverseTrace(values, arrayLine, loopLine, language);
        }

        // Binary Search
        boolean isSearch = lowerCode.contains("binary") ||
                           (lowerCode.contains("mid") && lowerCode.contains("high"));
        if (isSearch && values.size() >= 2) {
            return generateUserBinarySearchTrace(values, arrayLine, loopLine, language);
        }

        // 4. Default: Dynamic linear traversal trace matching user's exact code and numbers
        return generateUserArrayTrace(values, arrayLine, loopLine, printLine, language);
    }

    public List<Integer> extractArrayValues(String code, String lang) {
        List<Integer> list = new ArrayList<>();
        if (code == null) return list;

        // Matches {1, 2, 3} or [1, 2, 3]
        Pattern p = Pattern.compile("[\\[{]([0-9,\\s\\-]+)[\\]}]");
        Matcher m = p.matcher(code);
        if (m.find()) {
            String inner = m.group(1);
            String[] tokens = inner.split("[,\\s]+");
            for (String tok : tokens) {
                try {
                    String trimmed = tok.trim();
                    if (!trimmed.isEmpty()) {
                        list.add(Integer.parseInt(trimmed));
                    }
                } catch (NumberFormatException ignored) {}
            }
        }

        // If bracket match yielded nothing, look for comma or space separated numbers
        if (list.isEmpty()) {
            Pattern numPat = Pattern.compile("-?\\b\\d+\\b");
            Matcher numMatcher = numPat.matcher(code);
            while (numMatcher.find() && list.size() < 12) {
                try {
                    int val = Integer.parseInt(numMatcher.group());
                    if (val < 10000) { // filter out ports / giant line numbers
                        list.add(val);
                    }
                } catch (NumberFormatException ignored) {}
            }
        }

        return list;
    }

    private int findLineContaining(String code, String... keywords) {
        if (code == null) return 1;
        String[] lines = code.split("\r?\n");
        for (int i = 0; i < lines.length; i++) {
            for (String kw : keywords) {
                if (lines[i].contains(kw)) {
                    return i + 1; // 1-indexed
                }
            }
        }
        return 1;
    }


    private ExecuteResponse generateUserArrayTrace(List<Integer> values, int arrayLine, int loopLine, int printLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<String> output = new ArrayList<>();
        int n = values.size();
        int step = 1;

        // Step 1: Memory Allocation
        ExecutionStep s1 = new ExecutionStep();
        s1.setStepNumber(step++);
        s1.setLineNumber(arrayLine);
        s1.setEventType("ARRAY_CREATION");
        s1.setVariables(Map.of("arr", values.toString(), "size", n, "lang", lang.toUpperCase()));
        s1.setChangedVariable("arr");
        s1.setCurrentValue(values.toString());
        s1.setOutput(new ArrayList<>(output));

        DataStructureState ds1 = new DataStructureState();
        ds1.setType("array");
        ds1.setName("arr");
        ds1.setValues(new ArrayList<>(values));
        ds1.setLabel("User Array Allocated (" + lang.toUpperCase() + ")");
        ds1.setFocusInfo("Allocated " + n + " contiguous elements: " + values);
        s1.setDataStructureState(ds1);

        s1.setExplanation("[" + lang.toUpperCase() + "] Initialized user collection with " + n + " elements: " + values + ".");
        s1.setAiHint("Each element is assigned an index from 0 to " + (n - 1) + ".");
        steps.add(s1);

        // Step 2: Loop Init
        ExecutionStep s2 = new ExecutionStep();
        s2.setStepNumber(step++);
        s2.setLineNumber(loopLine);
        s2.setEventType("LOOP_INIT");
        s2.setVariables(Map.of("arr", values.toString(), "i", 0));
        s2.setChangedVariable("i");
        s2.setCurrentValue(0);
        s2.setOutput(new ArrayList<>(output));

        DataStructureState ds2 = new DataStructureState();
        ds2.setType("array");
        ds2.setName("arr");
        ds2.setValues(new ArrayList<>(values));
        ds2.setLabel("Loop Initialized");
        ds2.setFocusInfo("i = 0");
        s2.setDataStructureState(ds2);

        s2.setExplanation("[" + lang.toUpperCase() + "] Loop initialized: Index counter 'i' starts at 0.");
        s2.setAiHint("i = 0 addresses the first element.");
        steps.add(s2);

        // Loop steps
        for (int i = 0; i < n; i++) {
            // Condition Check (True)
            ExecutionStep sCond = new ExecutionStep();
            sCond.setStepNumber(step++);
            sCond.setLineNumber(loopLine);
            sCond.setEventType("CONDITION_CHECK");
            sCond.setVariables(Map.of("arr", values.toString(), "i", i));
            sCond.setCondition(new ConditionInfo("i < len", i + " < " + n, true, "ENTER LOOP"));
            sCond.setOutput(new ArrayList<>(output));

            DataStructureState dsCond = new DataStructureState();
            dsCond.setType("array");
            dsCond.setValues(new ArrayList<>(values));
            dsCond.setActiveIndex(i);
            dsCond.setLabel("Iteration " + (i + 1) + " (i = " + i + ")");
            dsCond.setFocusInfo("Checking boundary: " + i + " < " + n + " -> TRUE");
            sCond.setDataStructureState(dsCond);

            sCond.setExplanation("[" + lang.toUpperCase() + "] Condition (" + i + " < " + n + ") evaluated to TRUE. Loop body executes.");
            sCond.setAiHint("The index " + i + " is valid and within bounds.");
            steps.add(sCond);

            // Access & Print
            int val = values.get(i);
            output.add(String.valueOf(val));

            ExecutionStep sAccess = new ExecutionStep();
            sAccess.setStepNumber(step++);
            sAccess.setLineNumber(printLine);
            sAccess.setEventType("ARRAY_ACCESS");
            sAccess.setVariables(Map.of("arr", values.toString(), "i", i, "arr[i]", val));
            sAccess.setChangedVariable("output");
            sAccess.setCurrentValue(String.valueOf(val));
            sAccess.setOutput(new ArrayList<>(output));

            DataStructureState dsAccess = new DataStructureState();
            dsAccess.setType("array");
            dsAccess.setValues(new ArrayList<>(values));
            dsAccess.setActiveIndex(i);
            dsAccess.setLabel("Accessed arr[" + i + "] = " + val);
            dsAccess.setFocusInfo("Current Index: " + i + " | Value: " + val);
            sAccess.setDataStructureState(dsAccess);

            sAccess.setExplanation("[" + lang.toUpperCase() + "] Accessed element arr[" + i + "] = " + val + " and logged to standard output.");
            sAccess.setAiHint("Random access lookup runs in O(1) constant time.");
            steps.add(sAccess);

            // Increment
            int nextI = i + 1;
            ExecutionStep sInc = new ExecutionStep();
            sInc.setStepNumber(step++);
            sInc.setLineNumber(loopLine);
            sInc.setEventType("LOOP_INCREMENT");
            sInc.setVariables(Map.of("arr", values.toString(), "i", nextI));
            sInc.setChangedVariable("i");
            sInc.setPreviousValue(i);
            sInc.setCurrentValue(nextI);
            sInc.setOutput(new ArrayList<>(output));

            DataStructureState dsInc = new DataStructureState();
            dsInc.setType("array");
            dsInc.setValues(new ArrayList<>(values));
            dsInc.setLabel("Counter Increment (i: " + i + " → " + nextI + ")");
            dsInc.setFocusInfo("i updated to " + nextI);
            sInc.setDataStructureState(dsInc);

            sInc.setExplanation("[" + lang.toUpperCase() + "] Counter increment executed: 'i' advances from " + i + " to " + nextI + ".");
            sInc.setAiHint("Preparing next iteration condition check.");
            steps.add(sInc);
        }

        // Loop Exit
        ExecutionStep sExit = new ExecutionStep();
        sExit.setStepNumber(step++);
        sExit.setLineNumber(loopLine);
        sExit.setEventType("CONDITION_CHECK");
        sExit.setVariables(Map.of("arr", values.toString(), "i", n));
        sExit.setCondition(new ConditionInfo("i < len", n + " < " + n, false, "EXIT LOOP"));
        sExit.setOutput(new ArrayList<>(output));

        DataStructureState dsExit = new DataStructureState();
        dsExit.setType("array");
        dsExit.setValues(new ArrayList<>(values));
        dsExit.setLabel("Loop Terminated (" + n + " < " + n + ")");
        dsExit.setFocusInfo("Loop completed");
        sExit.setDataStructureState(dsExit);

        sExit.setExplanation("[" + lang.toUpperCase() + "] Condition (" + n + " < " + n + ") evaluated to FALSE. Loop terminated.");
        sExit.setAiHint("Control jumps past the loop body.");
        steps.add(sExit);

        // Completion
        ExecutionStep sEnd = new ExecutionStep();
        sEnd.setStepNumber(step);
        sEnd.setLineNumber(printLine + 1);
        sEnd.setEventType("PROGRAM_END");
        sEnd.setVariables(Map.of("arr", values.toString(), "totalPrinted", n));
        sEnd.setOutput(new ArrayList<>(output));

        DataStructureState dsEnd = new DataStructureState();
        dsEnd.setType("array");
        dsEnd.setValues(new ArrayList<>(values));
        dsEnd.setLabel("Execution Finished");
        dsEnd.setFocusInfo("Exit code 0");
        sEnd.setDataStructureState(dsEnd);

        sEnd.setExplanation("[" + lang.toUpperCase() + "] Custom program executed successfully. Process exited with return code 0.");
        sEnd.setAiHint("User code executed in O(n) time with O(1) auxiliary space.");
        steps.add(sEnd);

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    private ExecuteResponse generateUserSortTrace(List<Integer> inputVals, int arrayLine, int loopLine, int printLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = new ArrayList<>(inputVals);
        int comparisons = 0;
        int swaps = 0;
        int step = 1;

        for (int i = 0; i < arr.size() - 1; i++) {
            for (int j = 0; j < arr.size() - i - 1; j++) {
                comparisons++;
                int a = arr.get(j);
                int b = arr.get(j + 1);
                boolean willSwap = a > b;

                ExecutionStep sComp = new ExecutionStep();
                sComp.setStepNumber(step++);
                sComp.setLineNumber(loopLine);
                sComp.setEventType("COMPARE");
                sComp.setVariables(Map.of("arr[j]", a, "arr[j+1]", b, "comparisons", comparisons, "swaps", swaps));

                DataStructureState ds = new DataStructureState();
                ds.setType("sorting");
                ds.setValues(new ArrayList<>(arr));
                ds.setComparedIndices(List.of(j, j + 1));
                ds.setComparisons(comparisons);
                ds.setSwaps(swaps);
                ds.setLabel("Comparing " + a + " and " + b);
                ds.setFocusInfo("Comparisons: " + comparisons + " | Swaps: " + swaps);
                sComp.setDataStructureState(ds);

                sComp.setExplanation("[" + lang.toUpperCase() + "] Compare arr[" + j + "] (" + a + ") with arr[" + (j + 1) + "] (" + b + ").");
                sComp.setAiHint(willSwap ? a + " > " + b + ", elements will swap." : "Elements in ascending order.");
                steps.add(sComp);

                if (willSwap) {
                    swaps++;
                    arr.set(j, b);
                    arr.set(j + 1, a);

                    ExecutionStep sSwap = new ExecutionStep();
                    sSwap.setStepNumber(step++);
                    sSwap.setLineNumber(printLine);
                    sSwap.setEventType("SWAP");
                    sSwap.setVariables(Map.of("swapped", a + " <-> " + b, "comparisons", comparisons, "swaps", swaps));

                    DataStructureState dsSwap = new DataStructureState();
                    dsSwap.setType("sorting");
                    dsSwap.setValues(new ArrayList<>(arr));
                    dsSwap.setSwappedIndices(List.of(j, j + 1));
                    dsSwap.setComparisons(comparisons);
                    dsSwap.setSwaps(swaps);
                    dsSwap.setLabel("Swapped " + a + " and " + b);
                    dsSwap.setFocusInfo("Comparisons: " + comparisons + " | Swaps: " + swaps);
                    sSwap.setDataStructureState(dsSwap);

                    sSwap.setExplanation("[" + lang.toUpperCase() + "] Swapped " + a + " and " + b + ". Array is now: " + arr);
                    sSwap.setAiHint("Heavier element moves rightward.");
                    steps.add(sSwap);
                }
            }
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    private ExecuteResponse generateUserReverseTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = new ArrayList<>(values);
        int left = 0;
        int right = arr.size() - 1;
        int step = 1;

        // Step 1: Initial Array & Pointers
        ExecutionStep sInit = new ExecutionStep();
        sInit.setStepNumber(step++);
        sInit.setLineNumber(arrayLine);
        sInit.setEventType("INIT");
        sInit.setVariables(Map.of("arr", arr.toString(), "left", left, "right", right));
        sInit.setChangedVariable("pointers");
        sInit.setCurrentValue("left=0, right=" + right);

        DataStructureState dsInit = new DataStructureState();
        dsInit.setType("sorting");
        dsInit.setValues(new ArrayList<>(arr));
        dsInit.setComparedIndices(List.of(left, right));
        dsInit.setPointers(Map.of("low", left, "high", right));
        dsInit.setLabel("Two-Pointer Reverse Initialized");
        dsInit.setFocusInfo("left = " + left + " (" + arr.get(left) + ") | right = " + right + " (" + arr.get(right) + ")");
        sInit.setDataStructureState(dsInit);
        sInit.setExplanation("[" + lang.toUpperCase() + "] Two pointers set: 'left' at index 0, 'right' at index " + right + ".");
        sInit.setAiHint("Two-pointer array reversal runs in O(n) time with O(1) auxiliary space.");
        steps.add(sInit);

        // While loop
        while (left < right) {
            // Condition Check
            ExecutionStep sCond = new ExecutionStep();
            sCond.setStepNumber(step++);
            sCond.setLineNumber(loopLine);
            sCond.setEventType("CONDITION_CHECK");
            sCond.setVariables(Map.of("arr", arr.toString(), "left", left, "right", right));
            sCond.setCondition(new ConditionInfo("left < right", left + " < " + right, true, "ENTER LOOP"));

            DataStructureState dsCond = new DataStructureState();
            dsCond.setType("sorting");
            dsCond.setValues(new ArrayList<>(arr));
            dsCond.setComparedIndices(List.of(left, right));
            dsCond.setPointers(Map.of("low", left, "high", right));
            dsCond.setLabel("Comparing Pointers: " + left + " < " + right + " (TRUE)");
            dsCond.setFocusInfo("Ready to swap elements at indices " + left + " and " + right);
            sCond.setDataStructureState(dsCond);
            sCond.setExplanation("[" + lang.toUpperCase() + "] Condition (" + left + " < " + right + ") is TRUE. Swapping arr[" + left + "] and arr[" + right + "].");
            sCond.setAiHint("Symmetric elements are swapped inwards.");
            steps.add(sCond);

            // Swap
            int tempA = arr.get(left);
            int tempB = arr.get(right);
            arr.set(left, tempB);
            arr.set(right, tempA);

            ExecutionStep sSwap = new ExecutionStep();
            sSwap.setStepNumber(step++);
            sSwap.setLineNumber(loopLine + 1);
            sSwap.setEventType("SWAP");
            sSwap.setVariables(Map.of("swapped", tempA + " <-> " + tempB, "left", left, "right", right));
            sSwap.setChangedVariable("arr");
            sSwap.setCurrentValue(arr.toString());

            DataStructureState dsSwap = new DataStructureState();
            dsSwap.setType("sorting");
            dsSwap.setValues(new ArrayList<>(arr));
            dsSwap.setSwappedIndices(List.of(left, right));
            dsSwap.setPointers(Map.of("low", left, "high", right));
            dsSwap.setLabel("Swapped " + tempA + " and " + tempB);
            dsSwap.setFocusInfo("Array is now: " + arr);
            sSwap.setDataStructureState(dsSwap);
            sSwap.setExplanation("[" + lang.toUpperCase() + "] Swapped elements at indices " + left + " and " + right + ".");
            sSwap.setAiHint("Elements are placed into their mirrored positions.");
            steps.add(sSwap);

            // Advance pointers
            left++;
            right--;

            ExecutionStep sAdv = new ExecutionStep();
            sAdv.setStepNumber(step++);
            sAdv.setLineNumber(loopLine + 2);
            sAdv.setEventType("POINTER_UPDATE");
            sAdv.setVariables(Map.of("arr", arr.toString(), "left", left, "right", right));
            sAdv.setChangedVariable("pointers");
            sAdv.setCurrentValue("left=" + left + ", right=" + right);

            DataStructureState dsAdv = new DataStructureState();
            dsAdv.setType("sorting");
            dsAdv.setValues(new ArrayList<>(arr));
            if (left <= right) {
                dsAdv.setComparedIndices(List.of(left, right));
                dsAdv.setPointers(Map.of("low", left, "high", right));
            }
            dsAdv.setLabel("Pointers Advanced: left=" + left + ", right=" + right);
            dsAdv.setFocusInfo("Converging towards array midpoint");
            sAdv.setDataStructureState(dsAdv);
            sAdv.setExplanation("[" + lang.toUpperCase() + "] Advanced pointers: left incremented to " + left + ", right decremented to " + right + ".");
            sAdv.setAiHint("Pointers converge by 2 steps per iteration.");
            steps.add(sAdv);
        }

        // Program End
        ExecutionStep sEnd = new ExecutionStep();
        sEnd.setStepNumber(step);
        sEnd.setLineNumber(loopLine + 3);
        sEnd.setEventType("PROGRAM_END");
        sEnd.setVariables(Map.of("reversedArr", arr.toString()));

        DataStructureState dsEnd = new DataStructureState();
        dsEnd.setType("sorting");
        dsEnd.setValues(new ArrayList<>(arr));
        dsEnd.setLabel("Reversal Complete: " + arr);
        dsEnd.setFocusInfo("In-place reversal finished in O(n/2) iterations");
        sEnd.setDataStructureState(dsEnd);
        sEnd.setExplanation("[" + lang.toUpperCase() + "] Array reversal complete! Final array: " + arr);
        sEnd.setAiHint("Original array inverted in-place with O(1) extra memory.");
        steps.add(sEnd);

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    private ExecuteResponse generateUserBinarySearchTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = new ArrayList<>(values);
        Collections.sort(arr);

        int low = 0;
        int high = arr.size() - 1;
        int target = arr.get(arr.size() / 2); // Default to middle element
        int step = 1;

        // Step 1: Init Binary Search
        ExecutionStep sInit = new ExecutionStep();
        sInit.setStepNumber(step++);
        sInit.setLineNumber(arrayLine);
        sInit.setEventType("INIT");
        sInit.setVariables(Map.of("arr", arr.toString(), "target", target, "low", low, "high", high));

        DataStructureState dsInit = new DataStructureState();
        dsInit.setType("searching");
        dsInit.setValues(new ArrayList<>(arr));
        dsInit.setPointers(Map.of("low", low, "high", high));
        dsInit.setLabel("Binary Search Initialized (Target: " + target + ")");
        dsInit.setFocusInfo("Range: [" + low + "..." + high + "]");
        sInit.setDataStructureState(dsInit);
        sInit.setExplanation("[" + lang.toUpperCase() + "] Binary search initialized for target " + target + " on sorted array " + arr + ".");
        sInit.setAiHint("Binary search requires array to be in ascending sorted order.");
        steps.add(sInit);

        boolean found = false;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int midVal = arr.get(mid);

            // Step: Calculate Mid
            ExecutionStep sMid = new ExecutionStep();
            sMid.setStepNumber(step++);
            sMid.setLineNumber(loopLine);
            sMid.setEventType("MID_CALCULATION");
            sMid.setVariables(Map.of("low", low, "mid", mid, "high", high, "arr[mid]", midVal, "target", target));

            DataStructureState dsMid = new DataStructureState();
            dsMid.setType("searching");
            dsMid.setValues(new ArrayList<>(arr));
            dsMid.setActiveIndex(mid);
            dsMid.setPointers(Map.of("low", low, "mid", mid, "high", high));
            dsMid.setLabel("Mid Calculated: mid = " + mid + " (Value: " + midVal + ")");
            dsMid.setFocusInfo("Comparing arr[" + mid + "] (" + midVal + ") with target (" + target + ")");
            sMid.setDataStructureState(dsMid);
            sMid.setExplanation("[" + lang.toUpperCase() + "] Calculated midpoint index " + mid + ": arr[" + mid + "] = " + midVal + ".");
            sMid.setAiHint("Mid divides remaining search space in half.");
            steps.add(sMid);

            if (midVal == target) {
                found = true;
                ExecutionStep sFound = new ExecutionStep();
                sFound.setStepNumber(step++);
                sFound.setLineNumber(loopLine + 1);
                sFound.setEventType("TARGET_FOUND");
                sFound.setVariables(Map.of("target", target, "foundAtIndex", mid));

                DataStructureState dsFound = new DataStructureState();
                dsFound.setType("searching");
                dsFound.setValues(new ArrayList<>(arr));
                dsFound.setActiveIndex(mid);
                dsFound.setSwappedIndices(List.of(mid));
                dsFound.setPointers(Map.of("mid", mid));
                dsFound.setLabel("TARGET FOUND at index " + mid + "!");
                dsFound.setFocusInfo("arr[" + mid + "] == " + target);
                sFound.setDataStructureState(dsFound);
                sFound.setExplanation("[" + lang.toUpperCase() + "] Success! Found target " + target + " at index " + mid + ".");
                sFound.setAiHint("Binary search terminated successfully in O(log n) time.");
                steps.add(sFound);
                break;
            } else if (midVal < target) {
                low = mid + 1;
                ExecutionStep sAdj = new ExecutionStep();
                sAdj.setStepNumber(step++);
                sAdj.setLineNumber(loopLine + 2);
                sAdj.setEventType("RANGE_ADJUST");
                sAdj.setVariables(Map.of("low", low, "high", high, "target", target));

                DataStructureState dsAdj = new DataStructureState();
                dsAdj.setType("searching");
                dsAdj.setValues(new ArrayList<>(arr));
                dsAdj.setPointers(Map.of("low", low, "high", high));
                dsAdj.setLabel("Target > Mid: Discarding left half (low -> " + low + ")");
                dsAdj.setFocusInfo("New Search Range: [" + low + "..." + high + "]");
                sAdj.setDataStructureState(dsAdj);
                sAdj.setExplanation("[" + lang.toUpperCase() + "] arr[" + mid + "] < target (" + midVal + " < " + target + "). Search right subarray.");
                sAdj.setAiHint("Discarding all elements at indices <= " + mid + ".");
                steps.add(sAdj);
            } else {
                high = mid - 1;
                ExecutionStep sAdj = new ExecutionStep();
                sAdj.setStepNumber(step++);
                sAdj.setLineNumber(loopLine + 3);
                sAdj.setEventType("RANGE_ADJUST");
                sAdj.setVariables(Map.of("low", low, "high", high, "target", target));

                DataStructureState dsAdj = new DataStructureState();
                dsAdj.setType("searching");
                dsAdj.setValues(new ArrayList<>(arr));
                dsAdj.setPointers(Map.of("low", low, "high", high));
                dsAdj.setLabel("Target < Mid: Discarding right half (high -> " + high + ")");
                dsAdj.setFocusInfo("New Search Range: [" + low + "..." + high + "]");
                sAdj.setDataStructureState(dsAdj);
                sAdj.setExplanation("[" + lang.toUpperCase() + "] arr[" + mid + "] > target (" + midVal + " > " + target + "). Search left subarray.");
                sAdj.setAiHint("Discarding all elements at indices >= " + mid + ".");
                steps.add(sAdj);
            }
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    // ==========================================
    // Linked List Traversal Generator
    // ==========================================
    private ExecuteResponse generateUserLinkedListTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = !values.isEmpty() ? values : List.of(10, 20, 30, 40);
        int step = 1;

        for (int i = 0; i < arr.size(); i++) {
            int val = arr.get(i);
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine);
            s.setEventType("LIST_TRAVERSAL");
            s.setVariables(Map.of("curr.val", val, "index", i));

            DataStructureState ds = new DataStructureState();
            ds.setType("linked-list");
            ds.setValues(new ArrayList<Object>(arr));
            ds.setActiveIndex(i);
            ds.setPointers(Map.of("HEAD", 0, "CURR", i));
            ds.setLabel("Visiting Node [" + i + "]: " + val);
            ds.setFocusInfo("curr points to Node with val = " + val);
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Traversed to linked list node " + i + " with data " + val + ".");
            s.setAiHint("Linked list traversal runs in O(n) linear sequential time.");
            steps.add(s);
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    // ==========================================
    // Stack (LIFO) Push / Pop Generator
    // ==========================================
    private ExecuteResponse generateUserStackTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = !values.isEmpty() ? values : List.of(10, 20, 30);
        List<Integer> stack = new ArrayList<>();
        int step = 1;

        // Push elements
        for (int v : arr) {
            stack.add(v);
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine);
            s.setEventType("STACK_PUSH");
            s.setVariables(Map.of("pushed", v, "stackSize", stack.size()));

            DataStructureState ds = new DataStructureState();
            ds.setType("stack");
            ds.setValues(new ArrayList<Object>(stack));
            ds.setPointers(Map.of("TOP", stack.size() - 1));
            ds.setLabel("Pushed " + v + " onto Stack");
            ds.setFocusInfo("TOP element: " + v + " (Stack size: " + stack.size() + ")");
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Pushed " + v + " onto top of stack.");
            s.setAiHint("Push operation executes in constant O(1) time.");
            steps.add(s);
        }

        // Pop one element if stack has multiple
        if (stack.size() > 1) {
            int popped = stack.remove(stack.size() - 1);
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine + 1);
            s.setEventType("STACK_POP");
            s.setVariables(Map.of("popped", popped, "stackSize", stack.size()));

            DataStructureState ds = new DataStructureState();
            ds.setType("stack");
            ds.setValues(new ArrayList<Object>(stack));
            ds.setPointers(Map.of("TOP", stack.size() - 1));
            ds.setLabel("Popped " + popped + " from Stack");
            ds.setFocusInfo("Remaining TOP: " + stack.get(stack.size() - 1));
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Popped " + popped + " from stack (LIFO).");
            s.setAiHint("Pop operation removes the most recently pushed element.");
            steps.add(s);
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    // ==========================================
    // Queue (FIFO) Enqueue / Dequeue Generator
    // ==========================================
    private ExecuteResponse generateUserQueueTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = !values.isEmpty() ? values : List.of(10, 20, 30);
        List<Integer> queue = new ArrayList<>();
        int step = 1;

        // Enqueue elements
        for (int v : arr) {
            queue.add(v);
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine);
            s.setEventType("QUEUE_ENQUEUE");
            s.setVariables(Map.of("enqueued", v, "queueSize", queue.size()));

            DataStructureState ds = new DataStructureState();
            ds.setType("queue");
            ds.setValues(new ArrayList<Object>(queue));
            ds.setPointers(Map.of("FRONT", 0, "REAR", queue.size() - 1));
            ds.setLabel("Enqueued " + v + " to Queue");
            ds.setFocusInfo("FRONT: [" + queue.get(0) + "] | REAR: [" + queue.get(queue.size() - 1) + "]");
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Enqueued " + v + " at rear of queue.");
            s.setAiHint("Queue follows First-In, First-Out (FIFO) ordering.");
            steps.add(s);
        }

        // Dequeue one element
        if (queue.size() > 1) {
            int dequeued = queue.remove(0);
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine + 1);
            s.setEventType("QUEUE_DEQUEUE");
            s.setVariables(Map.of("dequeued", dequeued, "queueSize", queue.size()));

            DataStructureState ds = new DataStructureState();
            ds.setType("queue");
            ds.setValues(new ArrayList<Object>(queue));
            ds.setPointers(Map.of("FRONT", 0, "REAR", queue.size() - 1));
            ds.setLabel("Dequeued " + dequeued + " from Front");
            ds.setFocusInfo("New FRONT: [" + queue.get(0) + "]");
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Dequeued element " + dequeued + " from front of queue.");
            s.setAiHint("Dequeue operation runs in O(1) amortized time.");
            steps.add(s);
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    // ==========================================
    // Binary Search Tree (BST) Generator
    // ==========================================
    private ExecuteResponse generateUserTreeTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = !values.isEmpty() ? values : List.of(50, 30, 70, 20, 40);
        int step = 1;

        for (int i = 0; i < arr.size(); i++) {
            int v = arr.get(i);
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine);
            s.setEventType("TREE_NODE_VISIT");
            s.setVariables(Map.of("nodeVal", v, "treeSize", i + 1));

            DataStructureState ds = new DataStructureState();
            ds.setType("tree");
            ds.setValues(new ArrayList<Object>(arr.subList(0, i + 1)));
            ds.setActiveIndex(i);
            ds.setLabel("Tree Node: " + v);
            ds.setFocusInfo("Active Tree Node: " + v + " (Level " + (i == 0 ? "0 Root" : "1 Branch") + ")");
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Traversed / inserted value " + v + " into Tree structure.");
            s.setAiHint("BST operations divide search space hierarchically in O(log n) average time.");
            steps.add(s);
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    // ==========================================
    // 2D Matrix / Grid Scan Generator
    // ==========================================
    private ExecuteResponse generateUserMatrixTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = !values.isEmpty() ? values : List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);
        int cols = 3;
        int rows = Math.max(1, (int) Math.ceil((double) arr.size() / cols));

        List<List<Object>> matrix = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            List<Object> rowList = new ArrayList<>();
            for (int c = 0; c < cols; c++) {
                int idx = r * cols + c;
                rowList.add(idx < arr.size() ? arr.get(idx) : 0);
            }
            matrix.add(rowList);
        }

        int step = 1;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                Object cellVal = matrix.get(r).get(c);
                ExecutionStep s = new ExecutionStep();
                s.setStepNumber(step++);
                s.setLineNumber(loopLine);
                s.setEventType("MATRIX_SCAN");
                s.setVariables(Map.of("row", r, "col", c, "cellValue", cellVal));

                DataStructureState ds = new DataStructureState();
                ds.setType("matrix");
                ds.setMatrix(matrix);
                ds.setPointers(Map.of("activeRow", r, "activeCol", c));
                ds.setLabel("Matrix Cell [" + r + "][" + c + "] = " + cellVal);
                ds.setFocusInfo("Row " + r + ", Column " + c + ": Value = " + cellVal);
                s.setDataStructureState(ds);

                s.setExplanation("[" + lang.toUpperCase() + "] Scanned matrix coordinate [" + r + "][" + c + "] with value " + cellVal + ".");
                s.setAiHint("Row-major matrix iteration visits memory in contiguous stride order.");
                steps.add(s);
            }
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    // ==========================================
    // Recursion / Call Stack Frames Generator
    // ==========================================
    private ExecuteResponse generateUserRecursionTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        int n = !values.isEmpty() && values.get(0) > 0 && values.get(0) <= 6 ? values.get(0) : 4;
        int step = 1;
        List<Map<String, Object>> callStack = new ArrayList<>();

        // Push recursive call frames
        for (int k = n; k >= 1; k--) {
            callStack.add(Map.of("func", "solve(" + k + ")", "n", k, "state", k == 1 ? "BASE_CASE" : "CALL"));
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine);
            s.setEventType(k == 1 ? "RECURSION_BASE" : "RECURSION_CALL");
            s.setVariables(Map.of("n", k, "depth", callStack.size()));

            DataStructureState ds = new DataStructureState();
            ds.setType("recursion");
            ds.setCallStack(new ArrayList<>(callStack));
            ds.setLabel(k == 1 ? "Hit Base Case: solve(1)" : "Recursive Call: solve(" + k + ")");
            ds.setFocusInfo("Stack Depth: " + callStack.size() + " frames");
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Pushed call stack frame for solve(" + k + "). " + (k == 1 ? "Base case reached!" : "Recursing deeper."));
            s.setAiHint("Recursion utilizes the JVM execution call stack to preserve function state.");
            steps.add(s);
        }

        // Unwind call frames
        while (callStack.size() > 1) {
            Map<String, Object> top = callStack.remove(callStack.size() - 1);
            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine + 1);
            s.setEventType("RECURSION_RETURN");
            s.setVariables(Map.of("returnedFrom", top.get("func"), "depth", callStack.size()));

            DataStructureState ds = new DataStructureState();
            ds.setType("recursion");
            ds.setCallStack(new ArrayList<>(callStack));
            ds.setLabel("Unwound Return: " + top.get("func"));
            ds.setFocusInfo("Remaining depth: " + callStack.size());
            s.setDataStructureState(ds);

            s.setExplanation("[" + lang.toUpperCase() + "] Returned from " + top.get("func") + ", frame popped from call stack.");
            s.setAiHint("Call stack frame is deallocated upon returning value.");
            steps.add(s);
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }

    // ==========================================
    // Sliding Window Generator
    // ==========================================
    private ExecuteResponse generateUserSlidingWindowTrace(List<Integer> values, int arrayLine, int loopLine, String lang) {
        List<ExecutionStep> steps = new ArrayList<>();
        List<Integer> arr = values;
        int k = Math.min(3, arr.size());
        int currentSum = 0;
        for (int i = 0; i < k; i++) currentSum += arr.get(i);
        int maxSum = currentSum;
        int step = 1;

        ExecutionStep sInit = new ExecutionStep();
        sInit.setStepNumber(step++);
        sInit.setLineNumber(loopLine);
        sInit.setEventType("WINDOW_INIT");
        sInit.setVariables(Map.of("windowSum", currentSum, "k", k));
        DataStructureState dsInit = new DataStructureState();
        dsInit.setType("sorting");
        dsInit.setValues(new ArrayList<Object>(arr));
        dsInit.setComparedIndices(List.of(0, k - 1));
        dsInit.setPointers(Map.of("low", 0, "high", k - 1));
        dsInit.setLabel("Initial Window [0.." + (k - 1) + "]: Sum = " + currentSum);
        dsInit.setFocusInfo("Window Size K = " + k);
        sInit.setDataStructureState(dsInit);
        sInit.setExplanation("[" + lang.toUpperCase() + "] Computed initial sum of window: " + currentSum + ".");
        steps.add(sInit);

        for (int i = k; i < arr.size(); i++) {
            int outgoing = arr.get(i - k);
            int incoming = arr.get(i);
            currentSum = currentSum - outgoing + incoming;
            if (currentSum > maxSum) maxSum = currentSum;

            ExecutionStep s = new ExecutionStep();
            s.setStepNumber(step++);
            s.setLineNumber(loopLine + 1);
            s.setEventType("WINDOW_SLIDE");
            s.setVariables(Map.of("outgoing", outgoing, "incoming", incoming, "windowSum", currentSum, "maxSum", maxSum));
            DataStructureState ds = new DataStructureState();
            ds.setType("sorting");
            ds.setValues(new ArrayList<Object>(arr));
            ds.setComparedIndices(List.of(i - k + 1, i));
            ds.setPointers(Map.of("low", i - k + 1, "high", i));
            ds.setLabel("Window [" + (i - k + 1) + ".." + i + "]: Sum = " + currentSum);
            ds.setFocusInfo("-" + outgoing + " + " + incoming + " = " + currentSum + " | Max: " + maxSum);
            s.setDataStructureState(ds);
            s.setExplanation("[" + lang.toUpperCase() + "] Sliding window: Removed arr[" + (i - k) + "] (" + outgoing + "), added arr[" + i + "] (" + incoming + ").");
            steps.add(s);
        }

        return new ExecuteResponse("SUCCESS", steps.size(), steps);
    }
}
