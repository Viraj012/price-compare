let cachedResults = {};

function generateRealisticPrices(currentPrice, productTitle) {

  const variations = {
    amazon: { min: 0.85, max: 1.1 },
    bestbuy: { min: 0.9, max: 1.05 },
    target: { min: 0.8, max: 1.0 },
    walmart: { min: 0.85, max: 0.95 }
  };

  return {
    amazon: {
      price: currentPrice * (variations.amazon.min + Math.random() * 
             (variations.amazon.max - variations.amazon.min)),
      rating: 4.5 + Math.random() * 0.5,
      url: `https://www.amazon.com/s?k=${encodeURIComponent(productTitle)}`
    },
    bestbuy: {
      price: currentPrice * (variations.bestbuy.min + Math.random() * 
             (variations.bestbuy.max - variations.bestbuy.min)),
      rating: 4.3 + Math.random() * 0.7,
      url: `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(productTitle)}`
    },
    target: {
      price: currentPrice * (variations.target.min + Math.random() * 
             (variations.target.max - variations.target.min)),
      rating: 4.6 + Math.random() * 0.4,
      url: `https://www.target.com/s?searchTerm=${encodeURIComponent(productTitle)}`
    },
    walmart: {
      price: currentPrice * (variations.walmart.min + Math.random() * 
             (variations.walmart.max - variations.walmart.min)),
      rating: 4.4 + Math.random() * 0.6,
      url: `https://www.walmart.com/search?q=${encodeURIComponent(productTitle)}`
    }
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SEARCH_PRICES') {
    const results = generateRealisticPrices(
      message.currentPrice, 
      message.productTitle
    );
    
    // Remove current site from results
    if (results[message.currentSite]) {
      delete results[message.currentSite];
    }

    // Format prices
    Object.values(results).forEach(item => {
      item.price = Number(item.price.toFixed(2));
      item.rating = Number(item.rating.toFixed(1));
    });

    sendResponse({ success: true, results });
    return true;
  }
});