import { McpAgent } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createRequestHandler } from 'react-router';
import { createHtmlResource } from '@mcp-ui/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDataVisualizationTemplate } from './templates/dataTemplate.js';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const MODE = process.env.NODE_ENV || 'production';
const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build' as any),
  MODE,
);


export class MyMCP extends McpAgent {
  server = new McpServer({
    name: 'Data Visualization Engine - Powered by Gemini 2.0 Flash',
    version: '2.1.0',
  });

  private gemini: GoogleGenerativeAI | null = null;
  private model: any = null;

  private initGemini(apiKey: string) {
    if (!this.gemini) {
      if (!apiKey || apiKey === 'your-google-api-key-here') {
        throw new Error('GOOGLE_API_KEY is not set. Please add it to your .env or .dev.vars file.');
      }
      this.gemini = new GoogleGenerativeAI(apiKey);
      this.model = this.gemini.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    }
  }



  private async generateVisualizationHtml(userQuery: string) {
    try {
      if (!this.model) {
        throw new Error('Gemini model not initialized');
      }

      const prompt = `Create a professional HTML visualization with interactive charts for the user's query. Generate realistic, detailed content with working Chart.js visualizations.

USER QUERY: "${userQuery}"

Requirements:
- Create a beautiful, informative HTML visualization using div elements with proper classes
- Use the provided CSS classes: .container, .section, .stream-card, .header, .details, .metrics-grid, .metric-card, .metric-value, .metric-label
- Include realistic data points, numbers, percentages, and detailed information
- Add interactive charts using Chart.js (canvas elements with unique IDs)
- Include JavaScript code to render the charts with realistic data
- Use SVG icons or create simple ones
- Structure the content logically with headers, metrics, charts, and detailed cards
- Make it comprehensive and visually appealing
- Return ONLY the HTML content (div elements) with embedded JavaScript, no explanations or code block markers
- DO NOT include <html>, <head>, <body> tags - only the content divs and script tags

Example structure with charts:
<div class="container">
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-value">$250B</div>
      <div class="metric-label">Total Revenue</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">15.2%</div>
      <div class="metric-label">Growth Rate</div>
    </div>
  </div>
  <div class="section">
    <div class="stream-card">
      <div class="header">
        <h3>Revenue Trends</h3>
      </div>
      <div class="details">
        <canvas id="revenueChart" width="400" height="200"></canvas>
      </div>
    </div>
  </div>
</div>

<script>
// Chart.js code to create interactive charts
const ctx = document.getElementById('revenueChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue Over Time'
      }
    }
  }
});
</script>

IMPORTANT: Generate realistic data and working Chart.js code. Include multiple chart types (line, bar, pie, doughnut) as appropriate for the query. Use unique canvas IDs for each chart.

Generate the HTML visualization with interactive charts:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) throw new Error('No response from Gemini');

      // Clean the content and ensure it's valid HTML
      const cleanContent = content.trim()
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();

      return cleanContent;
    } catch (error) {
      console.error('Error generating visualization HTML:', error);
      // Fallback visualization with a working chart
      return `
        <div class="container">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">Loading...</div>
              <div class="metric-label">Data Processing</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">Error</div>
              <div class="metric-label">Status</div>
            </div>
          </div>
          <div class="section">
            <div class="stream-card">
              <div class="header">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M12,2L13.09,8.26L20,9L13.09,9.74L12,16L10.91,9.74L4,9L10.91,8.26L12,2Z"/>
                </svg>
                <h3>Sample Data Visualization</h3>
              </div>
              <div class="details">
                <canvas id="fallbackChart" width="400" height="200"></canvas>
                <p style="margin-top: 15px;"><strong>Query:</strong> ${userQuery}</p>
                <p><strong>Status:</strong> Using fallback visualization</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              </div>
            </div>
          </div>
        </div>

        <script>
        // Fallback chart
        setTimeout(() => {
          const ctx = document.getElementById('fallbackChart');
          if (ctx) {
            new Chart(ctx.getContext('2d'), {
              type: 'bar',
              data: {
                labels: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
                datasets: [{
                  label: 'Sample Data',
                  data: [12, 19, 3, 15],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                  ]
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Fallback Data Visualization'
                  }
                }
              }
            });
          }
        }, 100);
        </script>
      `;
    }
  }

  private getHtmlTemplate(title: string, htmlContent: string, query?: string): string {
    return getDataVisualizationTemplate(title, htmlContent, query);
  }

  private async convertDataToVisualization(userQuery: string, context?: string) {
    try {
      // Generate HTML visualization using the LLM
      const htmlContent = await this.generateVisualizationHtml(userQuery);
      const title = context || `Data Visualization: ${userQuery}`;
      
      // Use the template with the generated visualization
      const fullHtml = this.getHtmlTemplate(title, htmlContent, userQuery);
      
      // Validate HTML content
      if (!fullHtml || typeof fullHtml !== 'string' || fullHtml.trim().length === 0) {
        throw new Error('Generated HTML content is empty or invalid');
      }
      
      return fullHtml;
    } catch (error) {
      console.error('Error converting data to visualization:', error);
      // Fallback to template with error message and working chart
      const fallbackContent = `
        <div class="container">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">Error</div>
              <div class="metric-label">Status</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${new Date().toLocaleTimeString()}</div>
              <div class="metric-label">Generated At</div>
            </div>
          </div>
          <div class="section">
            <div class="stream-card">
              <div class="header">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                </svg>
                <h3>Error Processing Query</h3>
              </div>
              <div class="details">
                <canvas id="errorChart" width="400" height="200"></canvas>
                <p style="margin-top: 15px;"><strong>Query:</strong> ${userQuery}</p>
                <p><strong>Status:</strong> Unable to generate visualization</p>
                <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              </div>
            </div>
          </div>
        </div>

        <script>
        // Error fallback chart
        setTimeout(() => {
          const ctx = document.getElementById('errorChart');
          if (ctx) {
            new Chart(ctx.getContext('2d'), {
              type: 'doughnut',
              data: {
                labels: ['Error', 'Success'],
                datasets: [{
                  data: [1, 0],
                  backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(75, 192, 192, 0.8)']
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Processing Status'
                  }
                }
              }
            });
          }
        }, 100);
        </script>
      `;
      
      return this.getHtmlTemplate('Error - Data Visualization', fallbackContent, userQuery);
    }
  }

  async init() {
    const requestUrl = this.props.requestUrl as string;
    const googleApiKey = this.props.googleApiKey as string;
    const url = new URL(requestUrl);
    const requestHost = url.host;

    // Initialize Gemini with the API key from environment
    this.initGemini(googleApiKey);

    // Primary tool: Generate data visualization from query
    this.server.tool(
      'generate_and_display_data',
      'Generate a professional data visualization from a user query. This tool creates realistic, visual representations of data using beautiful HTML templates with interactive Chart.js visualizations. Use this tool first for any data visualization request.',
      { 
        query: z.string().describe('The user query or description of the data you want to visualize (e.g., "revenue of apple", "weather in New York", "student grades")'),
        context: z.string().optional().describe('Additional context or title for the visualization')
      },
      async ({ query, context }) => {
        try {
          // Generate HTML visualization using the LLM
          const displayContext = context || `Data Visualization: ${query}`;
          const htmlContent = await this.convertDataToVisualization(query, displayContext);
          
          // Validate the HTML content
          if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.trim().length === 0) {
            throw new Error('Generated HTML content is empty or invalid');
          }
          
          // Create a data URL with proper encoding
          const cleanHtml = htmlContent.replace(/\n\s*\n/g, '\n'); // Clean up extra whitespace
          const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(cleanHtml)}`;
          const uniqueUiAppUri: `ui://${string}` = `ui://generated-data/${Date.now()}`;
          
          const resourceBlock = createHtmlResource({
            uri: uniqueUiAppUri,
            content: { type: 'externalUrl', iframeUrl: dataUrl },
            delivery: 'text',
          });

          return {
            content: [resourceBlock],
          };
        } catch (error) {
          console.error('Error in generate_and_display_data tool:', error);
          
          // Create fallback visualization
          const fallbackHtml = this.getHtmlTemplate(
            'Error - Data Visualization',
            `<div class="container">
              <div class="section">
                <div class="stream-card">
                  <div class="header">
                    <h3>Visualization Error</h3>
                  </div>
                  <div class="details">
                    <p><strong>Query:</strong> ${query}</p>
                    <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
                    <canvas id="fallbackErrorChart" width="400" height="200"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <script>
            setTimeout(() => {
              const ctx = document.getElementById('fallbackErrorChart');
              if (ctx) {
                new Chart(ctx.getContext('2d'), {
                  type: 'bar',
                  data: {
                    labels: ['Error Occurred'],
                    datasets: [{
                      label: 'Status',
                      data: [1],
                      backgroundColor: ['rgba(255, 99, 132, 0.8)']
                    }]
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Processing Error'
                      }
                    }
                  }
                });
              }
            }, 100);
            </script>`,
            query
          );
          
          const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(fallbackHtml)}`;
          const uniqueUiAppUri: `ui://${string}` = `ui://error-${Date.now()}`;
          
          const resourceBlock = createHtmlResource({
            uri: uniqueUiAppUri,
            content: { type: 'externalUrl', iframeUrl: dataUrl },
            delivery: 'text',
          });

          return {
            content: [resourceBlock],
          };
        }
      },
    );

    // Secondary tool: Create visualization from existing data  
    this.server.tool(
      'convert_json_to_display',
      'Convert existing JSON or data into a professional visual display using consistent HTML templates with interactive Chart.js visualizations. This tool formats raw data into beautiful visualizations. Use this after generate_and_display_data for additional formatting of existing data.',
      { 
        data: z.any().describe('Existing JSON or data to be converted to a visual display using the consistent template'),
        context: z.string().optional().describe('Additional context or title for the visualization'),
        query: z.string().optional().describe('Original user query for context (optional)')
      },
      async ({ data, context, query }) => {
        try {
          // Convert data to proper visualization
          const displayContext = context || 'Data Display';
          const visualizationQuery = query || `Display data: ${JSON.stringify(data).substring(0, 100)}...`;
          
          // Create visualization from the data
          const htmlContent = await this.convertDataToVisualization(visualizationQuery, displayContext);
          
          // Validate the HTML content
          if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.trim().length === 0) {
            throw new Error('Generated HTML content is empty or invalid');
          }
          
          // Create a data URL with proper encoding
          const cleanHtml = htmlContent.replace(/\n\s*\n/g, '\n'); // Clean up extra whitespace
          const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(cleanHtml)}`;
          const uniqueUiAppUri: `ui://${string}` = `ui://json-display/${Date.now()}`;
          
          const resourceBlock = createHtmlResource({
            uri: uniqueUiAppUri,
            content: { type: 'externalUrl', iframeUrl: dataUrl },
            delivery: 'text',
          });

          return {
            content: [resourceBlock],
          };
        } catch (error) {
          console.error('Error in convert_json_to_display tool:', error);
          
          // Create fallback visualization with the actual data
          const fallbackHtml = this.getHtmlTemplate(
            'Data Display - Error',
            `<div class="container">
              <div class="section">
                <div class="stream-card">
                  <div class="header">
                    <h3>Data Display Error</h3>
                  </div>
                  <div class="details">
                    <p><strong>Data:</strong> ${JSON.stringify(data, null, 2).substring(0, 200)}...</p>
                    <p><strong>Context:</strong> ${context || 'N/A'}</p>
                    <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
                    <canvas id="fallbackDataChart" width="400" height="200"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <script>
            setTimeout(() => {
              const ctx = document.getElementById('fallbackDataChart');
              if (ctx) {
                new Chart(ctx.getContext('2d'), {
                  type: 'pie',
                  data: {
                    labels: ['Error', 'Data Available'],
                    datasets: [{
                      data: [1, 1],
                      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)']
                    }]
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Data Processing Status'
                      }
                    }
                  }
                });
              }
            }, 100);
            </script>`,
            query || 'Data Display'
          );
          
          const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(fallbackHtml)}`;
          const uniqueUiAppUri: `ui://${string}` = `ui://error-data-${Date.now()}`;
          
          const resourceBlock = createHtmlResource({
            uri: uniqueUiAppUri,
            content: { type: 'externalUrl', iframeUrl: dataUrl },
            delivery: 'text',
          });

          return {
            content: [resourceBlock],
          };
        }
      },
    );
  }
}

export default {
  fetch(request: Request, env: Env & { GOOGLE_API_KEY?: string }, ctx: ExecutionContext) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    const url = new URL(request.url);
    ctx.props.requestUrl = request.url;
    ctx.props.googleApiKey = env.GOOGLE_API_KEY || '';

    if (url.pathname === '/sse' || url.pathname === '/sse/message') {
      return MyMCP.serveSSE('/sse').fetch(request, env, ctx);
    }

    if (url.pathname === '/mcp') {
      return MyMCP.serve('/mcp').fetch(request, env, ctx);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
};
