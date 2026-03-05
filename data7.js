window.DSA_PROBLEMS_7 = [
    {
        id: 136, title: "Minimum Interval to Include Each Query", category: "Intervals", difficulty: "Hard", sources: ["Neetcode 150"], tags: ["Sorting", "Heap", "Intervals"], description: "For each query, find smallest interval containing it.", examples: [{ input: "intervals=[[1,4],[2,4],[3,6],[4,4]], queries=[2,3,4,5]", output: "[3,3,1,4]" }], constraints: ["1<=intervals.length<=10^5"], explanation: "Sort intervals and queries. Use min-heap keyed by interval size. Process queries in order.", approach: "Sort both. For each query, add all applicable intervals to heap. Pop expired. Top = answer.", code: `class Solution {
public:
    vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {
        sort(intervals.begin(),intervals.end());
        vector<int> sortedQ=queries;
        sort(sortedQ.begin(),sortedQ.end());
        unordered_map<int,int> res;
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;
        int i=0;
        for(int q:sortedQ){
            while(i<intervals.size()&&intervals[i][0]<=q) {pq.push({intervals[i][1]-intervals[i][0]+1,intervals[i][1]});i++;}
            while(!pq.empty()&&pq.top().second<q) pq.pop();
            res[q]=pq.empty()?-1:pq.top().first;
        }
        vector<int> ans;
        for(int q:queries) ans.push_back(res[q]);
        return ans;
    }
};`, timeComplexity: "O(n log n + q log q)", spaceComplexity: "O(n+q)", videoUrl: "https://www.youtube.com/watch?v=5hQ5WWW5awQ"
    },

    {
        id: 137, title: "Insert Interval", category: "Intervals", difficulty: "Medium", sources: ["Blind 75", "Neetcode 150"], tags: ["Sorting", "Intervals"], description: "Insert a new interval into sorted non-overlapping intervals and merge if necessary.", examples: [{ input: "intervals=[[1,3],[6,9]], newInterval=[2,5]", output: "[[1,5],[6,9]]" }], constraints: ["0<=intervals.length<=10^4"], explanation: "Add all intervals before new one. Merge overlapping ones. Add remaining.", approach: "Collect non-overlapping before. Merge overlapping. Collect remaining after.", code: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        int i=0,n=intervals.size();
        while(i<n&&intervals[i][1]<newInterval[0]) res.push_back(intervals[i++]);
        while(i<n&&intervals[i][0]<=newInterval[1]){
            newInterval[0]=min(newInterval[0],intervals[i][0]);
            newInterval[1]=max(newInterval[1],intervals[i][1]);i++;
        }
        res.push_back(newInterval);
        while(i<n) res.push_back(intervals[i++]);
        return res;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=A8NUOmlR6yc"
    },

    {
        id: 138, title: "Number of 1-Bit Positions", category: "Bit Manipulation", difficulty: "Easy", sources: ["Neetcode 150"], tags: ["Bit Manipulation"], description: "Given two integers, find number of positions where corresponding bits differ (Hamming Distance).", examples: [{ input: "x=1,y=4", output: "2" }], constraints: ["0<=x,y<=2^31-1"], explanation: "XOR gives bits that differ. Count set bits in XOR result.", approach: "xor = x^y. Count set bits using n&(n-1) trick.", code: `class Solution {
public:
    int hammingDistance(int x, int y) {
        int xr=x^y, count=0;
        while(xr){xr&=(xr-1);count++;}
        return count;
    }
};`, timeComplexity: "O(1)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=cS6T9U0m2lg"
    },

    {
        id: 139, title: "Single Number", category: "Bit Manipulation", difficulty: "Easy", sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Bit Manipulation"], description: "Every element appears twice except one. Find the single one.", examples: [{ input: "nums=[4,1,2,1,2]", output: "4" }], constraints: ["1<=nums.length<=3*10^4"], explanation: "XOR all elements. Pairs cancel out, leaving the single number.", approach: "XOR all numbers. Result is the single number.", code: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int result=0;
        for(int n:nums) result^=n;
        return result;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=qMPX1AOa83k"
    },

    {
        id: 140, title: "Number of Distinct Islands", category: "Graphs", difficulty: "Medium", sources: ["Google Fav"], tags: ["DFS", "Hash Set", "Matrix"], description: "Count distinct island shapes in a grid.", examples: [{ input: "grid=[[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]", output: "1" }], constraints: ["1<=m,n<=50"], explanation: "DFS each island, record relative positions from start. Use set of shapes for uniqueness.", approach: "DFS and record path relative to starting cell. Store shapes in set. Count unique.", code: `class Solution {
public:
    int numDistinctIslands(vector<vector<int>>& grid) {
        set<vector<pair<int,int>>> shapes;
        int m=grid.size(),n=grid[0].size();
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)
            if(grid[i][j]==1){
                vector<pair<int,int>> shape;
                dfs(grid,i,j,i,j,shape);
                shapes.insert(shape);
            }
        return shapes.size();
    }
    void dfs(vector<vector<int>>& g,int i,int j,int si,int sj,vector<pair<int,int>>& s){
        if(i<0||j<0||i>=g.size()||j>=g[0].size()||g[i][j]!=1) return;
        g[i][j]=0; s.push_back({i-si,j-sj});
        dfs(g,i+1,j,si,sj,s);dfs(g,i-1,j,si,sj,s);
        dfs(g,i,j+1,si,sj,s);dfs(g,i,j-1,si,sj,s);
    }
};`, timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=4Bo6oS1IRnU"
    },

    {
        id: 141, title: "Swim in Rising Water", category: "Graphs", difficulty: "Hard", sources: ["Neetcode 150"], tags: ["BFS", "Heap", "Binary Search"], description: "Find minimum time t so you can swim from top-left to bottom-right where elevation <= t.", examples: [{ input: "grid=[[0,2],[1,3]]", output: "3" }], constraints: ["1<=n<=50"], explanation: "Modified Dijkstra. Use max-heap tracking max elevation on path. Result = min max elevation path.", approach: "Min-heap of (maxElevation, r, c). Process like Dijkstra. Answer = elevation when reaching (n-1,n-1).", code: `class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n=grid.size();
        priority_queue<tuple<int,int,int>,vector<tuple<int,int,int>>,greater<>> pq;
        vector<vector<bool>> visited(n,vector<bool>(n,false));
        pq.push({grid[0][0],0,0}); visited[0][0]=true;
        int d[]={0,1,0,-1,0};
        while(!pq.empty()){
            auto[t,r,c]=pq.top(); pq.pop();
            if(r==n-1&&c==n-1) return t;
            for(int k=0;k<4;k++){
                int nr=r+d[k],nc=c+d[k+1];
                if(nr>=0&&nc>=0&&nr<n&&nc<n&&!visited[nr][nc]){
                    visited[nr][nc]=true;
                    pq.push({max(t,grid[nr][nc]),nr,nc});
                }
            }
        }
        return -1;
    }
};`, timeComplexity: "O(n² log n)", spaceComplexity: "O(n²)", videoUrl: "https://www.youtube.com/watch?v=amvrKlMLuGY"
    },

    {
        id: 142, title: "Matrix Chain Multiplication", category: "Dynamic Programming", difficulty: "Hard", sources: ["Striver SDE"], tags: ["DP", "Interval DP"], description: "Find minimum number of scalar multiplications to multiply chain of matrices.", examples: [{ input: "dims=[40,20,30,10,30]", output: "26000" }], constraints: ["2<=n<=100"], explanation: "dp[i][j] = min cost to multiply matrices i..j. Try all split points k.", approach: "Interval DP. For each length, try all splits. dp[i][j] = min over k of dp[i][k]+dp[k+1][j]+cost.", code: `int matrixChainOrder(vector<int>& p) {
    int n=p.size()-1;
    vector<vector<int>> dp(n,vector<int>(n,0));
    for(int len=2;len<=n;len++)
        for(int i=0;i<=n-len;i++){
            int j=i+len-1; dp[i][j]=INT_MAX;
            for(int k=i;k<j;k++)
                dp[i][j]=min(dp[i][j],dp[i][k]+dp[k+1][j]+p[i]*p[k+1]*p[j+1]);
        }
    return dp[0][n-1];
}`, timeComplexity: "O(n³)", spaceComplexity: "O(n²)", videoUrl: "https://www.youtube.com/watch?v=prx1psByp7U"
    },

    {
        id: 143, title: "Minimum Number of Platforms", category: "Intervals", difficulty: "Medium", sources: ["Striver SDE", "Google Fav"], tags: ["Sorting", "Greedy"], description: "Find minimum platforms needed at a train station given arrival and departure times.", examples: [{ input: "arr=[900,940,950,1100,1500,1800], dep=[910,1200,1120,1130,1900,2000]", output: "3" }], constraints: ["1<=n<=10^5"], explanation: "Sort arrivals and departures. Use two pointers similar to Meeting Rooms II.", approach: "Sort both arrays. Two pointers: if arrival <= departure, need platform. Else release.", code: `int findPlatform(vector<int>& arr, vector<int>& dep) {
    sort(arr.begin(),arr.end());
    sort(dep.begin(),dep.end());
    int plat=0,maxPlat=0,i=0,j=0,n=arr.size();
    while(i<n){
        if(arr[i]<=dep[j]){plat++;i++;}
        else{plat--;j++;}
        maxPlat=max(maxPlat,plat);
    }
    return maxPlat;
}`, timeComplexity: "O(n log n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=dxVcMDI7vyI"
    },

    {
        id: 144, title: "Shortest Path in Binary Matrix", category: "Graphs", difficulty: "Medium", sources: ["Google Fav"], tags: ["BFS", "Matrix"], description: "Find shortest clear path from top-left to bottom-right in binary matrix (8-directional).", examples: [{ input: "grid=[[0,0,0],[1,1,0],[1,1,0]]", output: "4" }], constraints: ["1<=n<=100"], explanation: "BFS from (0,0). Each level = 1 step. 8 directions. First time reaching (n-1,n-1) = shortest.", approach: "BFS with queue. Check all 8 neighbors. Mark visited. Return level when reaching bottom-right.", code: `class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n=grid.size();
        if(grid[0][0]||grid[n-1][n-1]) return -1;
        queue<pair<int,int>> q; q.push({0,0}); grid[0][0]=1;
        int steps=1;
        while(!q.empty()){
            int sz=q.size();
            while(sz--){
                auto[r,c]=q.front();q.pop();
                if(r==n-1&&c==n-1) return steps;
                for(int dr=-1;dr<=1;dr++) for(int dc=-1;dc<=1;dc++){
                    int nr=r+dr,nc=c+dc;
                    if(nr>=0&&nc>=0&&nr<n&&nc<n&&grid[nr][nc]==0){
                        grid[nr][nc]=1; q.push({nr,nc});
                    }
                }
            }
            steps++;
        }
        return -1;
    }
};`, timeComplexity: "O(n²)", spaceComplexity: "O(n²)", videoUrl: "https://www.youtube.com/watch?v=CABaqMR5PmI"
    },

    {
        id: 145, title: "Accounts Merge", category: "Graphs", difficulty: "Medium", sources: ["Google Fav"], tags: ["Union Find", "DFS"], description: "Merge accounts belonging to same person (share an email).", examples: [{ input: 'accounts=[["John","j1@mail","j2@mail"],["John","j1@mail","j3@mail"]]', output: '[["John","j1@mail","j2@mail","j3@mail"]]' }], constraints: ["1<=accounts.length<=1000"], explanation: "Union-Find on emails. Group emails belonging to same person. Sort and output.", approach: "Map email->first account index. Union accounts sharing emails. Group by root.", code: `class Solution {
    vector<int> parent;
    int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        int n=accounts.size(); parent.resize(n);
        iota(parent.begin(),parent.end(),0);
        unordered_map<string,int> emailOwner;
        for(int i=0;i<n;i++) for(int j=1;j<accounts[i].size();j++){
            if(emailOwner.count(accounts[i][j])) parent[find(i)]=find(emailOwner[accounts[i][j]]);
            else emailOwner[accounts[i][j]]=i;
        }
        unordered_map<int,set<string>> groups;
        for(int i=0;i<n;i++) for(int j=1;j<accounts[i].size();j++)
            groups[find(i)].insert(accounts[i][j]);
        vector<vector<string>> res;
        for(auto&[root,emails]:groups){
            vector<string> merged={accounts[root][0]};
            merged.insert(merged.end(),emails.begin(),emails.end());
            res.push_back(merged);
        }
        return res;
    }
};`, timeComplexity: "O(n*k*α(n))", spaceComplexity: "O(n*k)", videoUrl: "https://www.youtube.com/watch?v=6st4IxEF-90"
    },

    {
        id: 146, title: "Maximum Frequency Stack", category: "Stack", difficulty: "Hard", sources: ["Google Fav"], tags: ["Stack", "Hash Map", "Design"], description: "Design FreqStack: push adds element, pop removes most frequent (LIFO for ties).", examples: [{ input: "push 5,7,5,7,4,5 then pop->5,pop->7,pop->5", output: "5,7,5" }], constraints: ["0<=val<=10^9"], explanation: "Track frequency of each val. Group values by frequency in stacks. Pop from highest freq stack.", approach: "freqMap: val->freq. groupMap: freq->stack of vals. Track maxFreq.", code: `class FreqStack {
    unordered_map<int,int> freq;
    unordered_map<int,stack<int>> group;
    int maxFreq=0;
public:
    void push(int val){
        int f=++freq[val];
        maxFreq=max(maxFreq,f);
        group[f].push(val);
    }
    int pop(){
        int val=group[maxFreq].top();
        group[maxFreq].pop();
        if(group[maxFreq].empty()) maxFreq--;
        freq[val]--;
        return val;
    }
};`, timeComplexity: "O(1) per op", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=Z6idIicFDOE"
    },

    {
        id: 147, title: "Longest Valid Parentheses", category: "Dynamic Programming", difficulty: "Hard", sources: ["Striver SDE", "Google Fav"], tags: ["DP", "Stack"], description: "Find length of longest valid parentheses substring.", examples: [{ input: 's="(()"', output: "2" }, { input: 's=")()())"', output: "4" }], constraints: ["0<=s.length<=3*10^4"], explanation: "Stack-based: push indices. When matched, length = i - stack.top().", approach: "Push -1 as base. For '(' push index. For ')' pop; if empty push i as new base.", code: `class Solution {
public:
    int longestValidParentheses(string s) {
        stack<int> st; st.push(-1);
        int maxLen=0;
        for(int i=0;i<s.size();i++){
            if(s[i]=='(') st.push(i);
            else{st.pop();if(st.empty()) st.push(i); else maxLen=max(maxLen,i-st.top());}
        }
        return maxLen;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=VdQuwtEd10M"
    },

    {
        id: 148, title: "Critical Connections in a Network", category: "Graphs", difficulty: "Hard", sources: ["Google Fav"], tags: ["Graph", "DFS", "Bridges"], description: "Find all bridges (critical connections) in an undirected network.", examples: [{ input: "n=4, connections=[[0,1],[1,2],[2,0],[1,3]]", output: "[[1,3]]" }], constraints: ["2<=n<=10^5"], explanation: "Tarjan's bridge-finding algorithm. Track discovery time and lowest reachable time.", approach: "DFS with disc[] and low[]. Edge (u,v) is bridge if low[v] > disc[u].", code: `class Solution {
    vector<vector<int>> adj, bridges;
    vector<int> disc, low;
    int timer=0;
public:
    vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {
        adj.resize(n); disc.resize(n,-1); low.resize(n);
        for(auto& c:connections){adj[c[0]].push_back(c[1]);adj[c[1]].push_back(c[0]);}
        dfs(0,-1);
        return bridges;
    }
    void dfs(int u, int parent) {
        disc[u]=low[u]=timer++;
        for(int v:adj[u]){
            if(v==parent) continue;
            if(disc[v]==-1){dfs(v,u);low[u]=min(low[u],low[v]);
                if(low[v]>disc[u]) bridges.push_back({u,v});
            } else low[u]=min(low[u],disc[v]);
        }
    }
};`, timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)", videoUrl: "https://www.youtube.com/watch?v=aZXi1unBdJA"
    },

    {
        id: 149, title: "Cheapest Flights Within K Stops", category: "Graphs", difficulty: "Medium", sources: ["Neetcode 150", "Google Fav"], tags: ["Graph", "BFS", "Bellman-Ford"], description: "Find cheapest price from src to dst with at most k stops.", examples: [{ input: "n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1", output: "700" }], constraints: ["1<=n<=100"], explanation: "Modified Bellman-Ford for k+1 iterations, or BFS with level limit.", approach: "Bellman-Ford k+1 iterations. Only relax from previous iteration's distances.", code: `class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<int> dist(n,INT_MAX); dist[src]=0;
        for(int i=0;i<=k;i++){
            vector<int> tmp(dist);
            for(auto& f:flights)
                if(dist[f[0]]!=INT_MAX) tmp[f[1]]=min(tmp[f[1]],dist[f[0]]+f[2]);
            dist=tmp;
        }
        return dist[dst]==INT_MAX?-1:dist[dst];
    }
};`, timeComplexity: "O(k*E)", spaceComplexity: "O(V)", videoUrl: "https://www.youtube.com/watch?v=5eIK3zUdYmE"
    },

    {
        id: 150, title: "Design Twitter", category: "Design", difficulty: "Medium", sources: ["Neetcode 150"], tags: ["Heap", "Hash Map", "Design"], description: "Design simplified Twitter: postTweet, getNewsFeed (10 most recent), follow, unfollow.", examples: [{ input: "postTweet(1,'hello'), getNewsFeed(1)->['hello']", output: "['hello']" }], constraints: ["1<=userId<=500"], explanation: "Hash maps for follows and tweets. Merge k sorted lists (by time) for news feed using heap.", approach: "Map user->tweets, user->follows. getNewsFeed: merge recent tweets from user and followees using min-heap.", code: `class Twitter {
    int time=0;
    unordered_map<int,vector<pair<int,int>>> tweets; // user -> [(time,tweetId)]
    unordered_map<int,unordered_set<int>> follows;
public:
    void postTweet(int userId, int tweetId) { tweets[userId].push_back({time++,tweetId}); }
    vector<int> getNewsFeed(int userId) {
        priority_queue<pair<int,int>> pq;
        auto addTweets=[&](int uid){
            auto& t=tweets[uid];
            for(int i=max(0,(int)t.size()-10);i<t.size();i++) pq.push(t[i]);
        };
        addTweets(userId);
        for(int f:follows[userId]) addTweets(f);
        vector<int> feed;
        while(!pq.empty()&&feed.size()<10){feed.push_back(pq.top().second);pq.pop();}
        return feed;
    }
    void follow(int followerId, int followeeId) { if(followerId!=followeeId) follows[followerId].insert(followeeId); }
    void unfollow(int followerId, int followeeId) { follows[followerId].erase(followeeId); }
};`, timeComplexity: "O(n log n) getNewsFeed", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=pNichitDD2E"
    },

    {
        id: 151, title: "Maximum Width of Binary Tree", category: "Trees", difficulty: "Medium", sources: ["Striver SDE", "Google Fav"], tags: ["BFS", "Tree"], description: "Find maximum width of binary tree (including nulls between leftmost and rightmost nodes at each level).", examples: [{ input: "root=[1,3,2,5,3,null,9]", output: "4" }], constraints: ["1<=nodes<=3000"], explanation: "BFS with position indices. Width at level = rightmost - leftmost + 1. Use modular arithmetic to prevent overflow.", approach: "Assign positions: left=2*pos, right=2*pos+1. Track min/max pos per level.", code: `class Solution {
public:
    int widthOfBinaryTree(TreeNode* root) {
        if(!root) return 0;
        queue<pair<TreeNode*,unsigned long long>> q;
        q.push({root,0}); int maxW=0;
        while(!q.empty()){
            int sz=q.size();
            unsigned long long left=q.front().second, right;
            for(int i=0;i<sz;i++){
                auto[node,pos]=q.front(); q.pop();
                right=pos;
                if(node->left) q.push({node->left,2*pos});
                if(node->right) q.push({node->right,2*pos+1});
            }
            maxW=max(maxW,(int)(right-left+1));
        }
        return maxW;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=FPzLE2L7uHs"
    },

    {
        id: 152, title: "Binary Tree Zigzag Level Order", category: "Trees", difficulty: "Medium", sources: ["Striver SDE", "Google Fav"], tags: ["BFS", "Tree"], description: "Return zigzag level order traversal (alternating left-right and right-left).", examples: [{ input: "root=[3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" }], constraints: ["0<=nodes<=2000"], explanation: "Standard BFS level order but reverse every other level.", approach: "BFS like level order. Flag to alternate direction. Reverse odd-level results.", code: `class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if(!root) return res;
        queue<TreeNode*> q; q.push(root);
        bool leftToRight=true;
        while(!q.empty()){
            int sz=q.size(); vector<int> level(sz);
            for(int i=0;i<sz;i++){
                auto* node=q.front();q.pop();
                level[leftToRight?i:sz-1-i]=node->val;
                if(node->left)q.push(node->left);
                if(node->right)q.push(node->right);
            }
            res.push_back(level);
            leftToRight=!leftToRight;
        }
        return res;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=3OXWEdlIGl4"
    },

    {
        id: 153, title: "Flatten Binary Tree to Linked List", category: "Trees", difficulty: "Medium", sources: ["Striver SDE"], tags: ["Tree", "DFS"], description: "Flatten binary tree to a linked list in-place (preorder).", examples: [{ input: "root=[1,2,5,3,4,null,6]", output: "[1,null,2,null,3,null,4,null,5,null,6]" }], constraints: ["0<=nodes<=2000"], explanation: "Morris-traversal style: for each node, find rightmost of left subtree, connect to right subtree.", approach: "For each node with left child: find predecessor, connect right subtree to predecessor's right. Move left to right.", code: `class Solution {
public:
    void flatten(TreeNode* root) {
        TreeNode* curr=root;
        while(curr){
            if(curr->left){
                TreeNode* pred=curr->left;
                while(pred->right) pred=pred->right;
                pred->right=curr->right;
                curr->right=curr->left;
                curr->left=nullptr;
            }
            curr=curr->right;
        }
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=rKnD7rLT0lI"
    },

    {
        id: 154, title: "Count Good Nodes in Binary Tree", category: "Trees", difficulty: "Medium", sources: ["Neetcode 150"], tags: ["Tree", "DFS"], description: "Count nodes where no node on path from root has value greater than the node.", examples: [{ input: "root=[3,1,4,3,null,1,5]", output: "4", explanation: "3,3,4,5 are good" }], constraints: ["1<=nodes<=10^5"], explanation: "DFS tracking max value seen on path. If node.val >= maxSoFar, it's a good node.", approach: "DFS with maxSoFar parameter. If node->val >= maxSoFar, count it. Update maxSoFar.", code: `class Solution {
public:
    int goodNodes(TreeNode* root) {
        return dfs(root, INT_MIN);
    }
    int dfs(TreeNode* node, int maxSoFar) {
        if(!node) return 0;
        int good = node->val >= maxSoFar ? 1 : 0;
        maxSoFar = max(maxSoFar, node->val);
        return good + dfs(node->left, maxSoFar) + dfs(node->right, maxSoFar);
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(h)", videoUrl: "https://www.youtube.com/watch?v=7cp5imvDzl4"
    },

    {
        id: 155, title: "Right Side View of Binary Tree", category: "Trees", difficulty: "Medium", sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["BFS", "Tree"], description: "Return values visible from the right side of the binary tree.", examples: [{ input: "root=[1,2,3,null,5,null,4]", output: "[1,3,4]" }], constraints: ["0<=nodes<=100"], explanation: "BFS level order, take last node of each level. Or DFS right-first, take first node at each depth.", approach: "BFS. For each level, the last element is visible from right side.", code: `class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> res;
        if(!root) return res;
        queue<TreeNode*> q; q.push(root);
        while(!q.empty()){
            int sz=q.size();
            for(int i=0;i<sz;i++){
                auto* node=q.front(); q.pop();
                if(i==sz-1) res.push_back(node->val);
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
        }
        return res;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=d4zLyf32e3I"
    },
];
