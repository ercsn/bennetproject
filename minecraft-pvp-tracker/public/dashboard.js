// Dashboard JavaScript

let chart = null;
let allMatches = [];

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadMatches();
});

// Toggle advanced settings
function toggleAdvancedSettings() {
    const settings = document.getElementById('advanced-settings');
    const toggle = document.querySelector('.advanced-toggle');
    if (settings.style.display === 'none') {
        settings.style.display = 'block';
        toggle.textContent = 'Advanced Settings';
    } else {
        settings.style.display = 'none';
        toggle.textContent = 'Advanced Settings';
    }
}

// Quick match logging
async function logMatch(result) {
    try {
        const opponentName = document.getElementById('opponent-name')?.value.trim() || '';
        const notes = document.getElementById('match-notes')?.value.trim() || '';

        const matchData = {
            result: result,
            timestamp: new Date().toISOString()
        };

        // Only include optional fields if they have values
        if (opponentName) matchData.opponent_name = opponentName;
        if (notes) matchData.notes = notes;

        const response = await fetch('/api/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchData)
        });

        if (response.ok) {
            // Show success toast
            const toast = document.getElementById('success-toast');
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2000);

            // Clear advanced settings fields
            const opponentInput = document.getElementById('opponent-name');
            const notesInput = document.getElementById('match-notes');
            if (opponentInput) opponentInput.value = '';
            if (notesInput) notesInput.value = '';

            // Reload data
            loadStats();
            loadMatches();
        } else {
            const data = await response.json();
            alert('Failed to log match: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

async function loadStats(startDate = null, endDate = null) {
    try {
        let url = '/api/stats';
        const params = new URLSearchParams();

        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const data = await response.json();

        // Update stat cards
        document.getElementById('total-matches').textContent = data.total || 0;
        document.getElementById('total-wins').textContent = data.wins || 0;
        document.getElementById('total-losses').textContent = data.losses || 0;
        document.getElementById('win-percentage').textContent = data.winPercentage + '%';

        // Update streak display
        const streakDisplay = document.getElementById('streak-display');
        if (data.currentStreak > 0 && data.streakType) {
            streakDisplay.style.display = 'flex';
            streakDisplay.className = 'streak-card ' + data.streakType + '-streak';
            document.getElementById('streak-value').textContent =
                `${data.currentStreak} ${data.streakType}${data.currentStreak > 1 ? 's' : ''}`;
        } else {
            streakDisplay.style.display = 'none';
        }

        // Render chart
        renderChart(data.chartData);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadMatches(startDate = null, endDate = null, limit = 20) {
    try {
        let url = '/api/matches?limit=' + limit;

        if (startDate) url += '&start_date=' + startDate;
        if (endDate) url += '&end_date=' + endDate;

        const response = await fetch(url);
        allMatches = await response.json();

        const matchesList = document.getElementById('matches-list');

        if (allMatches.length === 0) {
            matchesList.innerHTML = '<div class="loading">No matches found</div>';
            return;
        }

        matchesList.innerHTML = allMatches.map(match => `
            <div class="match-item">
                <span class="match-result-badge ${match.result}">${match.result}</span>
                <div class="match-details">
                    <div class="match-opponent">${escapeHtml(match.opponent_name)}</div>
                    ${match.notes ? `<div class="match-notes">${escapeHtml(match.notes)}</div>` : ''}
                </div>
                <div class="match-timestamp">${formatDate(match.timestamp)}</div>
                <button class="match-delete-btn" onclick="deleteMatch(${match.id})" title="Delete match">
                    X
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading matches:', error);
        document.getElementById('matches-list').innerHTML =
            '<div class="loading">Error loading matches</div>';
    }
}

function renderChart(chartData) {
    const ctx = document.getElementById('stats-chart');
    const chartContainer = ctx.parentElement;
    const noDataMessage = chartContainer.querySelector('.no-data-message');

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
        chart = null;
    }

    if (!chartData || chartData.length === 0) {
        // Hide canvas and show message
        ctx.style.display = 'none';
        if (!noDataMessage) {
            const message = document.createElement('p');
            message.className = 'loading no-data-message';
            message.textContent = 'No data available for chart';
            chartContainer.appendChild(message);
        } else {
            noDataMessage.style.display = 'block';
        }
        return;
    }

    // Show canvas and hide message
    ctx.style.display = 'block';
    if (noDataMessage) {
        noDataMessage.style.display = 'none';
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(d => d.date),
            datasets: [
                {
                    label: 'Win Rate %',
                    data: chartData.map(d => d.winRate),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Cumulative Wins',
                    data: chartData.map(d => d.cumulativeWins),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                },
                {
                    label: 'Cumulative Losses',
                    data: chartData.map(d => d.cumulativeLosses),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: "'Press Start 2P', 'Courier New', monospace",
                            size: 10
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    titleFont: {
                        family: "'Press Start 2P', 'Courier New', monospace",
                        size: 10
                    },
                    bodyFont: {
                        family: "'Press Start 2P', 'Courier New', monospace",
                        size: 10
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.dataset.label === 'Win Rate %') {
                                    label += context.parsed.y + '%';
                                } else {
                                    label += context.parsed.y;
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: "'Press Start 2P', 'Courier New', monospace",
                            size: 8
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Win Rate %',
                        color: '#ffffff',
                        font: {
                            family: "'Press Start 2P', 'Courier New', monospace",
                            size: 10
                        }
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: "'Press Start 2P', 'Courier New', monospace",
                            size: 8
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    min: 0,
                    max: 100
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Cumulative Wins/Losses',
                        color: '#ffffff',
                        font: {
                            family: "'Press Start 2P', 'Courier New', monospace",
                            size: 10
                        }
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: "'Press Start 2P', 'Courier New', monospace",
                            size: 8
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function applyFilter() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (startDate || endDate) {
        const start = startDate ? startDate + 'T00:00:00' : null;
        const end = endDate ? endDate + 'T23:59:59' : null;

        loadStats(start, end);
        loadMatches(start, end);
    }
}

function clearFilter() {
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    loadStats();
    loadMatches();
}

function exportCSV() {
    if (allMatches.length === 0) {
        alert('No matches to export');
        return;
    }

    // Create CSV content
    const headers = ['Date', 'Opponent', 'Result', 'Notes'];
    const rows = allMatches.map(match => [
        match.timestamp,
        match.opponent_name,
        match.result,
        match.notes || ''
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minecraft-pvp-stats-' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days === 0) {
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
        }
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function deleteMatch(matchId) {
    if (!confirm('Are you sure you want to delete this match?')) {
        return;
    }

    try {
        const response = await fetch(`/api/matches/${matchId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Reload data after successful deletion
            loadStats();
            loadMatches();
        } else {
            const result = await response.json();
            alert('Failed to delete match: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

function seeAllMatches() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const start = startDate ? startDate + 'T00:00:00' : null;
    const end = endDate ? endDate + 'T23:59:59' : null;
    loadMatches(start, end, 1000);
}
