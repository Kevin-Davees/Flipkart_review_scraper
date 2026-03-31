document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');
    const reviewCount = document.getElementById('review-count');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    let updateInterval;

    // Initialize UI state
    function updateUI() {
        chrome.runtime.sendMessage({ action: 'GET_STATE' }, (response) => {
            if (!response) return;

            reviewCount.textContent = response.count;

            if (response.isScraping) {
                startBtn.classList.add('hidden');
                pauseBtn.classList.remove('hidden');
                statusDot.className = 'status-indicator active';
                statusText.textContent = 'Scraping in progress...';
            } else {
                pauseBtn.classList.add('hidden');
                startBtn.classList.remove('hidden');
                statusDot.className = 'status-indicator paused';
                statusText.textContent = response.count > 0 ? 'Paused' : 'Ready to Scrape';
                if (response.count === 0) statusDot.className = 'status-indicator idle';
            }
        });
    }

    // Start Scraping
    startBtn.addEventListener('click', () => {
        // Query active tab to verify we are on Flipkart
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentUrl = tabs[0].url;
            if (!currentUrl.includes('flipkart.com')) {
                alert('Please navigate to a Flipkart product reviews page to start scraping.');
                return;
            }
            
            // Execute the start command via message passing to background script
            chrome.runtime.sendMessage({ action: 'START_SCRAPING' }, (res) => {
                updateUI();
            });
        });
    });

    // Pause Scraping
    pauseBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'PAUSE_SCRAPING' }, (res) => {
            updateUI();
        });
    });

    // Download JSON
    downloadBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'DOWNLOAD_DATA' });
    });

    // Clear Local Storage
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all collected reviews?')) {
            chrome.runtime.sendMessage({ action: 'CLEAR_DATA' }, () => {
                updateUI();
            });
        }
    });

    // Initial fetch
    updateUI();

    // Poll for updates every second while popup is open
    updateInterval = setInterval(updateUI, 1000);
});
