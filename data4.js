// Problems 81-120: More DP, Tries, Bit Manipulation, Math, Advanced Topics
window.DSA_PROBLEMS_4 = [
    {
        id: 81, title: "Unique Paths", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP", "Math"],
        description: "Robot at top-left of m×n grid. Can only move right or down. Count unique paths to bottom-right.",
        examples: [{ input: "m=3, n=7", output: "28" }], constraints: ["1 <= m, n <= 100"],
        explanation: "dp[i][j] = dp[i-1][j] + dp[i][j-1]. Can optimize to 1D array.",
        approach: "1D DP: dp[j] += dp[j-1] for each row.",
        code: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);
        for (int i=1;i<m;i++)
            for (int j=1;j<n;j++) dp[j] += dp[j-1];
        return dp[n-1];
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=IlEsdxuD4lY"
    },

    {
        id: 82, title: "Longest Common Subsequence", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP", "String"],
        description: "Find the length of the longest common subsequence of two strings.",
        examples: [{ input: 'text1="abcde", text2="ace"', output: "3", explanation: '"ace"' }],
        constraints: ["1 <= length <= 1000"],
        explanation: "dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]. If chars match, dp[i-1][j-1]+1. Else max of skip either.",
        approach: "2D DP table. If match, diagonal+1. Else max(left, above).",
        code: `class Solution {
public:
    int longestCommonSubsequence(string t1, string t2) {
        int m=t1.size(), n=t2.size();
        vector<vector<int>> dp(m+1, vector<int>(n+1,0));
        for (int i=1;i<=m;i++)
            for (int j=1;j<=n;j++)
                dp[i][j] = t1[i-1]==t2[j-1] ? dp[i-1][j-1]+1 : max(dp[i-1][j],dp[i][j-1]);
        return dp[m][n];
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=Ua0GhsJSlWM"
    },

    {
        id: 83, title: "0/1 Knapsack", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Striver SDE"], tags: ["DP"],
        description: "Given weights and values of n items, find max value that fits in capacity W knapsack.",
        examples: [{ input: "W=50, wt=[10,20,30], val=[60,100,120]", output: "220" }],
        constraints: ["1 <= n <= 1000", "1 <= W <= 1000"],
        explanation: "dp[i][w] = max value using first i items with capacity w. Include or exclude current item.",
        approach: "For each item and weight, max of exclude (dp[i-1][w]) or include (val[i]+dp[i-1][w-wt[i]]).",
        code: `int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
    vector<int> dp(W+1, 0);
    for (int i=0;i<n;i++)
        for (int w=W;w>=wt[i];w--)
            dp[w] = max(dp[w], val[i]+dp[w-wt[i]]);
    return dp[W];
}`,
        timeComplexity: "O(n*W)", spaceComplexity: "O(W)", videoUrl: "https://www.youtube.com/watch?v=8LusJS5-AGo"
    },

    {
        id: 84, title: "Edit Distance", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Neetcode 150", "Striver SDE", "Google Fav"], tags: ["DP", "String"],
        description: "Find minimum operations (insert, delete, replace) to convert word1 to word2.",
        examples: [{ input: 'word1="horse", word2="ros"', output: "3" }],
        constraints: ["0 <= length <= 500"],
        explanation: "dp[i][j] = min ops for word1[0..i-1] to word2[0..j-1]. If match, diagonal. Else 1+min(insert,delete,replace).",
        approach: "2D DP. If chars match, dp[i-1][j-1]. Else 1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
        code: `class Solution {
public:
    int minDistance(string w1, string w2) {
        int m=w1.size(), n=w2.size();
        vector<vector<int>> dp(m+1,vector<int>(n+1));
        for (int i=0;i<=m;i++) dp[i][0]=i;
        for (int j=0;j<=n;j++) dp[0][j]=j;
        for (int i=1;i<=m;i++)
            for (int j=1;j<=n;j++)
                dp[i][j] = w1[i-1]==w2[j-1] ? dp[i-1][j-1] : 1+min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]});
        return dp[m][n];
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=XYi2-LPrwm4"
    },

    {
        id: 85, title: "Maximum Product Subarray", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP", "Array"],
        description: "Find the contiguous subarray with the largest product.",
        examples: [{ input: "nums=[2,3,-2,4]", output: "6" }, { input: "nums=[-2,0,-1]", output: "0" }],
        constraints: ["1 <= nums.length <= 2*10^4"],
        explanation: "Track both max and min products (negative * negative = positive). Update both at each step.",
        approach: "Track curMax and curMin. For each num, swap if num is negative. Update max and min.",
        code: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int result=nums[0], curMax=1, curMin=1;
        for (int n : nums) {
            if (n<0) swap(curMax, curMin);
            curMax = max(n, curMax*n);
            curMin = min(n, curMin*n);
            result = max(result, curMax);
        }
        return result;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=lXVy6YWFcRM"
    },

    {
        id: 86, title: "Partition Equal Subset Sum", category: "Dynamic Programming", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["DP", "Subset Sum"],
        description: "Can you partition array into two subsets with equal sum?",
        examples: [{ input: "nums=[1,5,11,5]", output: "true", explanation: "[1,5,5] and [11]" }],
        constraints: ["1 <= nums.length <= 200"],
        explanation: "If total sum is odd, impossible. Otherwise, find subset with sum = total/2 (subset sum problem).",
        approach: "Target = sum/2. Use 1D DP boolean array. For each num, update dp[j] |= dp[j-num].",
        code: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(),nums.end(),0);
        if (sum%2) return false;
        int target = sum/2;
        vector<bool> dp(target+1, false);
        dp[0] = true;
        for (int n : nums)
            for (int j=target;j>=n;j--) dp[j] = dp[j]||dp[j-n];
        return dp[target];
    }
};`,
        timeComplexity: "O(n*sum)", spaceComplexity: "O(sum)", videoUrl: "https://www.youtube.com/watch?v=IsvocB5BJhw"
    },

    // TRIES
    {
        id: 87, title: "Implement Trie (Prefix Tree)", category: "Tries", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Trie", "Design"],
        description: "Implement a trie with insert, search, and startsWith methods.",
        examples: [{ input: 'insert("apple"), search("apple")->true, startsWith("app")->true', output: "true, true" }],
        constraints: ["1 <= word.length <= 2000"],
        explanation: "Each node has 26 children (one per letter). Mark end of word. Follow path for search/prefix.",
        approach: "TrieNode with children array and isEnd flag. Insert/search by traversing character paths.",
        code: `class Trie {
    struct TrieNode {
        TrieNode* children[26] = {};
        bool isEnd = false;
    };
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}
    void insert(string word) {
        auto* node = root;
        for (char c : word) {
            if (!node->children[c-'a']) node->children[c-'a']=new TrieNode();
            node = node->children[c-'a'];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        auto* node = find(word);
        return node && node->isEnd;
    }
    bool startsWith(string prefix) { return find(prefix) != nullptr; }
    TrieNode* find(string& s) {
        auto* node = root;
        for (char c : s) {
            if (!node->children[c-'a']) return nullptr;
            node = node->children[c-'a'];
        }
        return node;
    }
};`,
        timeComplexity: "O(m) per op", spaceComplexity: "O(n*m)", videoUrl: "https://www.youtube.com/watch?v=oobqoCJlHA0"
    },

    {
        id: 88, title: "Word Search II", category: "Tries", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Google Fav"], tags: ["Trie", "Backtracking", "Matrix"],
        description: "Find all words from dictionary that exist in a 2D board.",
        examples: [{ input: 'board=[["o","a","a","n"],["e","t","a","e"]], words=["oath","pea","eat","rain"]', output: '["eat","oath"]' }],
        constraints: ["1 <= m, n <= 12", "1 <= words.length <= 3*10^4"],
        explanation: "Build trie from words. DFS on board following trie paths. Much faster than searching each word separately.",
        approach: "Insert all words in trie. DFS from each cell following trie. When word end found, add to result.",
        code: `class Solution {
    struct Trie {
        Trie* ch[26]={}; string* word=nullptr;
        void insert(string& w) {
            Trie* n=this;
            for (char c:w){if(!n->ch[c-'a'])n->ch[c-'a']=new Trie();n=n->ch[c-'a'];}
            n->word=&w;
        }
    };
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        Trie root;
        for (auto& w:words) root.insert(w);
        vector<string> res;
        for (int i=0;i<board.size();i++)
            for (int j=0;j<board[0].size();j++) dfs(board,&root,i,j,res);
        return res;
    }
    void dfs(vector<vector<char>>& b,Trie* node,int i,int j,vector<string>& res){
        if (i<0||j<0||i>=b.size()||j>=b[0].size()||b[i][j]=='#') return;
        char c=b[i][j];
        if (!node->ch[c-'a']) return;
        node=node->ch[c-'a'];
        if (node->word) { res.push_back(*node->word); node->word=nullptr; }
        b[i][j]='#';
        dfs(b,node,i+1,j,res);dfs(b,node,i-1,j,res);
        dfs(b,node,i,j+1,res);dfs(b,node,i,j-1,res);
        b[i][j]=c;
    }
};`,
        timeComplexity: "O(m*n*4^L)", spaceComplexity: "O(sum of word lengths)", videoUrl: "https://www.youtube.com/watch?v=asbcE9mZz_U"
    },

    // BIT MANIPULATION
    {
        id: 89, title: "Number of 1 Bits", category: "Bit Manipulation", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Bit Manipulation"],
        description: "Return the number of '1' bits in an unsigned integer (Hamming weight).",
        examples: [{ input: "n = 11 (1011)", output: "3" }], constraints: ["0 <= n <= 2^31 - 1"],
        explanation: "n & (n-1) clears the lowest set bit. Count how many times until n becomes 0.",
        approach: "While n != 0, do n &= (n-1) and increment count.",
        code: `class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count = 0;
        while (n) { n &= (n-1); count++; }
        return count;
    }
};`,
        timeComplexity: "O(k) k=set bits", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=5Km3utixwZs"
    },

    {
        id: 90, title: "Counting Bits", category: "Bit Manipulation", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Bit Manipulation", "DP"],
        description: "For every number 0 to n, count the number of 1s in binary representation.",
        examples: [{ input: "n = 5", output: "[0,1,1,2,1,2]" }], constraints: ["0 <= n <= 10^5"],
        explanation: "dp[i] = dp[i>>1] + (i&1). Number of 1s = number of 1s in i/2 + last bit.",
        approach: "For each i, result[i] = result[i>>1] + (i&1).",
        code: `class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> dp(n+1);
        for (int i=1;i<=n;i++) dp[i] = dp[i>>1] + (i&1);
        return dp;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)", videoUrl: "https://www.youtube.com/watch?v=RyBM56RIWrM"
    },

    {
        id: 91, title: "Reverse Bits", category: "Bit Manipulation", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Bit Manipulation"],
        description: "Reverse bits of a 32-bit unsigned integer.",
        examples: [{ input: "n = 43261596", output: "964176192" }], constraints: ["Input is 32-bit unsigned"],
        explanation: "Extract each bit from right, place it from left in result. Shift result left, n right.",
        approach: "For 32 iterations: result = (result<<1) | (n&1); n >>= 1.",
        code: `class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t result = 0;
        for (int i=0;i<32;i++) { result = (result<<1)|(n&1); n>>=1; }
        return result;
    }
};`,
        timeComplexity: "O(1)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=UcoN6UjAI64"
    },

    {
        id: 92, title: "Missing Number", category: "Bit Manipulation", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Bit Manipulation", "Math"],
        description: "Given array containing n distinct numbers in [0,n], find the missing one.",
        examples: [{ input: "nums = [3,0,1]", output: "2" }], constraints: ["n == nums.length"],
        explanation: "XOR all numbers 0..n with all array elements. Remaining value is missing number.",
        approach: "XOR all indices and values. Pairs cancel, leaving missing number.",
        code: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n=nums.size(), result=n;
        for (int i=0;i<n;i++) result ^= i ^ nums[i];
        return result;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=WnPLSRLSANE"
    },

    {
        id: 93, title: "Sum of Two Integers", category: "Bit Manipulation", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Bit Manipulation"],
        description: "Calculate sum of two integers without using + or - operators.",
        examples: [{ input: "a=1, b=2", output: "3" }], constraints: ["-1000 <= a, b <= 1000"],
        explanation: "XOR gives sum without carry. AND shifted left gives carry. Repeat until no carry.",
        approach: "While b!=0: carry = a&b, a = a^b, b = carry<<1.",
        code: `class Solution {
public:
    int getSum(int a, int b) {
        while (b) {
            int carry = a & b;
            a = a ^ b;
            b = (unsigned)carry << 1;
        }
        return a;
    }
};`,
        timeComplexity: "O(1)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=gVUrDV4tZfY"
    },

    {
        id: 94, title: "Rotate Image", category: "Matrix", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Matrix"],
        description: "Rotate an n×n 2D matrix 90 degrees clockwise in-place.",
        examples: [{ input: "matrix=[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" }],
        constraints: ["1 <= n <= 20"],
        explanation: "Transpose the matrix (swap rows and columns), then reverse each row.",
        approach: "First transpose (swap matrix[i][j] with matrix[j][i]). Then reverse each row.",
        code: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i=0;i<n;i++)
            for (int j=i+1;j<n;j++) swap(matrix[i][j], matrix[j][i]);
        for (auto& row : matrix) reverse(row.begin(), row.end());
    }
};`,
        timeComplexity: "O(n²)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=fMSJSS7eO1w"
    },

    {
        id: 95, title: "Spiral Matrix", category: "Matrix", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Matrix"],
        description: "Return all elements of the matrix in spiral order.",
        examples: [{ input: "matrix=[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }],
        constraints: ["1 <= m, n <= 10"],
        explanation: "Traverse right, down, left, up. Shrink boundaries after each direction.",
        approach: "Track top, bottom, left, right boundaries. Traverse and shrink after each direction.",
        code: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        int top=0, bot=matrix.size()-1, left=0, right=matrix[0].size()-1;
        while (top<=bot && left<=right) {
            for (int j=left;j<=right;j++) res.push_back(matrix[top][j]); top++;
            for (int i=top;i<=bot;i++) res.push_back(matrix[i][right]); right--;
            if (top<=bot) { for (int j=right;j>=left;j--) res.push_back(matrix[bot][j]); bot--; }
            if (left<=right) { for (int i=bot;i>=top;i--) res.push_back(matrix[i][left]); left++; }
        }
        return res;
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=BJnMZNwUk1M"
    },

    {
        id: 96, title: "Set Matrix Zeroes", category: "Matrix", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Matrix"],
        description: "If an element is 0, set its entire row and column to 0. Do it in-place.",
        examples: [{ input: "matrix=[[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" }],
        constraints: ["1 <= m, n <= 200"],
        explanation: "Use first row and first column as markers. Track if first row/col itself needs zeroing.",
        approach: "Mark first row/col for zeros. Use first row and col as flags. Process inner matrix, then edges.",
        code: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m=matrix.size(), n=matrix[0].size();
        bool firstRow=false, firstCol=false;
        for (int i=0;i<m;i++) if (matrix[i][0]==0) firstCol=true;
        for (int j=0;j<n;j++) if (matrix[0][j]==0) firstRow=true;
        for (int i=1;i<m;i++)
            for (int j=1;j<n;j++)
                if (matrix[i][j]==0) { matrix[i][0]=0; matrix[0][j]=0; }
        for (int i=1;i<m;i++)
            for (int j=1;j<n;j++)
                if (matrix[i][0]==0||matrix[0][j]==0) matrix[i][j]=0;
        if (firstRow) for (int j=0;j<n;j++) matrix[0][j]=0;
        if (firstCol) for (int i=0;i<m;i++) matrix[i][0]=0;
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=T41rL0L3Pnw"
    },

    // MORE DP
    {
        id: 97, title: "Longest Increasing Path in Matrix", category: "Dynamic Programming", difficulty: "Hard",
        sources: ["Neetcode 150", "Google Fav"], tags: ["DFS", "DP", "Matrix"],
        description: "Find the longest increasing path in a matrix.",
        examples: [{ input: "matrix=[[9,9,4],[6,6,8],[2,1,1]]", output: "4", explanation: "1->2->6->9" }],
        constraints: ["1 <= m, n <= 200"],
        explanation: "DFS with memoization from each cell. Only move to neighbors with strictly greater value.",
        approach: "Memo[i][j] stores longest path from (i,j). DFS to all 4 neighbors with larger value.",
        code: `class Solution {
    vector<vector<int>> memo;
    int dirs[5]={0,1,0,-1,0};
public:
    int longestIncreasingPath(vector<vector<int>>& matrix) {
        int m=matrix.size(), n=matrix[0].size(), ans=0;
        memo.assign(m, vector<int>(n,0));
        for (int i=0;i<m;i++)
            for (int j=0;j<n;j++) ans=max(ans, dfs(matrix,i,j));
        return ans;
    }
    int dfs(vector<vector<int>>& mat, int i, int j) {
        if (memo[i][j]) return memo[i][j];
        int best=1;
        for (int d=0;d<4;d++) {
            int ni=i+dirs[d], nj=j+dirs[d+1];
            if (ni>=0&&nj>=0&&ni<mat.size()&&nj<mat[0].size()&&mat[ni][nj]>mat[i][j])
                best = max(best, 1+dfs(mat,ni,nj));
        }
        return memo[i][j]=best;
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=wCc_nd-GiDw"
    },

    {
        id: 98, title: "Regular Expression Matching", category: "Dynamic Programming", difficulty: "Hard",
        sources: ["Neetcode 150", "Google Fav"], tags: ["DP", "String"],
        description: "Implement regex matching with '.' (any char) and '*' (zero or more of preceding).",
        examples: [{ input: 's="aa", p="a*"', output: "true" }, { input: 's="ab", p=".*"', output: "true" }],
        constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20"],
        explanation: "dp[i][j] = whether s[0..i-1] matches p[0..j-1]. Handle '.' and '*' cases.",
        approach: "2D DP. If '*', either skip pattern pair (0 match) or match current char and advance s.",
        code: `class Solution {
public:
    bool isMatch(string s, string p) {
        int m=s.size(), n=p.size();
        vector<vector<bool>> dp(m+1, vector<bool>(n+1,false));
        dp[0][0]=true;
        for (int j=1;j<=n;j++)
            if (p[j-1]=='*') dp[0][j]=dp[0][j-2];
        for (int i=1;i<=m;i++)
            for (int j=1;j<=n;j++) {
                if (p[j-1]=='.'||p[j-1]==s[i-1]) dp[i][j]=dp[i-1][j-1];
                else if (p[j-1]=='*') {
                    dp[i][j]=dp[i][j-2]; // 0 matches
                    if (p[j-2]=='.'||p[j-2]==s[i-1]) dp[i][j]=dp[i][j]||dp[i-1][j];
                }
            }
        return dp[m][n];
    }
};`,
        timeComplexity: "O(m*n)", spaceComplexity: "O(m*n)", videoUrl: "https://www.youtube.com/watch?v=HAA8mgxlov8"
    },

    {
        id: 99, title: "Burst Balloons", category: "Dynamic Programming", difficulty: "Hard",
        sources: ["Neetcode 150"], tags: ["DP", "Interval DP"],
        description: "Burst balloons to maximize coins. Coins for balloon i = nums[left]*nums[i]*nums[right].",
        examples: [{ input: "nums=[3,1,5,8]", output: "167" }], constraints: ["1 <= n <= 300"],
        explanation: "Think of which balloon to burst LAST in range [l,r]. dp[l][r] = max coins for range.",
        approach: "Interval DP. For each range, try each balloon as last to burst. Result = dp[0][n-1].",
        code: `class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n=nums.size();
        nums.insert(nums.begin(),1); nums.push_back(1);
        vector<vector<int>> dp(n+2, vector<int>(n+2,0));
        for (int len=1;len<=n;len++)
            for (int l=1;l<=n-len+1;l++) {
                int r=l+len-1;
                for (int k=l;k<=r;k++)
                    dp[l][r]=max(dp[l][r], dp[l][k-1]+nums[l-1]*nums[k]*nums[r+1]+dp[k+1][r]);
            }
        return dp[1][n];
    }
};`,
        timeComplexity: "O(n³)", spaceComplexity: "O(n²)", videoUrl: "https://www.youtube.com/watch?v=VFskby7lUbw"
    },

    {
        id: 100, title: "LRU Cache", category: "Design", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Hash Map", "Linked List", "Design"],
        description: "Design LRU cache supporting get and put in O(1) time.",
        examples: [{ input: "LRUCache(2), put(1,1), put(2,2), get(1)->1, put(3,3), get(2)->-1", output: "1, -1" }],
        constraints: ["1 <= capacity <= 3000"],
        explanation: "Doubly linked list for order + hash map for O(1) access. Most recently used at head.",
        approach: "Hash map: key -> list iterator. On access, move to front. On capacity overflow, evict from back.",
        code: `class LRUCache {
    int cap;
    list<pair<int,int>> dll;
    unordered_map<int, list<pair<int,int>>::iterator> cache;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!cache.count(key)) return -1;
        dll.splice(dll.begin(), dll, cache[key]);
        return cache[key]->second;
    }
    void put(int key, int value) {
        if (cache.count(key)) {
            cache[key]->second = value;
            dll.splice(dll.begin(), dll, cache[key]);
        } else {
            if (dll.size()==cap) { cache.erase(dll.back().first); dll.pop_back(); }
            dll.push_front({key, value});
            cache[key] = dll.begin();
        }
    }
};`,
        timeComplexity: "O(1) per op", spaceComplexity: "O(capacity)", videoUrl: "https://www.youtube.com/watch?v=7ABFKPK2hD4"
    },

    // MORE PROBLEMS
    {
        id: 101, title: "Detect Cycle in Linked List II", category: "Linked List", difficulty: "Medium",
        sources: ["Striver SDE", "Google Fav"], tags: ["Linked List", "Two Pointers"],
        description: "Find the node where the cycle begins in a linked list, or null if no cycle.",
        examples: [{ input: "head=[3,2,0,-4], pos=1", output: "node with val 2" }],
        constraints: ["0 <= nodes <= 10^4"],
        explanation: "Floyd's: after meeting, move one pointer to head. Both move 1 step. They meet at cycle start.",
        approach: "Fast/slow detect cycle. Reset one to head. Both move 1 step. Meeting point = cycle start.",
        code: `class Solution {
public:
    ListNode* detectCycle(ListNode* head) {
        ListNode *slow=head, *fast=head;
        while (fast && fast->next) {
            slow=slow->next; fast=fast->next->next;
            if (slow==fast) {
                slow=head;
                while (slow!=fast) { slow=slow->next; fast=fast->next; }
                return slow;
            }
        }
        return nullptr;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=wjYnzkAhcNk"
    },

    {
        id: 102, title: "Sort Colors (Dutch National Flag)", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Striver SDE", "Google Fav"], tags: ["Two Pointers", "Sorting"],
        description: "Sort an array with values 0, 1, 2 in-place (Dutch National Flag problem).",
        examples: [{ input: "nums=[2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }],
        constraints: ["1 <= n <= 300"],
        explanation: "Three pointers: lo for 0s, mid for 1s, hi for 2s. Partition in single pass.",
        approach: "lo=0, mid=0, hi=n-1. If 0: swap with lo. If 2: swap with hi. If 1: advance mid.",
        code: `class Solution {
public:
    void sortColors(vector<int>& nums) {
        int lo=0, mid=0, hi=nums.size()-1;
        while (mid<=hi) {
            if (nums[mid]==0) swap(nums[lo++],nums[mid++]);
            else if (nums[mid]==2) swap(nums[mid],nums[hi--]);
            else mid++;
        }
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=4xbWSRZHqac"
    },

    {
        id: 103, title: "Next Permutation", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Striver SDE", "Google Fav"], tags: ["Array", "Two Pointers"],
        description: "Find the next lexicographically greater permutation. If last, return first.",
        examples: [{ input: "nums=[1,2,3]", output: "[1,3,2]" }, { input: "nums=[3,2,1]", output: "[1,2,3]" }],
        constraints: ["1 <= nums.length <= 100"],
        explanation: "Find rightmost pair where nums[i]<nums[i+1]. Swap nums[i] with next larger element from right. Reverse suffix.",
        approach: "1) Find largest i where a[i]<a[i+1]. 2) Find largest j where a[j]>a[i]. 3) Swap. 4) Reverse suffix.",
        code: `class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n=nums.size(), i=n-2;
        while (i>=0 && nums[i]>=nums[i+1]) i--;
        if (i>=0) {
            int j=n-1;
            while (nums[j]<=nums[i]) j--;
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin()+i+1, nums.end());
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=LuLCLgMElus"
    },

    {
        id: 104, title: "Pow(x, n) - Fast Exponentiation", category: "Math", difficulty: "Medium",
        sources: ["Striver SDE", "Google Fav"], tags: ["Math", "Recursion"],
        description: "Implement pow(x, n), calculating x raised to the power n.",
        examples: [{ input: "x=2.0, n=10", output: "1024.0" }, { input: "x=2.0, n=-2", output: "0.25" }],
        constraints: ["-100 < x < 100", "-2^31 <= n <= 2^31-1"],
        explanation: "Binary exponentiation: if n is even, x^n = (x²)^(n/2). If odd, x * x^(n-1).",
        approach: "Handle negative n. Square x and halve n iteratively. Multiply result when n is odd.",
        code: `class Solution {
public:
    double myPow(double x, int n) {
        long long N=n;
        if (N<0) { x=1/x; N=-N; }
        double result=1;
        while (N) {
            if (N&1) result*=x;
            x*=x; N>>=1;
        }
        return result;
    }
};`,
        timeComplexity: "O(log n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=g9YQyYi4IQQ"
    },

    {
        id: 105, title: "Majority Element", category: "Arrays & Hashing", difficulty: "Easy",
        sources: ["Striver SDE", "Neetcode 150"], tags: ["Array", "Boyer-Moore"],
        description: "Find the element appearing more than ⌊n/2⌋ times.",
        examples: [{ input: "nums=[2,2,1,1,1,2,2]", output: "2" }],
        constraints: ["1 <= n <= 5*10^4", "Majority element always exists"],
        explanation: "Boyer-Moore Voting: maintain candidate and count. When count=0, pick new candidate.",
        approach: "Candidate with count. Increment if same, decrement if different. When 0, new candidate.",
        code: `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate=0, count=0;
        for (int n : nums) {
            if (count==0) candidate=n;
            count += (n==candidate) ? 1 : -1;
        }
        return candidate;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=7pnhv842keE"
    },

    {
        id: 106, title: "Reverse Nodes in k-Group", category: "Linked List", difficulty: "Hard",
        sources: ["Striver SDE", "Neetcode 150", "Google Fav"], tags: ["Linked List"],
        description: "Reverse nodes of linked list k at a time.",
        examples: [{ input: "head=[1,2,3,4,5], k=2", output: "[2,1,4,3,5]" }],
        constraints: ["1 <= k <= n <= 5000"],
        explanation: "Count k nodes. If k exist, reverse them, connect to recursively processed rest.",
        approach: "Check if k nodes exist. Reverse k nodes. Recursively process rest. Connect groups.",
        code: `class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode* curr=head;
        int count=0;
        while (curr && count<k) { curr=curr->next; count++; }
        if (count<k) return head;
        ListNode* prev=reverseKGroup(curr, k);
        while (count-->0) {
            ListNode* next=head->next;
            head->next=prev; prev=head; head=next;
        }
        return prev;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n/k)", videoUrl: "https://www.youtube.com/watch?v=1UOPsfP85V4"
    },

    {
        id: 107, title: "Dijkstra's Shortest Path", category: "Graphs", difficulty: "Medium",
        sources: ["Striver SDE", "Google Fav"], tags: ["Graph", "Heap", "Shortest Path"],
        description: "Find shortest path from source to all nodes in weighted graph with non-negative edges.",
        examples: [{ input: "n=5, edges with weights, src=0", output: "shortest distances from 0" }],
        constraints: ["1 <= n <= 10^5"],
        explanation: "Greedy BFS with min-heap. Process nearest unvisited node, relax neighbors.",
        approach: "Min-heap of (dist, node). Pop min. For each neighbor, if shorter path found, push to heap.",
        code: `vector<int> dijkstra(int n, vector<vector<pair<int,int>>>& adj, int src) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u]+w < dist[v]) {
                dist[v] = dist[u]+w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
        timeComplexity: "O((V+E) log V)", spaceComplexity: "O(V+E)", videoUrl: "https://www.youtube.com/watch?v=V6H1qAeB-l4"
    },

    {
        id: 108, title: "Bellman-Ford Algorithm", category: "Graphs", difficulty: "Medium",
        sources: ["Striver SDE"], tags: ["Graph", "Shortest Path", "DP"],
        description: "Find shortest paths from source, handling negative weights. Detect negative cycles.",
        examples: [{ input: "n=5, weighted edges, src=0", output: "shortest distances, or detect negative cycle" }],
        constraints: ["1 <= n <= 500"],
        explanation: "Relax all edges n-1 times. If any edge can still be relaxed, negative cycle exists.",
        approach: "Repeat n-1 times: for each edge, if dist[u]+w < dist[v], update dist[v]. Check nth iteration.",
        code: `vector<int> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    for (int i=0;i<n-1;i++)
        for (auto& e : edges)
            if (dist[e[0]]!=INT_MAX && dist[e[0]]+e[2]<dist[e[1]])
                dist[e[1]] = dist[e[0]]+e[2];
    // Check negative cycle
    for (auto& e : edges)
        if (dist[e[0]]!=INT_MAX && dist[e[0]]+e[2]<dist[e[1]])
            return {}; // negative cycle
    return dist;
}`,
        timeComplexity: "O(V*E)", spaceComplexity: "O(V)", videoUrl: "https://www.youtube.com/watch?v=FtN3BYH2Zes"
    },

    {
        id: 109, title: "Alien Dictionary", category: "Graphs", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Google Fav"], tags: ["Topological Sort", "Graph"],
        description: "Given sorted dictionary of alien language, find order of characters.",
        examples: [{ input: 'words=["wrt","wrf","er","ett","rftt"]', output: '"wertf"' }],
        constraints: ["1 <= words.length <= 100"],
        explanation: "Build directed graph from adjacent word comparisons. Topological sort gives order.",
        approach: "Compare adjacent words to find edges. Run topological sort. Detect invalid input.",
        code: `class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char,unordered_set<char>> adj;
        unordered_map<char,int> indeg;
        for (auto& w:words) for (char c:w) indeg[c]=0;
        for (int i=0;i<words.size()-1;i++) {
            string &w1=words[i], &w2=words[i+1];
            int len=min(w1.size(),w2.size());
            if (w1.size()>w2.size()&&w1.substr(0,len)==w2.substr(0,len)) return "";
            for (int j=0;j<len;j++)
                if (w1[j]!=w2[j]) {
                    if (!adj[w1[j]].count(w2[j])) { adj[w1[j]].insert(w2[j]); indeg[w2[j]]++; }
                    break;
                }
        }
        queue<char> q;
        for (auto& [c,d]:indeg) if (d==0) q.push(c);
        string result;
        while (!q.empty()) {
            char c=q.front(); q.pop(); result+=c;
            for (char nb:adj[c]) if (--indeg[nb]==0) q.push(nb);
        }
        return result.size()==indeg.size() ? result : "";
    }
};`,
        timeComplexity: "O(C)", spaceComplexity: "O(1)", videoUrl: "https://www.youtube.com/watch?v=6kTZYvNNyps"
    },

    {
        id: 110, title: "Minimum Spanning Tree (Kruskal's)", category: "Graphs", difficulty: "Medium",
        sources: ["Striver SDE"], tags: ["Graph", "Union Find", "Greedy"],
        description: "Find minimum spanning tree of a weighted undirected graph using Kruskal's algorithm.",
        examples: [{ input: "n=4, edges sorted by weight", output: "MST edges with minimum total weight" }],
        constraints: ["1 <= n <= 10^5"],
        explanation: "Sort edges by weight. Add edges greedily if they don't form a cycle (Union-Find).",
        approach: "Sort edges by weight. For each edge, if endpoints in different components, add to MST.",
        code: `struct Edge { int u, v, w; };
int parent[100001];
int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }

int kruskalMST(int n, vector<Edge>& edges) {
    sort(edges.begin(),edges.end(),[](auto& a,auto& b){return a.w<b.w;});
    iota(parent, parent+n, 0);
    int cost=0, count=0;
    for (auto& e : edges) {
        int pu=find(e.u), pv=find(e.v);
        if (pu!=pv) { parent[pu]=pv; cost+=e.w; if (++count==n-1) break; }
    }
    return cost;
}`,
        timeComplexity: "O(E log E)", spaceComplexity: "O(V)", videoUrl: "https://www.youtube.com/watch?v=DMnDM_sxVig"
    },
];
