# 🤖 Gemini AI Integration Guide

This document explains how Gemini AI is integrated into DropoutGuard for generating personalized recovery plans.

## Overview

DropoutGuard uses **Google Gemini 1.5 Flash** to generate AI-powered, personalized recovery plans for at-risk students. The system automatically analyzes student performance data and creates actionable recovery strategies.

## Configuration

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

### 2. Add to Environment Variables

Add your Gemini API key to your `.env` file:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Verify Configuration

The system automatically detects if Gemini is configured. You can check programmatically:

```typescript
import { isGeminiConfigured } from '@/lib/firebase/gemini';

if (isGeminiConfigured()) {
  console.log('Gemini AI is ready!');
} else {
  console.log('Gemini API key not found');
}
```

## How It Works

### Automatic AI Generation

When a recovery plan is generated, the system:

1. **Checks for Gemini API key** - If configured, uses AI; otherwise falls back to mock logic
2. **Analyzes student data** - Sends comprehensive student profile to Gemini
3. **Generates personalized plan** - AI creates custom recovery plan based on:
   - Risk level and score
   - Attendance percentage
   - Quiz performance
   - Assignment completion
   - Engagement metrics
   - Identified risk factors
4. **Saves to Firestore** - Plan is stored with `generatedBy: 'ai'` and `aiModel: 'gemini-1.5-flash'`

### Fallback Behavior

If Gemini API:
- Is not configured → Uses mock recovery plan generation
- Fails to respond → Falls back to mock recovery plan generation
- Returns invalid data → Falls back to mock recovery plan generation

This ensures the system always works, even without AI.

## Usage

### Generate Recovery Plan with AI

```typescript
import { generateRecoveryPlan } from '@/lib/firebase/recoveryPlans';

// This will automatically use Gemini if configured
const planId = await generateRecoveryPlan(studentId);
```

### Direct Gemini API Call

```typescript
import { generateRecoveryPlanWithGemini } from '@/lib/firebase/gemini';
import { getStudent } from '@/lib/firebase/students';

const student = await getStudent(studentId);
const recoveryPlan = await generateRecoveryPlanWithGemini(student);
```

## Testing

### Test Gemini Integration

Run the test script to verify Gemini is working:

```bash
npx tsx src/lib/firebase/test-gemini.ts
```

This will:
- Check if API key is configured
- Generate a test recovery plan
- Display the generated plan details
- Show generation time

### Expected Output

```
🧪 Testing Gemini AI Integration

✅ Gemini API key found
📊 Testing with student: Test Student
   Risk Level: High
   Risk Score: 75/100
   Attendance: 55%
   Engagement: 35/100

🤖 Generating recovery plan with Gemini AI...

✅ Recovery plan generated successfully!

⏱️  Generation time: 2.34s

📋 Recovery Plan Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Weak Topics (4):
   1. Fundamental Concepts
   2. Problem Solving
   3. Time Management
   4. Study Habits

⏰ Daily Study Hours: 4 hours

📅 Weekly Schedule:
   Monday     - Review fundamentals              (2 hours)
   Tuesday    - Practice problems                (2 hours)
   ...
```

## AI Prompt Engineering

The system uses a carefully crafted prompt that includes:

- **Student Profile**: Name, course, risk level, scores
- **Performance Metrics**: Attendance, quiz scores, assignments, engagement
- **Risk Factors**: Identified areas of concern
- **Output Format**: Structured JSON with specific fields

The prompt is designed to:
- Generate actionable, specific recommendations
- Base suggestions on actual performance data
- Create personalized study schedules
- Suggest relevant learning resources
- Provide evidence-based strategies

## Recovery Plan Structure

AI-generated recovery plans include:

1. **Weak Topics** (3-5 topics)
   - Based on performance analysis
   - Specific to student's course

2. **Daily Study Hours** (2-4 hours)
   - Adjusted based on risk level
   - Realistic and achievable

3. **Weekly Schedule** (Monday - Weekend)
   - Specific focus areas per day
   - Appropriate duration per session

4. **Learning Resources** (4-5 resources)
   - Mix of video courses, exercises, community, mentorship
   - Relevant to identified weak areas

5. **Strategies** (5-7 strategies)
   - Actionable and specific
   - Based on best practices
   - Tailored to student's needs

## Error Handling

The system handles various error scenarios:

- **API Key Missing**: Falls back to mock generation
- **Network Errors**: Catches and falls back gracefully
- **Invalid Response**: Parses and validates, falls back if needed
- **Rate Limiting**: Error logged, falls back to mock

All errors are logged to console for debugging.

## Cost Considerations

Gemini 1.5 Flash is:
- **Free tier**: 15 requests per minute
- **Paid tier**: Very affordable pricing
- **Efficient**: Fast responses (~1-3 seconds)

For MVP/hackathon, the free tier should be sufficient.

## Monitoring

Check recovery plans in Firestore to see:
- `generatedBy`: `'ai'` or `'manual'`
- `aiModel`: `'gemini-1.5-flash'` (if AI was used)
- `generatedAt`: Timestamp of generation

## Troubleshooting

### "Gemini API key not configured"
- Check `.env` file has `VITE_GEMINI_API_KEY`
- Restart dev server after adding to `.env`
- Verify key is correct (no extra spaces)

### "Failed to generate recovery plan with Gemini"
- Check API key is valid
- Verify network connection
- Check API quota/limits
- System will automatically fall back to mock

### "No content generated by Gemini API"
- API might be rate-limited
- Check API key permissions
- Verify Gemini API is accessible

## Future Enhancements

Potential improvements:
- [ ] Cache AI responses for similar students
- [ ] Fine-tune prompts based on course type
- [ ] Add multi-language support
- [ ] Implement response streaming
- [ ] Add AI analysis for risk prediction
- [ ] Generate progress reports with AI

## Support

For issues:
1. Check API key configuration
2. Run test script: `npx tsx src/lib/firebase/test-gemini.ts`
3. Check browser console for errors
4. Verify Firestore has recovery plans with `generatedBy: 'ai'`

---

**Last Updated**: 2024  
**Gemini Model**: gemini-1.5-flash  
**Status**: ✅ Production Ready

