/**
 * Catalog of all 9 DSA Concepts with curated Java source code
 */

export const DEFAULT_JAVA_CODE = `public class Main {
    public static void main(String[] args) {

        int[] arr = {10, 20, 30, 40};

        for(int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}`;

export const SAMPLE_PROGRAMS = [
  {
    id: 'array-loop',
    title: '1. 1D Array Traversal',
    category: 'Arrays',
    description: 'Iterate through a 1D array of 4 integers and print each element.',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: DEFAULT_JAVA_CODE,
  },
  {
    id: 'matrix',
    title: '2. 2D Matrix Scan',
    category: 'Arrays',
    description: 'Traverse a 3x3 matrix in row-major order with nested loops.',
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
                System.out.println(matrix[r][c]);
            }
        }
    }
}`,
  },
  {
    id: 'linked-list',
    title: '3. Singly Linked List',
    category: 'Linked Lists',
    description: 'Traverse singly linked nodes connected via next object references.',
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
            System.out.println(curr.val);
            curr = curr.next;
        }
    }
}`,
  },
  {
    id: 'stack',
    title: '4. Stack (LIFO)',
    category: 'Linear Structures',
    description: 'Demonstrate Push, Pop, and Peek operations with TOP pointer.',
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
    }
}`,
  },
  {
    id: 'queue',
    title: '5. Queue (FIFO)',
    category: 'Linear Structures',
    description: 'Demonstrate Enqueue and Dequeue operations with FRONT and REAR pointers.',
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
        int head = queue.poll();
    }
}`,
  },
  {
    id: 'bst',
    title: '6. Binary Search Tree (BST)',
    category: 'Trees',
    description: 'Search for target 40 in a Binary Search Tree in O(log n) time.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
public class Main {
    public static void main(String[] args) {
        TreeNode root = new TreeNode(50);
        root.left = new TreeNode(30);
        root.right = new TreeNode(70);
        root.left.right = new TreeNode(40);
        int target = 40;
    }
}`,
  },
  {
    id: 'bubble-sort',
    title: '7. Bubble Sort Algorithm',
    category: 'Sorting',
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
    }
}`,
  },
  {
    id: 'binary-search',
    title: '8. Binary Search Algorithm',
    category: 'Searching',
    description: 'Locate target 50 in sorted array by halving search range with low, mid, high.',
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
            if(arr[mid] == target) break;
            else if(arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
    }
}`,
  },
  {
    id: 'recursion',
    title: '9. Call Stack & Recursion',
    category: 'Recursion',
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
    }
}`,
  },
  {
    id: 'doubly-linked-list',
    title: '10. Doubly Linked List',
    category: 'Linked Lists',
    description: 'Bidirectional nodes with forward (next) and backward (prev) pointer links.',
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
    }
}`,
  },
  {
    id: 'parentheses-stack',
    title: '11. Balanced Parentheses',
    category: 'Stacks',
    description: 'Validate bracket balance by pushing openers and popping on matching closers.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `import java.util.Stack;
public class Main {
    public static void main(String[] args) {
        String expr = "{[()]}";
        Stack<Character> stack = new Stack<>();
        for(char ch : expr.toCharArray()) {
            if(ch == '{' || ch == '[' || ch == '(') stack.push(ch);
            else if(!stack.isEmpty()) stack.pop();
        }
    }
}`,
  },
  {
    id: 'circular-queue',
    title: '12. Circular Ring Queue',
    category: 'Queues',
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
        // Dequeue
        int val = q[front]; front = (front + 1) % capacity;
    }
}`,
  },
  {
    id: 'tree-traversals',
    title: '13. Tree Traversals (BFS & DFS)',
    category: 'Trees',
    description: 'Visit tree nodes in In-Order (Left-Root-Right) producing sorted values.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    code: `class TNode {
    int val; TNode left, right;
    TNode(int v) { val = v; }
}
public class Main {
    public static void inOrder(TNode root) {
        if(root == null) return;
        inOrder(root.left);
        System.out.println(root.val);
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
    title: '14. AVL Tree Self-Balancing',
    category: 'Trees',
    description: 'Maintain |Balance Factor| <= 1 via Right and Left rotations.',
    difficulty: 'Advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    code: `public class Main {
    // Inserts 30, 20, 10 causing LL imbalance
    // Right Rotation resolves to balanced root 20
    public static void main(String[] args) {
        int root = 30;
        int left = 20;
        int leftLeft = 10;
        // Balance factor = +2 -> Rotate Right
    }
}`,
  },
  {
    id: 'graph-bfs',
    title: '15. Graph BFS Traversal',
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
    }
}`,
  },
  {
    id: 'dp-knapsack',
    title: '16. DP: 0/1 Knapsack',
    category: 'Dynamic Programming',
    description: 'Build 2D state matrix maximizing item value within capacity bound.',
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
    }
}`,
  },
  {
    id: 'hash-table',
    title: '17. Hash Table Collision Chaining',
    category: 'Hashing',
    description: 'Resolve hash collisions using separate chaining linked nodes.',
    difficulty: 'Intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    code: `public class Main {
    public static void main(String[] args) {
        int capacity = 5;
        // Keys 12, 22, 42 hash to bucket 2: collision resolved via chaining
        int k1 = 12 % 5; // 2
        int k2 = 22 % 5; // 2 (Chained)
        int k3 = 35 % 5; // 0
        int k4 = 42 % 5; // 2 (Chained)
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

