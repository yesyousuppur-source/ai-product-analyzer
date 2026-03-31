export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, category, platform, mode, platformId } = req.body;
  if (!name || !category || !platform) return res.status(400).json({ error: "Missing fields" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenAI API key not configured" });

  let prompt;

  if (mode === "ads_platform") {
    prompt = `You are an expert digital marketer. Give a complete ad strategy for this product on ${platform}:

Product: ${name}
Category: ${category}

Return ONLY valid JSON, no extra text:
{
  "account_setup": "Step by step account creation and setup guide for ${platform}",
  "targeting": "Detailed targeting strategy - age, interests, demographics, behaviors",
  "ad_keywords": ["keyword1","keyword2","keyword3","keyword4","keyword5","keyword6","keyword7","keyword8"],
  "script": "Complete ad script or video script (3-4 sentences, highly persuasive)",
  "budget": "Daily and monthly budget recommendation with expected results",
  "title": "Best title/headline for this ad"
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
  "price_range": "₹X - ₹Y",
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
          { role: "system", content: "You are an expert product analyst and digital marketer. Always respond with valid JSON only, no markdown, no extra text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || "OpenAI error" });
    const text = data.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Analysis failed: " + err.message });
  }
}
