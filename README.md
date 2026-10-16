# Drewflix

Drewflix is a lightweight, static, single-page UI template that mimics a modern streaming service. It is designed to be a simple, fast, and customizable way to share personal show watchlists or movie recommendations with friends and family.

It is entirely front-end and relies on a single local configuration file, making it easy to host anywhere without a backend database.

## Features
*   **Cinematic Hero Section:** Automatically cycles through featured shows with smooth fade transitions.
*   **Tag-Based Categorization:** Dynamically generates layout grids based on custom tags you define.
*   **Detailed Show Modals:** View descriptions, tags, and custom streaming links in a clean overlay interface.
*   **Embedded Trailers:** Automatically detects "Trailer" links and plays YouTube videos directly in the app.
*   **Zero Dependencies:** Built with vanilla HTML, CSS, and JavaScript.
*   **Responsive CSS Grid:** Looks great on desktop and mobile.

## Getting Started

Because this project is entirely static, getting it up and running is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/drewgg/drewflix.git
   cd drewflix
   ```

2. **Setup your Data:**
   Rename or copy the provided `data.example.js` to `data.js`.
   ```bash
   cp data.example.js data.js
   ```

3. **Run locally:**
   
   Open `index.html` in your browser to view your creation.

## Configuration

All of the content on your site is driven by the `data.js` file. The `data.example.js` file contains instructions.

### Global Settings

At the top of `data.js`, you can modify basic site behaviors:
*   `RANDOMIZE_RECOMMENDED`: (Boolean) Randomizes the order of your shows in the main grid on page load.
*   `FEATURED_SHOW_CYCLE_TIME`: (Integer) Seconds between hero background cycles.
*   `MAX_RECOMMENDED_SHOWS`: (Integer) The maximum number of items to display in the primary "Recommended for You" row.

### Adding Shows
Simply add a new JSON object to the `localShowData` array. You can control image positions natively using standard CSS string properties (e.g., `center 20%`) within the layout configurations.

## Hosting

Since the application relies strictly on standard web technologies and a local `.js` data file, it is extremely cheap (or free) to host. You can deploy the root directory to any standard web server (Apache, Nginx), GitHub Pages, etc.

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.html) for more details.

To use this license in your own fork or deployment, ensure you include the required copyright notice and the full text of the GPLv3 license.
