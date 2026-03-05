/**
 * DSA Master - Google L3 Interview Prep App
 * Main application logic
 */

(function () {
    'use strict';

    // ============================================
    // State Management
    // ============================================

    const state = {
        problems: [],
        filteredProblems: [],
        currentProblemIndex: -1,
        filters: {
            search: '',
            category: 'all',
            difficulty: 'all',
            source: 'all',
            bookmarked: false
        },
        view: 'grid', // grid | list
        solvedProblems: new Set(),
        bookmarkedProblems: new Set(),
        customCode: {}, // { problemId: customCodeString }
        theme: 'dark'
    };

    // ============================================
    // Initialize
    // ============================================

    function init() {
        loadState();
        state.problems = window.DSA_PROBLEMS || [];
        applyFilters();
        renderCategories();
        renderProblems();
        updateStats();
        updateProgress();
        setupEventListeners();
        setupKeyboardShortcuts();
        updateCountdown();
        applyTheme();

        // Remove splash screen
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            splash.classList.add('fade-out');
            document.getElementById('app').classList.remove('hidden');
            setTimeout(() => splash.remove(), 500);
        }, 1800);
    }

    // ============================================
    // State Persistence
    // ============================================

    function loadState() {
        try {
            const saved = localStorage.getItem('dsa-master-state');
            if (saved) {
                const parsed = JSON.parse(saved);
                state.solvedProblems = new Set(parsed.solved || []);
                state.bookmarkedProblems = new Set(parsed.bookmarked || []);
                state.customCode = parsed.customCode || {};
                state.theme = parsed.theme || 'dark';
                state.view = parsed.view || 'grid';
            }
        } catch (e) {
            console.warn('Failed to load state:', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem('dsa-master-state', JSON.stringify({
                solved: Array.from(state.solvedProblems),
                bookmarked: Array.from(state.bookmarkedProblems),
                customCode: state.customCode,
                theme: state.theme,
                view: state.view
            }));
        } catch (e) {
            console.warn('Failed to save state:', e);
        }
    }

    function getCodeForProblem(problem) {
        if (state.customCode[problem.id] !== undefined) {
            return state.customCode[problem.id];
        }
        return problem.code || '// No solution available';
    }

    function hasCustomCode(problemId) {
        return state.customCode[problemId] !== undefined;
    }

    // ============================================
    // Filtering
    // ============================================

    function applyFilters() {
        let problems = state.problems;

        // Search
        if (state.filters.search) {
            const query = state.filters.search.toLowerCase();
            problems = problems.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
            );
        }

        // Category
        if (state.filters.category !== 'all') {
            problems = problems.filter(p => p.category === state.filters.category);
        }

        // Difficulty
        if (state.filters.difficulty !== 'all') {
            problems = problems.filter(p => p.difficulty === state.filters.difficulty);
        }

        // Source
        if (state.filters.source !== 'all') {
            problems = problems.filter(p => p.sources && p.sources.includes(state.filters.source));
        }

        // Bookmarked
        if (state.filters.bookmarked) {
            problems = problems.filter(p => state.bookmarkedProblems.has(p.id));
        }

        state.filteredProblems = problems;
        renderActiveFilters();
    }

    // ============================================
    // Rendering
    // ============================================

    function renderProblems() {
        const grid = document.getElementById('problems-grid');
        const emptyState = document.getElementById('empty-state');
        const count = document.getElementById('results-count');

        grid.className = state.view === 'list' ? 'problems-grid list-view' : 'problems-grid';

        if (state.filteredProblems.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            count.textContent = '0 problems';
            return;
        }

        emptyState.classList.add('hidden');
        count.textContent = `${state.filteredProblems.length} problem${state.filteredProblems.length !== 1 ? 's' : ''}`;

        grid.innerHTML = state.filteredProblems.map((problem, index) => {
            const isSolved = state.solvedProblems.has(problem.id);
            const isBookmarked = state.bookmarkedProblems.has(problem.id);

            return `
                <div class="problem-card ${isSolved ? 'solved' : ''}" 
                     data-id="${problem.id}" 
                     data-index="${index}"
                     style="animation-delay: ${Math.min(index * 0.03, 0.5)}s">
                    <div class="card-header">
                        <div>
                            <div class="card-number">#${problem.id}</div>
                            <div class="card-title">${escapeHtml(problem.title)}</div>
                        </div>
                        <div class="card-actions">
                            <button class="icon-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                                    data-id="${problem.id}" title="Bookmark"
                                    onclick="event.stopPropagation()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                            <button class="icon-btn ${isSolved ? 'solved-btn' : ''}" 
                                    data-id="${problem.id}" title="Mark as solved"
                                    onclick="event.stopPropagation()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-meta">
                        <span class="difficulty-badge ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
                        <span class="card-category">${problem.category}</span>
                        ${problem.sources ? problem.sources.map(s => `<span class="card-source">${s}</span>`).join('') : ''}
                    </div>
                    <div class="card-description">${escapeHtml(problem.description || '')}</div>
                    <div class="card-footer">
                        <div class="card-complexity">
                            <span>⏱️ ${problem.timeComplexity || 'N/A'}</span>
                            <span>💾 ${problem.spaceComplexity || 'N/A'}</span>
                        </div>
                        ${problem.videoUrl ? `
                            <a href="${problem.videoUrl}" target="_blank" rel="noopener" class="card-video-link" onclick="event.stopPropagation()">
                                ▶ Video
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Add click listeners to cards
        grid.querySelectorAll('.problem-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.index);
                openProblemModal(index);
            });
        });

        // Bookmark buttons
        grid.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleBookmark(parseInt(btn.dataset.id));
            });
        });

        // Solved buttons
        grid.querySelectorAll('.icon-btn[title="Mark as solved"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSolved(parseInt(btn.dataset.id));
            });
        });
    }

    function renderCategories() {
        const list = document.getElementById('category-list');
        const categories = {};

        state.problems.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });

        const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);

        list.innerHTML = `
            <div class="category-item ${state.filters.category === 'all' ? 'active' : ''}" data-category="all">
                <span>All Topics</span>
                <span class="category-count">${state.problems.length}</span>
            </div>
            ${sorted.map(([cat, count]) => `
                <div class="category-item ${state.filters.category === cat ? 'active' : ''}" data-category="${cat}">
                    <span>${cat}</span>
                    <span class="category-count">${count}</span>
                </div>
            `).join('')}
        `;

        list.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                state.filters.category = item.dataset.category;
                applyFilters();
                renderCategories();
                renderProblems();
                updateStats();
            });
        });
    }

    function renderActiveFilters() {
        const container = document.getElementById('active-filters');
        const tags = [];

        if (state.filters.category !== 'all') {
            tags.push({ label: state.filters.category, type: 'category' });
        }
        if (state.filters.difficulty !== 'all') {
            tags.push({ label: state.filters.difficulty, type: 'difficulty' });
        }
        if (state.filters.source !== 'all') {
            tags.push({ label: state.filters.source, type: 'source' });
        }
        if (state.filters.bookmarked) {
            tags.push({ label: 'Bookmarked', type: 'bookmarked' });
        }
        if (state.filters.search) {
            tags.push({ label: `"${state.filters.search}"`, type: 'search' });
        }

        container.innerHTML = tags.map(tag => `
            <div class="filter-tag">
                <span>${tag.label}</span>
                <button data-type="${tag.type}" aria-label="Remove filter">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');

        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                if (type === 'category') state.filters.category = 'all';
                else if (type === 'difficulty') state.filters.difficulty = 'all';
                else if (type === 'source') state.filters.source = 'all';
                else if (type === 'bookmarked') state.filters.bookmarked = false;
                else if (type === 'search') {
                    state.filters.search = '';
                    document.getElementById('search-input').value = '';
                }
                applyFilters();
                renderProblems();
                updateStats();
                updateFilterButtons();
                renderCategories();
            });
        });
    }

    // ============================================
    // Modal
    // ============================================

    function openProblemModal(index) {
        state.currentProblemIndex = index;
        const problem = state.filteredProblems[index];
        if (!problem) return;

        const modal = document.getElementById('problem-modal');
        const isSolved = state.solvedProblems.has(problem.id);
        const isBookmarked = state.bookmarkedProblems.has(problem.id);

        // Title & difficulty
        document.getElementById('modal-title').textContent = problem.title;
        const diffEl = document.getElementById('modal-difficulty');
        diffEl.className = `difficulty-badge ${problem.difficulty.toLowerCase()}`;
        diffEl.textContent = problem.difficulty;

        // Tags
        const tagsEl = document.getElementById('modal-tags');
        tagsEl.innerHTML = [
            ...(problem.tags || []).map(t => `<span class="modal-tag">${t}</span>`),
            ...(problem.sources || []).map(s => `<span class="modal-tag">${s}</span>`)
        ].join('');

        // Description
        document.getElementById('modal-description').textContent = problem.description || '';

        // IO
        const ioEl = document.getElementById('modal-io');
        if (problem.examples && problem.examples.length > 0) {
            ioEl.innerHTML = problem.examples.map((ex, i) => `
                <div class="io-example">
                    <div class="io-label">Example ${i + 1}</div>
                    <div class="io-value"><strong>Input:</strong> ${escapeHtml(ex.input)}</div>
                    <div class="io-value"><strong>Output:</strong> ${escapeHtml(ex.output)}</div>
                    ${ex.explanation ? `<div class="io-value" style="color: var(--text-muted); margin-top: 0.25rem;"><strong>Explanation:</strong> ${escapeHtml(ex.explanation)}</div>` : ''}
                </div>
            `).join('');
        } else {
            ioEl.innerHTML = '<p style="color: var(--text-muted)">No examples provided.</p>';
        }

        // Constraints
        const constraintsEl = document.getElementById('modal-constraints');
        if (problem.constraints && problem.constraints.length > 0) {
            constraintsEl.innerHTML = `<ul>${problem.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`;
        } else {
            constraintsEl.innerHTML = '<p style="color: var(--text-muted)">No constraints specified.</p>';
        }

        // Explanation
        document.getElementById('modal-explanation').textContent = problem.explanation || '';

        // Approach
        document.getElementById('modal-approach').innerHTML = problem.approach || '';

        // Code
        const codeEl = document.getElementById('modal-code');
        const displayCode = getCodeForProblem(problem);
        codeEl.textContent = displayCode;
        hljs.highlightElement(codeEl);

        // Reset edit mode
        document.getElementById('code-view-mode').classList.remove('hidden');
        document.getElementById('code-edit-mode').classList.add('hidden');
        const editBtn = document.getElementById('edit-code');
        editBtn.querySelector('span').textContent = 'Edit';
        editBtn.classList.remove('active');

        // Show modified badge if custom code exists
        const modifiedBadge = document.getElementById('code-modified-badge');
        if (hasCustomCode(problem.id)) {
            modifiedBadge.classList.remove('hidden');
        } else {
            modifiedBadge.classList.add('hidden');
        }

        // Complexity
        document.getElementById('modal-time').textContent = problem.timeComplexity || 'N/A';
        document.getElementById('modal-space').textContent = problem.spaceComplexity || 'N/A';

        // Video
        const videoSection = document.getElementById('video-section');
        const videoLink = document.getElementById('modal-video');
        if (problem.videoUrl) {
            videoSection.classList.remove('hidden');
            videoLink.href = problem.videoUrl;
        } else {
            videoSection.classList.add('hidden');
        }

        // Bookmark/Solved states
        updateModalButtons(isSolved, isBookmarked);

        // Navigation
        document.getElementById('modal-prev').disabled = index <= 0;
        document.getElementById('modal-next').disabled = index >= state.filteredProblems.length - 1;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        document.getElementById('problem-modal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    function updateModalButtons(isSolved, isBookmarked) {
        const solvedBtn = document.getElementById('modal-solved');
        const bookmarkBtn = document.getElementById('modal-bookmark');

        solvedBtn.classList.toggle('active', isSolved);
        solvedBtn.style.color = isSolved ? 'var(--solved)' : '';

        bookmarkBtn.classList.toggle('active', isBookmarked);
        bookmarkBtn.style.color = isBookmarked ? 'var(--bookmark)' : '';
    }

    // ============================================
    // Actions
    // ============================================

    function toggleSolved(id) {
        if (state.solvedProblems.has(id)) {
            state.solvedProblems.delete(id);
            showToast('Removed from solved ✖️');
        } else {
            state.solvedProblems.add(id);
            showToast('Marked as solved ✅');
        }
        saveState();
        renderProblems();
        updateStats();
        updateProgress();
    }

    function toggleBookmark(id) {
        if (state.bookmarkedProblems.has(id)) {
            state.bookmarkedProblems.delete(id);
            showToast('Bookmark removed 📌');
        } else {
            state.bookmarkedProblems.add(id);
            showToast('Bookmarked ⭐');
        }
        saveState();
        renderProblems();
        updateStats();
    }

    // ============================================
    // Stats & Progress
    // ============================================

    function updateStats() {
        document.getElementById('stat-total').textContent = state.problems.length;
        document.getElementById('stat-solved').textContent = state.solvedProblems.size;
        document.getElementById('stat-bookmarked').textContent = state.bookmarkedProblems.size;
    }

    function updateProgress() {
        const total = state.problems.length;
        if (total === 0) return;

        const solved = state.solvedProblems.size;
        const percent = Math.round((solved / total) * 100);

        // Progress ring
        const fill = document.getElementById('progress-ring-fill');
        const circumference = 2 * Math.PI * 16;
        const offset = circumference - (percent / 100) * circumference;
        fill.style.strokeDashoffset = offset;
        document.getElementById('progress-ring-text').textContent = `${percent}%`;

        // Progress bars by difficulty
        ['Easy', 'Medium', 'Hard'].forEach(diff => {
            const totalDiff = state.problems.filter(p => p.difficulty === diff).length;
            const solvedDiff = state.problems.filter(p => p.difficulty === diff && state.solvedProblems.has(p.id)).length;
            const key = diff.toLowerCase();

            document.getElementById(`${key}-progress-text`).textContent = `${solvedDiff}/${totalDiff}`;
            const bar = document.getElementById(`${key}-progress-fill`);
            bar.style.width = totalDiff > 0 ? `${(solvedDiff / totalDiff) * 100}%` : '0%';
        });
    }

    function updateCountdown() {
        const interviewDate = new Date('2026-03-15');
        const now = new Date();
        const diff = interviewDate - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        const el = document.getElementById('countdown-text');
        if (days > 0) {
            el.textContent = `${days} days remaining`;
        } else if (days === 0) {
            el.textContent = 'Interview day! 🎯';
        } else {
            el.textContent = 'Keep practicing! 💪';
        }
    }

    // ============================================
    // Theme
    // ============================================

    function applyTheme() {
        document.documentElement.setAttribute('data-theme', state.theme);
    }

    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        saveState();
    }

    // ============================================
    // Filter Button Updates
    // ============================================

    function updateFilterButtons() {
        // Difficulty buttons
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === state.filters.difficulty ||
                (btn.dataset.difficulty === 'all' && state.filters.difficulty === 'all'));
        });

        // Source buttons
        document.querySelectorAll('.source-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.source === state.filters.source ||
                (btn.dataset.source === 'all' && state.filters.source === 'all'));
        });

        // Bookmark filter
        document.getElementById('bookmark-filter').classList.toggle('active', state.filters.bookmarked);
    }

    // ============================================
    // Event Listeners
    // ============================================

    function setupEventListeners() {
        // Search
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                state.filters.search = e.target.value.trim();
                applyFilters();
                renderProblems();
            }, 200);
        });

        // Menu toggle
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('sidebar-overlay').classList.toggle('visible');
        });

        document.getElementById('sidebar-close').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.remove('visible');
        });

        document.getElementById('sidebar-overlay').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.remove('visible');
        });

        // Difficulty filters
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.filters.difficulty = btn.dataset.difficulty;
                applyFilters();
                renderProblems();
                updateStats();
                updateFilterButtons();
            });
        });

        // Source filters
        document.querySelectorAll('.source-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.filters.source = btn.dataset.source;
                applyFilters();
                renderProblems();
                updateStats();
                updateFilterButtons();
            });
        });

        // Bookmark filter
        document.getElementById('bookmark-filter').addEventListener('click', () => {
            state.filters.bookmarked = !state.filters.bookmarked;
            applyFilters();
            renderProblems();
            updateFilterButtons();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

        // View toggle
        document.getElementById('view-grid').addEventListener('click', () => {
            state.view = 'grid';
            document.getElementById('view-grid').classList.add('active');
            document.getElementById('view-list').classList.remove('active');
            renderProblems();
            saveState();
        });

        document.getElementById('view-list').addEventListener('click', () => {
            state.view = 'list';
            document.getElementById('view-list').classList.add('active');
            document.getElementById('view-grid').classList.remove('active');
            renderProblems();
            saveState();
        });

        // Set initial view toggle state
        if (state.view === 'list') {
            document.getElementById('view-list').classList.add('active');
            document.getElementById('view-grid').classList.remove('active');
        }

        // Modal
        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.getElementById('modal-backdrop').addEventListener('click', closeModal);

        document.getElementById('modal-prev').addEventListener('click', () => {
            if (state.currentProblemIndex > 0) {
                openProblemModal(state.currentProblemIndex - 1);
            }
        });

        document.getElementById('modal-next').addEventListener('click', () => {
            if (state.currentProblemIndex < state.filteredProblems.length - 1) {
                openProblemModal(state.currentProblemIndex + 1);
            }
        });

        document.getElementById('modal-solved').addEventListener('click', () => {
            const problem = state.filteredProblems[state.currentProblemIndex];
            if (problem) {
                toggleSolved(problem.id);
                updateModalButtons(state.solvedProblems.has(problem.id), state.bookmarkedProblems.has(problem.id));
            }
        });

        document.getElementById('modal-bookmark').addEventListener('click', () => {
            const problem = state.filteredProblems[state.currentProblemIndex];
            if (problem) {
                toggleBookmark(problem.id);
                updateModalButtons(state.solvedProblems.has(problem.id), state.bookmarkedProblems.has(problem.id));
            }
        });

        // Copy code
        document.getElementById('copy-code').addEventListener('click', () => {
            const editMode = document.getElementById('code-edit-mode');
            const code = editMode.classList.contains('hidden')
                ? document.getElementById('modal-code').textContent
                : document.getElementById('code-editor').value;
            navigator.clipboard.writeText(code).then(() => {
                const btn = document.getElementById('copy-code');
                btn.classList.add('copied');
                btn.querySelector('span').textContent = 'Copied!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.querySelector('span').textContent = 'Copy';
                }, 2000);
            });
        });

        // Edit code
        document.getElementById('edit-code').addEventListener('click', () => {
            const viewMode = document.getElementById('code-view-mode');
            const editMode = document.getElementById('code-edit-mode');
            const editor = document.getElementById('code-editor');
            const editBtn = document.getElementById('edit-code');

            if (editMode.classList.contains('hidden')) {
                // Enter edit mode
                const problem = state.filteredProblems[state.currentProblemIndex];
                editor.value = getCodeForProblem(problem);
                viewMode.classList.add('hidden');
                editMode.classList.remove('hidden');
                editBtn.querySelector('span').textContent = 'Editing';
                editBtn.classList.add('active');
                editor.focus();
                // Auto-resize textarea
                editor.style.height = 'auto';
                editor.style.height = Math.max(300, editor.scrollHeight) + 'px';
            }
        });

        // Save code edit
        document.getElementById('save-code').addEventListener('click', () => {
            const problem = state.filteredProblems[state.currentProblemIndex];
            if (!problem) return;

            const editor = document.getElementById('code-editor');
            const newCode = editor.value;

            // Save custom code
            state.customCode[problem.id] = newCode;
            saveState();

            // Update the view
            const codeEl = document.getElementById('modal-code');
            codeEl.textContent = newCode;
            hljs.highlightElement(codeEl);

            // Switch back to view mode
            document.getElementById('code-view-mode').classList.remove('hidden');
            document.getElementById('code-edit-mode').classList.add('hidden');
            const editBtn = document.getElementById('edit-code');
            editBtn.querySelector('span').textContent = 'Edit';
            editBtn.classList.remove('active');

            // Show modified badge
            document.getElementById('code-modified-badge').classList.remove('hidden');

            showToast('Code saved successfully ✅');
        });

        // Cancel code edit
        document.getElementById('cancel-code-edit').addEventListener('click', () => {
            document.getElementById('code-view-mode').classList.remove('hidden');
            document.getElementById('code-edit-mode').classList.add('hidden');
            const editBtn = document.getElementById('edit-code');
            editBtn.querySelector('span').textContent = 'Edit';
            editBtn.classList.remove('active');
        });

        // Reset code to original
        document.getElementById('reset-code').addEventListener('click', () => {
            const problem = state.filteredProblems[state.currentProblemIndex];
            if (!problem) return;

            if (!hasCustomCode(problem.id)) {
                showToast('Code is already original');
                return;
            }

            if (confirm('Reset to the original code? Your edits will be lost.')) {
                delete state.customCode[problem.id];
                saveState();

                const originalCode = problem.code || '// No solution available';

                // Update editor if in edit mode
                document.getElementById('code-editor').value = originalCode;

                // Update the view
                const codeEl = document.getElementById('modal-code');
                codeEl.textContent = originalCode;
                hljs.highlightElement(codeEl);

                // Switch to view mode
                document.getElementById('code-view-mode').classList.remove('hidden');
                document.getElementById('code-edit-mode').classList.add('hidden');
                const editBtn = document.getElementById('edit-code');
                editBtn.querySelector('span').textContent = 'Edit';
                editBtn.classList.remove('active');

                // Hide modified badge
                document.getElementById('code-modified-badge').classList.add('hidden');

                showToast('Code reset to original 🔄');
            }
        });

        // Tab key support in code editor
        document.getElementById('code-editor').addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const editor = e.target;
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
            }
        });

        // Auto resize textarea on input
        document.getElementById('code-editor').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.max(300, e.target.scrollHeight) + 'px';
        });

        // Reset progress
        document.getElementById('reset-progress').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                state.solvedProblems.clear();
                state.bookmarkedProblems.clear();
                saveState();
                renderProblems();
                updateStats();
                updateProgress();
                showToast('Progress reset 🔄');
            }
        });
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't handle shortcuts when code editor is focused
            const isEditing = document.activeElement === document.getElementById('code-editor');

            // Ctrl+K - Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }

            // Escape - Exit edit mode first, then close modal
            if (e.key === 'Escape') {
                const editMode = document.getElementById('code-edit-mode');
                if (editMode && !editMode.classList.contains('hidden')) {
                    // Exit edit mode
                    document.getElementById('code-view-mode').classList.remove('hidden');
                    editMode.classList.add('hidden');
                    const editBtn = document.getElementById('edit-code');
                    editBtn.querySelector('span').textContent = 'Edit';
                    editBtn.classList.remove('active');
                    return;
                }
                closeModal();
            }

            // Arrow keys in modal (not while editing)
            if (!isEditing && !document.getElementById('problem-modal').classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (state.currentProblemIndex > 0) {
                        openProblemModal(state.currentProblemIndex - 1);
                    }
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (state.currentProblemIndex < state.filteredProblems.length - 1) {
                        openProblemModal(state.currentProblemIndex + 1);
                    }
                }
            }
        });
    }

    // ============================================
    // Utilities
    // ============================================

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-message').textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2000);
    }

    // ============================================
    // Start
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
