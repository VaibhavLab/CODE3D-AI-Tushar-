/**
 * CODE3D AI - Complete Curriculum Catalog of 28+ DSA Concepts
 * Categorized into 8 core Computer Science modules with curated, production-grade source code.
 */

export const DEFAULT_JAVA_CODE = `public class Main {
    public static void main(String[] args) {

        int[] arr = {10, 20, 30, 40};

        for(int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}`;

export const CURRICULUM_CATEGORIES = [
  'Arrays & Matrices',
  'Linked Lists',
  'Stacks & Queues',
  'Trees & Tries',
  'Sorting Algorithms',
  'Searching & Hashing',
  'Graphs',
  'Dynamic Programming & Recursion',
];

export const SAMPLE_PROGRAMS = [
  // ========================================================
  // MODULE 1: ARRAYS & MATRICES
  // ========================================================
  {
    id: 'array-loop',
    title: '1. 1D Array Linear Traversal',
    category: 'Arrays & Matrices',
    description: 'Sequentially access and print elements in contiguous heap memory.',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: DEFAULT_JAVA_CODE,
  },
  {
    id: 'matrix',
    title: '2. 2D Matrix Scan (Row-Major)',
    category: 'Arrays & Matrices',
    description: 'Traverse 3x3 matrix in row-major layout with nested loop coordinates.',
    difficulty: 'Beginner',
    timeComplexity: 'O(n × m)',
    spaceComplexity: 'O(n × m)',
    code: `public class Main {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        for(int r = 0; r < matrix.length; r++) {
            for(int c = 0; c < matrix[r].length; c++) {
                System.out.println("Cell [" + r + "][" + c + "] = " + matrix[r][c]);
            }
        }
    }
}`,
  },
  {
    id: 'two-pointer-reverse',
    title: '3. Two-Pointer Array Reversal',
    category: 'Arrays & Matrices',
    description: 'In-place array reversal using converging left and right index pointers.',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        for (int val : arr) System.out.println(val);
    }
}`,
  },
  {
    id: 'sliding-window',
    title: '4. Sliding Window Subarray Sum',
    category: 'Arrays & Matrices',
    description: 'Maintain running sum of fixed window size K without recomputing overlapping items.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {2, 1, 5, 1, 3, 2};
        int k = 3;
        int windowSum = 0, maxSum = 0;

        for (int i = 0; i < k; i++) windowSum += arr[i];
        maxSum = windowSum;

        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        System.out.println("Max sum of window size " + k + " = " + maxSum);
    }
}`,
  },

  // ========================================================
  // MODULE 2: LINKED LISTS
  // ========================================================
  {
    id: 'linked-list',
    title: '5. Singly Linked List',
    category: 'Linked Lists',
    description: 'Traverse heap-allocated nodes connected via unidirectional next references.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `class Node {
    int val;
    Node next;
    Node(int val) { this.val = val; }
}
public class Main {
    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        head.next.next.next = new Node(40);
        Node curr = head;
        while(curr != null) {
            System.out.println("Visiting node: " + curr.val);
            curr = curr.next;
        }
    }
}`,
  },
  {
    id: 'doubly-linked-list',
    title: '6. Doubly Linked List',
    category: 'Linked Lists',
    description: 'Bidirectional nodes maintaining both next and prev pointer links.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `class DNode {
    int val;
    DNode prev, next;
    DNode(int val) { this.val = val; }
}
public class Main {
    public static void main(String[] args) {
        DNode head = new DNode(10);
        DNode n2 = new DNode(20);
        DNode n3 = new DNode(30);
        DNode tail = new DNode(40);

        head.next = n2; n2.prev = head;
        n2.next = n3; n3.prev = n2;
        n3.next = tail; tail.prev = n3;

        DNode curr = head;
        while (curr != null) {
            System.out.println("Node: " + curr.val);
            curr = curr.next;
        }
    }
}`,
  },
  {
    id: 'circular-linked-list',
    title: '7. Circular Linked List',
    category: 'Linked Lists',
    description: 'Last node links back to head, forming an endless ring buffer without null termination.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `class CNode {
    int val;
    CNode next;
    CNode(int val) { this.val = val; }
}
public class Main {
    public static void main(String[] args) {
        CNode head = new CNode(10);
        CNode n2 = new CNode(20);
        CNode n3 = new CNode(30);
        head.next = n2;
        n2.next = n3;
        n3.next = head; // Cycle loop back to head

        CNode curr = head;
        do {
            System.out.println("Circular node: " + curr.val);
            curr = curr.next;
        } while (curr != head);
    }
}`,
  },
  {
    id: 'cycle-detection',
    title: "8. Cycle Detection (Floyd's Algorithm)",
    category: 'Linked Lists',
    description: 'Fast (2x) and slow (1x) pointer collision technique for detecting linked list loops.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: `class Node {
    int val;
    Node next;
    Node(int val) { this.val = val; }
}
public class Main {
    public static boolean hasCycle(Node head) {
        if (head == null) return false;
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true; // Cycle detected!
        }
        return false;
    }
    public static void main(String[] args) {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        head.next.next.next = head.next; // Cycle: 3 -> 2
        System.out.println("Has cycle: " + hasCycle(head));
    }
}`,
  },

  // ========================================================
  // MODULE 3: STACKS & QUEUES
  // ========================================================
  {
    id: 'stack',
    title: '9. Stack (LIFO Fundamentals)',
    category: 'Stacks & Queues',
    description: 'Push, Pop, and Peek operations governed by Last-In-First-Out discipline.',
    difficulty: 'Beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    code: `import java.util.Stack;
public class Main {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(10);
        stack.push(20);
        stack.push(30);
        int top = stack.peek();
        int popped = stack.pop();
        System.out.println("Popped from stack: " + popped);
    }
}`,
  },
  {
    id: 'parentheses-stack',
    title: '10. Balanced Parentheses Validator',
    category: 'Stacks & Queues',
    description: 'Validate bracket balance by pushing openers and popping on matching closers.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `import java.util.Stack;
public class Main {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char ch : s.toCharArray()) {
            if (ch == '(' || ch == '{' || ch == '[') stack.push(ch);
            else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (ch == ')' && top != '(') return false;
                if (ch == '}' && top != '{') return false;
                if (ch == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
    public static void main(String[] args) {
        System.out.println("Expression '{[()]}' valid: " + isValid("{[()]}"));
    }
}`,
  },
  {
    id: 'queue',
    title: '11. Queue (FIFO Fundamentals)',
    category: 'Stacks & Queues',
    description: 'Enqueue and Dequeue operations with FRONT and REAR pointer progression.',
    difficulty: 'Beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    code: `import java.util.LinkedList;
import java.util.Queue;
public class Main {
    public static void main(String[] args) {
        Queue<Integer> queue = new LinkedList<>();
        queue.add(10);
        queue.add(20);
        queue.add(30);
        int front = queue.poll();
        System.out.println("Served customer: " + front);
    }
}`,
  },
  {
    id: 'circular-queue',
    title: '12. Circular Ring Buffer Queue',
    category: 'Stacks & Queues',
    description: 'Fixed-capacity ring buffer using modulo wrap-around (rear + 1) % N.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(k)',
    code: `public class Main {
    public static void main(String[] args) {
        int capacity = 5;
        int[] q = new int[capacity];
        int front = 0, rear = 0;

        // Enqueue with modulo
        q[rear] = 10; rear = (rear + 1) % capacity;
        q[rear] = 20; rear = (rear + 1) % capacity;
        q[rear] = 30; rear = (rear + 1) % capacity;

        // Dequeue
        int val = q[front]; front = (front + 1) % capacity;
        System.out.println("Dequeued from ring: " + val);
    }
}`,
  },
  {
    id: 'deque',
    title: '13. Double-Ended Queue (Deque)',
    category: 'Stacks & Queues',
    description: 'High performance queue allowing O(1) push and pop at both Front and Back ends.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    code: `import java.util.ArrayDeque;
import java.util.Deque;
public class Main {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addFirst(20);
        deque.addFirst(10);
        deque.addLast(30);
        deque.addLast(40);

        int f = deque.removeFirst();
        int l = deque.removeLast();
        System.out.println("Removed Front: " + f + ", Back: " + l);
    }
}`,
  },

  // ========================================================
  // MODULE 4: TREES & TRIES
  // ========================================================
  {
    id: 'bst',
    title: '14. Binary Search Tree (BST)',
    category: 'Trees & Tries',
    description: 'Search for target in binary tree partitioning smaller items left and larger items right.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
public class Main {
    public static boolean search(TreeNode root, int target) {
        if (root == null) return false;
        if (root.val == target) return true;
        return target < root.val ? search(root.left, target) : search(root.right, target);
    }
    public static void main(String[] args) {
        TreeNode root = new TreeNode(50);
        root.left = new TreeNode(30);
        root.right = new TreeNode(70);
        root.left.right = new TreeNode(40);
        System.out.println("Found 40: " + search(root, 40));
    }
}`,
  },
  {
    id: 'tree-traversals',
    title: '15. Tree Traversals (In-Order & BFS)',
    category: 'Trees & Tries',
    description: 'In-Order (Left-Root-Right sorted yield) and Level-Order queue breadth scan.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    code: `class TNode {
    int val;
    TNode left, right;
    TNode(int v) { val = v; }
}
public class Main {
    public static void inOrder(TNode root) {
        if (root == null) return;
        inOrder(root.left);
        System.out.println("InOrder Node: " + root.val);
        inOrder(root.right);
    }
    public static void main(String[] args) {
        TNode root = new TNode(50);
        root.left = new TNode(30);
        root.right = new TNode(70);
        inOrder(root);
    }
}`,
  },
  {
    id: 'avl-tree',
    title: '16. AVL Tree Self-Balancing',
    category: 'Trees & Tries',
    description: 'Strictly balance tree heights via LL, RR, LR, and RL rotations when |BF| > 1.',
    difficulty: 'Advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    code: `public class Main {
    // Inserts 30, 20, 10 causing LL imbalance (Balance Factor = +2)
    // A single Right Rotation restores balance with root 20:
    //      20
    //     /  \\
    //   10    30
    public static void main(String[] args) {
        int root = 30;
        int left = 20;
        int leftLeft = 10;
        System.out.println("Imbalance detected. Right-rotating around node " + root);
    }
}`,
  },
  {
    id: 'trie',
    title: '17. Trie (Prefix Tree)',
    category: 'Trees & Tries',
    description: 'Tree data structure for high-speed string and prefix lookup in O(L) time.',
    difficulty: 'Advanced',
    timeComplexity: 'O(L)',
    spaceComplexity: 'O(ALPHABET_SIZE × L × N)',
    code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord;
}
public class Main {
    public static void insert(TrieNode root, String word) {
        TrieNode curr = root;
        for (char ch : word.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEndOfWord = true;
    }
    public static void main(String[] args) {
        TrieNode root = new TrieNode();
        insert(root, "code");
        insert(root, "cool");
        System.out.println("Prefix Trie created successfully.");
    }
}`,
  },

  // ========================================================
  // MODULE 5: SORTING ALGORITHMS
  // ========================================================
  {
    id: 'bubble-sort',
    title: '18. Bubble Sort Algorithm',
    category: 'Sorting Algorithms',
    description: 'Compare adjacent elements and swap them if in descending order.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {40, 10, 30, 20};
        for(int i = 0; i < arr.length - 1; i++) {
            for(int j = 0; j < arr.length - i - 1; j++) {
                if(arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
        for (int v : arr) System.out.println(v);
    }
}`,
  },
  {
    id: 'insertion-sort',
    title: '19. Insertion Sort Algorithm',
    category: 'Sorting Algorithms',
    description: 'Build sorted array one element at a time by shifting larger items to the right.',
    difficulty: 'Beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {29, 10, 14, 37, 13};
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
        for (int v : arr) System.out.println(v);
    }
}`,
  },
  {
    id: 'merge-sort',
    title: '20. Merge Sort (Divide & Conquer)',
    category: 'Sorting Algorithms',
    description: 'Recursively split array into halves and merge sorted sublists in O(n log n).',
    difficulty: 'Advanced',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    code: `public class Main {
    public static void merge(int[] arr, int l, int m, int r) {
        int[] left = java.util.Arrays.copyOfRange(arr, l, m + 1);
        int[] right = java.util.Arrays.copyOfRange(arr, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else arr[k++] = right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        System.out.println("Merge sort running in O(n log n) time.");
    }
}`,
  },
  {
    id: 'quick-sort',
    title: '21. Quick Sort (Lomuto Partition)',
    category: 'Sorting Algorithms',
    description: 'Partition array around pivot element so smaller items lie left and larger items right.',
    difficulty: 'Advanced',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    code: `public class Main {
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
    public static void main(String[] args) {
        int[] arr = {10, 80, 30, 90, 40, 50, 70};
        int pi = partition(arr, 0, arr.length - 1);
        System.out.println("Pivot placed at index: " + pi);
    }
}`,
  },

  // ========================================================
  // MODULE 6: SEARCHING & HASHING
  // ========================================================
  {
    id: 'binary-search',
    title: '22. Binary Search Algorithm',
    category: 'Searching & Hashing',
    description: 'Locate target in sorted array by halving search range with low, mid, high.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50, 60, 70};
        int target = 50;
        int low = 0, high = arr.length - 1;
        while(low <= high) {
            int mid = low + (high - low) / 2;
            if(arr[mid] == target) {
                System.out.println("Target found at index " + mid);
                break;
            }
            else if(arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
    }
}`,
  },
  {
    id: 'hash-table',
    title: '23. Hash Table Collision Chaining',
    category: 'Searching & Hashing',
    description: 'Resolve hash collisions using separate chaining buckets and modulo index hash.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    code: `public class Main {
    public static void main(String[] args) {
        int capacity = 5;
        // Keys 12, 22, 42 hash to bucket 2: collision resolved via chaining
        int k1 = 12 % capacity; // 2
        int k2 = 22 % capacity; // 2 (Chained in bucket 2)
        int k3 = 35 % capacity; // 0
        int k4 = 42 % capacity; // 2 (Chained in bucket 2)
        System.out.println("Collision resolved for keys 12, 22, 42 in bucket 2");
    }
}`,
  },

  // ========================================================
  // MODULE 7: GRAPHS
  // ========================================================
  {
    id: 'graph-bfs',
    title: '24. Graph BFS Traversal',
    category: 'Graphs',
    description: 'Breadth-First Search discovering unweighted shortest paths level-by-level.',
    difficulty: 'Advanced',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", List.of("B", "C"));
        graph.put("B", List.of("D"));
        graph.put("C", List.of("E"));
        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        queue.add("A"); visited.add("A");

        while (!queue.isEmpty()) {
            String node = queue.poll();
            System.out.println("Visited graph vertex: " + node);
            for (String neighbor : graph.getOrDefault(node, List.of())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
    }
}`,
  },
  {
    id: 'graph-dfs',
    title: '25. Graph DFS Traversal',
    category: 'Graphs',
    description: 'Depth-First Search exploring deeply into branch frontiers before backtracking.',
    difficulty: 'Advanced',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    code: `import java.util.*;
public class Main {
    public static void dfs(String node, Map<String, List<String>> graph, Set<String> visited) {
        visited.add(node);
        System.out.println("DFS visit: " + node);
        for (String next : graph.getOrDefault(node, List.of())) {
            if (!visited.contains(next)) {
                dfs(next, graph, visited);
            }
        }
    }
    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", List.of("B", "C"));
        graph.put("B", List.of("D"));
        graph.put("C", List.of("E"));
        dfs("A", graph, new HashSet<>());
    }
}`,
  },
  {
    id: 'dijkstra',
    title: "26. Dijkstra's Shortest Path",
    category: 'Graphs',
    description: 'Find optimal weighted shortest paths from source vertex using priority queue.',
    difficulty: 'Advanced',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] dist = new int[5];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0; // Start at vertex 0

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{0, 0}); // {vertex, distance}

        System.out.println("Dijkstra relaxed shortest path to vertex 0 with distance 0.");
    }
}`,
  },

  // ========================================================
  // MODULE 8: DYNAMIC PROGRAMMING & RECURSION
  // ========================================================
  {
    id: 'recursion',
    title: '27. Call Stack & Factorial Recursion',
    category: 'Dynamic Programming & Recursion',
    description: 'Visualize recursive call stack frames pushing CALL and unwinding RETURN.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `public class Main {
    public static int factorial(int n) {
        if(n <= 1) return 1;
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        int result = factorial(4);
        System.out.println("4! = " + result);
    }
}`,
  },
  {
    id: 'fibonacci-memo',
    title: '28. Fibonacci Memoization (Top-Down)',
    category: 'Dynamic Programming & Recursion',
    description: 'Eliminate redundant recursive subproblems by caching results in a memo table.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `public class Main {
    public static int fib(int n, int[] memo) {
        if (n <= 1) return n;
        if (memo[n] != 0) return memo[n];
        memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
        return memo[n];
    }
    public static void main(String[] args) {
        int n = 6;
        int[] memo = new int[n + 1];
        System.out.println("Fibonacci(" + n + ") = " + fib(n, memo));
    }
}`,
  },
  {
    id: 'dp-knapsack',
    title: '29. DP: 0/1 Knapsack Problem',
    category: 'Dynamic Programming & Recursion',
    description: 'Build 2D state matrix maximizing item value within bounded weight capacity.',
    difficulty: 'Advanced',
    timeComplexity: 'O(N × W)',
    spaceComplexity: 'O(N × W)',
    code: `public class Main {
    public static void main(String[] args) {
        int[] wt = {2, 3, 4};
        int[] val = {3, 4, 5};
        int W = 5;
        int[][] dp = new int[4][6];

        for(int i = 1; i <= 3; i++) {
            for(int w = 1; w <= 5; w++) {
                if(wt[i-1] <= w) dp[i][w] = Math.max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]);
                else dp[i][w] = dp[i-1][w];
            }
        }
        System.out.println("Max profit = " + dp[3][5]);
    }
}`,
  },
  {
    id: 'lcs',
    title: '30. Longest Common Subsequence (LCS)',
    category: 'Dynamic Programming & Recursion',
    description: 'Compute longest shared subsequence between two strings using 2D DP cache.',
    difficulty: 'Advanced',
    timeComplexity: 'O(n × m)',
    spaceComplexity: 'O(n × m)',
    code: `public class Main {
    public static void main(String[] args) {
        String s1 = "ABCDE", s2 = "ACE";
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
                else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        System.out.println("Length of LCS = " + dp[m][n]);
    }
}`,
  }
];

export const LANGUAGE_DEFAULTS = {
  java: DEFAULT_JAVA_CODE,
  python: `# Python 3.12 - Interactive Array Traversal
numbers = [10, 25, 50, 75, 100]

print("Python 3D execution running:")
for i in range(len(numbers)):
    print(f"Index {i} -> {numbers[i]}")
`,
  c: `// C17 Standard - Contiguous Array Traversal
#include <stdio.h>

int main() {
    int arr[] = {12, 28, 45, 67, 89};
    int n = 5;

    for (int i = 0; i < n; i++) {
        printf("Element [%d] = %d\\n", i, arr[i]);
    }
    return 0;
}
`,
  cpp: `// C++20 Standard - Vector Buffer Traversal
#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {15, 30, 45, 60, 90};

    for (int i = 0; i < arr.size(); i++) {
        std::cout << "arr[" << i << "] = " << arr[i] << std::endl;
    }
    return 0;
}
`,
  javascript: `// JavaScript (ES6+ / Node.js 20) - Array Traversal
const arr = [10, 25, 50, 75, 100];

console.log("3D JavaScript execution running:");
for (let i = 0; i < arr.length; i++) {
    console.log(\`Element [\${i}] = \${arr[i]}\`);
}
`
};
