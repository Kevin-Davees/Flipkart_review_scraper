# Flipkart Review Scraper

A lightweight browser extension that extracts product reviews from Flipkart product pages and exports them as a JSON file.

This tool is designed specifically for **low-volume scraping of reviews from a single product page**. It only extracts reviews that are already loaded in the browser page and does not perform automated crawling.

---

## Overview

This extension allows users to:

* Open a Flipkart product review page
* Scroll until the required number of reviews are loaded
* Click the extension
* Start scraping
* Download the extracted reviews as a JSON file

The extension simply parses the reviews currently rendered in the browser DOM.

---

## Features

* Extracts reviews directly from the webpage
* No API or authentication required
* One-click scraping
* JSON export format
* Lightweight and fast
* Designed for targeted product review collection

---

## Example Use Cases

* Product research
* Sentiment analysis experiments
* Dataset creation
* Competitive product analysis
* Review text analytics

---

## How It Works

1. Navigate to a Flipkart product page
2. Click **"View All Reviews"**
3. Scroll down until the desired number of reviews load
4. Click the browser extension
5. Press **Start Scrape**
6. Download the JSON file

The extension collects review data directly from the webpage.

---

## Installation

### Load as Unpacked Extension

1. Clone this repository

git clone https://github.com/Kevin-Davees/Flipkart_review_scraper.git

2. Open your browser extension page

chrome://extensions/

3. Enable **Developer Mode**

4. Click **Load Unpacked**

5. Select the project folder

The extension will now appear in your browser toolbar.

---

## Usage

### Step 1 — Open Product Reviews

Open the product page on Flipkart.

Click **View All Reviews** to open the review section.

---

### Step 2 — Load Reviews

Scroll down the page until the number of reviews you want are visible.

Flipkart loads reviews dynamically, so scrolling ensures additional reviews appear in the page DOM.

---

### Step 3 — Start Scraping

1. Click the extension icon
2. Click **Start Scrape**

The extension will collect all visible reviews.

---

### Step 4 — Download Data

Click **Download JSON** to save the extracted data.

Example output file:

flipkart_reviews.json

---

## Output Format

Example JSON structure:

```json
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
```

---

## Limitations

This extension intentionally follows a simple manual scraping approach.

Limitations include:

* Only scrapes reviews currently loaded on the page
* Requires manual scrolling
* Works only on Flipkart review pages
* Not designed for large-scale scraping
* Changes in Flipkart page structure may break the scraper

---

## Design Philosophy

This tool follows a **low-volume scraping approach**.

It does not automate navigation or bypass platform protections. It simply extracts review data that is already visible in the browser.

This approach keeps the tool simple, stable, and easy to maintain.

---

## Project Structure

flipkart-review-scraper

├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── styles.css
└── README.md

---

## Future Improvements

Potential improvements include:

* CSV export support
* Automatic review pagination
* Review filtering options
* Sentiment analysis integration
* Review deduplication
* Product metadata extraction

---

## Disclaimer

This project is intended for **educational and research purposes only**.

Users are responsible for ensuring their usage complies with:

* Flipkart Terms of Service
* Applicable laws and regulations

The developer is not responsible for misuse of this software.

---

## Contributing

Contributions are welcome.

Possible areas of improvement:

* DOM selector robustness
* Additional export formats
* UI improvements
* Handling edge cases

Steps:

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Submit a Pull Request

---


GitHub:
https://github.com/yourusername
