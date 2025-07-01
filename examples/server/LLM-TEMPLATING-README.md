# LLM-Powered Generic Templating Server

This server has been transformed into a **completely generic LLM-powered templating system** that can take any raw JSON data, use an LLM to structure it appropriately, and apply templates to create formatted output.

## 🎯 Core Concept

Instead of hardcoded tools, this server now provides:

1. **Generic Data Transformation**: Takes any raw JSON input
2. **LLM-Powered Structuring**: Uses Groq/LLaMA to intelligently structure the data
3. **Template Application**: Uses Handlebars templating to format the output
4. **Flexible Output**: Returns formatted text, HTML, or structured JSON

## 🛠 Main Tool: `transform_and_template`

The primary tool that powers everything:

```typescript
transform_and_template({
  rawData: any,              // Your raw JSON data
  templateType?: string,     // Optional template type hint
  customTemplate?: string,   // Custom Handlebars template
  customPrompt?: string,     // Custom LLM prompt for structuring
  outputFormat?: 'text'|'html'|'json'  // Output format
})
```

### Example Usage

```javascript
// Example 1: Transform project data
{
  "rawData": {
    "project": "Mobile App",
    "team": ["Alice", "Bob", "Charlie"],
    "tasks": [
      {"name": "Login API", "status": "done"},
      {"name": "Dashboard UI", "status": "in-progress"},
      {"name": "User Profile", "status": "todo"}
    ]
  },
  "templateType": "project_insights",
  "outputFormat": "text"
}

// Example 2: Custom template for any data
{
  "rawData": {
    "sales": [
      {"month": "Jan", "revenue": 50000},
      {"month": "Feb", "revenue": 75000}
    ]
  },
  "customTemplate": `
📊 Sales Report
{{#each sales}}
📅 {{month}}: ${{revenue}}
{{/each}}
Total: ${{totalRevenue}}
  `,
  "customPrompt": "Structure this sales data and calculate totals"
}
```

## 🎨 Built-in Templates

The server includes several pre-built Handlebars templates:

### 1. `task_status` Template
```handlebars
🎯 Task Status Report
{{#each members}}
👤 {{name}}:
  📋 To Do: {{toDo}}
  🔄 In Progress: {{inProgress}}
  🚫 Blocked: {{blocked}}
  📊 Remaining: {{remaining}}
  💼 Current Work: {{currentWork}}
{{/each}}
📈 Summary: {{summary}}
```

### 2. `team_interaction` Template
```handlebars
🤖 Team Interaction Response:
👤 Member: {{memberName}}
🎯 Action: {{action}}
💬 Response: {{response}}
⏰ Time: {{timestamp}}
{{#if additionalInfo}}ℹ️ Info: {{additionalInfo}}{{/if}}
{{#if success}}✅ Success{{else}}❌ Failed{{/if}}
```

### 3. `project_insights` Template
```handlebars
🧠 Project Insights ({{timeframe}} - {{focus}}):

📊 Current Metrics:
  🚀 Productivity: {{metrics.productivity}}/10
  😊 Team Morale: {{metrics.teamMorale}}/10
  ⚠️ Risk Level: {{metrics.riskLevel}}/10
  💎 Code Quality: {{metrics.codeQuality}}/10

🔍 Key Insights:
{{#each insights}}
  {{@index}}. {{#if (eq severity 'high')}}🔴{{else}}{{#if (eq severity 'medium')}}🟡{{else}}🟢{{/if}}{{/if}} {{title}}
     Category: {{category}}
     {{description}}
     {{#if actionable}}⚡ Actionable item{{/if}}
{{/each}}

💡 Recommendations:
{{#each recommendations}}
  {{@index}}. {{this}}
{{/each}}
```

### 4. `generic` Template
```handlebars
{{#if title}}## {{title}}{{/if}}
{{#if description}}{{description}}{{/if}}
{{#each items}}
• {{this}}
{{/each}}
{{#if conclusion}}

**Conclusion:** {{conclusion}}{{/if}}
```

## 🤖 How the LLM Processing Works

1. **Input**: Raw JSON data from the user
2. **LLM Transformation**: The system sends the data to Groq with a prompt like:
   ```
   Transform this raw data into a structured format suitable for the "task_status" template:
   
   Raw Data: { ... }
   
   Please return a properly structured JSON object that includes all necessary fields for the template.
   If data is missing, generate realistic placeholder data.
   ```
3. **Template Application**: The structured data is then passed through the Handlebars template
4. **Output**: Formatted text, HTML, or JSON is returned

## 🚀 Quick Tools

For convenience, several quick tools are also available:

- `quick_task_status` - Generate task status from minimal input
- `quick_team_interaction` - Simulate team member interactions
- `create_custom_report` - Create any type of custom report
- `show_data_visualization` - Display data in UI components

## ⚙️ Setup

1. **Environment Variable**: Set `GROQ_API_KEY` in your `wrangler.jsonc`:
   ```json
   {
     "vars": {
       "GROQ_API_KEY": "your-groq-api-key-here"
     }
   }
   ```

2. **Deploy**: 
   ```bash
   pnpm run deploy
   ```

## 🎉 Benefits

- **Completely Generic**: Works with any JSON data structure
- **LLM-Powered**: Intelligently structures and enhances data
- **Template Flexibility**: Use built-in templates or create custom ones
- **Multiple Output Formats**: Text, HTML, or JSON
- **Smart Fallbacks**: Graceful error handling and default responses
- **Extensible**: Easy to add new templates and enhance prompts

## 🔍 Use Cases

1. **Project Reporting**: Transform project data into status reports
2. **Team Management**: Structure team interaction data
3. **Data Visualization**: Prepare data for charts and dashboards
4. **Content Generation**: Create formatted content from raw data
5. **API Response Formatting**: Structure API responses consistently
6. **Log Analysis**: Transform logs into readable reports
7. **Custom Dashboards**: Generate templated dashboard content

This approach makes the server incredibly flexible and powerful - it can handle virtually any data transformation and formatting task using the power of LLMs combined with structured templating!
