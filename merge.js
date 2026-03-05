// Merge all DSA problem data files into a single array
// This runs before app.js to combine all problem sets
(function () {
    const allProblems = [];

    // Collect from all data files
    if (window.DSA_PROBLEMS) allProblems.push(...window.DSA_PROBLEMS);
    if (window.DSA_PROBLEMS_2) allProblems.push(...window.DSA_PROBLEMS_2);
    if (window.DSA_PROBLEMS_3) allProblems.push(...window.DSA_PROBLEMS_3);
    if (window.DSA_PROBLEMS_4) allProblems.push(...window.DSA_PROBLEMS_4);
    if (window.DSA_PROBLEMS_5) allProblems.push(...window.DSA_PROBLEMS_5);
    if (window.DSA_PROBLEMS_6) allProblems.push(...window.DSA_PROBLEMS_6);
    if (window.DSA_PROBLEMS_7) allProblems.push(...window.DSA_PROBLEMS_7);

    // Set the unified array
    window.DSA_PROBLEMS = allProblems;

    console.log(`DSA Master: Loaded ${allProblems.length} problems`);
})();
