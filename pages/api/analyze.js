export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, category, platform, mode } = req.body;
  if (!name || !category || !platform) return res.status(400).json({ error: "Missing fields" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenAI API key not configured" });

  let prompt;

  if (mode === "ads_platform") {
    prompt = `You are an expert digital marketer. Give a COMPLETE real strategy for this product on ${platform}:
Product: ${name}
Category: ${category}

Return ONLY valid JSON, no placeholders, all real content:
{
  "account_setup": "Step 1: Go to ${platform} official website\nStep 2: Click Create Account or Business Account\nStep 3: Fill in your business name, email and phone\nStep 4: Verify your account via OTP or email\nStep 5: Set up billing/payment method with debit card or UPI\nStep 6: Create your first campaign by clicking New Campaign",
  "targeting": "Write detailed targeting for ${name} - include age groups 18-45, interests related to ${category}, locations tier 1 and 2 Indian cities, device types mobile and desktop, behavioral targeting for online shoppers",
  "ad_keywords": ["keyword specific to ${name} 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5", "keyword 6", "keyword 7", "keyword 8"],
  "script": "Write a 4-5 sentence compelling ad script specifically for ${name} that grabs attention, highlights benefits, creates urgency and has clear call to action",
  "video_steps": "Step 1: Film ${name} from 3 angles in good natural light\nStep 2: Show the product being used or worn in real life\nStep 3: Add text overlay with main benefit and price\nStep 4: Record 15-30 second short video for reels\nStep 5: Add trending background music from ${platform} library\nStep 6: Write SEO optimized caption with keywords\nStep 7: Add relevant hashtags 20-30 for reach\nStep 8: Post at peak time 7-9pm IST for maximum views\nStep 9: Reply to all comments in first 30 minutes\nStep 10: Boost post with INR 200-500 for wider reach",
  "titles": ["Title option 1 for ${name} - benefit focused", "Title option 2 - urgency focused for ${name}", "Title option 3 - price/value focused for ${name}", "Title option 4 - emotional/lifestyle focused"],
  "budget": "Daily budget: INR 300-500 for beginners. Monthly budget: INR 9000-15000. Expected reach: 10000-50000 people. Expected sales: 5-15 units per month with proper targeting."
}`;

  } else if (mode === "description") {
    prompt = `You are an expert ecommerce copywriter. Generate real SEO-optimized product listings for: ${name} in ${category} category.
Return ONLY valid JSON with real content specific to this product:
{"listings":[
  {"platform":"Amazon India","title":"Write real Amazon SEO title for ${name} with keywords","description":"Write 2-3 compelling sentences about ${name} benefits","bullets":["Real feature/benefit 1 of ${name}","Real feature/benefit 2","Real feature/benefit 3","Real feature/benefit 4","Real feature/benefit 5"]},
  {"platform":"Meesho","title":"Simple catchy Meesho title for ${name}","description":"Short simple description in easy language for ${name}","bullets":["Point 1","Point 2","Point 3"]},
  {"platform":"Flipkart","title":"Flipkart SEO optimized title for ${name}","description":"Flipkart style description for ${name}","bullets":["Highlight 1","Highlight 2","Highlight 3","Highlight 4"]},
  {"platform":"Instagram Caption","title":"Viral Instagram caption for ${name} with emojis","description":"Engaging 2-3 line caption with call to action for ${name}","bullets":["#hashtag1 #hashtag2 #hashtag3","#hashtag4 #hashtag5 #hashtag6","#hashtag7 #hashtag8 #hashtag9"]}
]}`;

  } else if (mode === "trending") {
    prompt = `You are an Indian ecommerce expert. List 6 trending products in ${category} category for Indian ecommerce market right now.
Return ONLY valid JSON with real product names:
{"products":[
  {"name":"Real trending product name 1","why_trending":"Specific reason why this is trending in India now","price_range":"INR X-Y","tags":["tag1","tag2","tag3"]},
  {"name":"Real product 2","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Real product 3","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Real product 4","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Real product 5","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Real product 6","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]}
]}`;

  } else if (mode === "competitor") {
    prompt = `You are an ecommerce analyst. Analyze top 4 competitors for: ${name} on ${platform} in India.
Return ONLY valid JSON with realistic data:
{"competitors":[
  {"name":"Real competitor brand/product name","platform":"${platform}","price":"INR X","rating":"4.2/5","reviews":"2.3k","strengths":["specific strength 1","specific strength 2","specific strength 3"],"weaknesses":["specific weakness 1","specific weakness 2","specific weakness 3"],"opportunity":"Specific way to beat this competitor for ${name}"},
  {"name":"Competitor 2","platform":"${platform}","price":"INR X","rating":"4.0/5","reviews":"1.5k","strengths":["s1","s2"],"weaknesses":["w1","w2"],"opportunity":"opportunity"},
  {"name":"Competitor 3","platform":"${platform}","price":"INR X","rating":"3.8/5","reviews":"800","strengths":["s1","s2"],"weaknesses":["w1","w2"],"opportunity":"opportunity"},
  {"name":"Competitor 4","platform":"${platform}","price":"INR X","rating":"4.5/5","reviews":"5k","strengths":["s1","s2","s3"],"weaknesses":["w1","w2"],"opportunity":"opportunity"}
]}`;

  } else if (mode === "supplier") {
    const encodedName = encodeURIComponent(name);
    prompt = `You are a sourcing expert for Indian ecommerce. Find 4 best suppliers for: ${name} (${category}).
Return ONLY valid JSON:
{"suppliers":[
  {"name":"IndiaMart Verified Supplier","platform":"IndiaMart","price_range":"INR 80-150 per unit","moq":"Min 10 units","rating":"4.5/5","delivery":"3-7 days","description":"Best for domestic sourcing of ${name} with GST invoice","tip":"Always ask for sample before bulk order. Negotiate 20-30% discount on first order.","search_url":"https://www.indiamart.com/search.mp?ss=${encodedName}"},
  {"name":"AliExpress Dropship","platform":"AliExpress","price_range":"USD 3-8 per unit","moq":"No minimum","rating":"4.2/5","delivery":"10-20 days","description":"Best for testing ${name} without inventory risk","tip":"Order sample first. Check reviews carefully. Use ePacket shipping for faster delivery.","search_url":"https://www.aliexpress.com/wholesale?SearchText=${encodedName}"},
  {"name":"Alibaba Wholesale","platform":"Alibaba","price_range":"USD 2-5 per unit","moq":"Min 50-100 units","rating":"4.0/5","delivery":"15-30 days","description":"Best price for bulk order of ${name} for serious sellers","tip":"Use Trade Assurance for protection. Request customization or private label.","search_url":"https://www.alibaba.com/trade/search?SearchText=${encodedName}"},
  {"name":"Meesho B2B Supplier","platform":"Meesho Supplier","price_range":"INR 120-200 per unit","moq":"Min 5 units","rating":"4.3/5","delivery":"5-10 days","description":"Easy GST billing and returns for ${name} with fast shipping","tip":"Check supplier ratings above 4 stars. Read return policy before ordering.","search_url":"https://supplier.meesho.com"}
]}`;

  } else {
    prompt = `You are an expert ecommerce analyst. Analyze this product deeply for Indian market:
Product: ${name}
Category: ${category}
Platform: ${platform}

Return ONLY valid JSON with real specific data, NO placeholder text like h1 h2 k1 k2:
{
  "hooks": [
    "Write real viral hook 1 specifically about ${name} - attention grabbing opening line",
    "Write real viral hook 2 - problem/solution angle for ${name}",
    "Write real viral hook 3 - social proof angle for ${name}",
    "Write real viral hook 4 - urgency/scarcity angle for ${name}",
    "Write real viral hook 5 - curiosity angle about ${name}"
  ],
  "keywords": [
    "real keyword 1 for ${name}",
    "real keyword 2 for ${name} on ${platform}",
    "real keyword 3",
    "real keyword 4",
    "real keyword 5",
    "real keyword 6",
    "real keyword 7",
    "real keyword 8",
    "real keyword 9",
    "real keyword 10 for ${category}"
  ],
  "description": "Write 2-3 compelling sentences specifically about ${name} benefits and why customers should buy it",
  "price_range": "INR X - INR Y based on ${platform} market",
  "demand_level": "High or Medium or Very High",
  "target_audience": [
    "Audience segment 1: Age group, gender, income level, specific interest related to ${name}",
    "Audience segment 2: Different demographic who needs ${name}",
    "Audience segment 3: Occasion-based buyer for ${name}",
    "Audience segment 4: Geographic or behavioral segment for ${name}",
    "Audience segment 5: Gifting or bulk buyer segment for ${name}"
  ],
  "viral_score": "7/10",
  "competition_level": "Medium"
}`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert ecommerce analyst for Indian market. Always respond with valid JSON only. Never use placeholder text. Write real, specific, actionable content. No markdown, no backticks." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || "OpenAI error" });
    const text = data.choices?.[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Analysis failed: " + err.message });
  }
}
