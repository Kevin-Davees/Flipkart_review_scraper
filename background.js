let isScraping = false;
let scrapedData = [];
let targetTabId = null;

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_SCRAPING') {
    isScraping = true;
    startScrapingInActiveTab();
    sendResponse({ status: 'started' });
  } 
  
  else if (request.action === 'PAUSE_SCRAPING') {
    isScraping = false;
    if (targetTabId) {
      chrome.tabs.sendMessage(targetTabId, { action: 'PAUSE' });
    }
    sendResponse({ status: 'paused' });
  } 
  
  else if (request.action === 'GET_STATE') {
    sendResponse({ 
      isScraping: isScraping, 
      count: scrapedData.length 
    });
  } 
  
  else if (request.action === 'RECEIVE_REVIEWS') {
    // Append unique reviews to our collection
    const newReviews = request.data || [];
    let addedCount = 0;
    
    newReviews.forEach(review => {
      // Basic deduplication using a combination of name and review text
      const isDuplicate = scrapedData.some(r => r.name === review.name && r.content === review.content);
      if (!isDuplicate) {
        scrapedData.push(review);
        addedCount++;
      }
    });

    // Update storage for persistence across popup opens
    chrome.storage.local.set({ scrapedData });

    // Respond back if we are still active so content script knows whether to continue
    sendResponse({ 
      continueScraping: isScraping,
      totalCount: scrapedData.length
    });
  }

  else if (request.action === 'DOWNLOAD_DATA') {
    downloadJSON();
    sendResponse({ status: 'downloading' });
  }

  else if (request.action === 'CLEAR_DATA') {
    scrapedData = [];
    chrome.storage.local.set({ scrapedData: [] });
    sendResponse({ status: 'cleared' });
  }

  // Ensure async sendResponse
  return true; 
});

// Helper to inject/trigger content script
async function startScrapingInActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length === 0) return;
  targetTabId = tabs[0].id;
  
  // Send start command to content script. We assume content script is already injected via manifest
  chrome.tabs.sendMessage(targetTabId, { action: 'START' });
}

// Download function
function downloadJSON() {
  if (scrapedData.length === 0) return;

  const dataStr = JSON.stringify({
    totalReviews: scrapedData.length,
    scrapedAt: new Date().toISOString(),
    data: scrapedData
  }, null, 2);

  // Convert to data URI
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = 'flipkart_reviews.json';

  chrome.downloads.download({
    url: dataUri,
    filename: exportFileDefaultName,
    saveAs: true
  });
}

// Load existing state from storage on startup
chrome.storage.local.get(['scrapedData'], (result) => {
  if (result.scrapedData) {
    scrapedData = result.scrapedData;
  }
});
