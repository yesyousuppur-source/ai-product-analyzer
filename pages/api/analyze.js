export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, category, platform, mode } = req.body;
  if (!name || !category || !platform) return res.status(400).json({ error: "Missing fields" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenAI API key not configured" });

  let prompt;

  if (mode === "ads_platform") {
    prompt = `You are an expert digital marketer and content creator. Give a COMPLETE strategy for this product on ${platform}:

Product: ${name}
Category: ${category}

Return ONLY valid JSON, no extra text, no markdown:
{
  "account_setup": "Step 1: Go to platform website\\nStep 2: Click sign up\\nStep 3: Fill business details\\nStep 4: Verify account\\nStep 5: Setup billing/payment method",
  "targeting": "Detailed targeting - age groups, interests, demographics, locations, behaviors, device types",
  "ad_keywords": ["keyword1","keyword2","keyword3","keyword4","keyword5","keyword6","keyword7","keyword8","keyword9","keyword10"],
  "script": "Complete persuasive ad script or video script optimized for ${platform}",
  "video_steps": "Step 1: Create account on ${platform}\\nStep 2: Set up your profile/channel\\nStep 3: Record product video (30-60 seconds)\\nStep 4: Edit with captions and music\\nStep 5: Write optimized title\\nStep 6: Add relevant hashtags\\nStep 7: Choose best posting time\\nStep 8: Upload and publish\\nStep 9: Engage with comments\\nStep 10: Boost with paid promotion",
  "title": "Best SEO-optimized title or headline for this product on ${platform}",
  "budget": "Daily budget: INR X-Y. Monthly budget: INR A-B. Expected reach: Z people. Expected sales: N units."
}`;
  } else {
    prompt = `Analyze this product deeply:

Product: ${name}
Category: ${category}
Platform: ${platform}

Return ONLY valid JSON, no extra text:
{
  "hooks": ["hook1","hook2","hook3","hook4","hook5"],
  "keywords": ["kw1","kw2","kw3","kw4","kw5","kw6","kw7","kw8","kw9","kw10"],
  "description": "compelling 2-3 sentence product description",
  "price_range": "INR X - INR Y",
  "demand_level": "Low or Medium or High or Very High",
  "target_audience": "detailed ideal customer description",
  "viral_score": "X/10",
  "competition_level": "Low or Medium or High or Very High"
}`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert product analyst and digital marketer. Always respond with valid JSON only. No markdown, no backticks, no extra text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || "OpenAI API error" });
    const text = data.choices?.[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Analysis failed: " + err.message });
  }
}
