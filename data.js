// DSA Master - Problem Database
// Curated from Neetcode 150, Blind 75, Striver SDE Sheet, Google Interview Favorites
window.DSA_PROBLEMS = [
    // ============================================
    // ARRAYS & HASHING (1-20)
    // ============================================
    {
        id: 1, title: "Two Sum", category: "Arrays & Hashing", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"],
        tags: ["Hash Map", "Array"],
        description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
        examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0]+nums[1]=2+7=9" }, { input: "nums = [3,2,4], target = 6", output: "[1,2]" }],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one solution exists"],
        explanation: "Use a hash map to store each number's index. For each element, check if target-current exists in map. This gives O(1) lookup instead of brute force O(n) inner loop.",
        approach: "Iterate through array. For each element, check if (target - nums[i]) exists in hash map. If yes, return both indices. Otherwise, store nums[i] -> i in map.",
        code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numToIndex;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numToIndex.count(complement)) {
                return {numToIndex[complement], i};
            }
            numToIndex[nums[i]] = i;
        }
        return {};
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)",
        videoUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA"
    },
    {
        id: 2, title: "Contains Duplicate", category: "Arrays & Hashing", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Hash Set", "Array"],
        description: "Given an integer array nums, return true if any value appears at least twice.",
        examples: [{ input: "nums = [1,2,3,1]", output: "true" }, { input: "nums = [1,2,3,4]", output: "false" }],
        constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        explanation: "Insert each element into a hash set. If an element already exists in the set, we found a duplicate.",
        approach: "Use unordered_set. For each num, if it's already in set return true, else insert it.",
        code: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num)) return true;
            seen.insert(num);
        }
        return false;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)",
        videoUrl: "https://www.youtube.com/watch?v=3OamzN90kPg"
    },
    {
        id: 3, title: "Valid Anagram", category: "Arrays & Hashing", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Hash Map", "String"],
        description: "Given two strings s and t, return true if t is an anagram of s.",
        examples: [{ input: 's = "anagram", t = "nagaram"', output: "true" }, { input: 's = "rat", t = "car"', output: "false" }],
        constraints: ["1 <= s.length, t.length <= 5*10^4", "s and t consist of lowercase English letters"],
        explanation: "Count character frequencies in both strings. If all counts match, they are anagrams.",
        approach: "Use a frequency array of size 26. Increment for s, decrement for t. If all zeros, return true.",
        code: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        int freq[26] = {};
        for (int i = 0; i < s.size(); i++) {
            freq[s[i] - 'a']++;
            freq[t[i] - 'a']--;
        }
        for (int f : freq)
            if (f != 0) return false;
        return true;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=9UtInBqnCgA"
    },
    {
        id: 4, title: "Group Anagrams", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Google Fav"], tags: ["Hash Map", "Sorting", "String"],
        description: "Given an array of strings, group the anagrams together.",
        examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }],
        constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100"],
        explanation: "Sort each string to get a canonical key. All anagrams produce the same sorted key. Group by this key using a hash map.",
        approach: "For each string, sort it to create a key, then group in a hash map. Return all groups.",
        code: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& [key, group] : groups) {
            result.push_back(group);
        }
        return result;
    }
};`,
        timeComplexity: "O(n * k log k)", spaceComplexity: "O(n * k)",
        videoUrl: "https://www.youtube.com/watch?v=vzdNOK2oB2E"
    },
    {
        id: 5, title: "Top K Frequent Elements", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Hash Map", "Heap", "Bucket Sort"],
        description: "Given an integer array nums and an integer k, return the k most frequent elements.",
        examples: [{ input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }],
        constraints: ["1 <= nums.length <= 10^5", "1 <= k <= number of unique elements"],
        explanation: "Count frequencies with a hash map, then use bucket sort where index = frequency. Walk buckets from high to low to get top k.",
        approach: "Count frequencies. Create buckets where bucket[i] = elements with frequency i. Iterate from end to collect top k elements.",
        code: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int n : nums) freq[n]++;
        
        vector<vector<int>> buckets(nums.size() + 1);
        for (auto& [num, count] : freq)
            buckets[count].push_back(num);
        
        vector<int> result;
        for (int i = buckets.size() - 1; i >= 0 && result.size() < k; i--)
            for (int num : buckets[i]) {
                result.push_back(num);
                if (result.size() == k) break;
            }
        return result;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)",
        videoUrl: "https://www.youtube.com/watch?v=YPTqKIgVk-k"
    },
    {
        id: 6, title: "Product of Array Except Self", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Array", "Prefix Sum"],
        description: "Given an integer array nums, return an array where answer[i] is the product of all elements except nums[i], without using division.",
        examples: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }, { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }],
        constraints: ["2 <= nums.length <= 10^5", "Solve in O(n) without division"],
        explanation: "Use prefix and suffix products. First pass: left-to-right prefix products. Second pass: right-to-left suffix products multiplied into result.",
        approach: "Build result with prefix products from left. Then multiply suffix products from right in second pass.",
        code: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        return result;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=bNvIQI2wAjk"
    },
    {
        id: 7, title: "Longest Consecutive Sequence", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Hash Set", "Array"],
        description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.",
        examples: [{ input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "Sequence is [1,2,3,4]" }],
        constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        explanation: "Put all numbers in a set. For each number that is the START of a sequence (num-1 not in set), count consecutive numbers forward.",
        approach: "Insert all into set. For each num where num-1 is not in set, count streak length. Track maximum.",
        code: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int maxLen = 0;
        
        for (int num : numSet) {
            if (!numSet.count(num - 1)) {
                int length = 1;
                while (numSet.count(num + length))
                    length++;
                maxLen = max(maxLen, length);
            }
        }
        return maxLen;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)",
        videoUrl: "https://www.youtube.com/watch?v=P6RZZMu_maU"
    },
    {
        id: 8, title: "Valid Sudoku", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Neetcode 150"], tags: ["Hash Set", "Matrix"],
        description: "Determine if a 9x9 Sudoku board is valid. Only filled cells need to be validated.",
        examples: [{ input: "9x9 board with valid partial fill", output: "true" }],
        constraints: ["board.length == 9", "board[i][j] is digit 1-9 or '.'"],
        explanation: "Use hash sets to track digits seen in each row, column, and 3x3 sub-box. If any duplicate found, return false.",
        approach: "For each cell, check if digit already exists in its row set, column set, or box set. Box index = (r/3)*3 + c/3.",
        code: `class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        unordered_set<string> seen;
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') continue;
                char d = board[r][c];
                string row = string(1,d) + "r" + to_string(r);
                string col = string(1,d) + "c" + to_string(c);
                string box = string(1,d) + "b" + to_string(r/3) + to_string(c/3);
                if (seen.count(row) || seen.count(col) || seen.count(box))
                    return false;
                seen.insert(row); seen.insert(col); seen.insert(box);
            }
        }
        return true;
    }
};`,
        timeComplexity: "O(81) = O(1)", spaceComplexity: "O(81) = O(1)",
        videoUrl: "https://www.youtube.com/watch?v=TjFXEUCMqI8"
    },
    {
        id: 9, title: "Encode and Decode Strings", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["String", "Design"],
        description: "Design an algorithm to encode a list of strings into a single string, and decode it back.",
        examples: [{ input: '["hello","world"]', output: '"5#hello5#world"' }],
        constraints: ["0 <= strs.length <= 200", "0 <= strs[i].length <= 200"],
        explanation: "Prefix each string with its length followed by a delimiter '#'. This handles any characters within strings.",
        approach: "Encode: for each string, prepend length + '#'. Decode: read length, skip '#', extract substring of that length.",
        code: `class Codec {
public:
    string encode(vector<string>& strs) {
        string encoded;
        for (const string& s : strs)
            encoded += to_string(s.size()) + "#" + s;
        return encoded;
    }
    
    vector<string> decode(string s) {
        vector<string> result;
        int i = 0;
        while (i < s.size()) {
            int j = s.find('#', i);
            int len = stoi(s.substr(i, j - i));
            result.push_back(s.substr(j + 1, len));
            i = j + 1 + len;
        }
        return result;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)",
        videoUrl: "https://www.youtube.com/watch?v=B1k_sxOSgv8"
    },
    {
        id: 10, title: "Subarray Sum Equals K", category: "Arrays & Hashing", difficulty: "Medium",
        sources: ["Striver SDE", "Google Fav"], tags: ["Hash Map", "Prefix Sum"],
        description: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals k.",
        examples: [{ input: "nums = [1,1,1], k = 2", output: "2" }, { input: "nums = [1,2,3], k = 3", output: "2" }],
        constraints: ["1 <= nums.length <= 2*10^4", "-1000 <= nums[i] <= 1000"],
        explanation: "Use prefix sum with hash map. If prefixSum - k was seen before, those subarrays sum to k. Store frequency of each prefix sum.",
        approach: "Track running prefix sum. Store count of each prefix sum in map. For current sum, add count of (sum - k) to result.",
        code: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> prefixCount;
        prefixCount[0] = 1;
        int sum = 0, count = 0;
        
        for (int num : nums) {
            sum += num;
            if (prefixCount.count(sum - k))
                count += prefixCount[sum - k];
            prefixCount[sum]++;
        }
        return count;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(n)",
        videoUrl: "https://www.youtube.com/watch?v=fFVZt-6sgyo"
    },
    // ============================================
    // TWO POINTERS (11-22)
    // ============================================
    {
        id: 11, title: "Valid Palindrome", category: "Two Pointers", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Two Pointers", "String"],
        description: "Given a string s, return true if it is a palindrome after converting to lowercase and removing non-alphanumeric characters.",
        examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: "true" }, { input: 's = "race a car"', output: "false" }],
        constraints: ["1 <= s.length <= 2*10^5"],
        explanation: "Use two pointers from both ends, skip non-alphanumeric chars, compare lowercase characters.",
        approach: "Left pointer starts at 0, right at end. Skip non-alnum chars. Compare tolower of both. Move inward.",
        code: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=jJXJ16kPFWg"
    },
    {
        id: 12, title: "Two Sum II - Sorted Array", category: "Two Pointers", difficulty: "Medium",
        sources: ["Neetcode 150"], tags: ["Two Pointers", "Array"],
        description: "Given a 1-indexed sorted array, find two numbers that add up to target. Return their indices.",
        examples: [{ input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" }],
        constraints: ["2 <= numbers.length <= 3*10^4", "Array is sorted in non-decreasing order"],
        explanation: "Since array is sorted, use two pointers. If sum < target, move left pointer right. If sum > target, move right pointer left.",
        approach: "Left=0, right=end. If sum equals target, return. If sum < target, l++. If sum > target, r--.",
        code: `class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l = 0, r = numbers.size() - 1;
        while (l < r) {
            int sum = numbers[l] + numbers[r];
            if (sum == target) return {l + 1, r + 1};
            else if (sum < target) l++;
            else r--;
        }
        return {};
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=cQ1Oz4ckceM"
    },
    {
        id: 13, title: "3Sum", category: "Two Pointers", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Two Pointers", "Sorting"],
        description: "Given an array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i!=j!=k and nums[i]+nums[j]+nums[k]==0.",
        examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
        constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
        explanation: "Sort array. Fix one element, then use two pointers on remaining sorted subarray. Skip duplicates to avoid repeated triplets.",
        approach: "Sort. For each i, use two pointers l=i+1, r=end. Skip duplicate values of nums[i], nums[l], nums[r].",
        code: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    result.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return result;
    }
};`,
        timeComplexity: "O(n²)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=jzZsG8n2R9A"
    },
    {
        id: 14, title: "Container With Most Water", category: "Two Pointers", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Google Fav"], tags: ["Two Pointers", "Greedy"],
        description: "Given n vertical lines, find two lines that together with x-axis form a container that holds the most water.",
        examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
        constraints: ["2 <= height.length <= 10^5", "0 <= height[i] <= 10^4"],
        explanation: "Two pointers at both ends. Calculate area = min(h[l],h[r]) * (r-l). Move the shorter line inward since it's the bottleneck.",
        approach: "l=0, r=end. Compute area with min height * width. Move the pointer pointing to shorter line inward.",
        code: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int maxWater = 0;
        
        while (l < r) {
            int area = min(height[l], height[r]) * (r - l);
            maxWater = max(maxWater, area);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxWater;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=UuiTKBwPgAo"
    },
    {
        id: 15, title: "Trapping Rain Water", category: "Two Pointers", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Two Pointers", "Dynamic Programming"],
        description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
        examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
        constraints: ["n == height.length", "0 <= n <= 2*10^4", "0 <= height[i] <= 10^5"],
        explanation: "Water at each position = min(maxLeft, maxRight) - height[i]. Use two pointers tracking maxLeft and maxRight to compute in O(1) space.",
        approach: "Two pointers. Track leftMax and rightMax. Process the smaller side: water = max - height at that pointer.",
        code: `class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        
        while (l < r) {
            if (height[l] < height[r]) {
                leftMax = max(leftMax, height[l]);
                water += leftMax - height[l];
                l++;
            } else {
                rightMax = max(rightMax, height[r]);
                water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=ZI2z5pq0TqA"
    },
    // ============================================
    // SLIDING WINDOW (16-23)
    // ============================================
    {
        id: 16, title: "Best Time to Buy and Sell Stock", category: "Sliding Window", difficulty: "Easy",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE"], tags: ["Sliding Window", "Array"],
        description: "Given an array prices where prices[i] is stock price on day i, find maximum profit from one buy and one sell.",
        examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1), sell on day 5 (price=6), profit=5" }],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        explanation: "Track minimum price seen so far. At each step, check if selling at current price gives better profit than current max.",
        approach: "Keep track of minPrice and maxProfit. For each price, update minPrice and check current profit.",
        code: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, maxProfit = 0;
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=1pkOgXD63yU"
    },
    {
        id: 17, title: "Longest Substring Without Repeating Characters", category: "Sliding Window", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Sliding Window", "Hash Set"],
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [{ input: 's = "abcabcbb"', output: "3", explanation: '"abc" has length 3' }, { input: 's = "bbbbb"', output: "1" }],
        constraints: ["0 <= s.length <= 5*10^4"],
        explanation: "Use sliding window with a hash set. Expand right pointer adding chars. When duplicate found, shrink from left until no duplicate.",
        approach: "Two pointers l,r. Set tracks chars in window. If s[r] in set, remove s[l] and l++. Otherwise add s[r] and update max length.",
        code: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> charSet;
        int l = 0, maxLen = 0;
        
        for (int r = 0; r < s.size(); r++) {
            while (charSet.count(s[r])) {
                charSet.erase(s[l]);
                l++;
            }
            charSet.insert(s[r]);
            maxLen = max(maxLen, r - l + 1);
        }
        return maxLen;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(min(n, 26))",
        videoUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0"
    },
    {
        id: 18, title: "Longest Repeating Character Replacement", category: "Sliding Window", difficulty: "Medium",
        sources: ["Blind 75", "Neetcode 150"], tags: ["Sliding Window", "Hash Map"],
        description: "Given string s and integer k, find the length of the longest substring where you can replace at most k characters to make all characters the same.",
        examples: [{ input: 's = "AABABBA", k = 1', output: "4" }],
        constraints: ["1 <= s.length <= 10^5", "s consists of uppercase English letters", "0 <= k <= s.length"],
        explanation: "Sliding window tracking character frequencies. Window is valid if (windowSize - maxFreq) <= k. If invalid, shrink from left.",
        approach: "Expand window right. Track maxFreq in window. If window_size - maxFreq > k, shrink from left. Update max length.",
        code: `class Solution {
public:
    int characterReplacement(string s, int k) {
        int freq[26] = {};
        int l = 0, maxFreq = 0, maxLen = 0;
        
        for (int r = 0; r < s.size(); r++) {
            freq[s[r] - 'A']++;
            maxFreq = max(maxFreq, freq[s[r] - 'A']);
            
            while ((r - l + 1) - maxFreq > k) {
                freq[s[l] - 'A']--;
                l++;
            }
            maxLen = max(maxLen, r - l + 1);
        }
        return maxLen;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(1)",
        videoUrl: "https://www.youtube.com/watch?v=gqXU1UyA8pk"
    },
    {
        id: 19, title: "Minimum Window Substring", category: "Sliding Window", difficulty: "Hard",
        sources: ["Blind 75", "Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Sliding Window", "Hash Map"],
        description: "Given strings s and t, find the minimum window substring of s that contains all characters of t (including duplicates).",
        examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }],
        constraints: ["1 <= s.length, t.length <= 10^5"],
        explanation: "Expand window to include all chars of t, then shrink from left to find minimum valid window. Track how many chars are satisfied.",
        approach: "Count t's chars. Expand right, decrement counts. When all satisfied (formed==required), shrink left updating min window.",
        code: `class Solution {
public:
    string minWindow(string s, string t) {
        unordered_map<char, int> need, have;
        for (char c : t) need[c]++;
        
        int required = need.size(), formed = 0;
        int l = 0, minLen = INT_MAX, minStart = 0;
        
        for (int r = 0; r < s.size(); r++) {
            have[s[r]]++;
            if (need.count(s[r]) && have[s[r]] == need[s[r]])
                formed++;
            
            while (formed == required) {
                if (r - l + 1 < minLen) {
                    minLen = r - l + 1;
                    minStart = l;
                }
                have[s[l]]--;
                if (need.count(s[l]) && have[s[l]] < need[s[l]])
                    formed--;
                l++;
            }
        }
        return minLen == INT_MAX ? "" : s.substr(minStart, minLen);
    }
};`,
        timeComplexity: "O(n + m)", spaceComplexity: "O(n + m)",
        videoUrl: "https://www.youtube.com/watch?v=jSto0O4AJbM"
    },
    {
        id: 20, title: "Sliding Window Maximum", category: "Sliding Window", difficulty: "Hard",
        sources: ["Neetcode 150", "Striver SDE", "Google Fav"], tags: ["Sliding Window", "Deque", "Monotonic Queue"],
        description: "Given an array nums and sliding window of size k, return the max value in each window position.",
        examples: [{ input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" }],
        constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length"],
        explanation: "Use a monotonic decreasing deque storing indices. Front always has the maximum. Remove elements outside window and smaller elements from back.",
        approach: "Deque stores indices in decreasing order of values. Pop front if out of window. Pop back if smaller than current. Front = window max.",
        code: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> result;
        
        for (int i = 0; i < nums.size(); i++) {
            while (!dq.empty() && dq.front() < i - k + 1)
                dq.pop_front();
            while (!dq.empty() && nums[dq.back()] < nums[i])
                dq.pop_back();
            dq.push_back(i);
            
            if (i >= k - 1)
                result.push_back(nums[dq.front()]);
        }
        return result;
    }
};`,
        timeComplexity: "O(n)", spaceComplexity: "O(k)",
        videoUrl: "https://www.youtube.com/watch?v=DfljaUwZsOk"
    },
];
