// Problems 51-80: Graphs, Heaps, Backtracking, DP
window.DSA_PROBLEMS_3 = [
    {
        id: 51, title: "Number of Islands", category: "Graphs", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["BFS", "DFS", "Matrix"],
        description: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands.",
        examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: "2" }],
        constraints: ["1 <= m, n <= 300"],
        explanation: "For each unvisited '1', run DFS/BFS to mark all connected land. Each DFS call = one island.",
        approach: "Iterate grid. When '1' found, increment count, DFS to mark all connected '1's as visited.",
        code: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0, m = grid.size(), n = grid[0].size();
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] == '1') { count++; dfs(grid, i, j); }
        return count;
    }
    void dfs(vector<vector<char>>& g, int i, int j) {
        if (i<0||j<0||i>=g.size()||j>=g[0].size()||g[i][j]!='1') return;
        g[i][j] = '0';
        dfs(g,i+1,j); dfs(g,i-1,j); dfs(g,i,j+1); dfs(g,i,j-1);
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=pV2kpPD66nE"
    },

    {
        id: 52, title: "Clone Graph", category: "Graphs", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["BFS", "DFS", "Hash Map"],
        description: "Return a deep copy of a connected undirected graph.",
        examples: [{ input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "deep copy" }],
        constraints: ["0 <= nodes <= 100", "No repeated edges or self-loops"],
        explanation: "Use a hash map from old node to cloned node. DFS/BFS and clone neighbors recursively.",
        approach: "Map old->new. For each node, create clone, recursively clone neighbors if not already cloned.",
        code: `class Solution {
    unordered_map<Node*, Node*> visited;
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        if (visited.count(node)) return visited[node];
        Node* clone = new Node(node->val);
        visited[node] = clone;
        for (auto* nb : node->neighbors)
            clone->neighbors.push_back(cloneGraph(nb));
        return clone;
    }
};`,
        timeComplexity: "O(V+E)", spaceComplexity: "O(V)", videoUrl: "https://www.youtube.com/watch?v=mQeF6bN8hMk"
    },

    {
        id: 53, title: "Pacific Atlantic Water Flow", category: "Graphs", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["BFS", "DFS", "Matrix"],
        description: "Find all cells where water can flow to both Pacific and Atlantic oceans.",
        examples: [{ input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" }],
        constraints: ["1 <= m, n <= 200"],
        explanation: "BFS/DFS from ocean borders inward. Find cells reachable from both oceans.",
        approach: "DFS from Pacific border and Atlantic border separately. Return intersection.",
        code: `class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        int m=heights.size(), n=heights[0].size();
        vector<vector<bool>> pac(m,vector<bool>(n)), atl(m,vector<bool>(n));
        for (int i=0;i<m;i++) { dfs(heights,pac,i,0); dfs(heights,atl,i,n-1); }
        for (int j=0;j<n;j++) { dfs(heights,pac,0,j); dfs(heights,atl,m-1,j); }
        vector<vector<int>> res;
        for (int i=0;i<m;i++)
            for (int j=0;j<n;j++)
                if (pac[i][j]&&atl[i][j]) res.push_back({i,j});
        return res;
    }
    void dfs(vector<vector<int>>& h, vector<vector<bool>>& v, int i, int j) {
        v[i][j]=true;
        int d[]={0,1,0,-1,0};
        for (int k=0;k<4;k++) {
            int ni=i+d[k],nj=j+d[k+1];
            if (ni>=0&&nj>=0&&ni<h.size()&&nj<h[0].size()&&!v[ni][nj]&&h[ni][nj]>=h[i][j])
                dfs(h,v,ni,nj);
        }
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=s-VkcjHqkGI"
    },

    {
        id: 54, title: "Course Schedule", category: "Graphs", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Topological Sort", "BFS", "DFS"],
        description: "Determine if you can finish all courses given prerequisites (detect cycle in directed graph).",
        examples: [{ input: "numCourses=2, prerequisites=[[1,0]]", output: "true" }, { input: "numCourses=2, prerequisites=[[1,0],[0,1]]", output: "false" }],
        constraints: ["1 <= numCourses <= 2000"],
        explanation: "This is cycle detection in a directed graph. Use DFS with 3 states or BFS topological sort (Kahn's).",
        approach: "Kahn's algorithm: count in-degrees, BFS from nodes with 0 in-degree. If all processed, no cycle.",
        code: `class Solution {
public:
    bool canFinish(int n, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(n);
        vector<int> indeg(n, 0);
        for (auto& p : prerequisites) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
        queue<int> q;
        for (int i=0;i<n;i++) if (indeg[i]==0) q.push(i);
        int count = 0;
        while (!q.empty()) {
            int node=q.front(); q.pop(); count++;
            for (int nb : adj[node]) if (--indeg[nb]==0) q.push(nb);
        }
        return count == n;
    }
};`,
        timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)", videoUrl: "https://www.youtube.com/watch?v=EgI5nU9etnU"
    },

    {
        id: 55, title: "Course Schedule II", category: "Graphs", difficulty: "Medium",
        sources: ["Neetcode 150", "Striver SDE"], tags: ["Topological Sort", "BFS"],
        description: "Return the ordering of courses you should take to finish all courses (topological sort).",
        examples: [{ input: "numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]", output: "[0,2,1,3]" }],
        constraints: ["1 <= numCourses <= 2000"],
        explanation: "Topological sort using Kahn's algorithm. If cycle exists, return empty array.",
        approach: "Same as Course Schedule but collect the order. Return empty if count != numCourses.",
        code: `class Solution {
public:
    vector<int> findOrder(int n, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(n);
        vector<int> indeg(n,0);
        for (auto& p : prerequisites) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
        queue<int> q;
        for (int i=0;i<n;i++) if (indeg[i]==0) q.push(i);
        vector<int> order;
        while (!q.empty()) {
            int node=q.front(); q.pop(); order.push_back(node);
            for (int nb : adj[node]) if (--indeg[nb]==0) q.push(nb);
        }
        return order.size()==n ? order : vector<int>{};
    }
};`,
        timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)", videoUrl: "https://www.youtube.com/watch?v=Akt3glAwyfY"
    },

    {
        id: 56, title: "Graph Valid Tree", category: "Graphs", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Union Find", "DFS"],
        description: "Given n nodes and edges, determine if these edges form a valid tree (connected, no cycles).",
        examples: [{ input: "n=5, edges=[[0,1],[0,2],[0,3],[1,4]]", output: "true" }],
        constraints: ["1 <= n <= 2000"],
        explanation: "A valid tree has exactly n-1 edges and is connected. Use Union-Find to detect cycles.",
        approach: "Check edges == n-1. Use Union-Find. If any edge connects already-connected nodes, it's a cycle.",
        code: `class Solution {
    vector<int> parent, rank_;
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if (edges.size() != n-1) return false;
        parent.resize(n); rank_.resize(n, 0);
        iota(parent.begin(), parent.end(), 0);
        for (auto& e : edges)
            if (!unite(e[0], e[1])) return false;
        return true;
    }
    int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
    bool unite(int a, int b) {
        a=find(a); b=find(b);
        if (a==b) return false;
        if (rank_[a]<rank_[b]) swap(a,b);
        parent[b]=a;
        if (rank_[a]==rank_[b]) rank_[a]++;
        return true;
    }
};`,
        timeComplexity: "O(n * α(n))", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=bXsUuownnoQ"
    },

    {
        id: 57, title: "Number of Connected Components", category: "Graphs", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Union Find", "DFS"],
        description: "Find the number of connected components in an undirected graph with n nodes.",
        examples: [{ input: "n=5, edges=[[0,1],[1,2],[3,4]]", output: "2" }],
        constraints: ["1 <= n <= 2000"],
        explanation: "Use Union-Find. Initially n components. Each successful union reduces count by 1.",
        approach: "Union-Find with path compression. Start with n components, decrement on each union.",
        code: `class Solution {
    vector<int> parent;
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        parent.resize(n);
        iota(parent.begin(), parent.end(), 0);
        int count = n;
        for (auto& e : edges) {
            int a=find(e[0]), b=find(e[1]);
            if (a!=b) { parent[a]=b; count--; }
        }
        return count;
    }
    int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
};`,
        timeComplexity: "O(n * α(n))", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=8f1XPm4WOUc"
    },

    {
        id: 58, title: "Word Ladder", category: "Graphs", difficulty: "Hard",
        sources: ["Neetcode 150", "Striver SDE", "Google Fav"], tags: ["BFS", "Hash Set"],
        description: "Find shortest transformation sequence length from beginWord to endWord, changing one letter at a time.",
        examples: [{ input: 'beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]', output: "5" }],
        constraints: ["1 <= beginWord.length <= 10", "1 <= wordList.length <= 5000"],
        explanation: "BFS from beginWord. Each level, try all single-char changes. First time we reach endWord is shortest path.",
        approach: "BFS with word set. For each word, try all 26 chars at each position. If in set, add to queue.",
        code: `class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> words(wordList.begin(), wordList.end());
        if (!words.count(endWord)) return 0;
        queue<string> q;
        q.push(beginWord);
        int steps = 1;
        while (!q.empty()) {
            int sz = q.size();
            for (int i=0;i<sz;i++) {
                string word = q.front(); q.pop();
                for (int j=0;j<word.size();j++) {
                    char orig = word[j];
                    for (char c='a';c<='z';c++) {
                        word[j] = c;
                        if (word == endWord) return steps+1;
                        if (words.count(word)) { words.erase(word); q.push(word); }
                    }
                    word[j] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
};`,
        timeComplexity: "O(n * m * 26)", spaceComplexity: "O(n * m)", videoUrl: "https://www.youtube.com/watch?v=h9iTnkgv05E"
    },

    // HEAP / PRIORITY QUEUE
    {
        id: 59, title: "Kth Largest Element in Array", category: "Heap", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Heap", "QuickSelect"],
        description: "Find the kth largest element in an unsorted array.",
        examples: [{ input: "nums=[3,2,1,5,6,4], k=2", output: "5" }],
        constraints: ["1 <= k <= nums.length <= 10^5"],
        explanation: "Use a min-heap of size k. The top of heap is the kth largest element.",
        approach: "Push elements to min-heap. If size > k, pop. Final top = kth largest.",
        code: `class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> pq;
        for (int n : nums) {
            pq.push(n);
            if (pq.size() > k) pq.pop();
        }
        return pq.top();
    }
};`,
        timeComplexity: "O(n log k)", spaceComplexity: "O(k)", videoUrl: "https://www.youtube.com/watch?v=XEmy13g1Qxc"
    },

    {
        id: 60, title: "Find Median from Data Stream", category: "Heap", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Google Fav"], tags: ["Heap", "Design"],
        description: "Design a data structure that supports adding numbers and finding the median.",
        examples: [{ input: "addNum(1), addNum(2), findMedian() -> 1.5, addNum(3), findMedian() -> 2.0", output: "1.5, 2.0" }],
        constraints: ["At most 5*10^4 calls"],
        explanation: "Use two heaps: max-heap for lower half, min-heap for upper half. Median is from tops of heaps.",
        approach: "Max-heap stores smaller half, min-heap stores larger half. Balance sizes. Median from top(s).",
        code: `class MedianFinder {
    priority_queue<int> lo; // max-heap
    priority_queue<int, vector<int>, greater<int>> hi; // min-heap
public:
    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top()); lo.pop();
        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
    }
    double findMedian() {
        return lo.size() > hi.size() ? lo.top() : (lo.top()+hi.top())/2.0;
    }
};`,
        timeComplexity: "O(log n) add, O(1) find", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=itmhHWaHupI"
    },

    {
        id: 61, title: "Task Scheduler", category: "Heap", difficulty: "Medium",
        sources: ["Neetcode 150", "Google Fav"], tags: ["Heap", "Greedy"],
        description: "Given tasks with cooldown interval n, find minimum intervals to finish all tasks.",
        examples: [{ input: 'tasks=["A","A","A","B","B","B"], n=2', output: "8" }],
        constraints: ["1 <= tasks.length <= 10^4", "0 <= n <= 100"],
        explanation: "Most frequent task determines structure. Idle slots = (maxFreq-1)*n - fill with other tasks.",
        approach: "Count frequencies. Max freq task creates (maxFreq-1) gaps of size n. Fill gaps with other tasks.",
        code: `class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int freq[26] = {};
        for (char t : tasks) freq[t-'A']++;
        int maxF = *max_element(freq, freq+26);
        int maxCount = count(freq, freq+26, maxF);
        int result = (maxF-1)*(n+1) + maxCount;
        return max(result, (int)tasks.size());
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=s8p8ukTyA2I"
    },

    // BACKTRACKING
    {
        id: 62, title: "Subsets", category: "Backtracking", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Backtracking", "Bit Manipulation"],
        description: "Given an integer array of unique elements, return all possible subsets.",
        examples: [{ input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }],
        constraints: ["1 <= nums.length <= 10"],
        explanation: "For each element, choose to include or exclude it. Recursively build all combinations.",
        approach: "Backtrack: at each index, add current subset to result, then try adding each remaining element.",
        code: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> curr;
        backtrack(nums, 0, curr, result);
        return result;
    }
    void backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& res) {
        res.push_back(curr);
        for (int i = start; i < nums.size(); i++) {
            curr.push_back(nums[i]);
            backtrack(nums, i+1, curr, res);
            curr.pop_back();
        }
    }
};`,
        timeComplexity: "O(n * 2^n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=REOH22Xwdkk"
    },

    {
        id: 63, title: "Combination Sum", category: "Backtracking", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Backtracking"],
        description: "Find all unique combinations of candidates that sum to target. Elements can be reused.",
        examples: [{ input: "candidates=[2,3,6,7], target=7", output: "[[2,2,3],[7]]" }],
        constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40"],
        explanation: "Backtrack trying each candidate. Allow reuse by starting from same index. Prune if sum > target.",
        approach: "Sort candidates. Backtrack from index i. If target==0, found combo. Skip if target<0.",
        code: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> curr;
        sort(candidates.begin(), candidates.end());
        backtrack(candidates, target, 0, curr, result);
        return result;
    }
    void backtrack(vector<int>& c, int target, int start, vector<int>& curr, vector<vector<int>>& res) {
        if (target == 0) { res.push_back(curr); return; }
        for (int i=start; i<c.size() && c[i]<=target; i++) {
            curr.push_back(c[i]);
            backtrack(c, target-c[i], i, curr, res);
            curr.pop_back();
        }
    }
};`,
        timeComplexity: "O(2^(t/m))", spaceComplexity: "O(t/m)", videoUrl: "https://www.youtube.com/watch?v=GBKI9VSKdGg"
    },

    {
        id: 64, title: "Permutations", category: "Backtracking", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Backtracking"],
        description: "Given an array of distinct integers, return all possible permutations.",
        examples: [{ input: "nums=[1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }],
        constraints: ["1 <= nums.length <= 6"],
        explanation: "At each position, try all unused elements. Use a visited array or swap-based approach.",
        approach: "Backtrack with visited array. At each step, try each unvisited number. When path.size()==n, add to result.",
        code: `class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> curr;
        vector<bool> used(nums.size(), false);
        backtrack(nums, used, curr, result);
        return result;
    }
    void backtrack(vector<int>& nums, vector<bool>& used, vector<int>& curr, vector<vector<int>>& res) {
        if (curr.size() == nums.size()) { res.push_back(curr); return; }
        for (int i=0; i<nums.size(); i++) {
            if (used[i]) continue;
            used[i]=true; curr.push_back(nums[i]);
            backtrack(nums, used, curr, res);
            curr.pop_back(); used[i]=false;
        }
    }
};`,
        timeComplexity: "O(n! * n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=s7AvT7cGdSo"
    },

    {
        id: 65, title: "Word Search", category: "Backtracking", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Backtracking", "Matrix"],
        description: "Given a 2D board and a word, find if the word exists in the grid by moving adjacently.",
        examples: [{ input: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"', output: "true" }],
        constraints: ["1 <= m, n <= 6", "1 <= word.length <= 15"],
        explanation: "DFS from each cell matching first char. Mark visited cells. Backtrack if no path found.",
        approach: "For each cell matching word[0], DFS checking adjacent cells for subsequent characters.",
        code: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        for (int i=0;i<board.size();i++)
            for (int j=0;j<board[0].size();j++)
                if (dfs(board,word,i,j,0)) return true;
        return false;
    }
    bool dfs(vector<vector<char>>& b, string& w, int i, int j, int k) {
        if (k==w.size()) return true;
        if (i<0||j<0||i>=b.size()||j>=b[0].size()||b[i][j]!=w[k]) return false;
        char tmp=b[i][j]; b[i][j]='#';
        bool found = dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||
                     dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);
        b[i][j]=tmp;
        return found;
    }
};`,
        timeComplexity: "O(m*n*4^L)", spaceComplexity: "O(L)", videoUrl: "https://www.youtube.com/watch?v=pfiQ_PS1g8E"
    },

    {
        id: 66, title: "N-Queens", category: "Backtracking", difficulty: "Hard",
        sources: ["Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Backtracking"],
        description: "Place n queens on an n×n chessboard so no two queens attack each other.",
        examples: [{ input: "n=4", output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' }],
        constraints: ["1 <= n <= 9"],
        explanation: "Place queens row by row. Track columns and diagonals under attack using sets.",
        approach: "Backtrack row by row. For each column, check if safe (column, diagonal, anti-diagonal). Use sets.",
        code: `class Solution {
    vector<vector<string>> result;
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<string> board(n, string(n,'.'));
        unordered_set<int> cols, diag, antiDiag;
        solve(board, 0, n, cols, diag, antiDiag);
        return result;
    }
    void solve(vector<string>& b, int r, int n, unordered_set<int>& c, unordered_set<int>& d, unordered_set<int>& ad) {
        if (r==n) { result.push_back(b); return; }
        for (int j=0;j<n;j++) {
            if (c.count(j)||d.count(r-j)||ad.count(r+j)) continue;
            b[r][j]='Q'; c.insert(j); d.insert(r-j); ad.insert(r+j);
            solve(b,r+1,n,c,d,ad);
            b[r][j]='.'; c.erase(j); d.erase(r-j); ad.erase(r+j);
        }
    }
};`,
        timeComplexity: "O(n!)", spaceComplexity: "O(n²)", videoUrl: "https://www.youtube.com/watch?v=Ph95IHmRp5M"
    },

    // DYNAMIC PROGRAMMING
    {
        id: 67, title: "Climbing Stairs", category: "Dynamic Programming", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP", "Fibonacci"],
        description: "You can climb 1 or 2 steps. How many distinct ways to climb n steps?",
        examples: [{ input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" }],
        constraints: ["1 <= n <= 45"],
        explanation: "This is Fibonacci. dp[i] = dp[i-1] + dp[i-2]. Can be done with O(1) space.",
        approach: "Two variables for previous two values. Iterate from 2 to n, updating like Fibonacci.",
        code: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a=1, b=2;
        for (int i=3; i<=n; i++) { int c=a+b; a=b; b=c; }
        return b;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=Y0lT9Fck7qI"
    },

    {
        id: 68, title: "House Robber", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP"],
        description: "Rob houses along a street. Can't rob two adjacent houses. Maximize total amount.",
        examples: [{ input: "nums=[1,2,3,1]", output: "4", explanation: "Rob house 1 and 3" }],
        constraints: ["1 <= nums.length <= 100"],
        explanation: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Either skip current house or rob it.",
        approach: "Two variables: prev1 (i-1) and prev2 (i-2). For each house, max of skip or rob.",
        code: `class Solution {
public:
    int rob(vector<int>& nums) {
        int prev1=0, prev2=0;
        for (int n : nums) {
            int curr = max(prev1, prev2+n);
            prev2=prev1; prev1=curr;
        }
        return prev1;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=73r3KWiEvyk"
    },

    {
        id: 69, title: "House Robber II", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["DP"],
        description: "Houses are in a circle. Can't rob adjacent houses. Maximize total.",
        examples: [{ input: "nums=[2,3,2]", output: "3" }],
        constraints: ["1 <= nums.length <= 100"],
        explanation: "Since first and last are adjacent, solve twice: once without first, once without last. Take max.",
        approach: "Run House Robber on nums[0..n-2] and nums[1..n-1]. Return max of both.",
        code: `class Solution {
public:
    int rob(vector<int>& nums) {
        int n=nums.size();
        if (n==1) return nums[0];
        return max(robRange(nums,0,n-2), robRange(nums,1,n-1));
    }
    int robRange(vector<int>& nums, int lo, int hi) {
        int prev1=0, prev2=0;
        for (int i=lo;i<=hi;i++) { int c=max(prev1,prev2+nums[i]); prev2=prev1; prev1=c; }
        return prev1;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=rWAJCfYYOvM"
    },

    {
        id: 70, title: "Longest Palindromic Substring", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["DP", "String", "Two Pointers"],
        description: "Find the longest palindromic substring in s.",
        examples: [{ input: 's = "babad"', output: '"bab" or "aba"' }],
        constraints: ["1 <= s.length <= 1000"],
        explanation: "Expand around each center (both odd and even length palindromes). Track longest found.",
        approach: "For each index, expand around center for odd and even length. Update result with longest.",
        code: `class Solution {
public:
    string longestPalindrome(string s) {
        int start=0, maxLen=0;
        for (int i=0;i<s.size();i++) {
            expand(s,i,i,start,maxLen);   // odd
            expand(s,i,i+1,start,maxLen); // even
        }
        return s.substr(start, maxLen);
    }
    void expand(string& s, int l, int r, int& start, int& maxLen) {
        while (l>=0 && r<s.size() && s[l]==s[r]) { l--; r++; }
        if (r-l-1 > maxLen) { start=l+1; maxLen=r-l-1; }
    }
};`,
        timeComplexity: "O(n²)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=XYQecbcd6_c"
    },

    {
        id: 71, title: "Palindromic Substrings", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["DP", "String", "Two Pointers"],
        description: "Count the number of palindromic substrings in string s.",
        examples: [{ input: 's = "abc"', output: "3", explanation: '"a","b","c"' }, { input: 's = "aaa"', output: "6" }],
        constraints: ["1 <= s.length <= 1000"],
        explanation: "Expand around each center for both odd and even length palindromes. Count valid expansions.",
        approach: "For each center, expand outward counting palindromes. Both odd and even centers.",
        code: `class Solution {
public:
    int countSubstrings(string s) {
        int count = 0;
        for (int i=0;i<s.size();i++) {
            count += expand(s,i,i);
            count += expand(s,i,i+1);
        }
        return count;
    }
    int expand(string& s, int l, int r) {
        int cnt=0;
        while (l>=0 && r<s.size() && s[l]==s[r]) { cnt++; l--; r++; }
        return cnt;
    }
};`,
        timeComplexity: "O(n²)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=4RACzI5-du8"
    },

    {
        id: 72, title: "Decode Ways", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["DP", "String"],
        description: "Given a string of digits, count the number of ways to decode it (1=A, 2=B, ..., 26=Z).",
        examples: [{ input: 's = "226"', output: "3", explanation: "BZ(2,26), VF(22,6), BBF(2,2,6)" }],
        constraints: ["1 <= s.length <= 100"],
        explanation: "dp[i] = dp[i-1] (if s[i]!='0') + dp[i-2] (if s[i-1..i] is 10-26).",
        approach: "Iterate with two variables. If current digit valid, add prev1. If two-digit valid, add prev2.",
        code: `class Solution {
public:
    int numDecodings(string s) {
        if (s[0]=='0') return 0;
        int prev2=1, prev1=1;
        for (int i=1;i<s.size();i++) {
            int curr=0;
            if (s[i]!='0') curr+=prev1;
            int two=stoi(s.substr(i-1,2));
            if (two>=10 && two<=26) curr+=prev2;
            prev2=prev1; prev1=curr;
        }
        return prev1;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=6aEyTjOwlJU"
    },

    {
        id: 73, title: "Coin Change", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP", "BFS"],
        description: "Find fewest coins needed to make up amount. Return -1 if impossible.",
        examples: [{ input: "coins=[1,5,11], amount=11", output: "1" }, { input: "coins=[2], amount=3", output: "-1" }],
        constraints: ["1 <= coins.length <= 12", "1 <= amount <= 10^4"],
        explanation: "dp[i] = min coins to make amount i. For each coin, dp[i] = min(dp[i], dp[i-coin]+1).",
        approach: "Fill dp array bottom-up. dp[0]=0. For each amount, try each coin. Return dp[amount].",
        code: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount+1, amount+1);
        dp[0] = 0;
        for (int i=1;i<=amount;i++)
            for (int c : coins)
                if (c<=i) dp[i] = min(dp[i], dp[i-c]+1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
        timeComplexity: "O(amount * n)", spaceComplexity: "O(amount)", videoUrl: "https://www.youtube.com/watch?v=H9bfqozjoqs"
    },

    {
        id: 74, title: "Longest Increasing Subsequence", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["DP", "Binary Search"],
        description: "Find length of the longest strictly increasing subsequence.",
        examples: [{ input: "nums=[10,9,2,5,3,7,101,18]", output: "4", explanation: "[2,3,7,101]" }],
        constraints: ["1 <= nums.length <= 2500"],
        explanation: "O(n log n) with patience sorting. Maintain tails array. Binary search for insertion point.",
        approach: "Maintain sorted tails. For each num, binary search for position. Replace or extend tails.",
        code: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int n : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), n);
            if (it == tails.end()) tails.push_back(n);
            else *it = n;
        }
        return tails.size();
    }
};`,
        timeComplexity: "O(n log n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=cjWnW0hdF1Y"
    },

    {
        id: 75, title: "Word Break", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["DP", "Hash Set"],
        description: "Can string s be segmented into space-separated dictionary words?",
        examples: [{ input: 's="leetcode", wordDict=["leet","code"]', output: "true" }],
        constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000"],
        explanation: "dp[i] = true if s[0..i-1] can be segmented. Check all possible last words ending at i.",
        approach: "dp[0]=true. For each position i, check all j<i where dp[j] is true and s[j..i] is in dict.",
        code: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> words(wordDict.begin(), wordDict.end());
        int n=s.size();
        vector<bool> dp(n+1, false);
        dp[0] = true;
        for (int i=1;i<=n;i++)
            for (int j=0;j<i;j++)
                if (dp[j] && words.count(s.substr(j,i-j))) { dp[i]=true; break; }
        return dp[n];
    }
};`,
        timeComplexity: "O(n² * m)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=Sx9NNgInc3A"
    },

    // INTERVALS & GREEDY
    {
        id: 76, title: "Merge Intervals", category: "Intervals", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Sorting", "Intervals"],
        description: "Merge all overlapping intervals.",
        examples: [{ input: "intervals=[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }],
        constraints: ["1 <= intervals.length <= 10^4"],
        explanation: "Sort by start time. If current overlaps with previous, merge by extending end. Otherwise add new.",
        approach: "Sort intervals. Iterate and merge if overlap (start <= prev end). Update end = max of both ends.",
        code: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        for (auto& iv : intervals) {
            if (!merged.empty() && iv[0] <= merged.back()[1])
                merged.back()[1] = max(merged.back()[1], iv[1]);
            else merged.push_back(iv);
        }
        return merged;
    }
};`,
        timeComplexity: "O(n log n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=44H3cEC2fFM"
    },

    {
        id: 77, title: "Non-overlapping Intervals", category: "Intervals", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Sorting", "Greedy"],
        description: "Find minimum number of intervals to remove to make the rest non-overlapping.",
        examples: [{ input: "intervals=[[1,2],[2,3],[3,4],[1,3]]", output: "1" }],
        constraints: ["1 <= intervals.length <= 10^5"],
        explanation: "Sort by end time. Greedily keep intervals that don't overlap with previous kept interval.",
        approach: "Sort by end. Track last end. Count overlapping intervals (start < lastEnd).",
        code: `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(),intervals.end(),[](auto& a,auto& b){return a[1]<b[1];});
        int count=0, end=INT_MIN;
        for (auto& iv : intervals) {
            if (iv[0] >= end) end = iv[1];
            else count++;
        }
        return count;
    }
};`,
        timeComplexity: "O(n log n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=nONCGxWoUfM"
    },

    {
        id: 78, title: "Meeting Rooms II", category: "Intervals", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Google Fav"], tags: ["Sorting", "Heap", "Intervals"],
        description: "Find minimum number of conference rooms required for all meetings.",
        examples: [{ input: "intervals=[[0,30],[5,10],[15,20]]", output: "2" }],
        constraints: ["1 <= intervals.length <= 10^4"],
        explanation: "Sort by start time. Use min-heap of end times. If earliest ending room is free, reuse it.",
        approach: "Sort starts and ends separately. Two pointers: if start < end, need new room. Else reuse.",
        code: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        vector<int> starts, ends;
        for (auto& iv : intervals) { starts.push_back(iv[0]); ends.push_back(iv[1]); }
        sort(starts.begin(), starts.end());
        sort(ends.begin(), ends.end());
        int rooms=0, endPtr=0;
        for (int s : starts) {
            if (s < ends[endPtr]) rooms++;
            else endPtr++;
        }
        return rooms;
    }
};`,
        timeComplexity: "O(n log n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=FdzJmTCVyJU"
    },

    {
        id: 79, title: "Maximum Subarray", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP", "Kadane's"],
        description: "Find the contiguous subarray with the largest sum.",
        examples: [{ input: "nums=[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1]" }],
        constraints: ["1 <= nums.length <= 10^5"],
        explanation: "Kadane's algorithm: track current sum. If it goes negative, reset to 0. Track max sum seen.",
        approach: "currentSum = max(num, currentSum + num). Update maxSum at each step.",
        code: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum=nums[0], currSum=nums[0];
        for (int i=1;i<nums.size();i++) {
            currSum = max(nums[i], currSum+nums[i]);
            maxSum = max(maxSum, currSum);
        }
        return maxSum;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=5WZl3MMT0Eg"
    },

    {
        id: 80, title: "Jump Game", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Greedy", "DP"],
        description: "Given array where nums[i] is max jump length from position i, can you reach the last index?",
        examples: [{ input: "nums=[2,3,1,1,4]", output: "true" }, { input: "nums=[3,2,1,0,4]", output: "false" }],
        constraints: ["1 <= nums.length <= 10^4"],
        explanation: "Greedy: track the farthest reachable index. If current index > farthest, can't proceed.",
        approach: "Track maxReach. For each i <= maxReach, update maxReach = max(maxReach, i+nums[i]).",
        code: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        int maxReach = 0;
        for (int i=0;i<nums.size();i++) {
            if (i > maxReach) return false;
            maxReach = max(maxReach, i+nums[i]);
        }
        return true;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=Yan0cv2cLy8"
    },
];
