async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function formatPrice(price) {
  return price ? `$${price.toFixed(2)}` : 'Price unavailable';
}

function formatRating(rating) {
  return rating ? `&#11088; ${Math.min(5, rating).toFixed(1)}/5` : 'Rating unavailable';
}

function createStoreCard(site, data) {
  const card = document.createElement('div');
  card.className = 'store-card';
  card.innerHTML = `
    <div class="store-header">
      <div class="store-meta">
        <div class="store-name">${site.charAt(0).toUpperCase() + site.slice(1)}</div>
        <div class="price-display">
          <span class="price">${formatPrice(data.price)}</span>
          <span class="rating">${formatRating(data.rating)}</span>
        </div>
      </div>
    </div>
    <div class="store-footer">
      <a href="#" class="visit-link" data-url="${data.url}">
        View Product
        <svg class="external-icon" viewBox="0 0 24 24">
          <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
        </svg>
      </a>
    </div>
  `;

  // Add click handler
  const link = card.querySelector('.visit-link');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: data.url });
  });

  return card;
}

function updateComparisonView(productInfo, comparisons) {
  const container = document.getElementById('comparison-container');
  container.innerHTML = '';

  if (!productInfo?.title) {
    container.innerHTML = '<div class="no-results">&#x1F6D2; No comparisons found</div>';
    return;
  }

  const validComparisons = Object.entries(comparisons || {})
    .filter(([site, data]) => site !== productInfo.site && data.price)
    .sort((a, b) => a[1].price - b[1].price);

  container.innerHTML = `
    <div class="product-header">
      <h2>${productInfo.title}</h2>
      <div class="current-price">Current Price: ${formatPrice(productInfo.price)}</div>
    </div>
    <div class="comparison-grid"></div>
  `;

  const grid = container.querySelector('.comparison-grid');
  validComparisons.forEach(([site, data]) => {
    grid.appendChild(createStoreCard(site, data));
  });

  if (validComparisons.length === 0) {
    grid.innerHTML = '<div class="no-results">🛒 No comparisons found</div>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const tab = await getCurrentTab();
    const supportedSites = ['amazon.com', 'walmart.com', 'bestbuy.com', 'target.com'];
    
    if (!supportedSites.some(site => tab.url.includes(site))) {
      document.getElementById('comparison-container').innerHTML = `
        <div class="welcome">
          <p>Visit a product page on:<br>${supportedSites.join(', ')}</p>
        </div>
      `;
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'GET_PRODUCT_INFO' }, response => {
      if (!response?.productInfo) {
        updateComparisonView(null, {});
        return;
      }

      updateComparisonView(response.productInfo, {});
      
      chrome.runtime.sendMessage({
        action: 'SEARCH_PRICES',
  productTitle: response.productInfo.title,
  currentPrice: response.productInfo.price,
  currentSite: response.productInfo.site
      }, comparisonResponse => {
        if (comparisonResponse?.success) {
          updateComparisonView(response.productInfo, comparisonResponse.results);
        }
      });
    });
  } catch (error) {
    document.getElementById('comparison-container').innerHTML = `
     <div class="error">&#x26A0;&#xFE0F; Failed to load comparisons</div>
    `;
  }
});