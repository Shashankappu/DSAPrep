package com.dsamaster.app.presentation.home

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.dsamaster.app.data.ProblemRepository
import com.dsamaster.app.data.local.UserPreferences
import com.dsamaster.app.data.model.Problem
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class HomeUiState(
    val allProblems: List<Problem> = emptyList(),
    val filteredProblems: List<Problem> = emptyList(),
    val categories: List<String> = emptyList(),
    val sources: List<String> = emptyList(),
    val selectedCategory: String? = null,
    val selectedDifficulty: String? = null,
    val selectedSource: String? = null,
    val searchQuery: String = "",
    val solvedIds: Set<Int> = emptySet(),
    val bookmarkedIds: Set<Int> = emptySet(),
    val showBookmarkedOnly: Boolean = false,
    val isDarkTheme: Boolean = true,
    val selectedProblem: Problem? = null,
    val selectedProblemIndex: Int = -1,
)

class HomeViewModel(application: Application) : AndroidViewModel(application) {
    private val prefs = UserPreferences(application)
    
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        val problems = ProblemRepository.getAllProblems()
        val categories = ProblemRepository.getCategories()
        val sources = ProblemRepository.getSources()
        val solved = prefs.getSolvedIds()
        val bookmarked = prefs.getBookmarkedIds()
        val isDark = prefs.isDarkTheme()
        
        _uiState.update {
            it.copy(
                allProblems = problems,
                filteredProblems = problems,
                categories = categories,
                sources = sources,
                solvedIds = solved,
                bookmarkedIds = bookmarked,
                isDarkTheme = isDark
            )
        }
    }

    fun onSearchQueryChanged(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
        applyFilters()
    }

    fun onCategorySelected(category: String?) {
        _uiState.update { 
            it.copy(selectedCategory = if (it.selectedCategory == category) null else category) 
        }
        applyFilters()
    }

    fun onDifficultySelected(difficulty: String?) {
        _uiState.update { 
            it.copy(selectedDifficulty = if (it.selectedDifficulty == difficulty) null else difficulty) 
        }
        applyFilters()
    }

    fun onSourceSelected(source: String?) {
        _uiState.update { 
            it.copy(selectedSource = if (it.selectedSource == source) null else source)
        }
        applyFilters()
    }

    fun toggleBookmarkFilter() {
        _uiState.update { it.copy(showBookmarkedOnly = !it.showBookmarkedOnly) }
        applyFilters()
    }

    fun toggleSolved(problemId: Int) {
        _uiState.update { state ->
            val newSolved = state.solvedIds.toMutableSet()
            if (newSolved.contains(problemId)) newSolved.remove(problemId)
            else newSolved.add(problemId)
            prefs.setSolvedIds(newSolved)
            state.copy(solvedIds = newSolved)
        }
    }

    fun toggleBookmark(problemId: Int) {
        _uiState.update { state ->
            val newBookmarked = state.bookmarkedIds.toMutableSet()
            if (newBookmarked.contains(problemId)) newBookmarked.remove(problemId)
            else newBookmarked.add(problemId)
            prefs.setBookmarkedIds(newBookmarked)
            state.copy(bookmarkedIds = newBookmarked)
        }
    }

    fun toggleTheme() {
        _uiState.update { state ->
            val newTheme = !state.isDarkTheme
            prefs.setDarkTheme(newTheme)
            state.copy(isDarkTheme = newTheme)
        }
    }

    fun selectProblem(problem: Problem) {
        val index = _uiState.value.filteredProblems.indexOf(problem)
        _uiState.update { it.copy(selectedProblem = problem, selectedProblemIndex = index) }
    }

    fun clearSelectedProblem() {
        _uiState.update { it.copy(selectedProblem = null, selectedProblemIndex = -1) }
    }

    fun navigateToProblem(direction: Int) {
        val state = _uiState.value
        val newIndex = state.selectedProblemIndex + direction
        if (newIndex in state.filteredProblems.indices) {
            _uiState.update {
                it.copy(
                    selectedProblem = state.filteredProblems[newIndex],
                    selectedProblemIndex = newIndex
                )
            }
        }
    }

    fun resetProgress() {
        prefs.setSolvedIds(emptySet())
        prefs.setBookmarkedIds(emptySet())
        _uiState.update { it.copy(solvedIds = emptySet(), bookmarkedIds = emptySet()) }
    }

    fun clearFilters() {
        _uiState.update {
            it.copy(
                selectedCategory = null,
                selectedDifficulty = null,
                selectedSource = null,
                searchQuery = "",
                showBookmarkedOnly = false
            )
        }
        applyFilters()
    }

    private fun applyFilters() {
        _uiState.update { state ->
            var filtered = state.allProblems

            if (state.searchQuery.isNotBlank()) {
                val q = state.searchQuery.lowercase()
                filtered = filtered.filter {
                    it.title.lowercase().contains(q) ||
                    it.category.lowercase().contains(q) ||
                    it.tags.any { t -> t.lowercase().contains(q) } ||
                    it.id.toString().contains(q)
                }
            }

            state.selectedCategory?.let { cat ->
                filtered = filtered.filter { it.category == cat }
            }

            state.selectedDifficulty?.let { diff ->
                filtered = filtered.filter { it.difficulty == diff }
            }

            state.selectedSource?.let { src ->
                filtered = filtered.filter { src in it.sources }
            }

            if (state.showBookmarkedOnly) {
                filtered = filtered.filter { it.id in state.bookmarkedIds }
            }

            state.copy(filteredProblems = filtered)
        }
    }

    // Stats helpers
    fun getSolvedCount(): Int = _uiState.value.solvedIds.size
    fun getTotalCount(): Int = _uiState.value.allProblems.size
    fun getSolvedByDifficulty(difficulty: String): Int =
        _uiState.value.allProblems.count { it.difficulty == difficulty && it.id in _uiState.value.solvedIds }
    fun getTotalByDifficulty(difficulty: String): Int =
        _uiState.value.allProblems.count { it.difficulty == difficulty }
}
