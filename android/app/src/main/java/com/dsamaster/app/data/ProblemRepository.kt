package com.dsamaster.app.data

import com.dsamaster.app.data.model.Problem

object ProblemRepository {
    private var _problems: List<Problem>? = null
    
    fun getAllProblems(): List<Problem> {
        if (_problems == null) {
            _problems = buildList {
                addAll(getProblems1())
                addAll(getProblems2())
                addAll(getProblems3())
                addAll(getProblems4())
                addAll(getProblems5())
                addAll(getProblems6())
            }
        }
        return _problems!!
    }
    
    fun getCategories(): List<String> {
        return getAllProblems().map { it.category }.distinct().sorted()
    }
    
    fun getSources(): List<String> {
        return getAllProblems().flatMap { it.sources }.distinct().sorted()
    }
}
