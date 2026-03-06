package com.dsamaster.app.presentation.navigation

import androidx.compose.animation.*
import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.dsamaster.app.presentation.detail.DetailScreen
import com.dsamaster.app.presentation.home.HomeScreen
import com.dsamaster.app.presentation.home.HomeViewModel

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Detail : Screen("detail")
}

@Composable
fun DSANavGraph(
    navController: NavHostController,
    viewModel: HomeViewModel
) {
    val uiState by viewModel.uiState.collectAsState()

    NavHost(
        navController = navController,
        startDestination = Screen.Home.route,
        enterTransition = { slideInHorizontally(initialOffsetX = { it }) + fadeIn() },
        exitTransition = { slideOutHorizontally(targetOffsetX = { -it }) + fadeOut() },
        popEnterTransition = { slideInHorizontally(initialOffsetX = { -it }) + fadeIn() },
        popExitTransition = { slideOutHorizontally(targetOffsetX = { it }) + fadeOut() }
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                viewModel = viewModel,
                onProblemClick = { problem ->
                    viewModel.selectProblem(problem)
                    navController.navigate(Screen.Detail.route)
                }
            )
        }

        composable(Screen.Detail.route) {
            val selectedProblem = uiState.selectedProblem
            if (selectedProblem != null) {
                DetailScreen(
                    problem = selectedProblem,
                    isSolved = selectedProblem.id in uiState.solvedIds,
                    isBookmarked = selectedProblem.id in uiState.bookmarkedIds,
                    hasPrev = uiState.selectedProblemIndex > 0,
                    hasNext = uiState.selectedProblemIndex < uiState.filteredProblems.size - 1,
                    onBack = { navController.popBackStack() },
                    onSolvedClick = { viewModel.toggleSolved(selectedProblem.id) },
                    onBookmarkClick = { viewModel.toggleBookmark(selectedProblem.id) },
                    onPrevClick = { viewModel.navigateToProblem(-1) },
                    onNextClick = { viewModel.navigateToProblem(1) }
                )
            }
        }
    }
}
