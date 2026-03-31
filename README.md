Flipkart Review Scraper

A lightweight browser extension designed to extract product reviews from Flipkart product pages and export them as a JSON file.

This tool is intended for low-volume scraping of reviews for a specific product. It works by reading the reviews that are already loaded in the browser page.

The extension does not automate page navigation or bypass platform protections. It simply extracts reviews currently visible in the DOM.

Overview

This extension allows users to:

Open a Flipkart product review page
Scroll until the required number of reviews are loaded
Start scraping via the extension
Export the collected reviews as a JSON file

This workflow keeps the tool simple, reliable, and compliant with browser limitations.

Features
Extracts reviews directly from the webpage
No login or API required
Simple one-click scraping
JSON export format
Lightweight and fast
Designed for specific product review collection
Example Use Cases
Product research
Sentiment analysis experiments
Dataset creation
Competitive product analysis
Review text analysis
How It Works
Navigate to a Flipkart product page
Click "View All Reviews"
Scroll down until the desired number of reviews load
Click the browser extension
Press Start Scrape
Download the JSON file

The extension parses the reviews already loaded in the page DOM and converts them into structured data.

Installation
Option 1 — Load Unpacked Extension (Recommended)
Clone the repository
git clone https://github.com/yourusername/flipkart-review-scraper.git
Open your browser extensions page

For Chrome / Brave / Edge:

chrome://extensions
Enable Developer Mode
Click Load Unpacked
Select the project folder

The extension should now appear in your browser toolbar.

Usage
Step 1 — Open Product Reviews

Open the product page on Flipkart.

Example:

https://www.flipkart.com/product-name/product-reviews/...

Click "View All Reviews".

Step 2 — Load Reviews

Scroll down the page until the number of reviews you want are visible.

Flipkart loads reviews dynamically, so scrolling ensures more reviews appear in the DOM.

Step 3 — Start Scraping
Click the extension icon
Click Start Scrape

The extension will extract the reviews currently visible in the page.

Step 4 — Download Data

Click Download JSON to save the extracted reviews.

Example output file:

flipkart_reviews.json
Output Format

Example JSON structure:

[
  {
    "reviewer_name": "Rahul",
    "rating": 5,
    "title": "Excellent Product",
    "review": "Very good quality and worth the price.",
    "date": "12 Jan 2024",
    "likes": 14,
    "dislikes": 2
  },
  {
    "reviewer_name": "Amit",
    "rating": 4,
    "title": "Good Value",
    "review": "Battery life is good and performance is smooth.",
    "date": "8 Jan 2024",
    "likes": 5,
    "dislikes": 1
  }
]
Limitations

This extension intentionally keeps scraping simple and manual.

Limitations include:

Only scrapes reviews currently loaded in the page
Requires manual scrolling
Works only on Flipkart review pages
Large-scale scraping is not supported
Changes in Flipkart page structure may break the scraper
Design Philosophy

This tool follows a low-volume scraping approach:

No automation
No aggressive crawling
No bypassing protections

It simply extracts data already rendered in the browser.

This makes it stable and easy to maintain.

Project Structure

Example structure:

flipkart-review-scraper
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── styles.css
└── README.md
Future Improvements

Possible enhancements:

CSV export
Automatic review pagination
Sentiment analysis integration
Review filtering
Review deduplication
Product metadata extraction
Disclaimer

This tool is intended for educational and research purposes only.

Users are responsible for ensuring that their usage complies with:

Flipkart Terms of Service
Applicable laws and regulations

The developer is not responsible for misuse of this software.

Contributing

Contributions are welcome.

Possible contribution areas:

Improving DOM selectors
Adding export formats
Improving UI
Handling edge cases

Steps:

Fork the repository
Create a new branch
Commit your changes
Submit a Pull Request
