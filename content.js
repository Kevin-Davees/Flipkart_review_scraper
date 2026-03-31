let scrapingActive = false;
let autoScrollInterval = null;
let lastScrollY = 0;
let unchangedScrollCount = 0;

// Add a floating UI banner to the page so the user knows it's actually running
function ensureBanner() {
    let banner = document.getElementById('fk-scraper-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'fk-scraper-banner';
        Object.assign(banner.style, {
            position: 'fixed', bottom: '20px', left: '20px', zIndex: '999999',
            padding: '12px 24px', background: '#3B82F6', color: 'white',
            borderRadius: '8px', fontWeight: 'bold', fontFamily: 'sans-serif',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'all 0.3s'
        });
        document.body.appendChild(banner);
    }
    return banner;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'START') {
        if (!scrapingActive) {
            scrapingActive = true;
            ensureBanner().innerText = "Scraper: Active! Scrolling...";
            startExtractionMainLoop();
        }
    } else if (request.action === 'PAUSE') {
        scrapingActive = false;
        ensureBanner().innerText = "Scraper: Paused.";
        stopScrolling();
    }
});

async function startExtractionMainLoop() {
    // Basic heuristics: find 'Read More' buttons and expand them first
    await expandReadMores();

    // Extract what we see right now
    const reviews = extractReviewsFromDOM();
    
    // Send to background
    if (reviews.length > 0) {
        chrome.runtime.sendMessage({ action: 'RECEIVE_REVIEWS', data: reviews }, (response) => {
            if (response && !response.continueScraping) {
                scrapingActive = false;
            }
        });
    }

    // Scroll Down to trigger lazy load
    if (scrapingActive) {
        scrollAndCheckNext();
    }
}

async function expandReadMores() {
    const sel = window.FLIPKART_SELECTORS || { READ_MORE_BTN: 'span._1BWGvX, span:contains("READ MORE")' };
    try {
        // Query using some custom logic since :contains isn't standard in querySelectorAll
        const spans = Array.from(document.querySelectorAll('span')).filter(s => s.innerText && s.innerText.toUpperCase() === 'READ MORE');
        
        let clicked = 0;
        for (const span of spans) {
            if (span.offsetParent !== null) { // is visible
                span.click();
                clicked++;
            }
        }
        
        if (clicked > 0) {
            // wait a tiny bit for the DOM update
            await new Promise(r => setTimeout(r, 500));
        }
    } catch (e) {
        console.warn("Could not expand 'Read More' buttons", e);
    }
}

function extractReviewsFromDOM() {
    const extractedData = [];
    const seenNodes = new Set();
    
    // Most bulletproof way on Flipkart is to find the small DIV that contains just the rating
    const ratingNodes = Array.from(document.querySelectorAll('div')).filter(el => {
        const t = (el.innerText || "").trim();
        // Look for string exactly matching 1-5 followed by an optional star, or precisely just the digit.
        return el.children.length <= 2 && /^[1-5](\.[0-9])?\s*★?$/.test(t) && t.length > 0 && t.length <= 4;
    });

    ratingNodes.forEach(badge => {
        // Go up to the parent wrapper block
        let container = badge.parentElement;
        for(let i=0; i<6; i++) {
            if(container && container.parentElement) container = container.parentElement;
        }

        if (!container || seenNodes.has(container)) return;
        seenNodes.add(container);

        try {
            // Stars is simply the badge text
            let stars = badge.innerText.replace(/[^0-9.]/g, '').trim();

            // Find all P tags in this block
            const pTags = Array.from(container.querySelectorAll('p')).map(p => p.innerText.trim()).filter(t => t.length > 0);
            
            // Title is typically the first or second P tag, usually not containing "days ago"
            let title = '';
            const titleCandidates = pTags.filter(t => t !== stars && !t.includes('Certified Buyer') && !t.includes('ago'));
            if (titleCandidates.length > 0) title = titleCandidates[0];

            // Body text is usually a div that contains more than 15 chars and is not the title
            let bodyText = '';
            const textNodes = Array.from(container.querySelectorAll('div')).map(d => (d.innerText||"").trim()).filter(t => t.length > 15);
            // Eliminate elements that contain the title exactly, or "READ MORE"
            const bodyCandidates = textNodes.filter(t => !titleCandidates.includes(t) && !t.includes('READ MORE'));
            if (bodyCandidates.length > 0) {
                // sort by length descending to get the full review text block
                bodyCandidates.sort((a,b) => b.length - a.length);
                bodyText = bodyCandidates[0];
            }

            // Fallback: If body empty, try to get anything that looks like content
            if (!bodyText && titleCandidates.length > 1) {
                bodyText = titleCandidates[1];
            }

            // Name and Date
            let name = 'Unknown';
            let date = 'Unknown';
            
            pTags.forEach(t => {
                if (t === title) return; // ignore title
                if (/(years|months|days|year|month|day)\s+ago/i.test(t)) date = t;
                else if (t !== 'Certified Buyer' && !t.includes('Report') && t.length < 30 && t !== stars) {
                    // It's probably a name or location
                    if (!name || name === 'Unknown') name = t;
                }
            });

            // Make sure we have enough to be considered a review
            if (stars && (title || bodyText)) {
                extractedData.push({
                    stars: stars,
                    title: title,
                    content: bodyText,
                    name: name,
                    datePosted: date,
                    url: window.location.href
                });
            }
        } catch(e) {
            console.error('Error extracting a review block', e);
        }
    });

    if (extractedData.length > 0) {
        const banner = document.getElementById('fk-scraper-banner');
        if (banner) banner.innerText = "Scraper: Found " + extractedData.length + " reviews this pass...";
    }

    return extractedData;
}

function scrollAndCheckNext() {
    const scrollStep = 800;
    
    // Instead of window.scrollY which can fail if body is absolute, we force a scrollIntoView on the last element or scroll
    const previousHeight = document.documentElement.scrollHeight;
    
    window.scrollBy({ top: scrollStep, left: 0, behavior: 'smooth' });
    
    // Fallback if window doesn't scroll properly: try to scroll body natively
    document.body.scrollTop += scrollStep;
    document.documentElement.scrollTop += scrollStep;

    autoScrollInterval = setTimeout(() => {
        if (!scrapingActive) return;

        // Give Flipkart's dynamic load a moment. If scrollHeight changed, we loaded new content
        if (document.documentElement.scrollHeight > previousHeight || window.scrollY > lastScrollY) {
            lastScrollY = window.scrollY;
            unchangedScrollCount = 0;
            startExtractionMainLoop();
        } else {
            // It didn't change
            unchangedScrollCount++;
            
            if (unchangedScrollCount >= 3) {
                const nextBtnFound = tryClickNextPage();
                if (!nextBtnFound) {
                    const banner = document.getElementById('fk-scraper-banner');
                    if (banner) banner.innerText = "Scraper: Finished current pages. Paused.";
                    chrome.runtime.sendMessage({ action: 'PAUSE_SCRAPING' });
                }
            } else {
                scrollAndCheckNext();
            }
        }
    }, 1500); // Wait 1.5s for images/content to lazy render
}

function stopScrolling() {
    clearTimeout(autoScrollInterval);
}

function tryClickNextPage() {
    const nextTextAnchors = Array.from(document.querySelectorAll('a, span')).filter(el => {
        const t = el.innerText.toUpperCase();
        return t.includes('NEXT') && el.offsetParent !== null; // visible
    });

    if (nextTextAnchors.length > 0) {
        const banner = document.getElementById('fk-scraper-banner');
        if (banner) banner.innerText = "Scraper: Moving to Next Page... Please Wait.";
        
        unchangedScrollCount = 0; // reset
        // Wait for page transition
        nextTextAnchors[nextTextAnchors.length - 1].click();
        
        // Wait a few seconds for next page to load completely before re-firing the loop Let dom refresh.
        autoScrollInterval = setTimeout(() => {
            if (scrapingActive) {
                startExtractionMainLoop();
            }
        }, 5000);
        return true;
    }
    return false;
}
