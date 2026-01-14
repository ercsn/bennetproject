// Add Match Form JavaScript

let selectedResult = null;

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    // Set default timestamp to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('timestamp').value = now.toISOString().slice(0, 16);

    // Form submission
    document.getElementById('match-form').addEventListener('submit', handleSubmit);

    // Focus on opponent input
    document.getElementById('opponent').focus();
});

function selectResult(result) {
    selectedResult = result;
    document.getElementById('result').value = result;

    // Update button styles
    document.querySelectorAll('.result-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    document.querySelector(`[data-result="${result}"]`).classList.add('selected');
}

async function handleSubmit(e) {
    e.preventDefault();

    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    // Validate result is selected
    if (!selectedResult) {
        errorMsg.textContent = 'Please select a match result';
        errorMsg.style.display = 'block';
        return;
    }

    const formData = {
        opponent_name: document.getElementById('opponent').value.trim(),
        result: selectedResult,
        notes: document.getElementById('notes').value.trim()
    };

    // Add timestamp if provided
    const timestampInput = document.getElementById('timestamp').value;
    if (timestampInput) {
        formData.timestamp = new Date(timestampInput).toISOString();
    }

    try {
        const response = await fetch('/api/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            successMsg.style.display = 'block';
            resetForm();

            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);
        } else {
            errorMsg.textContent = result.error || 'Failed to save match';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        errorMsg.textContent = 'Network error: ' + error.message;
        errorMsg.style.display = 'block';
    }
}

function resetForm() {
    document.getElementById('match-form').reset();
    selectedResult = null;

    // Reset result buttons
    document.querySelectorAll('.result-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Reset timestamp to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('timestamp').value = now.toISOString().slice(0, 16);

    // Focus on opponent input
    document.getElementById('opponent').focus();
}

// Keyboard shortcuts for quick entry
document.addEventListener('keydown', (e) => {
    // W for Win, L for Loss, I for Inconclusive
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key.toLowerCase() === 'w') {
            selectResult('win');
        } else if (e.key.toLowerCase() === 'l') {
            selectResult('loss');
        } else if (e.key.toLowerCase() === 'i') {
            selectResult('inconclusive');
        }
    }
});
