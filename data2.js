// DSA Master - Problem Database Part 2 (Stack, Binary Search, Linked List)
// Problems 21-50
window.DSA_PROBLEMS_2 = [
    // STACK
    {
        id: 21, title: "Valid Parentheses", category: "Stack", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Stack", "String"],
        description: "Given a string containing just '(', ')', '{', '}', '[', ']', determine if the input string is valid.",
        examples: [{ input: 's = "()[]{}"', output: "true" }, { input: 's = "(]"', output: "false" }],
        constraints: ["1 <= s.length <= 10^4"],
        explanation: "Push opening brackets onto stack. For closing brackets, check if stack top matches. Stack must be empty at end.",
        approach: "Use stack. Push opening brackets. For closing, check top matches. Return stack.empty() at end.",
        code: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char,char> match = {{')', '('}, {']', '['}, {'}', '{'}};
        for (char c : s) {
            if (match.count(c)) {
                if (st.empty() || st.top() != match[c]) return false;
                st.pop();
            } else st.push(c);
        }
        return st.empty();
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=WTzjTskDFMg"
    },

    {
        id: 22, title: "Min Stack", category: "Stack", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Stack", "Design"],
        description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
        examples: [{ input: "push(-2),push(0),push(-3),getMin(),pop(),top(),getMin()", output: "-3, 0, -2" }],
        constraints: ["Methods pop, top and getMin always called on non-empty stacks"],
        explanation: "Use two stacks: one for values, one for minimums. The min stack tracks the minimum at each level.",
        approach: "Maintain a parallel minStack. On push, push min(val, minStack.top()). On pop, pop both stacks.",
        code: `class MinStack {
    stack<int> st, minSt;
public:
    void push(int val) {
        st.push(val);
        minSt.push(minSt.empty() ? val : min(val, minSt.top()));
    }
    void pop() { st.pop(); minSt.pop(); }
    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};`,
        timeComplexity: "O(1) all ops", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=qkLl7nAwDPo"
    },

    {
        id: 23, title: "Evaluate Reverse Polish Notation", category: "Stack", difficulty: "Medium",
        sources: ["Neetcode 150"], tags: ["Stack", "Math"],
        description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation.",
        examples: [{ input: 'tokens = ["2","1","+","3","*"]', output: "9", explanation: "((2+1)*3)=9" }],
        constraints: ["1 <= tokens.length <= 10^4"],
        explanation: "Use a stack. Push numbers. When operator found, pop two operands, compute result, push back.",
        approach: "Iterate tokens. If number, push to stack. If operator, pop b then a, push a op b.",
        code: `class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<long long> st;
        for (const string& t : tokens) {
            if (t=="+"||t=="-"||t=="*"||t=="/") {
                long long b=st.top();st.pop();
                long long a=st.top();st.pop();
                if(t=="+") st.push(a+b);
                else if(t=="-") st.push(a-b);
                else if(t=="*") st.push(a*b);
                else st.push(a/b);
            } else st.push(stoll(t));
        }
        return st.top();
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=iu0082c4HDE"
    },

    {
        id: 24, title: "Daily Temperatures", category: "Stack", difficulty: "Medium",
        sources: ["Neetcode 150", "Google Fav"], tags: ["Stack", "Monotonic Stack"],
        description: "Given daily temperatures, return array where answer[i] is days until a warmer temperature.",
        examples: [{ input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" }],
        constraints: ["1 <= temperatures.length <= 10^5"],
        explanation: "Use a monotonic decreasing stack of indices. When current temp > stack top temp, pop and record the difference.",
        approach: "Stack stores indices. For each temp, while stack top has lower temp, pop and set answer[top] = i - top.",
        code: `class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> answer(n, 0);
        stack<int> st;
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                answer[st.top()] = i - st.top();
                st.pop();
            }
            st.push(i);
        }
        return answer;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=cTBiBSnjO3c"
    },

    {
        id: 25, title: "Largest Rectangle in Histogram", category: "Stack", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Stack", "Monotonic Stack"],
        description: "Given histogram bar heights, find the area of the largest rectangle.",
        examples: [{ input: "heights = [2,1,5,6,2,3]", output: "10" }],
        constraints: ["1 <= heights.length <= 10^5"],
        explanation: "Use monotonic increasing stack. When shorter bar found, pop and calculate area with popped bar as height.",
        approach: "Push indices with increasing heights. On shorter bar, pop and compute area. Process remaining at end.",
        code: `class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st;
        int maxArea = 0, n = heights.size();
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!st.empty() && h < heights[st.top()]) {
                int height = heights[st.top()]; st.pop();
                int width = st.empty() ? i : (i - st.top() - 1);
                maxArea = max(maxArea, height * width);
            }
            st.push(i);
        }
        return maxArea;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=zx5Sw9130L0"
    },

    // BINARY SEARCH
    {
        id: 26, title: "Binary Search", category: "Binary Search", difficulty: "Easy",
        sources: ["Neetcode 150"], tags: ["Binary Search", "Array"],
        description: "Given a sorted array and a target, return the index of target or -1.",
        examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
        constraints: ["1 <= nums.length <= 10^4", "All integers are unique"],
        explanation: "Classic binary search: compare target with middle element and narrow search space by half each time.",
        approach: "l=0, r=size-1. While l<=r, check mid. Adjust l or r based on comparison.",
        code: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
};`,
        timeComplexity: "O(log n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=s4DPM8ct1pI"
    },

    {
        id: 27, title: "Search in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Binary Search"],
        description: "Search a target in a rotated sorted array. Return index or -1.",
        examples: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }],
        constraints: ["1 <= nums.length <= 5000", "All values are unique"],
        explanation: "Modified binary search. Determine which half is sorted. Check if target lies in sorted half.",
        approach: "Find mid. If left half sorted, check if target in [l,mid). Else check right half. Narrow accordingly.",
        code: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (target >= nums[l] && target < nums[mid]) r = mid-1;
                else l = mid+1;
            } else {
                if (target > nums[mid] && target <= nums[r]) l = mid+1;
                else r = mid-1;
            }
        }
        return -1;
    }
};`,
        timeComplexity: "O(log n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=U8XENwh8Oy8"
    },

    {
        id: 28, title: "Find Minimum in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Binary Search"],
        description: "Find the minimum element in a rotated sorted array with unique elements.",
        examples: [{ input: "nums = [3,4,5,1,2]", output: "1" }],
        constraints: ["1 <= n <= 5000", "All integers unique"],
        explanation: "Binary search comparing mid with right. If mid > right, minimum is in right half.",
        approach: "If nums[mid] > nums[r], min is in right half. Else min is in left half including mid.",
        code: `class Solution {
public:
    int findMin(vector<int>& nums) {
        int l = 0, r = nums.size() - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
};`,
        timeComplexity: "O(log n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=nIVW4P8b1VA"
    },

    {
        id: 29, title: "Search a 2D Matrix", category: "Binary Search", difficulty: "Medium",
        sources: ["Neetcode 150", "Striver SDE"], tags: ["Binary Search", "Matrix"],
        description: "Search for target in sorted m x n matrix where first element of each row > last of previous.",
        examples: [{ input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" }],
        constraints: ["1 <= m, n <= 100"],
        explanation: "Treat 2D matrix as 1D sorted array. Use binary search with index mapping: row=idx/cols, col=idx%cols.",
        approach: "Binary search on virtual 1D array. Convert mid to (mid/n, mid%n) for matrix access.",
        code: `class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int val = matrix[mid/n][mid%n];
            if (val == target) return true;
            else if (val < target) l = mid+1;
            else r = mid-1;
        }
        return false;
    }
};`,
        timeComplexity: "O(log(m*n))", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=Ber2pi2C0j0"
    },

    {
        id: 30, title: "Koko Eating Bananas", category: "Binary Search", difficulty: "Medium",
        sources: ["Neetcode 150"], tags: ["Binary Search", "Greedy"],
        description: "Find minimum eating speed k to finish all banana piles within h hours.",
        examples: [{ input: "piles = [3,6,7,11], h = 8", output: "4" }],
        constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9"],
        explanation: "Binary search on k. For each k, calculate total hours. Find minimum k where hours <= h.",
        approach: "Binary search k in [1, max(piles)]. For each k, sum ceil(pile/k). If total <= h, try smaller k.",
        code: `class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int l = 1, r = *max_element(piles.begin(), piles.end());
        while (l < r) {
            int mid = l + (r - l) / 2;
            long long hours = 0;
            for (int p : piles) hours += (p + mid - 1) / mid;
            if (hours <= h) r = mid;
            else l = mid + 1;
        }
        return l;
    }
};`,
        timeComplexity: "O(n log m)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=U2SozAs9RzA"
    },

    {
        id: 31, title: "Median of Two Sorted Arrays", category: "Binary Search", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Binary Search", "Divide and Conquer"],
        description: "Find median of two sorted arrays in O(log(m+n)) time.",
        examples: [{ input: "nums1=[1,3], nums2=[2]", output: "2.0" }, { input: "nums1=[1,2], nums2=[3,4]", output: "2.5" }],
        constraints: ["0 <= m, n <= 1000", "1 <= m + n <= 2000"],
        explanation: "Binary search on partition of smaller array. Find partition where all left elements <= all right elements.",
        approach: "Binary search on smaller array's partition. Check valid partition. Calculate median from boundary.",
        code: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) swap(nums1, nums2);
        int m=nums1.size(), n=nums2.size(), l=0, r=m;
        while (l <= r) {
            int i=(l+r)/2, j=(m+n+1)/2-i;
            int left1 = i==0?INT_MIN:nums1[i-1];
            int right1 = i==m?INT_MAX:nums1[i];
            int left2 = j==0?INT_MIN:nums2[j-1];
            int right2 = j==n?INT_MAX:nums2[j];
            if (left1<=right2 && left2<=right1) {
                if ((m+n)%2==0) return (max(left1,left2)+min(right1,right2))/2.0;
                return max(left1,left2);
            } else if (left1>right2) r=i-1;
            else l=i+1;
        }
        return 0;
    }
};`,
        timeComplexity: "O(log(min(m,n)))", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=q6IEA26hvXc"
    },

    // LINKED LIST
    {
        id: 32, title: "Reverse Linked List", category: "Linked List", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Linked List"],
        description: "Reverse a singly linked list and return the reversed list.",
        examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }],
        constraints: ["0 <= number of nodes <= 5000"],
        explanation: "Use three pointers: prev, curr, next. At each step, reverse curr's pointer to prev, then advance.",
        approach: "prev=null, curr=head. Save next, point curr->next to prev, advance prev and curr.",
        code: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=G0_I-ZF0S38"
    },

    {
        id: 33, title: "Merge Two Sorted Lists", category: "Linked List", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Linked List"],
        description: "Merge two sorted linked lists into one sorted list.",
        examples: [{ input: "list1=[1,2,4], list2=[1,3,4]", output: "[1,1,2,3,4,4]" }],
        constraints: ["0 <= nodes <= 50"],
        explanation: "Use dummy node, compare heads of both lists, attach smaller node to result.",
        approach: "Dummy head, tail pointer. Compare l1 and l2 values, attach smaller. Append remaining.",
        code: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { tail->next=l1; l1=l1->next; }
            else { tail->next=l2; l2=l2->next; }
            tail = tail->next;
        }
        tail->next = l1 ? l1 : l2;
        return dummy.next;
    }
};`,
        timeComplexity: "O(n+m)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=XIdigk956u0"
    },

    {
        id: 34, title: "Linked List Cycle", category: "Linked List", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Linked List", "Two Pointers"],
        description: "Determine if a linked list has a cycle using Floyd's algorithm.",
        examples: [{ input: "head = [3,2,0,-4], pos = 1", output: "true" }],
        constraints: ["0 <= nodes <= 10^4"],
        explanation: "Floyd's Tortoise and Hare: slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle.",
        approach: "slow=head, fast=head. Move slow by 1, fast by 2. If they meet, cycle exists.",
        code: `class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode *slow=head, *fast=head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=gBTe7lFR3vc"
    },

    {
        id: 35, title: "Reorder List", category: "Linked List", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Linked List", "Two Pointers"],
        description: "Reorder list from L0->L1->...->Ln to L0->Ln->L1->Ln-1->...",
        examples: [{ input: "head = [1,2,3,4]", output: "[1,4,2,3]" }],
        constraints: ["1 <= nodes <= 5*10^4"],
        explanation: "Find middle with slow/fast. Reverse second half. Merge both halves alternately.",
        approach: "1) Find mid. 2) Reverse second half. 3) Merge first and reversed second half.",
        code: `class Solution {
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        ListNode *slow=head, *fast=head->next;
        while (fast && fast->next) { slow=slow->next; fast=fast->next->next; }
        ListNode* second = slow->next;
        slow->next = nullptr;
        ListNode* prev = nullptr;
        while (second) {
            ListNode* next=second->next;
            second->next=prev; prev=second; second=next;
        }
        ListNode *first=head; second=prev;
        while (second) {
            ListNode *t1=first->next, *t2=second->next;
            first->next=second; second->next=t1;
            first=t1; second=t2;
        }
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=S5bfdUTrKLM"
    },

    {
        id: 36, title: "Remove Nth Node From End", category: "Linked List", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Linked List", "Two Pointers"],
        description: "Remove the nth node from the end of the list.",
        examples: [{ input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" }],
        constraints: ["1 <= sz <= 30", "1 <= n <= sz"],
        explanation: "Two pointers n apart. When fast reaches end, slow is before the target node.",
        approach: "Dummy head. Advance fast n+1 steps. Move both until fast is null. Delete slow->next.",
        code: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode *slow=&dummy, *fast=&dummy;
        for (int i=0;i<=n;i++) fast=fast->next;
        while (fast) { slow=slow->next; fast=fast->next; }
        slow->next = slow->next->next;
        return dummy.next;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=XVuQxVej6y8"
    },

    {
        id: 37, title: "Merge K Sorted Lists", category: "Linked List", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Linked List", "Heap"],
        description: "Merge k sorted linked lists into one sorted list.",
        examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
        constraints: ["0 <= k <= 10^4"],
        explanation: "Use min-heap storing heads of all lists. Pop smallest, add to result, push its next node.",
        approach: "Min-heap with comparator. Push all heads. Pop min, attach to result, push next.",
        code: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp=[](ListNode* a,ListNode* b){return a->val>b->val;};
        priority_queue<ListNode*,vector<ListNode*>,decltype(cmp)> pq(cmp);
        for (auto* l : lists) if (l) pq.push(l);
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (!pq.empty()) {
            ListNode* node=pq.top(); pq.pop();
            tail->next=node; tail=tail->next;
            if (node->next) pq.push(node->next);
        }
        return dummy.next;
    }
};`,
        timeComplexity: "O(n log k)", spaceComplexity: "O(k)", videoUrl: "https://www.youtube.com/watch?v=q5a5OiGbT6Q"
    },

    // TREES
    {
        id: 38, title: "Invert Binary Tree", category: "Trees", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Tree", "DFS", "Recursion"],
        description: "Invert a binary tree and return its root.",
        examples: [{ input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
        constraints: ["0 <= nodes <= 100"],
        explanation: "Recursively swap left and right children of every node.",
        approach: "If root null, return. Swap children. Recurse on both subtrees.",
        code: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=OnSn2XEQ4MY"
    },

    {
        id: 39, title: "Maximum Depth of Binary Tree", category: "Trees", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Tree", "DFS", "BFS"],
        description: "Return maximum depth (longest root-to-leaf path) of a binary tree.",
        examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "3" }],
        constraints: ["0 <= nodes <= 10^4"],
        explanation: "Recursively find max depth of left and right subtrees. Add 1 for current node.",
        approach: "Base: null returns 0. Return 1 + max(depth(left), depth(right)).",
        code: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=hTM3phVI6YQ"
    },

    {
        id: 40, title: "Same Tree", category: "Trees", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Tree", "DFS"],
        description: "Check if two binary trees are structurally identical with same values.",
        examples: [{ input: "p=[1,2,3], q=[1,2,3]", output: "true" }],
        constraints: ["0 <= nodes <= 100"],
        explanation: "Recursively check: both null (true), one null (false), values differ (false), compare subtrees.",
        approach: "If both null, true. If one null or vals differ, false. Recurse left and right.",
        code: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if (!p || !q || p->val != q->val) return false;
        return isSameTree(p->left,q->left) && isSameTree(p->right,q->right);
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=vRbbcKXCxOw"
    },

    {
        id: 41, title: "Subtree of Another Tree", category: "Trees", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Tree", "DFS"],
        description: "Check if subRoot is a subtree of root.",
        examples: [{ input: "root=[3,4,5,1,2], subRoot=[4,1,2]", output: "true" }],
        constraints: ["1 <= nodes <= 2000"],
        explanation: "For each node in root, check if the subtree there is identical to subRoot.",
        approach: "If root null, false. Check if current matches subRoot. Else recurse on left and right.",
        code: `class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!root) return false;
        if (isSame(root, subRoot)) return true;
        return isSubtree(root->left,subRoot) || isSubtree(root->right,subRoot);
    }
    bool isSame(TreeNode* p, TreeNode* q) {
        if (!p&&!q) return true;
        if (!p||!q||p->val!=q->val) return false;
        return isSame(p->left,q->left) && isSame(p->right,q->right);
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=E36O5SWp-LE"
    },

    {
        id: 42, title: "Lowest Common Ancestor of BST", category: "Trees", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["BST"],
        description: "Find the lowest common ancestor of two nodes in a BST.",
        examples: [{ input: "root=[6,2,8,0,4,7,9], p=2, q=8", output: "6" }],
        constraints: ["All values unique", "p != q", "Both exist"],
        explanation: "In BST, if both < root go left, if both > root go right, else current is LCA.",
        approach: "If both p,q < root, left. If both > root, right. Otherwise current is LCA.",
        code: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        while (root) {
            if (p->val < root->val && q->val < root->val) root=root->left;
            else if (p->val > root->val && q->val > root->val) root=root->right;
            else return root;
        }
        return nullptr;
    }
};`,
        timeComplexity: "O(h)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=gs2LMfuOR9k"
    },

    {
        id: 43, title: "Binary Tree Level Order Traversal", category: "Trees", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Tree", "BFS"],
        description: "Return level order traversal of a binary tree's values.",
        examples: [{ input: "root=[3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }],
        constraints: ["0 <= nodes <= 2000"],
        explanation: "BFS with queue. Process each level by tracking queue size at start of each level.",
        approach: "Queue-based BFS. For each level, process queue.size() nodes, collect values per level.",
        code: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int sz=q.size();
            vector<int> level;
            for (int i=0;i<sz;i++) {
                TreeNode* node=q.front(); q.pop();
                level.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(level);
        }
        return result;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=6ZnyEApgFYg"
    },

    {
        id: 44, title: "Validate Binary Search Tree", category: "Trees", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["BST", "DFS"],
        description: "Determine if a binary tree is a valid BST.",
        examples: [{ input: "root=[2,1,3]", output: "true" }, { input: "root=[5,1,4,null,null,3,6]", output: "false" }],
        constraints: ["1 <= nodes <= 10^4"],
        explanation: "Each node must be within a valid range. Pass min/max bounds down the tree.",
        approach: "Recursive check with range [min,max]. Left child: update max. Right: update min.",
        code: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;
        if (node->val <= minVal || node->val >= maxVal) return false;
        return validate(node->left,minVal,node->val) &&
               validate(node->right,node->val,maxVal);
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=s6ATEkipzow"
    },

    {
        id: 45, title: "Kth Smallest Element in BST", category: "Trees", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["BST", "Inorder"],
        description: "Return the kth smallest value in a BST (1-indexed).",
        examples: [{ input: "root=[3,1,4,null,2], k=1", output: "1" }],
        constraints: ["1 <= k <= nodes <= 10^4"],
        explanation: "Inorder traversal of BST gives sorted order. Return the kth element.",
        approach: "Iterative inorder with stack. Count visited nodes. When count equals k, return value.",
        code: `class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        stack<TreeNode*> st;
        TreeNode* curr = root;
        while (curr || !st.empty()) {
            while (curr) { st.push(curr); curr=curr->left; }
            curr=st.top(); st.pop();
            if (--k == 0) return curr->val;
            curr = curr->right;
        }
        return -1;
    }
};`,
        timeComplexity: "O(h+k)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=5LUXSvjmGCw"
    },

    {
        id: 46, title: "Construct Binary Tree from Preorder and Inorder", category: "Trees", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Tree", "Recursion", "Hash Map"],
        description: "Construct binary tree given preorder and inorder traversal arrays.",
        examples: [{ input: "preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]", output: "[3,9,20,null,null,15,7]" }],
        constraints: ["1 <= length <= 3000"],
        explanation: "First element of preorder is root. Find it in inorder to split left/right subtrees.",
        approach: "Map inorder values to indices. preorder[0] is root. Split inorder at root. Recurse.",
        code: `class Solution {
    unordered_map<int,int> inMap;
    int preIdx = 0;
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int i=0;i<inorder.size();i++) inMap[inorder[i]]=i;
        return build(preorder, 0, inorder.size()-1);
    }
    TreeNode* build(vector<int>& pre, int inL, int inR) {
        if (inL > inR) return nullptr;
        int val = pre[preIdx++];
        TreeNode* root = new TreeNode(val);
        root->left = build(pre, inL, inMap[val]-1);
        root->right = build(pre, inMap[val]+1, inR);
        return root;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=ihj4IQGZ2zc"
    },

    {
        id: 47, title: "Binary Tree Maximum Path Sum", category: "Trees", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Tree", "DFS"],
        description: "Find maximum path sum in a binary tree. Path can start and end at any node.",
        examples: [{ input: "root=[-10,9,20,null,null,15,7]", output: "42", explanation: "15->20->7" }],
        constraints: ["1 <= nodes <= 3*10^4"],
        explanation: "At each node, max path = val + max(0,left) + max(0,right). Return only one branch to parent.",
        approach: "DFS returns max gain from one side. Update global max with node+left+right.",
        code: `class Solution {
    int maxSum = INT_MIN;
public:
    int maxPathSum(TreeNode* root) { dfs(root); return maxSum; }
    int dfs(TreeNode* node) {
        if (!node) return 0;
        int left = max(0, dfs(node->left));
        int right = max(0, dfs(node->right));
        maxSum = max(maxSum, node->val + left + right);
        return node->val + max(left, right);
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=Hr5cWUld4vU"
    },

    {
        id: 48, title: "Serialize and Deserialize Binary Tree", category: "Trees", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Google Fav"], tags: ["Tree", "Design"],
        description: "Serialize a binary tree to string and deserialize back.",
        examples: [{ input: "root=[1,2,3,null,null,4,5]", output: '"1,2,N,N,3,4,N,N,5,N,N"' }],
        constraints: ["0 <= nodes <= 10^4"],
        explanation: "Preorder traversal with 'N' for null. Deserialize by reading tokens in same order.",
        approach: "Serialize: preorder DFS. Deserialize: read tokens, recursively build left then right.",
        code: `class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "N";
        return to_string(root->val)+","+serialize(root->left)+","+serialize(root->right);
    }
    TreeNode* deserialize(string data) {
        istringstream ss(data);
        return build(ss);
    }
    TreeNode* build(istringstream& ss) {
        string val; getline(ss, val, ',');
        if (val == "N") return nullptr;
        TreeNode* node = new TreeNode(stoi(val));
        node->left = build(ss);
        node->right = build(ss);
        return node;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=u4JAi2JJhI8"
    },

    {
        id: 49, title: "Diameter of Binary Tree", category: "Trees", difficulty: "Easy",
        sources: ["Neetcode 150", "Striver SDE"], tags: ["Tree", "DFS"],
        description: "Return diameter of binary tree (longest path between any two nodes in edges).",
        examples: [{ input: "root=[1,2,3,4,5]", output: "3" }],
        constraints: ["1 <= nodes <= 10^4"],
        explanation: "At each node, diameter through it = leftHeight + rightHeight. Track global max.",
        approach: "DFS returns height. Update diameter = max(diameter, left+right). Return 1+max(left,right).",
        code: `class Solution {
    int dia = 0;
public:
    int diameterOfBinaryTree(TreeNode* root) { height(root); return dia; }
    int height(TreeNode* node) {
        if (!node) return 0;
        int l=height(node->left), r=height(node->right);
        dia = max(dia, l+r);
        return 1 + max(l, r);
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=bkxqA8Rfv04"
    },

    {
        id: 50, title: "Balanced Binary Tree", category: "Trees", difficulty: "Easy",
        sources: ["Neetcode 150"], tags: ["Tree", "DFS"],
        description: "Determine if a binary tree is height-balanced.",
        examples: [{ input: "root=[3,9,20,null,null,15,7]", output: "true" }],
        constraints: ["0 <= nodes <= 5000"],
        explanation: "Check if left and right subtree heights differ by at most 1. Return -1 if unbalanced.",
        approach: "DFS returns height or -1 if unbalanced. If |left-right| > 1, return -1.",
        code: `class Solution {
public:
    bool isBalanced(TreeNode* root) { return check(root) != -1; }
    int check(TreeNode* node) {
        if (!node) return 0;
        int l=check(node->left); if (l==-1) return -1;
        int r=check(node->right); if (r==-1) return -1;
        if (abs(l-r)>1) return -1;
        return 1+max(l,r);
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=QfJsau0ItOY"
    },
];
