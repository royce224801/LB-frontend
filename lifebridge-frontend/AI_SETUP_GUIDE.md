# 🔑 AI API Setup Guide

## Quick Start - Where to Add Your API Key

### **SINGLE FILE TO EDIT:** `ai-config.ts`

Open the file `lifebridge-frontend/ai-config.ts` and look for this line:

```typescript
apiKey: 'YOUR_API_KEY_HERE', // 👈 REPLACE WITH YOUR OPENAI API KEY
```

Replace `'YOUR_API_KEY_HERE'` with your actual API key (keep the quotes).

---

## Step-by-Step Instructions

### Option 1: OpenAI (Recommended - Best Quality)

1. **Get API Key** (2 minutes):
   - Go to: https://platform.openai.com/signup
   - Sign up or log in
   - Go to: https://platform.openai.com/api-keys
   - Click **"Create new secret key"**
   - Name it "LifeBridge" and click **Create**
   - **Copy the key** (starts with `sk-...`)
   - ⚠️ Save it somewhere safe - you can't see it again!

2. **Add to App**:
   - Open: `lifebridge-frontend/ai-config.ts`
   - Find line: `apiKey: 'YOUR_API_KEY_HERE',`
   - Replace with: `apiKey: 'sk-your-actual-key-here',`
   - Save the file

3. **Test**:
   - Restart your app
   - Open AI chatbot
   - Type: "I have chest pain"
   - Should get ONLY Cardiologist (not all doctors!)

**Cost**: ~$0.0005 per symptom analysis (500 analyses for $0.25!)

---

### Option 2: Google Gemini (Free!)

1. **Get API Key**:
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click **"Create API Key"**
   - Copy the key

2. **Configure App**:
   - Open: `lifebridge-frontend/ai-config.ts`
   - **Comment out** the OpenAI section (lines 19-25):
   ```typescript
   // export const AI_CONFIG = {
   //   provider: 'openai',
   //   ...
   // };
   ```
   
   - **Uncomment** the Gemini section (lines 55-62):
   ```typescript
   export const AI_CONFIG = {
     provider: 'gemini',
     apiKey: 'YOUR_GEMINI_API_KEY_HERE', // 👈 PASTE YOUR KEY HERE
     apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
     model: 'gemini-pro',
     maxTokens: 150,
     temperature: 0.3,
   };
   ```

3. **Update Chatbot for Gemini**:
   The current code is optimized for OpenAI. Gemini has a different API format.
   I can update it for you if you choose Gemini!

**Cost**: FREE with generous limits!

---

### Option 3: Use Without AI (Current Keyword Matching)

If you don't want to set up an API key right now:

1. Open: `lifebridge-frontend/ai-config.ts`
2. **Comment out** the OpenAI section (lines 19-25)
3. **Uncomment** the Fallback section (lines 65-72):

```typescript
export const AI_CONFIG = {
  provider: 'fallback',
  apiKey: null,
  apiUrl: null,
  model: null,
  maxTokens: 0,
  temperature: 0,
};
```

The app will continue using keyword matching (current behavior).

---

## What Changes After Adding API Key?

### Before (Keyword Matching):
- User: "chest pain"
- System: Matches keywords → Shows ALL doctors

### After (AI Integration):
- User: "chest pain"
- AI analyzes → Understands medical context
- System: Shows ONLY Cardiologist ✅

### Better Understanding:
- **"I feel dizzy and my heart races"**
  - Before: Shows all doctors
  - After: Shows Cardiologist only ✅

- **"My skin is red and itchy"**
  - Before: Shows all doctors
  - After: Shows Dermatologist only ✅

- **"Stomach hurts after eating"**
  - Before: Shows all doctors
  - After: Shows Gastroenterologist only ✅

---

## Verification Steps

After adding your API key:

1. **Check Console**:
   - Should see: "AI-powered by OpenAI ChatGPT"
   - Should NOT see: "Using fallback keyword matching"

2. **Test Specific Symptoms**:
   ```
   Test 1: "chest pain and shortness of breath"
   Expected: ONLY Cardiologist(s)
   
   Test 2: "skin rash itching"
   Expected: ONLY Dermatologist(s)
   
   Test 3: "stomach ache nausea"
   Expected: ONLY Gastroenterologist(s)
   
   Test 4: "feeling sad and anxious"
   Expected: ONLY Psychiatrist(s)
   ```

3. **If All Doctors Still Show**:
   - Check API key is correct (no spaces, includes 'sk-' prefix)
   - Check you saved the file
   - Restart the app completely
   - Check app console for errors

---

## Security Best Practices

### ⚠️ IMPORTANT: Protect Your API Key

1. **Never Share Your API Key**
   - Don't post it online
   - Don't commit it to GitHub
   - Don't share screenshots with the key visible

2. **Add to .gitignore**:
   Create or update `.gitignore` file:
   ```
   # AI Configuration (contains API keys)
   ai-config.ts
   ```

3. **For Production**:
   - Use environment variables
   - Store keys on a secure backend
   - Never expose keys in client code

---

## Troubleshooting

### Error: "Invalid API Key"
- Double-check the key from OpenAI dashboard
- Make sure you copied the full key
- Ensure there are no spaces before/after the key

### Error: "Rate Limit Exceeded"
- You've used up your free credits
- Add payment method to OpenAI account
- Or switch to Gemini (free)

### Error: "Network Error"
- Check internet connection
- Verify API URL is correct
- Try again in a few minutes

### Still Showing All Doctors?
- Verify API key is added correctly
- Check console for error messages
- Make sure you're using the right AI_CONFIG export
- Restart the app after changes

---

## API Costs (Pay-as-you-go)

### OpenAI GPT-3.5-turbo:
- Cost: $0.002 per 1,000 tokens
- Each symptom analysis: ~200-300 tokens
- **Cost per analysis: $0.0004 - $0.0006**
- **500 analyses: ~$0.25** 💰

### OpenAI GPT-4:
- Cost: $0.03 per 1,000 tokens (15x more expensive)
- Better quality, but probably overkill for this use case
- **Cost per analysis: $0.006 - $0.009**

### Google Gemini:
- **FREE tier** with 60 requests per minute
- Perfect for development and testing!

---

## File Structure

```
lifebridge-frontend/
├── ai-config.ts          👈 ADD YOUR API KEY HERE
├── app/
│   └── ai-chatbot.tsx    (Uses AI_CONFIG from above)
└── api-config.ts         (Backend URL - different file)
```

**Two different config files:**
- `ai-config.ts` - For AI API (OpenAI, Gemini, etc.)
- `api-config.ts` - For your backend server

---

## Example: Complete ai-config.ts

```typescript
export const AI_CONFIG = {
  provider: 'openai',
  apiKey: 'sk-proj-abc123xyz789...', // 👈 YOUR REAL KEY HERE
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  maxTokens: 150,
  temperature: 0.3,
};
```

That's it! Just change that one line and restart the app.

---

## Need Help?

1. **Can't get OpenAI key?**
   - Use Gemini (free) instead
   - Or use fallback mode (no API needed)

2. **Want me to add Gemini support?**
   - Let me know and I'll update the code
   - Gemini API format is different from OpenAI

3. **Want to use Claude?**
   - I can add Claude support too
   - Just ask!

---

## Summary

✅ **ONE FILE** to edit: `ai-config.ts`
✅ **ONE LINE** to change: `apiKey: 'YOUR_API_KEY_HERE'`
✅ **TWO MINUTES** to get OpenAI key
✅ **ZERO COST** with Gemini free tier

**That's all you need to do!** 🎉

---

**Last Updated**: October 16, 2025
