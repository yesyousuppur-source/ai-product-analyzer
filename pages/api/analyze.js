export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, category, platform, mode } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenAI API key not configured" });

  let prompt = "";

  if (mode === "ads_platform") {
    prompt = `Expert digital marketer. Complete strategy for ${name} on ${platform} (${category}).
Return ONLY valid JSON:
{"account_setup":"Step 1: ...\nStep 2: ...\nStep 3: ...\nStep 4: ...\nStep 5: ...","targeting":"detailed targeting for ${name}","ad_keywords":["kw1","kw2","kw3","kw4","kw5","kw6","kw7","kw8"],"script":"Complete 4-5 sentence ad script for ${name}","video_steps":"Step 1: ...\nStep 2: ...\nStep 3: ...\nStep 4: ...\nStep 5: ...\nStep 6: ...\nStep 7: ...\nStep 8: ...","titles":["Title 1","Title 2","Title 3","Title 4"],"budget":"Daily: INR X. Monthly: INR Y. Expected reach: Z"}`;

  } else if (mode === "description") {
    prompt = `Expert ecommerce copywriter. Generate listings for ${name} (${category}).
Return ONLY valid JSON:
{"listings":[{"platform":"Amazon India","title":"SEO title","description":"2-3 sentences","bullets":["b1","b2","b3","b4","b5"]},{"platform":"Meesho","title":"title","description":"desc","bullets":["b1","b2","b3"]},{"platform":"Flipkart","title":"title","description":"desc","bullets":["b1","b2","b3","b4"]},{"platform":"Instagram Caption","title":"caption","description":"desc","bullets":["#tag1 #tag2","#tag3 #tag4","#tag5 #tag6"]}]}`;

  } else if (mode === "trending") {
    prompt = `Indian ecommerce expert. Top 6 trending products in ${category} for India right now.
Return ONLY valid JSON:
{"products":[{"name":"product","why_trending":"reason","price_range":"INR X-Y","tags":["t1","t2","t3"]},{"name":"p2","why_trending":"r","price_range":"INR X-Y","tags":["t1","t2"]},{"name":"p3","why_trending":"r","price_range":"INR X-Y","tags":["t1","t2"]},{"name":"p4","why_trending":"r","price_range":"INR X-Y","tags":["t1","t2"]},{"name":"p5","why_trending":"r","price_range":"INR X-Y","tags":["t1","t2"]},{"name":"p6","why_trending":"r","price_range":"INR X-Y","tags":["t1","t2"]}]}`;

  } else if (mode === "competitor") {
    prompt = `Ecommerce analyst. Top 4 competitors for ${name} on ${platform} in India.
Return ONLY valid JSON:
{"competitors":[{"name":"brand","platform":"${platform}","price":"INR X","rating":"4.2/5","reviews":"2k","strengths":["s1","s2","s3"],"weaknesses":["w1","w2","w3"],"opportunity":"how to beat"},{"name":"b2","platform":"${platform}","price":"INR X","rating":"4.0/5","reviews":"1k","strengths":["s1","s2"],"weaknesses":["w1","w2"],"opportunity":"opp"},{"name":"b3","platform":"${platform}","price":"INR X","rating":"3.8/5","reviews":"800","strengths":["s1","s2"],"weaknesses":["w1","w2"],"opportunity":"opp"},{"name":"b4","platform":"${platform}","price":"INR X","rating":"4.5/5","reviews":"5k","strengths":["s1","s2","s3"],"weaknesses":["w1","w2"],"opportunity":"opp"}]}`;

  } else if (mode === "supplier") {
    const q = encodeURIComponent(name);
    prompt = `Sourcing expert for Indian ecommerce. 4 best suppliers for ${name} (${category}).
Return ONLY valid JSON:
{"suppliers":[{"name":"IndiaMart Supplier","platform":"IndiaMart","price_range":"INR 80-150","moq":"10 units","rating":"4.5/5","delivery":"3-7 days","description":"desc","tip":"tip","search_url":"https://www.indiamart.com/search.mp?ss=${q}"},{"name":"AliExpress","platform":"AliExpress","price_range":"USD 3-8","moq":"No min","rating":"4.2/5","delivery":"10-20 days","description":"desc","tip":"tip","search_url":"https://www.aliexpress.com/wholesale?SearchText=${q}"},{"name":"Alibaba","platform":"Alibaba","price_range":"USD 2-5","moq":"50 units","rating":"4.0/5","delivery":"15-30 days","description":"desc","tip":"tip","search_url":"https://www.alibaba.com/trade/search?SearchText=${q}"},{"name":"Meesho Supplier","platform":"Meesho","price_range":"INR 120-200","moq":"5 units","rating":"4.3/5","delivery":"5-10 days","description":"desc","tip":"tip","search_url":"https://supplier.meesho.com"}]}`;

  } else if (mode === "starter_guide") {
    const budget = req.body.budget || "5000";
    const exp = req.body.experience || "beginner";
    prompt = `Indian ecommerce expert. Create complete starter guide for ${exp} with budget INR ${budget}.
Return ONLY valid JSON:
{"platform_recommendation":{"name":"Best platform name","why":"why this platform","commission":"X%","difficulty":"Easy/Medium"},"steps":[{"step":1,"title":"Step title","description":"detailed description","time":"X days","cost":"INR X or Free"},{"step":2,"title":"title","description":"desc","time":"time","cost":"cost"},{"step":3,"title":"title","description":"desc","time":"time","cost":"cost"},{"step":4,"title":"title","description":"desc","time":"time","cost":"cost"},{"step":5,"title":"title","description":"desc","time":"time","cost":"cost"}],"first_product":{"name":"Suggested first product","reason":"why start with this","expected_profit":"INR X per unit"},"tips":["tip1","tip2","tip3","tip4","tip5"],"mistakes":["common mistake 1","mistake 2","mistake 3"]}`;

  } else if (mode === "beginner_product") {
    const budget2 = req.body.budget || "5000";
    const cat2 = category || "Fashion";
    prompt = `Indian ecommerce expert. Find 6 best beginner-friendly products in ${cat2} with budget INR ${budget2} for Indian market.
Return ONLY valid JSON:
{"products":[{"name":"product name","category":"${cat2}","buy_price":"INR X","sell_price":"INR Y","profit_per_unit":"INR Z","risk":"Low","demand":"High","why_good":"reason for beginner","platform":"best platform","suppliers":"where to buy"},{"name":"p2","category":"${cat2}","buy_price":"INR X","sell_price":"INR Y","profit_per_unit":"INR Z","risk":"Low","demand":"High","why_good":"reason","platform":"platform","suppliers":"source"},{"name":"p3","category":"${cat2}","buy_price":"INR X","sell_price":"INR Y","profit_per_unit":"INR Z","risk":"Low","demand":"Medium","why_good":"reason","platform":"platform","suppliers":"source"},{"name":"p4","category":"${cat2}","buy_price":"INR X","sell_price":"INR Y","profit_per_unit":"INR Z","risk":"Low","demand":"High","why_good":"reason","platform":"platform","suppliers":"source"},{"name":"p5","category":"${cat2}","buy_price":"INR X","sell_price":"INR Y","profit_per_unit":"INR Z","risk":"Medium","demand":"High","why_good":"reason","platform":"platform","suppliers":"source"},{"name":"p6","category":"${cat2}","buy_price":"INR X","sell_price":"INR Y","profit_per_unit":"INR Z","risk":"Low","demand":"Very High","why_good":"reason","platform":"platform","suppliers":"source"}]}`;

  } else if (mode === "sales_estimator") {
    prompt = `Ecommerce analyst. Estimate monthly sales for ${name} on ${platform} in India.
Return ONLY valid JSON:
{"monthly_units":{"low":10,"medium":35,"high":80},"monthly_revenue":{"low":"INR X","medium":"INR Y","high":"INR Z"},"monthly_profit":{"low":"INR A","medium":"INR B","high":"INR C"},"factors":[{"name":"factor1","impact":"positive/negative","detail":"detail"},{"name":"factor2","impact":"positive","detail":"detail"},{"name":"factor3","impact":"negative","detail":"detail"}],"best_months":["Month1","Month2","Month3"],"slow_months":["Month1","Month2"],"tips":["tip to increase sales 1","tip2","tip3"]}`;

  } else if (mode === "price_optimizer") {
    prompt = `Pricing expert for Indian ecommerce. Optimal pricing strategy for ${name} on ${platform}.
Return ONLY valid JSON:
{"recommended_price":"INR X","price_range":{"minimum":"INR X","maximum":"INR Y","sweet_spot":"INR Z"},"competitor_prices":[{"seller":"Competitor 1","price":"INR X","notes":"note"},{"seller":"Competitor 2","price":"INR Y","notes":"note"},{"seller":"Competitor 3","price":"INR Z","notes":"note"}],"pricing_strategy":"detailed strategy explanation","psychological_tricks":["trick1 like ending in 9","trick2","trick3"],"when_to_discount":"when and how much to discount","seasonal_pricing":["festival season tip","off-season tip"]}`;

  } else if (mode === "inventory") {
    const units = req.body.units || "50";
    prompt = `Inventory management expert for Indian ecommerce. Plan for ${name} starting with ${units} units on ${platform}.
Return ONLY valid JSON:
{"recommended_stock":{"starter":"X units","safe":"Y units","max":"Z units"},"reorder_point":"Reorder when stock reaches X units","storage_cost":"INR X per month estimated","turnover_days":"Stock will last approximately X days","tips":["inventory tip 1","tip 2","tip 3","tip 4"],"seasonal_advice":"seasonal stock advice","risk":"main inventory risk and how to avoid"}`;

  } else if (mode === "review_analyzer") {
    prompt = `Customer psychology expert. Analyze what customers love and hate about ${name} in ${category} category on ${platform} in India.
Return ONLY valid JSON:
{"common_complaints":["complaint1","complaint2","complaint3","complaint4","complaint5"],"what_customers_love":["love1","love2","love3","love4","love5"],"keywords_in_reviews":["keyword1","keyword2","keyword3","keyword4","keyword5"],"sentiment_score":"X/10","opportunities":["opportunity to beat competitors 1","opp2","opp3"],"red_flags":["thing to avoid 1","avoid 2"],"product_improvements":["improvement 1","improvement 2","improvement 3"]}`;

  } else if (mode === "niche_finder") {
    const mainCat = category || "Fashion";
    prompt = `Ecommerce niche expert for Indian market. Find 6 untapped profitable niches related to ${mainCat}.
Return ONLY valid JSON:
{"niches":[{"name":"Specific niche name","competition":"Low/Medium","demand":"High/Very High","profit_margin":"X-Y%","investment":"INR X-Y","why_untapped":"reason","best_platform":"platform","example_products":["product1","product2","product3"],"trend":"Growing/Seasonal/Stable"},{"name":"n2","competition":"Low","demand":"High","profit_margin":"X%","investment":"INR X","why_untapped":"reason","best_platform":"p","example_products":["p1","p2"],"trend":"Growing"},{"name":"n3","competition":"Low","demand":"High","profit_margin":"X%","investment":"INR X","why_untapped":"reason","best_platform":"p","example_products":["p1","p2"],"trend":"Growing"},{"name":"n4","competition":"Low","demand":"High","profit_margin":"X%","investment":"INR X","why_untapped":"reason","best_platform":"p","example_products":["p1","p2"],"trend":"Stable"},{"name":"n5","competition":"Low","demand":"High","profit_margin":"X%","investment":"INR X","why_untapped":"reason","best_platform":"p","example_products":["p1","p2"],"trend":"Growing"},{"name":"n6","competition":"Medium","demand":"Very High","profit_margin":"X%","investment":"INR X","why_untapped":"reason","best_platform":"p","example_products":["p1","p2"],"trend":"Growing"}]}`;

  } else {
    // Default full analysis
    prompt = `Expert ecommerce analyst for Indian market. Analyze:
Product: ${name}, Category: ${category}, Platform: ${platform}
Return ONLY valid JSON with real specific content:
{"hooks":["Real viral hook 1 for ${name}","Real hook 2","Real hook 3","Real hook 4","Real hook 5"],"keywords":["keyword1","keyword2","keyword3","keyword4","keyword5","keyword6","keyword7","keyword8","keyword9","keyword10"],"description":"2-3 compelling sentences about ${name}","price_range":"INR X-Y","demand_level":"High","target_audience":["Segment 1: specific description","Segment 2","Segment 3","Segment 4","Segment 5"],"viral_score":"7/10","competition_level":"Medium"}`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert ecommerce analyst for Indian market. Always respond with valid JSON only. Never use placeholder text. Write real, specific, actionable content. No markdown, no backticks, no extra text whatsoever." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || "OpenAI error" });
    const text = data.choices?.[0]?.message?.content || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Analysis failed: " + err.message });
  }
}
