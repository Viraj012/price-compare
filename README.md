# Price Compare Chrome Extension

A Chrome extension that helps users compare product prices across major e-commerce platforms including Amazon, Walmart, Best Buy, and Target.

![Price Compare Extension](icons/icon128.png)

## Features

- Real-time price comparison across major e-commerce platforms
- Clean and modern user interface
- Price and rating display for each store
- Direct links to product pages
- Support for multiple e-commerce platforms:
  - Amazon
  - Walmart
  - Best Buy
  - Target

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/price-compare.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Usage

1. Visit a product page on any supported e-commerce site
2. Click the extension icon in your Chrome toolbar
3. View price comparisons from other supported stores
4. Click "View Product" to open the product page on another store

## Project Structure

```
price-compare/
├── manifest.json        # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── content.js          # Page content extraction
├── background.js       # Background service worker
└── icons/             # Extension icons
```

## Technical Details

- Uses Chrome Extension Manifest V3
- Implements modern JavaScript features
- Responsive design with CSS variables
- Real-time price data extraction
- Cross-platform price comparison

## Development

To modify the extension:

1. Make your changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Test the changes on supported e-commerce sites

## Permissions

The extension requires the following permissions:
- `activeTab`: To access the current tab's content
- `scripting`: To inject content scripts
- `storage`: To store extension data
- `webRequest`: To handle web requests
- `tabs`: To manage browser tabs

## Host Permissions

Access to the following domains is required:
- `*.amazon.com`
- `*.walmart.com`
- `*.bestbuy.com`
- `*.target.com`

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This extension is for educational purposes only. Price comparisons are simulated and may not reflect actual market prices. Always verify prices on the actual store websites before making purchase decisions.