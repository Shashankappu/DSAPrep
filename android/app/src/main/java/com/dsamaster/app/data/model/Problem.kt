package com.dsamaster.app.data.model

data class Example(
    val input: String,
    val output: String,
    val explanation: String = ""
)

data class Problem(
    val id: Int,
    val title: String,
    val category: String,
    val difficulty: String,
    val sources: List<String>,
    val tags: List<String>,
    val description: String,
    val examples: List<Example>,
    val constraints: List<String>,
    val explanation: String,
    val approach: String,
    val code: String,
    val timeComplexity: String,
    val spaceComplexity: String,
    val videoUrl: String
)
