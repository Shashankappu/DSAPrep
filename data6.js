window.DSA_PROBLEMS_6 = [
    {
        id: 121, title: "Trapping Rain Water (Stack)", category: "Stack", difficulty: "Hard", sources: ["Google Fav"], tags: ["Stack", "Monotonic Stack"], description: "Solve trapping rain water using stack approach.", examples: [{ input: "height=[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }], constraints: ["0<=n<=2*10^4"], explanation: "Monotonic decreasing stack. When taller bar found, pop and calculate water trapped between bars.", approach: "Stack of indices. Pop when current > top. Water = min(left,right)-popped height * width.", code: `class Solution {
public:
    int trap(vector<int>& h) {
        stack<int> st; int water=0;
        for(int i=0;i<h.size();i++){
            while(!st.empty()&&h[i]>h[st.top()]){
                int bot=st.top();st.pop();
                if(st.empty()) break;
                int w=i-st.top()-1;
                int ht=min(h[i],h[st.top()])-h[bot];
                water+=w*ht;
            }
            st.push(i);
        }
        return water;
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=ZI2z5pq0TqA"
    },

    {
        id: 122, title: "Letter Combinations of Phone", category: "Backtracking", difficulty: "Medium", sources: ["Neetcode 150", "Striver SDE"], tags: ["Backtracking", "String"], description: "Given digit string, return all possible letter combinations (phone keypad).", examples: [{ input: 'digits="23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }], constraints: ["0<=digits.length<=4"], explanation: "Map each digit to letters. Backtrack through each digit, trying all corresponding letters.", approach: "Backtrack with index. For each digit, try all mapped letters and recurse.", code: `class Solution {
    string mapping[10]={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
public:
    vector<string> letterCombinations(string digits) {
        if(digits.empty()) return {};
        vector<string> res; string curr;
        bt(digits,0,curr,res); return res;
    }
    void bt(string& d,int i,string& c,vector<string>& r){
        if(i==d.size()){r.push_back(c);return;}
        for(char ch:mapping[d[i]-'0']){c+=ch;bt(d,i+1,c,r);c.pop_back();}
    }
};`, timeComplexity: "O(4^n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=0snEunUacZY"
    },

    {
        id: 123, title: "Generate Parentheses", category: "Backtracking", difficulty: "Medium", sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Backtracking", "String"], description: "Generate all valid combinations of n pairs of parentheses.", examples: [{ input: "n=3", output: '["((()))","(()())","(())()","()(())","()()()"]' }], constraints: ["1<=n<=8"], explanation: "Backtrack: add '(' if open<n, add ')' if close<open. When length=2n, valid combination.", approach: "Track open and close count. Add ( if open<n, ) if close<open.", code: `class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> res; string curr;
        bt(n,0,0,curr,res); return res;
    }
    void bt(int n,int o,int c,string& s,vector<string>& r){
        if(s.size()==2*n){r.push_back(s);return;}
        if(o<n){s+='(';bt(n,o+1,c,s,r);s.pop_back();}
        if(c<o){s+=')';bt(n,o,c+1,s,r);s.pop_back();}
    }
};`, timeComplexity: "O(4^n/√n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=s9fokUqJ76A"
    },

    {
        id: 124, title: "Combination Sum II", category: "Backtracking", difficulty: "Medium", sources: ["Neetcode 150", "Striver SDE"], tags: ["Backtracking"], description: "Find unique combinations summing to target. Each number used at most once.", examples: [{ input: "candidates=[10,1,2,7,6,1,5], target=8", output: "[[1,1,6],[1,2,5],[1,7],[2,6]]" }], constraints: ["1<=candidates.length<=100"], explanation: "Sort to handle duplicates. Skip same element at same level of recursion.", approach: "Sort. Backtrack from i+1 (no reuse). Skip duplicates at same recursion level.", code: `class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& c, int target) {
        sort(c.begin(),c.end());
        vector<vector<int>> res; vector<int> curr;
        bt(c,target,0,curr,res); return res;
    }
    void bt(vector<int>& c,int t,int s,vector<int>& cur,vector<vector<int>>& r){
        if(t==0){r.push_back(cur);return;}
        for(int i=s;i<c.size()&&c[i]<=t;i++){
            if(i>s&&c[i]==c[i-1]) continue;
            cur.push_back(c[i]);bt(c,t-c[i],i+1,cur,r);cur.pop_back();
        }
    }
};`, timeComplexity: "O(2^n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=rSA3t6BDDwg"
    },

    {
        id: 125, title: "Subsets II", category: "Backtracking", difficulty: "Medium", sources: ["Neetcode 150", "Striver SDE"], tags: ["Backtracking"], description: "Return all possible subsets (no duplicate subsets). Array may contain duplicates.", examples: [{ input: "nums=[1,2,2]", output: "[[],[1],[1,2],[1,2,2],[2],[2,2]]" }], constraints: ["1<=nums.length<=10"], explanation: "Sort array. When backtracking, skip consecutive duplicates at same level.", approach: "Sort. Backtrack. Skip nums[i]==nums[i-1] when i>start to avoid duplicate subsets.", code: `class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        vector<vector<int>> res; vector<int> curr;
        bt(nums,0,curr,res); return res;
    }
    void bt(vector<int>& n,int s,vector<int>& c,vector<vector<int>>& r){
        r.push_back(c);
        for(int i=s;i<n.size();i++){
            if(i>s&&n[i]==n[i-1]) continue;
            c.push_back(n[i]);bt(n,i+1,c,r);c.pop_back();
        }
    }
};`, timeComplexity: "O(n*2^n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=Vn2v6ajA7U0"
    },

    {
        id: 126, title: "Palindrome Partitioning", category: "Backtracking", difficulty: "Medium", sources: ["Neetcode 150", "Striver SDE"], tags: ["Backtracking", "String"], description: "Partition s such that every substring is a palindrome. Return all possible partitions.", examples: [{ input: 's="aab"', output: '[["a","a","b"],["aa","b"]]' }], constraints: ["1<=s.length<=16"], explanation: "Backtrack: try each prefix. If palindrome, recurse on suffix.", approach: "For each prefix s[start..i], if palindrome, add to partition, recurse on remainder.", code: `class Solution {
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> res; vector<string> curr;
        bt(s,0,curr,res); return res;
    }
    void bt(string& s,int start,vector<string>& c,vector<vector<string>>& r){
        if(start==s.size()){r.push_back(c);return;}
        for(int i=start;i<s.size();i++){
            if(isPalin(s,start,i)){c.push_back(s.substr(start,i-start+1));bt(s,i+1,c,r);c.pop_back();}
        }
    }
    bool isPalin(string& s,int l,int r){while(l<r) if(s[l++]!=s[r--]) return false; return true;}
};`, timeComplexity: "O(n*2^n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=3jvWodd7ht0"
    },

    {
        id: 127, title: "Word Break II", category: "Backtracking", difficulty: "Hard", sources: ["Google Fav", "Striver SDE"], tags: ["Backtracking", "DP", "String"], description: "Return all possible sentences where each word is a dictionary word.", examples: [{ input: 's="catsanddog", wordDict=["cat","cats","and","sand","dog"]', output: '["cats and dog","cat sand dog"]' }], constraints: ["1<=s.length<=20"], explanation: "Backtrack with memoization. Try each prefix in dict. If match, recurse on suffix.", approach: "For each position, try all dict words as prefix. Recurse. Memoize results.", code: `class Solution {
    unordered_map<int,vector<string>> memo;
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(),wordDict.end());
        return bt(s,0,dict);
    }
    vector<string> bt(string& s,int start,unordered_set<string>& dict){
        if(memo.count(start)) return memo[start];
        vector<string> res;
        if(start==s.size()){res.push_back("");return res;}
        for(int i=start;i<s.size();i++){
            string w=s.substr(start,i-start+1);
            if(dict.count(w)) for(auto& sub:bt(s,i+1,dict))
                res.push_back(w+(sub.empty()?"":" "+sub));
        }
        return memo[start]=res;
    }
};`, timeComplexity: "O(2^n)", spaceComplexity: "O(2^n)", videoUrl: "https://www.youtube.com/watch?v=hBCIAt_J40c"
    },

    {
        id: 128, title: "Sudoku Solver", category: "Backtracking", difficulty: "Hard", sources: ["Striver SDE", "Google Fav"], tags: ["Backtracking", "Matrix"], description: "Solve a Sudoku puzzle by filling empty cells.", examples: [{ input: "9x9 board with some filled", output: "completed valid sudoku" }], constraints: ["board is 9x9", "'.' represents empty cells"], explanation: "Try digits 1-9 for each empty cell. Validate row, col, box. Backtrack if invalid.", approach: "Find empty cell. Try 1-9. Check validity. Recurse. Backtrack if no solution.", code: `class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) { solve(board); }
    bool solve(vector<vector<char>>& b){
        for(int i=0;i<9;i++) for(int j=0;j<9;j++){
            if(b[i][j]!='.') continue;
            for(char c='1';c<='9';c++){
                if(isValid(b,i,j,c)){b[i][j]=c;if(solve(b)) return true;b[i][j]='.';}
            }
            return false;
        }
        return true;
    }
    bool isValid(vector<vector<char>>& b,int r,int c,char ch){
        for(int i=0;i<9;i++){
            if(b[r][i]==ch||b[i][c]==ch) return false;
            if(b[3*(r/3)+i/3][3*(c/3)+i%3]==ch) return false;
        }
        return true;
    }
};`, timeComplexity: "O(9^(empty cells))", spaceComplexity: "O(81)", videoUrl: "https://www.youtube.com/watch?v=FWAIf_EVUKE"
    },

    {
        id: 129, title: "Maximal Rectangle", category: "Stack", difficulty: "Hard", sources: ["Striver SDE", "Google Fav"], tags: ["Stack", "DP", "Matrix"], description: "Find the largest rectangle containing only 1's in a binary matrix.", examples: [{ input: 'matrix=[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"]]', output: "6" }], constraints: ["1<=rows,cols<=200"], explanation: "Build histogram heights row by row. Apply largest rectangle in histogram for each row.", approach: "For each row, compute heights (consecutive 1s above). Run histogram max rectangle on each row.", code: `class Solution {
public:
    int maximalRectangle(vector<vector<char>>& matrix) {
        if(matrix.empty()) return 0;
        int n=matrix[0].size(),maxArea=0;
        vector<int> heights(n,0);
        for(auto& row:matrix){
            for(int j=0;j<n;j++) heights[j]=row[j]=='1'?heights[j]+1:0;
            maxArea=max(maxArea,largestRect(heights));
        }
        return maxArea;
    }
    int largestRect(vector<int>& h){
        stack<int> st; int maxA=0;
        for(int i=0;i<=h.size();i++){
            int ht=i==h.size()?0:h[i];
            while(!st.empty()&&ht<h[st.top()]){
                int height=h[st.top()];st.pop();
                int w=st.empty()?i:i-st.top()-1;
                maxA=max(maxA,height*w);
            }
            st.push(i);
        }
        return maxA;
    }
};`, timeComplexity: "O(m*n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=g8bSdXCG-lA"
    },

    {
        id: 130, title: "Design Add and Search Words", category: "Tries", difficulty: "Medium", sources: ["Blind 75", "Neetcode 150"], tags: ["Trie", "DFS", "Design"], description: "Design data structure supporting addWord and search with '.' wildcard.", examples: [{ input: 'addWord("bad"),search("b.d")->true', output: "true" }], constraints: ["1<=word.length<=25"], explanation: "Trie for addWord. For search, DFS handling '.' by trying all 26 children.", approach: "Trie insert normally. Search: if '.', recurse on all children. Else follow specific child.", code: `class WordDictionary {
    struct Node{Node* ch[26]={}; bool end=false;};
    Node* root;
public:
    WordDictionary():root(new Node()){}
    void addWord(string word){
        auto* n=root;
        for(char c:word){if(!n->ch[c-'a'])n->ch[c-'a']=new Node();n=n->ch[c-'a'];}
        n->end=true;
    }
    bool search(string word){return dfs(word,0,root);}
    bool dfs(string& w,int i,Node* n){
        if(!n) return false;
        if(i==w.size()) return n->end;
        if(w[i]!='.') return dfs(w,i+1,n->ch[w[i]-'a']);
        for(int j=0;j<26;j++) if(dfs(w,i+1,n->ch[j])) return true;
        return false;
    }
};`, timeComplexity: "O(m) add, O(26^m) search worst", spaceComplexity: "O(n*m)", videoUrl: "https://www.youtube.com/watch?v=BTf05gs_8iU"
    },

    {
        id: 131, title: "Minimum Path Sum", category: "Dynamic Programming", difficulty: "Medium", sources: ["Striver SDE"], tags: ["DP", "Matrix"], description: "Find path from top-left to bottom-right with minimum sum, moving only right or down.", examples: [{ input: "grid=[[1,3,1],[1,5,1],[4,2,1]]", output: "7" }], constraints: ["1<=m,n<=200"], explanation: "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). Can optimize to 1D.", approach: "1D DP array. Process row by row, adding min of above or left.", code: `class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m=grid.size(),n=grid[0].size();
        vector<int> dp(n);
        for(int i=0;i<m;i++) for(int j=0;j<n;j++){
            if(i==0&&j==0) dp[j]=grid[0][0];
            else if(i==0) dp[j]=dp[j-1]+grid[i][j];
            else if(j==0) dp[j]+=grid[i][j];
            else dp[j]=min(dp[j],dp[j-1])+grid[i][j];
        }
        return dp[n-1];
    }
};`, timeComplexity: "O(m*n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=pGMsrvt0fpk"
    },

    {
        id: 132, title: "Interleaving String", category: "Dynamic Programming", difficulty: "Medium", sources: ["Neetcode 150"], tags: ["DP", "String"], description: "Is s3 formed by interleaving s1 and s2, maintaining relative order?", examples: [{ input: 's1="aabcc",s2="dbbca",s3="aadbbcbcac"', output: "true" }], constraints: ["0<=s1,s2,s3.length<=100"], explanation: "dp[i][j] = whether s3[0..i+j-1] can be formed from s1[0..i-1] and s2[0..j-1].", approach: "2D DP. dp[i][j] true if we can match by taking from s1 or s2.", code: `class Solution {
public:
    bool isInterleave(string s1, string s2, string s3) {
        int m=s1.size(),n=s2.size();
        if(m+n!=s3.size()) return false;
        vector<vector<bool>> dp(m+1,vector<bool>(n+1,false));
        dp[0][0]=true;
        for(int i=0;i<=m;i++) for(int j=0;j<=n;j++){
            if(i>0&&s1[i-1]==s3[i+j-1]) dp[i][j]=dp[i][j]||dp[i-1][j];
            if(j>0&&s2[j-1]==s3[i+j-1]) dp[i][j]=dp[i][j]||dp[i][j-1];
        }
        return dp[m][n];
    }
};`, timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=3Rw3p9LrgvE"
    },

    {
        id: 133, title: "Target Sum", category: "Dynamic Programming", difficulty: "Medium", sources: ["Neetcode 150"], tags: ["DP", "Backtracking"], description: "Assign + or - to each number to achieve target sum. Count number of ways.", examples: [{ input: "nums=[1,1,1,1,1], target=3", output: "5" }], constraints: ["1<=nums.length<=20"], explanation: "Subset sum variant. Find subsets where P - N = target, P + N = sum. So P = (sum+target)/2.", approach: "Convert to subset sum problem. Find subsets summing to (sum+target)/2.", code: `class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int sum=accumulate(nums.begin(),nums.end(),0);
        if((sum+target)%2||abs(target)>sum) return 0;
        int t=(sum+target)/2;
        vector<int> dp(t+1,0); dp[0]=1;
        for(int n:nums) for(int j=t;j>=n;j--) dp[j]+=dp[j-n];
        return dp[t];
    }
};`, timeComplexity: "O(n*sum)", spaceComplexity: "O(sum)", videoUrl: "https://www.youtube.com/watch?v=g0npyaQtAQM"
    },

    {
        id: 134, title: "Distinct Subsequences", category: "Dynamic Programming", difficulty: "Hard", sources: ["Neetcode 150", "Striver SDE"], tags: ["DP", "String"], description: "Count distinct subsequences of s that equal t.", examples: [{ input: 's="rabbbit",t="rabbit"', output: "3" }], constraints: ["1<=s.length,t.length<=1000"], explanation: "dp[i][j] = ways to form t[0..j-1] from s[0..i-1]. If match, add dp[i-1][j-1].", approach: "If chars match: dp[i][j]=dp[i-1][j-1]+dp[i-1][j]. Else: dp[i][j]=dp[i-1][j].", code: `class Solution {
public:
    int numDistinct(string s, string t) {
        int m=s.size(),n=t.size();
        vector<vector<unsigned long long>> dp(m+1,vector<unsigned long long>(n+1,0));
        for(int i=0;i<=m;i++) dp[i][0]=1;
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
            dp[i][j]=dp[i-1][j];
            if(s[i-1]==t[j-1]) dp[i][j]+=dp[i-1][j-1];
        }
        return dp[m][n];
    }
};`, timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=nVG7eTiD2bY"
    },

    {
        id: 135, title: "Best Time Buy/Sell Stock with Cooldown", category: "Dynamic Programming", difficulty: "Medium", sources: ["Neetcode 150"], tags: ["DP", "State Machine"], description: "Buy/sell stock with cooldown (must wait 1 day after selling before buying again).", examples: [{ input: "prices=[1,2,3,0,2]", output: "3", explanation: "buy,sell,cooldown,buy,sell" }], constraints: ["1<=prices.length<=5000"], explanation: "Three states: hold, sold, rest. Transition between states each day.", approach: "hold=max(hold,rest-price). sold=hold+price. rest=max(rest,sold).", code: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int hold=INT_MIN,sold=0,rest=0;
        for(int p:prices){
            int prevSold=sold;
            sold=hold+p;
            hold=max(hold,rest-p);
            rest=max(rest,prevSold);
        }
        return max(sold,rest);
    }
};`, timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=I7j0F7AHpb8"
    },
];
