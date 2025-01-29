
class ProductExtractor {
  constructor() {
    this.hostname = window.location.hostname;
  }

  getProductInfo() {
    try {
      if (this.hostname.includes('amazon')) return this.extractAmazonProduct();
      if (this.hostname.includes('walmart')) return this.extractWalmartProduct();
      if (this.hostname.includes('bestbuy')) return this.extractBestBuyProduct();
      if (this.hostname.includes('target')) return this.extractTargetProduct();
      return null;
    } catch (error) {
      console.error('Extraction error:', error);
      return null;
    }
  }

  extractAmazonProduct() {
    const title = document.querySelector('#productTitle')?.textContent?.trim() || 
                 document.querySelector('#title')?.textContent?.trim();
    
    const priceElement = document.querySelector('.a-price-whole') ||
                        document.querySelector('.a-offscreen') ||
                        document.querySelector('.priceToPay');
    
    const ratingElement = document.querySelector('.averageStarRatingNumerical') ||
                         document.querySelector('.reviewCountTextLinkedHistogram') ||
                         document.querySelector('#acrPopover');

    return {
      title: title || 'Unknown Product',
      price: this.cleanPrice(priceElement?.textContent),
      rating: this.cleanRating(ratingElement?.textContent),
      site: 'amazon',
      url: window.location.href
    };
  }

  extractWalmartProduct() {
    const title = document.querySelector('[data-testid="product-title"]')?.textContent?.trim() ||
                 document.querySelector('h1')?.textContent?.trim();
    
    const priceElement = document.querySelector('[data-testid="price-wrap"]') ||
                        document.querySelector('[itemprop="price"]');
    
    return {
      title: title || 'Unknown Product',
      price: this.cleanPrice(priceElement?.textContent),
      rating: this.cleanRating(null), 
      site: 'walmart',
      url: window.location.href
    };
  }


  cleanPrice(price) {
    if (!price) return null;
    const numeric = price.replace(/[^0-9.]/g, '');
    return parseFloat(numeric) || null;
  }

  cleanRating(rating) {
    if (!rating) return null;
    const match = rating.match(/(\d+\.?\d?)/);
    return match ? parseFloat(match[1]) : null;
  }
}

const extractor = new ProductExtractor();
const currentProductInfo = extractor.getProductInfo();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_PRODUCT_INFO') {
    sendResponse({ productInfo: currentProductInfo });
  }
});