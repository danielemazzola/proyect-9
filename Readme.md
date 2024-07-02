# Project 9 Rock the Code: Web Scraper 🕸️

Welcome to **Project 9 Rock the Code**! This project focuses on creating a web scraper using Puppeteer, a Node.js library for headless browser automation. The main goal is to collect product information from the Mediamarkt website. This README provides an overview of the project, including technologies used, installation instructions, and how to run the scraper.

---

## 📚 Overview

The web scraper is designed to navigate through multiple pages of a website, gather data on various products, and save this data to a JSON file. This project is particularly useful for anyone looking to automate data collection from e-commerce sites.

## 🛠️ Technologies

- **Puppeteer**: A powerful Node.js library for controlling a headless Chrome or Chromium browser.
- **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **Nodemon**: A tool that helps develop Node.js-based applications by automatically restarting the application when file changes in the directory are detected.

## 📋 Dependencies

The project requires the following dependencies to run:

- **dotenv**: `^16.4.5`
- **puppeteer**: `^22.9.0`

Additionally, it includes a development dependency:

- **nodemon**: `^3.1.0`

## 📂 Project Structure

```plaintext
project-folder
│
├── index.js           # Main script for running the web scraper
├── .env               # Environment variables file
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation (this file)
```

## Scripts

In the `package.json` file, the following scripts are defined:

```json
"scripts": {
  "scrapper": "node index.js",
  "dev": "nodemon index.js"
}
```

```json
npm run dev
```

```json
npm run scrapper
```
