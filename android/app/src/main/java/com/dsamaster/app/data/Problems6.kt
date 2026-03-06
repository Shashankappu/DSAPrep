package com.dsamaster.app.data

import com.dsamaster.app.data.model.Example
import com.dsamaster.app.data.model.Problem

fun getProblems6(): List<Problem> = listOf(
        Problem(
            id = 151,
            title = "Maximum Width of Binary Tree",
            category = "Trees",
            difficulty = "Medium",
            sources = listOf("Striver SDE", "Google Fav"),
            tags = listOf("BFS", "Tree"),
            description = "Find maximum width of binary tree (including nulls between leftmost and rightmost nodes at each level).",
            examples = listOf(
                Example("root=[1,3,2,5,3,null,9]", "4", ""),
            ),
            constraints = listOf("1<=nodes<=3000"),
            explanation = "BFS with position indices. Width at level = rightmost - leftmost + 1. Use modular arithmetic to prevent overflow.",
            approach = "Assign positions: left=2*pos, right=2*pos+1. Track min/max pos per level.",
            code = "class Solution {\npublic:\n    int widthOfBinaryTree(TreeNode* root) {\n        if(!root) return 0;\n        queue<pair<TreeNode*,unsigned long long>> q;\n        q.push({root,0}); int maxW=0;\n        while(!q.empty()){\n            int sz=q.size();\n            unsigned long long left=q.front().second, right;\n            for(int i=0;i<sz;i++){\n                auto[node,pos]=q.front(); q.pop();\n                right=pos;\n                if(node->left) q.push({node->left,2*pos});\n                if(node->right) q.push({node->right,2*pos+1});\n            }\n            maxW=max(maxW,(int)(right-left+1));\n        }\n        return maxW;\n    }\n};",
            timeComplexity = "O(n)",
            spaceComplexity = "O(n)",
            videoUrl = "https://www.youtube.com/watch?v=FPzLE2L7uHs"
        ),
        Problem(
            id = 152,
            title = "Binary Tree Zigzag Level Order",
            category = "Trees",
            difficulty = "Medium",
            sources = listOf("Striver SDE", "Google Fav"),
            tags = listOf("BFS", "Tree"),
            description = "Return zigzag level order traversal (alternating left-right and right-left).",
            examples = listOf(
                Example("root=[3,9,20,null,null,15,7]", "[[3],[20,9],[15,7]]", ""),
            ),
            constraints = listOf("0<=nodes<=2000"),
            explanation = "Standard BFS level order but reverse every other level.",
            approach = "BFS like level order. Flag to alternate direction. Reverse odd-level results.",
            code = "class Solution {\npublic:\n    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {\n        vector<vector<int>> res;\n        if(!root) return res;\n        queue<TreeNode*> q; q.push(root);\n        bool leftToRight=true;\n        while(!q.empty()){\n            int sz=q.size(); vector<int> level(sz);\n            for(int i=0;i<sz;i++){\n                auto* node=q.front();q.pop();\n                level[leftToRight?i:sz-1-i]=node->val;\n                if(node->left)q.push(node->left);\n                if(node->right)q.push(node->right);\n            }\n            res.push_back(level);\n            leftToRight=!leftToRight;\n        }\n        return res;\n    }\n};",
            timeComplexity = "O(n)",
            spaceComplexity = "O(n)",
            videoUrl = "https://www.youtube.com/watch?v=3OXWEdlIGl4"
        ),
        Problem(
            id = 153,
            title = "Flatten Binary Tree to Linked List",
            category = "Trees",
            difficulty = "Medium",
            sources = listOf("Striver SDE"),
            tags = listOf("Tree", "DFS"),
            description = "Flatten binary tree to a linked list in-place (preorder).",
            examples = listOf(
                Example("root=[1,2,5,3,4,null,6]", "[1,null,2,null,3,null,4,null,5,null,6]", ""),
            ),
            constraints = listOf("0<=nodes<=2000"),
            explanation = "Morris-traversal style: for each node, find rightmost of left subtree, connect to right subtree.",
            approach = "For each node with left child: find predecessor, connect right subtree to predecessor's right. Move left to right.",
            code = "class Solution {\npublic:\n    void flatten(TreeNode* root) {\n        TreeNode* curr=root;\n        while(curr){\n            if(curr->left){\n                TreeNode* pred=curr->left;\n                while(pred->right) pred=pred->right;\n                pred->right=curr->right;\n                curr->right=curr->left;\n                curr->left=nullptr;\n            }\n            curr=curr->right;\n        }\n    }\n};",
            timeComplexity = "O(n)",
            spaceComplexity = "O(1)",
            videoUrl = "https://www.youtube.com/watch?v=rKnD7rLT0lI"
        ),
        Problem(
            id = 154,
            title = "Count Good Nodes in Binary Tree",
            category = "Trees",
            difficulty = "Medium",
            sources = listOf("Neetcode 150"),
            tags = listOf("Tree", "DFS"),
            description = "Count nodes where no node on path from root has value greater than the node.",
            examples = listOf(
                Example("root=[3,1,4,3,null,1,5]", "4", "3,3,4,5 are good"),
            ),
            constraints = listOf("1<=nodes<=10^5"),
            explanation = "3,3,4,5 are good",
            approach = "DFS with maxSoFar parameter. If node->val >= maxSoFar, count it. Update maxSoFar.",
            code = "class Solution {\npublic:\n    int goodNodes(TreeNode* root) {\n        return dfs(root, INT_MIN);\n    }\n    int dfs(TreeNode* node, int maxSoFar) {\n        if(!node) return 0;\n        int good = node->val >= maxSoFar ? 1 : 0;\n        maxSoFar = max(maxSoFar, node->val);\n        return good + dfs(node->left, maxSoFar) + dfs(node->right, maxSoFar);\n    }\n};",
            timeComplexity = "O(n)",
            spaceComplexity = "O(h)",
            videoUrl = "https://www.youtube.com/watch?v=7cp5imvDzl4"
        ),
        Problem(
            id = 155,
            title = "Right Side View of Binary Tree",
            category = "Trees",
            difficulty = "Medium",
            sources = listOf("Blind 75", "Neetcode 150", "Striver SDE"),
            tags = listOf("BFS", "Tree"),
            description = "Return values visible from the right side of the binary tree.",
            examples = listOf(
                Example("root=[1,2,3,null,5,null,4]", "[1,3,4]", ""),
            ),
            constraints = listOf("0<=nodes<=100"),
            explanation = "BFS level order, take last node of each level. Or DFS right-first, take first node at each depth.",
            approach = "BFS. For each level, the last element is visible from right side.",
            code = "class Solution {\npublic:\n    vector<int> rightSideView(TreeNode* root) {\n        vector<int> res;\n        if(!root) return res;\n        queue<TreeNode*> q; q.push(root);\n        while(!q.empty()){\n            int sz=q.size();\n            for(int i=0;i<sz;i++){\n                auto* node=q.front(); q.pop();\n                if(i==sz-1) res.push_back(node->val);\n                if(node->left) q.push(node->left);\n                if(node->right) q.push(node->right);\n            }\n        }\n        return res;\n    }\n};",
            timeComplexity = "O(n)",
            spaceComplexity = "O(n)",
            videoUrl = "https://www.youtube.com/watch?v=d4zLyf32e3I"
        )
    )
