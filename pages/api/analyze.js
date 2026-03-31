export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, category, platform, mode } = req.body;
  if (!name || !category || !platform) return res.status(400).json({ error: "Missing fields" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenAI API key not configured" });

  let prompt;

  if (mode === "ads_platform") {
    prompt = `You are an expert digital marketer. Give a COMPLETE strategy for this product on ${platform}:
Product: ${name}, Category: ${category}
Return ONLY valid JSON:
{"account_setup":"Step 1: ...\nStep 2: ...\nStep 3: ...\nStep 4: ...\nStep 5: ...","targeting":"detailed targeting strategy","ad_keywords":["kw1","kw2","kw3","kw4","kw5","kw6","kw7","kw8"],"script":"Complete persuasive ad script","video_steps":"Step 1: ...\nStep 2: ...\nStep 3: ...\nStep 4: ...\nStep 5: ...\nStep 6: ...\nStep 7: ...\nStep 8: ...","title":"Best SEO title for this product","budget":"Daily: INR X-Y. Monthly: INR A-B. Expected reach: Z"}`;
  
  } else if (mode === "description") {
    prompt = `You are an expert ecommerce copywriter. Generate SEO-optimized product listings for: ${name} (${category})
Return ONLY valid JSON:
{"listings":[
  {"platform":"Amazon","title":"SEO optimized Amazon title","description":"2-3 sentence compelling description","bullets":["Feature benefit 1","Feature benefit 2","Feature benefit 3","Feature benefit 4","Feature benefit 5"]},
  {"platform":"Meesho","title":"Meesho style title","description":"Short catchy description in simple language","bullets":["Point 1","Point 2","Point 3"]},
  {"platform":"Flipkart","title":"Flipkart SEO title","description":"Flipkart style description","bullets":["Highlight 1","Highlight 2","Highlight 3","Highlight 4"]},
  {"platform":"Instagram Caption","title":"Viral Instagram caption","description":"Engaging caption with emojis and call to action","bullets":["Hashtag set 1","Hashtag set 2","Hashtag set 3"]}
]}`;

  } else if (mode === "trending") {
    prompt = `You are an ecommerce expert. List top 6 trending products in ${category} category right now for Indian ecommerce market.
Return ONLY valid JSON:
{"products":[
  {"name":"Product Name","why_trending":"1-2 sentence reason why trending now","price_range":"INR X-Y","tags":["tag1","tag2","tag3"]},
  {"name":"Product 2","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Product 3","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Product 4","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Product 5","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]},
  {"name":"Product 6","why_trending":"reason","price_range":"INR X-Y","tags":["tag1","tag2"]}
]}`;

  } else if (mode === "competitor") {
    prompt = `You are an ecommerce analyst. Analyze top 4 competitors for: ${name} on ${platform} in India.
Return ONLY valid JSON:
{"competitors":[
  {"name":"Competitor Brand/Product Name","platform":"${platform}","price":"INR X","rating":"4.2/5","reviews":"2.3k","strengths":["strength1","strength2","strength3"],"weaknesses":["weakness1","weakness2","weakness3"],"opportunity":"How to beat this competitor"},
  {"name":"Competitor 2","platform":"${platform}","price":"INR X","rating":"4.0/5","reviews":"1.5k","strengths":["s1","s2"],"weaknesses":["w1","w2"],"opportunity":"opportunity"},
  {"name":"Competitor 3","platform":"${platform}","price":"INR X","rating":"3.8/5","reviews":"800","strengths":["s1","s2"],"weaknesses":["w1","w2"],"opportunity":"opportunity"},
  {"name":"Competitor 4","platform":"${platform}","price":"INR X","rating":"4.5/5","reviews":"5k","strengths":["s1","s2","s3"],"weaknesses":["w1","w2"],"opportunity":"opportunity"}
]}`;

  } else if (mode === "supplier") {
    prompt = `You are a sourcing expert. Find 4 best suppliers for: ${name} (${category}) for Indian ecommerce sellers.
Return ONLY valid JSON:
{"suppliers":[
  {"name":"Supplier/Platform Name","platform":"AliExpress/IndiaMart/Alibaba/Meesho Supplier","price_range":"INR X-Y per unit","moq":"Min 10 units","rating":"4.5/5","delivery":"7-14 days","description":"What makes this supplier good for this product","tip":"Pro tip for negotiating or ordering","search_url":"https://www.indiamart.com/search.mp?ss=${name.replace(/ /g,'+')}"},
  {"name":"Supplier 2","platform":"IndiaMart","price_range":"INR X-Y","moq":"Min 5 units","rating":"4.2/5","delivery":"3-7 days","description":"description","tip":"tip","search_url":"https://www.indiamart.com/search.mp?ss=${name.replace(/ /g,'+')}"},
  {"name":"Supplier 3","platform":"Alibaba","price_range":"USD X-Y","moq":"Min 50 units","rating":"4.0/5","delivery":"15-30 days","description":"description","tip":"tip","search_url":"https://www.alibaba.com/trade/search?SearchText=${name.replace(/ /g,'+')}"},
  {"name":"Supplier 4","platform":"AliExpress","price_range":"USD X-Y","moq":"No minimum","rating":"4.3/5","delivery":"10-20 days","description":"description","tip":"tip","search_url":"https://www.aliexpress.com/wholesale?SearchText=${name.replace(/ /g,'+')}"}
]}`;

  } else {
    prompt = `Analyze this product:
Product: ${name}, Category: ${category}, Platform: ${platform}
Return ONLY valid JSON:
{"hooks":["h1","h2","h3","h4","h5"],"keywords":["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10"],"description":"2-3 sentence description","price_range":"INR X-Y","demand_level":"High","target_audience":"description","viral_score":"7/10","competition_level":"Medium"}`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert ecommerce analyst. Always respond with valid JSON only. No markdown, no backticks, no extra text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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
