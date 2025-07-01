# Generic JSON-to-HTML MCP Server

This is a Model Context Protocol (MCP) server that provides generic tools for generating sample JSON data and converting any JSON structure into displayable HTML format for iframe rendering.

## Features

- **Generate Sample JSON**: Takes a natural language query and generates realistic sample JSON data
- **Convert JSON to HTML**: Transforms any JSON structure into visually appealing HTML that can be displayed in an iframe
- **LLM-Powered**: Uses Groq LLM for intelligent data generation and HTML formatting
- **Generic**: Works with any type of data structure, not limited to specific domains

## 🛠️ Setup

### 1. Get a Groq API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in
3. Create a new API key
4. Copy your API key

### 2. Configure Environment

Update the `wrangler.jsonc` file with your Groq API key:

```json
{
  "vars": {
    "GROQ_API_KEY": "your-actual-groq-api-key-here"
  }
}
```

Or set it as a secret (recommended for production):

```bash
npx wrangler secret put GROQ_API_KEY
```

### 3. Run the Server

```bash
# Development
pnpm dev

# Build and deploy
pnpm build
pnpm deploy
```

## 🎯 Available Tools

### 1. `get_tasks_status`
Get AI-generated task status information for team members.

**Parameters:**
- `query` (optional): Filter or focus the task status

**Example responses:**
- Team productivity metrics
- Individual task breakdowns
- Weekly summaries
- Current work descriptions

### 2. `interact_with_team_member`
AI-powered team member interactions.

**Parameters:**
- `name`: Team member name
- `action`: Action type (nudge, ask_status, assign_task, send_message)
- `message` (optional): Additional context

**Example actions:**
- Send gentle reminders
- Request status updates
- Assign new tasks
- General communication

### 3. `get_project_insights`
Get AI-generated project insights and recommendations.

**Parameters:**
- `focus` (optional): Focus area (performance, team, risks, opportunities)
- `timeframe` (optional): Analysis timeframe (daily, weekly, monthly)

**Example insights:**
- Performance metrics
- Risk assessments
- Improvement opportunities
- Actionable recommendations

### 4. `show_task_status` & `show_user_status`
Display interactive UIs (unchanged from original implementation).

## 🤖 How It Works

1. **LLM Integration**: Uses Groq's Llama-3.1-70b model for intelligent responses
2. **Structured Output**: Ensures responses follow specific JSON schemas
3. **Fallback System**: Graceful degradation if LLM is unavailable
4. **Error Handling**: Robust error handling with meaningful fallbacks

## 📊 Example Usage

```javascript
// Get general task status
await mcp.call('get_tasks_status');

// Get performance-focused task status
await mcp.call('get_tasks_status', { 
  query: 'team performance and blockers' 
});

// Nudge a team member
await mcp.call('interact_with_team_member', {
  name: 'Alice',
  action: 'nudge',
  message: 'Please update your sprint tasks'
});

// Get project insights
await mcp.call('get_project_insights', {
  focus: 'risks',
  timeframe: 'weekly'
});
```

## 🔧 Customization

### Adding New Tools

```typescript
this.server.tool(
  'your_tool_name',
  'Tool description',
  { /* parameters schema */ },
  async (params) => {
    const prompt = `Your LLM prompt here...`;
    const response = await this.generateStructuredResponse(prompt, {
      fallback: { /* fallback data */ }
    });
    return { content: [{ type: 'text', text: response }] };
  }
);
```

### Modifying Prompts

Edit the prompt strings in the `generateStructuredResponse` calls to customize the AI behavior:

```typescript
const prompt = `Generate a custom response for ${params.context}.
Include specific requirements...
Return in JSON format: { ... }`;
```

## 🚀 Benefits

- **Dynamic Data**: No more hardcoded responses
- **Intelligent Interactions**: Context-aware team communications
- **Scalable**: Easily add new AI-powered tools
- **Realistic**: AI generates believable, varied data
- **Maintainable**: Clean separation of AI logic and UI components

## 🔍 Troubleshooting

1. **API Key Issues**: Ensure your Groq API key is correctly set
2. **Rate Limits**: Groq has rate limits; implement caching if needed
3. **JSON Parsing**: The system has robust JSON extraction from LLM responses
4. **Fallbacks**: Default responses ensure the system never fails completely

## 📈 Future Enhancements

- Add memory/context persistence
- Implement user-specific personalization
- Add more sophisticated prompting strategies
- Integrate with real project management tools
- Add voice/audio capabilities
