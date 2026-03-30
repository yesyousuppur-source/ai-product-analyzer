// pages/api/analyze.js
// Ye file Vercel pe backend ka kaam karegi
// OPENAI_API_KEY automatically Vercel environment se aayegi

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, category, platform } = req.body;

  if (!name || !category || !platform) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  const prompt = `Analyze this product deeply:

Product: ${name}
Category: ${category}  
Platform: ${platform}

Return ONLY valid JSON, no extra text, no markdown, no backticks:
{
  "hooks": ["hook1", "hook2", "hook3", "hook4", "hook5"],
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8", "kw9", "kw10"],
  "description": "compelling product description in 2-3 sentences",
  "price_range": "₹X - ₹Y",
  "demand_level": "Low or Medium or High or Very High",
  "target_audience": "detailed description of ideal customer",
  "viral_score": "X/10",
  "competition_level": "Low or Medium or High or Very High"
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Fast + cheap, perfect for this
        messages: [
          {
            role: "system",
            content:
              "You are an expert e-commerce product analyst. Always respond with valid JSON only, no extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("OpenAI error:", errData);
      return res.status(500).json({ error: "OpenAI API failed", detail: errData });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Clean any accidental markdown
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Analysis failed. Try again." });
  }
}

