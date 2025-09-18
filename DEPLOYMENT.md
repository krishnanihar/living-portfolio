# Deployment Guide - Living Portfolio with Gemini AI

## 🚀 Quick Deployment to Vercel

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Deploy to Vercel

#### Option A: Deploy from Git Repository
1. Push your code to GitHub/GitLab
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Add environment variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your API key from step 1
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Add environment variable
vercel env add GEMINI_API_KEY

# Redeploy with new env var
vercel --prod
```

### 3. Verify Deployment
1. Visit your deployed URL
2. Open the chat bot
3. Ask a question like "Tell me about Pixel Radar"
4. Verify you get AI-powered responses

## 🔧 Local Development

### Setup
```bash
# Install dependencies (optional - this is a static site)
npm install

# Start local server
npx serve .
# or
python -m http.server 8000
```

### Environment Variables
1. Copy `.env.example` to `.env.local`
2. Add your Gemini API key to `.env.local`
3. Restart your development server

## 📋 Features Added

### AI Integration
- **Secure API**: Gemini API calls happen server-side via Vercel functions
- **Fallback Responses**: Local responses when AI is unavailable
- **Context Awareness**: AI knows which portfolio section user is viewing
- **Personality**: AI responds as Nihar's digital consciousness

### Chat System Enhancements
- **Hybrid Intelligence**: Quick local responses + AI for complex questions
- **Particle Effects**: Visual feedback when AI detects keywords
- **Error Handling**: Graceful degradation when API is unavailable
- **Performance**: Optimized response times with smart caching

## 🔒 Security

- API key is never exposed to the client
- CORS headers configured for security
- Rate limiting via Vercel's built-in protection
- Input sanitization and safety filters

## 🐛 Troubleshooting

### Chat Not Working
1. Check browser console for errors
2. Verify environment variable is set in Vercel dashboard
3. Test API endpoint directly: `https://yoursite.vercel.app/api/chat`

### API Errors
1. Verify Gemini API key is valid
2. Check API quota in Google AI Studio
3. Review Vercel function logs

### Local Development Issues
1. Ensure `.env.local` exists with valid API key
2. Use `vercel dev` for testing functions locally
3. Check network requests in browser DevTools

## 📊 Monitoring

- Monitor API usage in Google AI Studio
- Track function performance in Vercel Dashboard
- Check error rates and response times

## 🚨 Important Notes

- **API Limits**: Gemini has rate limits - monitor usage
- **Costs**: Free tier available, check pricing for production use
- **Fallbacks**: Local responses ensure chat always works
- **Updates**: Redeploy after updating environment variables