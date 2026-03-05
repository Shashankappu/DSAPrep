window.DSA_PROBLEMS_5 = [
    {
        id: 111, title: "Lowest Common Ancestor of Binary Tree", category: "Trees", difficulty: "Medium", sources: ["Striver SDE", "Google Fav"], tags: ["Tree", "DFS"], description: "Find LCA of two nodes in a general binary tree.", examples: [{ input: "root=[3,5,1,6,2,0,8], p=5, q=1", output: "3" }], constraints: ["2<=nodes<=10^5"], explanation: "If current node is p or q, return it. Recurse left and right. If both sides return non-null, current is LCA.", approach: "Recursive DFS. If node==p or q, return node. If left and right both non-null, return current node.", code: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root||root==p||root==q) return root;
        auto* l=lowestCommonAncestor(root->left,p,q);
        auto* r=lowestCommonAncestor(root->right,p,q);
        if (l&&r) return root;
        return l?l:r;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=13m9ZCB8gjw"
    },

    {
        id: 112, title: "Rotting Oranges", category: "Graphs", difficulty: "Medium", sources: ["Neetcode 150", "Striver SDE", "Google Fav"], tags: ["BFS", "Matrix"], description: "Find minimum minutes until no fresh orange remains. Rotten spreads to 4-directional neighbors.", examples: [{ input: "grid=[[2,1,1],[1,1,0],[0,1,1]]", output: "4" }], constraints: ["1<=m,n<=10"], explanation: "Multi-source BFS from all rotten oranges simultaneously. Count levels = minutes.", approach: "Push all rotten to queue. BFS level by level. Count fresh remaining.", code: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        queue<pair<int,int>> q;
        int fresh=0,m=grid.size(),n=grid[0].size();
        for(int i=0;i<m;i++) for(int j=0;j<n;j++){
            if(grid[i][j]==2) q.push({i,j});
            else if(grid[i][j]==1) fresh++;
        }
        int mins=0,d[]={0,1,0,-1,0};
        while(!q.empty()&&fresh){
            int sz=q.size(); mins++;
            while(sz--){auto[r,c]=q.front();q.pop();
                for(int k=0;k<4;k++){int nr=r+d[k],nc=c+d[k+1];
                    if(nr>=0&&nc>=0&&nr<m&&nc<n&&grid[nr][nc]==1){grid[nr][nc]=2;fresh--;q.push({nr,nc});}
            }}
        }
        return fresh?-1:mins;
    }
};`, timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=y704fEOx0s0"
    },

    {
        id: 113, title: "Surrounded Regions", category: "Graphs", difficulty: "Medium", sources: ["Neetcode 150", "Striver SDE"], tags: ["DFS", "Matrix"], description: "Capture all 'O' regions surrounded by 'X'. Border-connected 'O's are not captured.", examples: [{ input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', output: 'X everywhere except border-connected Os' }], constraints: ["1<=m,n<=200"], explanation: "DFS from border 'O's to mark safe. Then flip remaining 'O' to 'X' and restore safe ones.", approach: "Mark border-connected O's as safe. Flip remaining O->X. Restore safe->O.", code: `class Solution {
public:
    void solve(vector<vector<char>>& board) {
        int m=board.size(),n=board[0].size();
        for(int i=0;i<m;i++){dfs(board,i,0);dfs(board,i,n-1);}
        for(int j=0;j<n;j++){dfs(board,0,j);dfs(board,m-1,j);}
        for(int i=0;i<m;i++) for(int j=0;j<n;j++){
            if(board[i][j]=='O') board[i][j]='X';
            else if(board[i][j]=='S') board[i][j]='O';
        }
    }
    void dfs(vector<vector<char>>& b,int i,int j){
        if(i<0||j<0||i>=b.size()||j>=b[0].size()||b[i][j]!='O') return;
        b[i][j]='S'; dfs(b,i+1,j);dfs(b,i-1,j);dfs(b,i,j+1);dfs(b,i,j-1);
    }
};`, timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=9z2BunfoZ5Y"
    },

    {
        id: 114, title: "Implement Queue using Stacks", category: "Stack", difficulty: "Easy", sources: ["Neetcode 150", "Google Fav"], tags: ["Stack", "Design"], description: "Implement a FIFO queue using two stacks.", examples: [{ input: "push(1),push(2),peek()->1,pop()->1", output: "1,1" }], constraints: ["1<=x<=9", "At most 100 calls"], explanation: "Use two stacks. Push to input stack. For pop/peek, transfer to output stack if empty.", approach: "inStack for push. outStack for pop/peek. Transfer when outStack empty.", code: `class MyQueue {
    stack<int> in, out;
    void transfer(){ while(!in.empty()){out.push(in.top());in.pop();} }
public:
    void push(int x){in.push(x);}
    int pop(){if(out.empty())transfer();int v=out.top();out.pop();return v;}
    int peek(){if(out.empty())transfer();return out.top();}
    bool empty(){return in.empty()&&out.empty();}
};`, timeComplexity: "O(1) amortized", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=3Et9MrMc02Q"
    },

    {
        id: 115, title: "Find the Duplicate Number", category: "Arrays & Hashing", difficulty: "Medium", sources: ["Striver SDE", "Neetcode 150"], tags: ["Floyd's Cycle", "Two Pointers"], description: "Array of n+1 integers in [1,n] with one duplicate. Find it without modifying array, O(1) space.", examples: [{ input: "nums=[1,3,4,2,2]", output: "2" }], constraints: ["1<=n<=10^5"], explanation: "Treat array as linked list where nums[i] is next pointer. Floyd's cycle detection finds duplicate.", approach: "Floyd's algorithm. slow=nums[slow], fast=nums[nums[fast]]. After meeting, find cycle start.", code: `class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow=nums[0],fast=nums[0];
        do{slow=nums[slow];fast=nums[nums[fast]];}while(slow!=fast);
        slow=nums[0];
        while(slow!=fast){slow=nums[slow];fast=nums[fast];}
        return slow;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=wjYnzkAhcNk"
    },

    {
        id: 116, title: "Copy List with Random Pointer", category: "Linked List", difficulty: "Medium", sources: ["Striver SDE", "Neetcode 150"], tags: ["Linked List", "Hash Map"], description: "Deep copy a linked list where each node has a next and random pointer.", examples: [{ input: "head=[[7,null],[13,0],[11,4],[10,2],[1,0]]", output: "deep copy" }], constraints: ["0<=n<=1000"], explanation: "Interweave cloned nodes with original. Set random pointers. Separate lists.", approach: "Insert clones after each node. Set random = original.random.next. Separate lists.", code: `class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(!head) return nullptr;
        Node* curr=head;
        while(curr){Node* copy=new Node(curr->val);copy->next=curr->next;curr->next=copy;curr=copy->next;}
        curr=head;
        while(curr){if(curr->random) curr->next->random=curr->random->next;curr=curr->next->next;}
        Node* dummy=new Node(0); Node* tail=dummy; curr=head;
        while(curr){tail->next=curr->next;tail=tail->next;curr->next=curr->next->next;curr=curr->next;}
        return dummy->next;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=5Y2EiZST97Y"
    },

    {
        id: 117, title: "Largest Number", category: "Arrays & Hashing", difficulty: "Medium", sources: ["Striver SDE", "Google Fav"], tags: ["Sorting", "String"], description: "Arrange numbers to form the largest number.", examples: [{ input: "nums=[10,2]", output: '"210"' }, { input: "nums=[3,30,34,5,9]", output: '"9534330"' }], constraints: ["1<=nums.length<=100"], explanation: "Custom sort: compare a+b vs b+a as strings. If a+b > b+a, a comes first.", approach: "Convert to strings. Sort with custom comparator a+b > b+a. Concatenate result.", code: `class Solution {
public:
    string largestNumber(vector<int>& nums) {
        vector<string> s;
        for(int n:nums) s.push_back(to_string(n));
        sort(s.begin(),s.end(),[](string& a,string& b){return a+b>b+a;});
        if(s[0]=="0") return "0";
        string res;
        for(auto& x:s) res+=x;
        return res;
    }
};`, timeComplexity: "O(n log n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=WDx6Y4i4xJ8"
    },

    {
        id: 118, title: "Gas Station", category: "Greedy", difficulty: "Medium", sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Greedy", "Array"], description: "Find starting gas station index for a circular route, or -1 if impossible.", examples: [{ input: "gas=[1,2,3,4,5],cost=[3,4,5,1,2]", output: "3" }], constraints: ["1<=n<=10^5"], explanation: "If total gas >= total cost, solution exists. Track running surplus. Reset start when surplus < 0.", approach: "If total>=0, answer exists. Track tank. When tank<0, reset start to next station.", code: `class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int total=0,tank=0,start=0;
        for(int i=0;i<gas.size();i++){
            total+=gas[i]-cost[i];
            tank+=gas[i]-cost[i];
            if(tank<0){start=i+1;tank=0;}
        }
        return total>=0?start:-1;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=lJwbPZGo05A"
    },

    {
        id: 119, title: "Redundant Connection", category: "Graphs", difficulty: "Medium", sources: ["Neetcode 150"], tags: ["Union Find", "Graph"], description: "Find the edge that can be removed to make the graph a tree.", examples: [{ input: "edges=[[1,2],[1,3],[2,3]]", output: "[2,3]" }], constraints: ["3<=n<=1000"], explanation: "Use Union-Find. The first edge connecting already-connected nodes is redundant.", approach: "Process edges with Union-Find. First edge where both endpoints have same root is answer.", code: `class Solution {
    vector<int> parent;
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n=edges.size(); parent.resize(n+1);
        iota(parent.begin(),parent.end(),0);
        for(auto& e:edges) if(find(e[0])==find(e[1])) return e; else parent[find(e[0])]=find(e[1]);
        return {};
    }
    int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}
};`, timeComplexity: "O(n*α(n))", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=FXWRE67PLL0"
    },

    {
        id: 120, title: "Min Cost Climbing Stairs", category: "Dynamic Programming", difficulty: "Easy", sources: ["Neetcode 150"], tags: ["DP"], description: "Pay cost[i] to step on stair i. Can climb 1 or 2 steps. Find min cost to reach top.", examples: [{ input: "cost=[10,15,20]", output: "15" }], constraints: ["2<=cost.length<=1000"], explanation: "dp[i] = min(dp[i-1]+cost[i-1], dp[i-2]+cost[i-2]). Top is past last stair.", approach: "Track two previous values. For each step, take min of stepping from i-1 or i-2.", code: `class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        int a=0,b=0;
        for(int i=2;i<=cost.size();i++){int c=min(a+cost[i-2],b+cost[i-1]);a=b;b=c;}
        return b;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=ktmzAZWkEZ0"
    },
];
