package com.dsamaster.app.presentation.home

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.dsamaster.app.data.model.Problem
import com.dsamaster.app.presentation.components.*
import com.dsamaster.app.presentation.theme.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onProblemClick: (Problem) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(
                drawerContainerColor = MaterialTheme.colorScheme.surface,
                modifier = Modifier.width(300.dp)
            ) {
                DrawerContent(
                    viewModel = viewModel,
                    uiState = uiState,
                    onClose = { scope.launch { drawerState.close() } }
                )
            }
        }
    ) {
        Scaffold(
            topBar = {
                HomeTopBar(
                    uiState = uiState,
                    onMenuClick = { scope.launch { drawerState.open() } },
                    onSearchChanged = viewModel::onSearchQueryChanged,
                    onBookmarkFilterClick = viewModel::toggleBookmarkFilter,
                    onThemeToggle = viewModel::toggleTheme
                )
            },
            containerColor = MaterialTheme.colorScheme.background
        ) { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            ) {
                // Active Filters
                ActiveFilters(uiState = uiState, viewModel = viewModel)

                // Results count
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${uiState.filteredProblems.size} problems",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Problem Grid
                if (uiState.filteredProblems.isEmpty()) {
                    EmptyState()
                } else {
                    LazyVerticalGrid(
                        columns = GridCells.Adaptive(minSize = 300.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(
                            items = uiState.filteredProblems,
                            key = { it.id }
                        ) { problem ->
                            ProblemCard(
                                problem = problem,
                                isSolved = problem.id in uiState.solvedIds,
                                isBookmarked = problem.id in uiState.bookmarkedIds,
                                onCardClick = { onProblemClick(problem) },
                                onSolvedClick = { viewModel.toggleSolved(problem.id) },
                                onBookmarkClick = { viewModel.toggleBookmark(problem.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun HomeTopBar(
    uiState: HomeUiState,
    onMenuClick: () -> Unit,
    onSearchChanged: (String) -> Unit,
    onBookmarkFilterClick: () -> Unit,
    onThemeToggle: () -> Unit
) {
    var isSearchExpanded by remember { mutableStateOf(false) }

    TopAppBar(
        title = {
            if (isSearchExpanded) {
                OutlinedTextField(
                    value = uiState.searchQuery,
                    onValueChange = onSearchChanged,
                    placeholder = {
                        Text(
                            "Search problems...",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    textStyle = MaterialTheme.typography.bodyMedium,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = Color.Transparent,
                        focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    ),
                    shape = RoundedCornerShape(12.dp),
                    leadingIcon = {
                        Icon(
                            Icons.Default.Search,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(20.dp)
                        )
                    },
                    trailingIcon = {
                        if (uiState.searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchChanged("") }) {
                                Icon(
                                    Icons.Default.Close,
                                    contentDescription = "Clear",
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                )
            } else {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "⚡",
                        style = MaterialTheme.typography.titleLarge
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "DSA Master",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                }
            }
        },
        navigationIcon = {
            if (!isSearchExpanded) {
                IconButton(onClick = onMenuClick) {
                    Icon(Icons.Default.Menu, contentDescription = "Menu")
                }
            } else {
                IconButton(onClick = { isSearchExpanded = false; onSearchChanged("") }) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
            }
        },
        actions = {
            if (!isSearchExpanded) {
                IconButton(onClick = { isSearchExpanded = true }) {
                    Icon(
                        Icons.Default.Search,
                        contentDescription = "Search",
                        tint = MaterialTheme.colorScheme.onBackground
                    )
                }
            }

            // Progress indicator
            if (!isSearchExpanded) {
                val progress = if (uiState.allProblems.isNotEmpty())
                    uiState.solvedIds.size.toFloat() / uiState.allProblems.size else 0f
                val percent = (progress * 100).toInt()
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                    modifier = Modifier.size(36.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(
                            progress = progress,
                            modifier = Modifier.size(32.dp),
                            strokeWidth = 3.dp,
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
                        )
                        Text(
                            text = "$percent%",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = androidx.compose.ui.unit.TextUnit(8f, androidx.compose.ui.unit.TextUnitType.Sp)
                            ),
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
                Spacer(modifier = Modifier.width(4.dp))
            }

            IconButton(onClick = onBookmarkFilterClick) {
                Icon(
                    imageVector = if (uiState.showBookmarkedOnly) Icons.Filled.Bookmark 
                                  else Icons.Outlined.BookmarkBorder,
                    contentDescription = "Bookmarks",
                    tint = if (uiState.showBookmarkedOnly) BookmarkGold 
                           else MaterialTheme.colorScheme.onBackground
                )
            }
            IconButton(onClick = onThemeToggle) {
                Icon(
                    imageVector = if (uiState.isDarkTheme) Icons.Outlined.LightMode 
                                  else Icons.Outlined.DarkMode,
                    contentDescription = "Toggle theme",
                    tint = MaterialTheme.colorScheme.onBackground
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background
        )
    )
}

@Composable
private fun ActiveFilters(uiState: HomeUiState, viewModel: HomeViewModel) {
    val hasFilters = uiState.selectedCategory != null || uiState.selectedDifficulty != null ||
            uiState.selectedSource != null || uiState.showBookmarkedOnly
    
    if (hasFilters) {
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            uiState.selectedCategory?.let { cat ->
                item {
                    FilterChipWithClose(
                        text = cat,
                        onClose = { viewModel.onCategorySelected(null) }
                    )
                }
            }
            uiState.selectedDifficulty?.let { diff ->
                item {
                    FilterChipWithClose(
                        text = diff,
                        color = when (diff) {
                            "Easy" -> EasyGreen
                            "Medium" -> MediumOrange
                            "Hard" -> HardRed
                            else -> MaterialTheme.colorScheme.primary
                        },
                        onClose = { viewModel.onDifficultySelected(null) }
                    )
                }
            }
            uiState.selectedSource?.let { src ->
                item {
                    FilterChipWithClose(
                        text = src,
                        onClose = { viewModel.onSourceSelected(null) }
                    )
                }
            }
            if (uiState.showBookmarkedOnly) {
                item {
                    FilterChipWithClose(
                        text = "⭐ Bookmarked",
                        color = BookmarkGold,
                        onClose = { viewModel.toggleBookmarkFilter() }
                    )
                }
            }
            item {
                Surface(
                    modifier = Modifier.clickable { viewModel.clearFilters() },
                    shape = RoundedCornerShape(20.dp),
                    color = HardRed.copy(alpha = 0.15f)
                ) {
                    Text(
                        text = "✕ Clear All",
                        style = MaterialTheme.typography.labelMedium,
                        color = HardRed,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun FilterChipWithClose(
    text: String,
    color: Color = MaterialTheme.colorScheme.primary,
    onClose: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(20.dp),
        color = color.copy(alpha = 0.15f)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(start = 12.dp, end = 4.dp, top = 4.dp, bottom = 4.dp)
        ) {
            Text(
                text = text,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Medium,
                color = color
            )
            IconButton(
                onClick = onClose,
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Remove filter",
                    modifier = Modifier.size(14.dp),
                    tint = color
                )
            }
        }
    }
}

@Composable
private fun DrawerContent(
    viewModel: HomeViewModel,
    uiState: HomeUiState,
    onClose: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "📊 Dashboard",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            IconButton(onClick = onClose) {
                Icon(Icons.Default.Close, contentDescription = "Close")
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Stats Cards
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatsCard(
                title = "Total",
                value = "${uiState.allProblems.size}",
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f)
            )
            StatsCard(
                title = "Solved",
                value = "${uiState.solvedIds.size}",
                color = SolvedGreen,
                modifier = Modifier.weight(1f)
            )
            StatsCard(
                title = "Bookmarked",
                value = "${uiState.bookmarkedIds.size}",
                color = BookmarkGold,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Categories
        Text(
            text = "📁 Categories",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(8.dp))
        
        uiState.categories.forEach { category ->
            val count = uiState.allProblems.count { it.category == category }
            val isSelected = uiState.selectedCategory == category
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 2.dp)
                    .clickable {
                        viewModel.onCategorySelected(category)
                        onClose()
                    },
                shape = RoundedCornerShape(10.dp),
                color = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                        else Color.Transparent
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = category,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                        color = if (isSelected) MaterialTheme.colorScheme.primary 
                               else MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.weight(1f)
                    )
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Text(
                            text = "$count",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Difficulty Filter
        Text(
            text = "🎯 Difficulty",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("Easy", "Medium", "Hard").forEach { diff ->
                val color = when (diff) {
                    "Easy" -> EasyGreen
                    "Medium" -> MediumOrange
                    "Hard" -> HardRed
                    else -> MaterialTheme.colorScheme.primary
                }
                FilterChip(
                    text = diff,
                    isSelected = uiState.selectedDifficulty == diff,
                    onClick = { viewModel.onDifficultySelected(diff); onClose() },
                    color = color
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Source Filter
        Text(
            text = "📋 Source",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            listOf("Blind 75", "Neetcode 150", "Striver SDE", "Google Fav").forEach { source ->
                FilterChip(
                    text = source,
                    isSelected = uiState.selectedSource == source,
                    onClick = { viewModel.onSourceSelected(source); onClose() }
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Progress by Difficulty
        Text(
            text = "📈 Progress",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(12.dp))

        listOf(
            Triple("Easy", EasyGreen, viewModel.getTotalByDifficulty("Easy")),
            Triple("Medium", MediumOrange, viewModel.getTotalByDifficulty("Medium")),
            Triple("Hard", HardRed, viewModel.getTotalByDifficulty("Hard"))
        ).forEach { (label, color, total) ->
            ProgressBar(
                label = label,
                current = viewModel.getSolvedByDifficulty(label),
                total = total,
                color = color,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Interview countdown
        val interviewDate = LocalDate.of(2026, 3, 15)
        val today = LocalDate.now()
        val daysLeft = ChronoUnit.DAYS.between(today, interviewDate)
        
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "🎯 Google L3 Interview",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = if (daysLeft > 0) "$daysLeft days left" else if (daysLeft == 0L) "Today!" else "Completed!",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Reset Progress
        OutlinedButton(
            onClick = { viewModel.resetProgress() },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = HardRed)
        ) {
            Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Reset Progress")
        }
    }
}

@Composable
private fun EmptyState() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "🔍", style = MaterialTheme.typography.displayLarge)
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "No problems found",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Try adjusting your filters or search query",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
