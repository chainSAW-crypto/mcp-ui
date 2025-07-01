export const getDataVisualizationTemplate = (title: string, htmlContent: string, query?: string): string => {
  const timestamp = new Date().toISOString();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: #333;
    }

    .main-container {
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .header-section {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 30px;
      text-align: center;
      position: relative;
    }

    .header-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.1;
    }

    .header-section h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
      position: relative;
    }

    .header-section p {
      font-size: 1.1rem;
      opacity: 0.9;
      position: relative;
    }

    .copy-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .copy-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .copy-button.copied {
      background: rgba(34, 197, 94, 0.8);
      border-color: rgba(34, 197, 94, 0.9);
    }

    .content-section {
      padding: 40px;
    }

    .container {
      width: 100%;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 1px solid #e2e8f0;
      border-radius: 15px;
      padding: 25px;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4);
    }

    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .metric-label {
      font-size: 1rem;
      color: #64748b;
      font-weight: 500;
    }

    .section {
      margin-bottom: 30px;
    }

    .stream-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 15px;
      margin-bottom: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .stream-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .header {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      border-bottom: 1px solid #e2e8f0;
    }

    .icon {
      width: 32px;
      height: 32px;
      fill: #4f46e5;
      flex-shrink: 0;
    }

    .header h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .details {
      padding: 25px;
      line-height: 1.6;
    }

    .details p {
      margin-bottom: 12px;
      color: #475569;
    }

    .details strong {
      color: #1e293b;
      font-weight: 600;
    }

    /* Chart and Canvas Styling */
    canvas {
      max-width: 100%;
      height: auto !important;
      margin: 15px 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .chart-container {
      position: relative;
      width: 100%;
      height: 400px;
      margin: 20px 0;
      padding: 10px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }

    .timestamp {
      text-align: center;
      padding: 20px;
      color: #64748b;
      font-size: 0.9rem;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    @media (max-width: 768px) {
      .header-section {
        padding: 20px;
      }

      .header-section h1 {
        font-size: 2rem;
      }

      .content-section {
        padding: 20px;
      }

      .copy-button {
        position: static;
        margin-top: 15px;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Toast notification styles */
    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #22c55e;
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
      z-index: 1000;
    }

    .toast.show {
      transform: translateX(0);
    }
  </style>
</head>
<body>
  <div class="main-container">
    <div class="header-section">
      <button class="copy-button" onclick="copyToClipboard()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <span id="copy-text">Copy Content</span>
      </button>
      <h1>${title}</h1>
      ${query ? `<p>Query: ${query}</p>` : ''}
    </div>
    
    <div class="content-section">
      ${htmlContent}
    </div>
    
    <div class="timestamp">
      Generated on ${new Date().toLocaleString()}
    </div>
  </div>

  <!-- Toast notification -->
  <div id="toast" class="toast">
    Content copied to clipboard!
  </div>

  <script>
    function copyToClipboard() {
      // Get the content section
      const contentSection = document.querySelector('.content-section');
      
      // Create a temporary textarea to hold the content
      const tempTextarea = document.createElement('textarea');
      
      // Get all text content from the content section
      let textContent = '';
      
      // Extract structured data from metric cards
      const metricCards = contentSection.querySelectorAll('.metric-card');
      if (metricCards.length > 0) {
        textContent += 'METRICS:\\n';
        metricCards.forEach(card => {
          const value = card.querySelector('.metric-value')?.textContent || '';
          const label = card.querySelector('.metric-label')?.textContent || '';
          if (value && label) {
            textContent += \`- \${label}: \${value}\\n\`;
          }
        });
        textContent += '\\n';
      }
      
      // Extract data from stream cards
      const streamCards = contentSection.querySelectorAll('.stream-card');
      if (streamCards.length > 0) {
        textContent += 'DETAILED DATA:\\n';
        streamCards.forEach((card, index) => {
          const header = card.querySelector('.header h3')?.textContent || '';
          const details = card.querySelector('.details')?.textContent || '';
          
          if (header) {
            textContent += \`\${index + 1}. \${header}\\n\`;
          }
          if (details) {
            // Clean up the details text
            const cleanDetails = details.replace(/\\s+/g, ' ').trim();
            textContent += \`   \${cleanDetails}\\n\\n\`;
          }
        });
      }
      
      // If no structured content found, get all text
      if (!textContent.trim()) {
        textContent = contentSection.textContent?.replace(/\\s+/g, ' ').trim() || 'No content available';
      }
      
      // Add title and query information
      const title = document.querySelector('.header-section h1')?.textContent || '';
      const query = document.querySelector('.header-section p')?.textContent || '';
      
      let finalContent = '';
      if (title) finalContent += \`TITLE: \${title}\\n\\n\`;
      if (query) finalContent += \`\${query}\\n\\n\`;
      finalContent += textContent;
      
      // Copy to clipboard
      tempTextarea.value = finalContent;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      tempTextarea.setSelectionRange(0, 99999); // For mobile devices
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showToast();
          updateCopyButton();
        } else {
          // Fallback for modern browsers
          navigator.clipboard.writeText(finalContent).then(() => {
            showToast();
            updateCopyButton();
          }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy content to clipboard');
          });
        }
      } catch (err) {
        // Fallback for modern browsers
        if (navigator.clipboard) {
          navigator.clipboard.writeText(finalContent).then(() => {
            showToast();
            updateCopyButton();
          }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy content to clipboard');
          });
        } else {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy content to clipboard');
        }
      }
      
      document.body.removeChild(tempTextarea);
    }
    
    function showToast() {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
    
    function updateCopyButton() {
      const copyButton = document.querySelector('.copy-button');
      const copyText = document.getElementById('copy-text');
      
      copyButton.classList.add('copied');
      copyText.textContent = 'Copied!';
      
      setTimeout(() => {
        copyButton.classList.remove('copied');
        copyText.textContent = 'Copy Content';
      }, 2000);
    }
  </script>
</body>
</html>
  `;
}
