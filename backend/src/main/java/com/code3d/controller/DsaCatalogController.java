package com.code3d.controller;

import com.code3d.model.DsaConcept;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dsa")
public class DsaCatalogController {

    private final List<DsaConcept> concepts = List.of(
            new DsaConcept("array-loop", "1D Array Traversal", "Arrays",
                    "Iterate through a 1D array of 4 integers and print each element sequentially.",
                    "Beginner", "O(n)", "O(1)",
                    """
                    public class Main {
                        public static void main(String[] args) {
                            int[] arr = {10, 20, 30, 40};
                            for(int i = 0; i < arr.length; i++) {
                                System.out.println(arr[i]);
                            }
                        }
                    }
                    """),

            new DsaConcept("2d-array", "2D Matrix Scan", "Arrays",
                    "Traverse a 3x3 matrix in row-major order.",
                    "Beginner", "O(n × m)", "O(n × m)",
                    """
                    public class Main {
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
                    }
                    """),

            new DsaConcept("linked-list", "Singly Linked List", "Linked Lists",
                    "Traverse singly linked nodes connected via next object references.",
                    "Intermediate", "O(n)", "O(n)",
                    """
                    class Node {
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
                    }
                    """),

            new DsaConcept("stack", "Stack (LIFO)", "Linear Structures",
                    "Demonstrate Push, Pop, and Peek operations with TOP pointer.",
                    "Beginner", "O(1)", "O(n)",
                    """
                    import java.util.Stack;
                    public class Main {
                        public static void main(String[] args) {
                            Stack<Integer> stack = new Stack<>();
                            stack.push(10);
                            stack.push(20);
                            stack.push(30);
                            int top = stack.peek();
                            int popped = stack.pop();
                        }
                    }
                    """),

            new DsaConcept("queue", "Queue (FIFO)", "Linear Structures",
                    "Demonstrate Enqueue and Dequeue operations with FRONT and REAR pointers.",
                    "Beginner", "O(1)", "O(n)",
                    """
                    import java.util.LinkedList;
                    import java.util.Queue;
                    public class Main {
                        public static void main(String[] args) {
                            Queue<Integer> queue = new LinkedList<>();
                            queue.add(10);
                            queue.add(20);
                            queue.add(30);
                            int head = queue.poll();
                        }
                    }
                    """),

            new DsaConcept("bst", "Binary Search Tree Search", "Trees",
                    "Search for target 40 in a Binary Search Tree in O(log n) time.",
                    "Intermediate", "O(log n)", "O(n)",
                    """
                    class TreeNode {
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
                    }
                    """),

            new DsaConcept("bubble-sort", "Bubble Sort Algorithm", "Sorting",
                    "Compare adjacent elements and swap them if in descending order.",
                    "Intermediate", "O(n²)", "O(1)",
                    """
                    public class Main {
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
                    }
                    """),

            new DsaConcept("binary-search", "Binary Search Algorithm", "Searching",
                    "Locate target 50 in sorted array by halving search range with low, mid, high.",
                    "Intermediate", "O(log n)", "O(1)",
                    """
                    public class Main {
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
                    }
                    """),

            new DsaConcept("recursion", "Call Stack & Recursion (Factorial)", "Recursion",
                    "Visualize recursive call stack frames pushing CALL and unwinding RETURN.",
                    "Intermediate", "O(n)", "O(n)",
                    """
                    public class Main {
                        public static int factorial(int n) {
                            if(n <= 1) return 1;
                            return n * factorial(n - 1);
                        }
                        public static void main(String[] args) {
                            int result = factorial(4);
                        }
                    }
                    """)
    );

    @GetMapping("/concepts")
    public ResponseEntity<List<DsaConcept>> getConcepts() {
        return ResponseEntity.ok(concepts);
    }
}
