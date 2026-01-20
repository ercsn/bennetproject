// Matches Page JavaScript

let allMatches = [];
let selectedResult = null;

document.addEventListener('DOMContentLoaded', () => {
    loadMatches();

    document.getElementById('edit-form').addEventListener('submit', saveMatch);
});

async function loadMatches(startDate = null, endDate = null) {
    try {
        let url = '/api/matches?limit=1000';

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
            <div class="match-item compact">
                <span class="match-result-badge compact ${match.result}">${match.result}</span>
                <span class="match-opponent compact">${escapeHtml(match.opponent_name)}</span>
                <span class="match-timestamp compact">${formatDate(match.timestamp)}</span>
                <button class="match-edit-btn" onclick="editMatch(${match.id})" title="Edit match">
                    ✏️
                </button>
                <button class="match-delete-btn compact" onclick="deleteMatch(${match.id})" title="Delete match">
                    🗑️
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading matches:', error);
        document.getElementById('matches-list').innerHTML =
            '<div class="loading">Error loading matches</div>';
    }
}

function applyFilter() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const start = startDate ? startDate + 'T00:00:00' : null;
    const end = endDate ? endDate + 'T23:59:59' : null;

    loadMatches(start, end);
}

function clearFilter() {
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    loadMatches();
}

function editMatch(matchId) {
    const match = allMatches.find(m => m.id === matchId);
    if (!match) return;

    document.getElementById('edit-match-id').value = match.id;
    document.getElementById('edit-opponent').value = match.opponent_name;
    document.getElementById('edit-notes').value = match.notes || '';

    selectResult(match.result);

    document.getElementById('edit-modal').style.display = 'flex';
}

function selectResult(result) {
    selectedResult = result;

    document.querySelectorAll('.result-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    document.querySelector(`.result-btn.${result}`).classList.add('selected');
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
    selectedResult = null;
}

async function saveMatch(e) {
    e.preventDefault();

    const matchId = document.getElementById('edit-match-id').value;
    const opponent = document.getElementById('edit-opponent').value;
    const notes = document.getElementById('edit-notes').value;

    if (!selectedResult) {
        alert('Please select a result');
        return;
    }

    try {
        const response = await fetch(`/api/matches/${matchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                opponent_name: opponent,
                result: selectedResult,
                notes: notes
            })
        });

        if (response.ok) {
            closeModal();
            loadMatches();
        } else {
            const data = await response.json();
            alert('Failed to update match: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
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
            loadMatches();
        } else {
            const result = await response.json();
            alert('Failed to delete match: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
