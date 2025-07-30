// Test Plan Dashboard JavaScript
class TestPlanDashboard {
    constructor() {
        this.testPlans = this.loadTestPlans();
        this.filteredPlans = [...this.testPlans];
        this.currentView = 'grid';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTestPlans();
        this.updateStats();
        this.populateTeamFilter();
    }

    // Load test plans from localStorage or use sample data
    loadTestPlans() {
        const saved = localStorage.getItem('testPlans');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Sample data
        return [
            {
                id: 1,
                title: 'Authentication System Testing',
                description: 'Comprehensive testing of user authentication, login, logout, and session management.',
                status: 'active',
                priority: 'high',
                team: 'Backend Team',
                createdAt: '2024-01-15',
                testCases: [
                    { id: 1, title: 'Login with valid credentials', status: 'passed' },
                    { id: 2, title: 'Login with invalid credentials', status: 'passed' },
                    { id: 3, title: 'Session timeout handling', status: 'pending' },
                    { id: 4, title: 'Password reset flow', status: 'failed' }
                ]
            },
            {
                id: 2,
                title: 'Mobile App UI Testing',
                description: 'User interface testing across different mobile devices and screen sizes.',
                status: 'completed',
                priority: 'medium',
                team: 'Mobile Team',
                createdAt: '2024-01-10',
                testCases: [
                    { id: 1, title: 'iPhone 12 Pro compatibility', status: 'passed' },
                    { id: 2, title: 'Android tablet layout', status: 'passed' },
                    { id: 3, title: 'Dark mode functionality', status: 'passed' }
                ]
            },
            {
                id: 3,
                title: 'API Performance Testing',
                description: 'Load testing and performance validation of REST API endpoints.',
                status: 'draft',
                priority: 'high',
                team: 'QA Team',
                createdAt: '2024-01-20',
                testCases: [
                    { id: 1, title: 'GET endpoints load testing', status: 'pending' },
                    { id: 2, title: 'POST endpoints stress testing', status: 'pending' },
                    { id: 3, title: 'Database connection pooling', status: 'pending' }
                ]
            }
        ];
    }

    // Save test plans to localStorage
    saveTestPlans() {
        localStorage.setItem('testPlans', JSON.stringify(this.testPlans));
    }

    // Bind event listeners
    bindEvents() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterPlans();
        });

        // Filter dropdowns
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterPlans();
        });
        
        document.getElementById('priorityFilter').addEventListener('change', () => {
            this.filterPlans();
        });
        
        document.getElementById('teamFilter').addEventListener('change', () => {
            this.filterPlans();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleView(e.target.dataset.view);
            });
        });

        // Add test plan modal
        document.getElementById('addTestPlanBtn').addEventListener('click', () => {
            this.showAddModal();
        });
        
        document.getElementById('createFirstPlan').addEventListener('click', () => {
            this.showAddModal();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal('testPlanModal');
        });
        
        document.getElementById('closeAddModal').addEventListener('click', () => {
            this.hideModal('addTestPlanModal');
        });
        
        document.getElementById('cancelAdd').addEventListener('click', () => {
            this.hideModal('addTestPlanModal');
        });

        // Form submission
        document.getElementById('testPlanForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTestPlan();
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    // Filter test plans based on search and filters
    filterPlans() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        const teamFilter = document.getElementById('teamFilter').value;

        this.filteredPlans = this.testPlans.filter(plan => {
            const matchesSearch = plan.title.toLowerCase().includes(searchTerm) ||
                                plan.description.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || plan.status === statusFilter;
            const matchesPriority = !priorityFilter || plan.priority === priorityFilter;
            const matchesTeam = !teamFilter || plan.team === teamFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesTeam;
        });

        this.renderTestPlans();
        this.updateStats();
    }

    // Clear all filters
    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('priorityFilter').value = '';
        document.getElementById('teamFilter').value = '';
        this.filteredPlans = [...this.testPlans];
        this.renderTestPlans();
        this.updateStats();
    }

    // Toggle between grid and list view
    toggleView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        const container = document.getElementById('testPlansContainer');
        container.classList.toggle('list-view', view === 'list');
        
        this.renderTestPlans();
    }

    // Populate team filter dropdown
    populateTeamFilter() {
        const teams = [...new Set(this.testPlans.map(plan => plan.team))];
        const teamFilter = document.getElementById('teamFilter');
        
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamFilter.appendChild(option);
        });
    }

    // Render test plans
    renderTestPlans() {
        const container = document.getElementById('testPlansContainer');
        const emptyState = document.getElementById('emptyState');

        if (this.filteredPlans.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        emptyState.style.display = 'none';

        container.innerHTML = this.filteredPlans.map(plan => {
            const completedTests = plan.testCases.filter(tc => tc.status === 'passed').length;
            const totalTests = plan.testCases.length;
            const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

            return `
                <div class="test-plan-card" onclick="dashboard.showTestPlanDetails(${plan.id})">
                    <div class="test-plan-header">
                        <div>
                            <h3 class="test-plan-title">${plan.title}</h3>
                            <p class="test-plan-description">${plan.description}</p>
                        </div>
                    </div>
                    
                    <div class="test-plan-meta">
                        <span class="status-badge status-${plan.status}">${plan.status}</span>
                        <span class="priority-badge priority-${plan.priority}">${plan.priority}</span>
                        <span class="team-badge">${plan.team}</span>
                    </div>
                    
                    <div class="test-plan-stats">
                        <span class="test-count">${completedTests}/${totalTests} tests completed</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Update dashboard statistics
    updateStats() {
        const total = this.testPlans.length;
        const active = this.testPlans.filter(p => p.status === 'active').length;
        const completed = this.testPlans.filter(p => p.status === 'completed').length;
        
        // Calculate overall test coverage
        let totalTests = 0;
        let passedTests = 0;
        
        this.testPlans.forEach(plan => {
            totalTests += plan.testCases.length;
            passedTests += plan.testCases.filter(tc => tc.status === 'passed').length;
        });
        
        const coverage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

        document.getElementById('totalPlans').textContent = total;
        document.getElementById('activePlans').textContent = active;
        document.getElementById('completedPlans').textContent = completed;
        document.getElementById('testCoverage').textContent = `${coverage}%`;
    }

    // Show test plan details modal
    showTestPlanDetails(planId) {
        const plan = this.testPlans.find(p => p.id === planId);
        if (!plan) return;

        const modal = document.getElementById('testPlanModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = plan.title;
        
        const completedTests = plan.testCases.filter(tc => tc.status === 'passed').length;
        const totalTests = plan.testCases.length;
        const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

        modalBody.innerHTML = `
            <div class="test-plan-details">
                <div class="detail-section">
                    <h3>Description</h3>
                    <p>${plan.description}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Metadata</h3>
                    <div class="metadata-grid">
                        <div class="metadata-item">
                            <strong>Status:</strong>
                            <span class="status-badge status-${plan.status}">${plan.status}</span>
                        </div>
                        <div class="metadata-item">
                            <strong>Priority:</strong>
                            <span class="priority-badge priority-${plan.priority}">${plan.priority}</span>
                        </div>
                        <div class="metadata-item">
                            <strong>Team:</strong>
                            <span>${plan.team}</span>
                        </div>
                        <div class="metadata-item">
                            <strong>Created:</strong>
                            <span>${plan.createdAt}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Progress</h3>
                    <div class="progress-detail">
                        <div class="progress-bar" style="width: 100%; height: 12px;">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <p>${completedTests} of ${totalTests} test cases completed (${Math.round(progress)}%)</p>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Test Cases</h3>
                    <div class="test-cases-list">
                        ${plan.testCases.map(testCase => `
                            <div class="test-case-item">
                                <div class="test-case-content">
                                    <h4>${testCase.title}</h4>
                                    <span class="test-status status-${testCase.status}">${testCase.status}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.showModal('testPlanModal');
    }

    // Show add test plan modal
    showAddModal() {
        document.getElementById('testPlanForm').reset();
        this.showModal('addTestPlanModal');
    }

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
    }

    // Hide modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }

    // Save new test plan
    saveTestPlan() {
        const title = document.getElementById('planTitle').value;
        const description = document.getElementById('planDescription').value;
        const status = document.getElementById('planStatus').value;
        const priority = document.getElementById('planPriority').value;
        const team = document.getElementById('planTeam').value;
        const testCasesText = document.getElementById('planTestCases').value;

        let testCases = [];
        try {
            testCases = testCasesText ? JSON.parse(testCasesText) : [];
        } catch (e) {
            alert('Invalid JSON format for test cases');
            return;
        }

        const newPlan = {
            id: Date.now(),
            title,
            description,
            status,
            priority,
            team,
            createdAt: new Date().toISOString().split('T')[0],
            testCases
        };

        this.testPlans.push(newPlan);
        this.saveTestPlans();
        this.filteredPlans = [...this.testPlans];
        
        this.renderTestPlans();
        this.updateStats();
        this.populateTeamFilter();
        this.hideModal('addTestPlanModal');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new TestPlanDashboard();
});