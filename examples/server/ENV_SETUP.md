# Environment Setup

## API Keys Configuration

This project requires API keys to function properly. Follow these steps to set them up:

### 1. Copy the environment template
```bash
cp .env.example .env
```

### 2. Add your API keys to the .env file
```bash
# Get your Groq API key from: https://console.groq.com/keys
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3. For development with Wrangler (Cloudflare Workers)
The project will automatically use your `.env` file, but for Wrangler development, you can also create a `.dev.vars` file:

```bash
# .dev.vars (for wrangler dev)
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 4. Run the development server
```bash
cd examples/server
npx wrangler dev
```

## Important Notes

- **Never commit API keys to git** - both `.env` and `.dev.vars` files are in `.gitignore`
- **Use `.env.example` as a template** - it shows what variables are needed
- **Environment variables are loaded automatically** - no additional configuration needed
- **For production deployment** - set environment variables in your Cloudflare Workers dashboard

## Getting API Keys

### Groq API Key
1. Go to [Groq Console](https://console.groq.com/keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy it to your `.env` file
