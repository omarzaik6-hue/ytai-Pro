// api/gemini.js
// YT AI Pro - By Omar Roshdy (عمر رشدي)
// Vercel Serverless Function - Google Gemini 1.5 Flash Bridge

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=";

function buildPrompt(tool, data) {
  switch (tool) {
    case "name_advisor": {
      const { channelName, niche } = data;
      return `أنت خبير عالمي في بناء العلامات التجارية والهوية الرقمية لقنوات اليوتيوب الناطقة بالعربية.
حلل الاسم التالي للقناة: "${channelName}"
التخصص/المحتوى: "${niche}"

قم بإرجاع تحليل شامل بصيغة JSON صارمة فقط بدون أي نص خارج JSON وبدون Markdown، حسب الهيكل التالي بالضبط:
{
  "score": رقم من 0 إلى 100 يمثل قوة الاسم العامة,
  "scoreBreakdown": {
    "memorability": رقم 0-100 (سهولة التذكر),
    "pronunciation": رقم 0-100 (سهولة النطق),
    "distinctiveness": رقم 0-100 (التميز),
    "relevance": رقم 0-100 (الملاءمة للتخصص)
  },
  "socialAvailability": {
    "x": "تقدير نصي مبدئي عن احتمالية توفر الاسم على منصة X مع توضيح أنه تقدير وليس فحص مباشر",
    "tiktok": "تقدير نصي مبدئي مشابه لتيك توك",
    "instagram": "تقدير نصي مبدئي مشابه لانستجرام"
  },
  "trademarkNote": "ملاحظة مبدئية عن احتمالية تعارض الاسم مع علامات تجارية مشهورة، مع التنويه أنه ليس فحصاً قانونياً رسمياً",
  "catchyNames": ["5 أسماء بديلة قصيرة وجذابة جداً"],
  "rhymingNames": ["5 أسماء بديلة تعتمد على السجع والتناغم الصوتي"],
  "translatedNames": ["5 أسماء أجنبية مترجمة أو مستوحاة، مناسبة ثقافياً للجمهور العربي، كل اسم مع شرح قصير للمعنى بين قوسين"],
  "colorPalette": [
    {"hex": "#XXXXXX", "name": "اسم اللون بالعربية"},
    {"hex": "#XXXXXX", "name": "اسم اللون بالعربية"},
    {"hex": "#XXXXXX", "name": "اسم اللون بالعربية"},
    {"hex": "#XXXXXX", "name": "اسم اللون بالعربية"},
    {"hex": "#XXXXXX", "name": "اسم اللون بالعربية"}
  ],
  "logoPrompt": "برومبت كامل بالإنجليزية جاهز للنسخ مباشرة في Midjourney أو DALL-E لتصميم لوجو للقناة، يتضمن وصف الستايل والألوان والعناصر",
  "targetAgeGroup": "وصف الشريحة العمرية والجمهور الأنسب لهذا الاسم والتخصص",
  "sensitiveWordsCheck": "تحليل للكلمات الحساسة أو المعاني المزدوجة المحتملة في اللهجات العربية المختلفة (مصرية، خليجية، شامية، مغربية)، وإذا لم توجد أي مشاكل صرّح بذلك بوضوح"
}

تأكد أن جميع الأكواد اللونية hex حقيقية ومتناسقة فيما بينها كهوية بصرية واحدة، وأن جميع الاقتراحات إبداعية وعملية وغير مكررة.`;
    }

    case "thumbnail_analyzer": {
      const { title } = data;
      return `أنت خبير عالمي في تصميم وتحليل صور الثمنيل (Thumbnails) لفيديوهات اليوتيوب من الناحية البصرية والنفسية والتسويقية.
حلل صورة الثمنيل المرفقة${title ? ` مع الأخذ في الاعتبار أن عنوان الفيديو المرتبط بها هو: "${title}"` : ""}.

أرجع تحليلاً شاملاً بصيغة JSON صارمة فقط بدون أي نص خارج JSON وبدون Markdown، حسب الهيكل بالضبط:
{
  "contrastScore": رقم 0-100 يقيس تباين الألوان وبروز العناصر عن الخلفية,
  "readabilityScore": رقم 0-100 يقيس وضوح أي نص أو عناوين داخل الصورة من مسافة بعيدة وعلى شاشات صغيرة,
  "ctrExpectation": رقم 0-100 يمثل توقع نسبة النقر إلى الظهور المتوقعة لهذه الصورة,
  "emotionAnalysis": {
    "excitement": رقم 0-100,
    "fear": رقم 0-100,
    "curiosity": رقم 0-100,
    "summary": "وصف نصي لتحليل سيكولوجية تعبيرات الوجه أو العناصر الموجودة في الصورة وتأثيرها على المشاهد، وإذا لم توجد وجوه وضح ذلك"
  },
  "dominantColors": ["#XXXXXX","#XXXXXX","#XXXXXX","#XXXXXX","#XXXXXX"],
  "arrowAndCircleSuggestions": "وصف دقيق لأماكن مقترحة (بالاتجاهات: أعلى يسار، أسفل يمين، إلخ) لوضع أسهم أو دوائر حمراء لجذب عين المشاهد نحو أهم عنصر في الصورة",
  "colorBlindNote": "تقييم لمدى وضوح الصورة وعناصرها لأشخاص يعانون من عمى الألوان (الأحمر-الأخضر بشكل خاص) مع اقتراحات إن وجدت",
  "alternativeIdea": "فكرة وصياغة بصرية بديلة كاملة ومختلفة تماماً لتصميم ثمنيل جديد لنفس الفيديو، مكتوبة كوصف تفصيلي يمكن للمصمم اتباعه أو استخدامه كبرومبت لمولد صور",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", "نقطة ضعف 3"]
}

كن دقيقاً وواقعياً وموضوعياً في التقييم بناءً على المحتوى الفعلي للصورة المرفقة.`;
    }

    case "seo_engineer": {
      const { idea, niche } = data;
      return `أنت خبير عالمي في تهيئة محركات البحث (SEO) لفيديوهات اليوتيوب والانتشار الفيروسي للمحتوى العربي.
فكرة الفيديو: "${idea}"
تخصص القناة: "${niche}"

أرجع استراتيجية متكاملة بصيغة JSON صارمة فقط بدون أي نص خارج JSON وبدون Markdown، حسب الهيكل بالضبط:
{
  "searchTitles": ["3 عناوين تعتمد على كلمات البحث العضوي الشائعة (Search SEO)"],
  "clickbaitTitles": ["3 عناوين تعتمد على إثارة الفضول والتريند بشكل آمن وغير مضلل (Curiosity)"],
  "description": "وصف طويل للفيديو لا يقل عن 150 كلمة، أول 3 أسطر منه يجب أن تكون مكثفة بالكلمات المفتاحية ومهيأة تماماً لخوارزمية المقترحات، ثم باقي الوصف يشرح محتوى الفيديو ويتضمن دعوة للاشتراك",
  "tags": {
    "main": ["5 تاغات رئيسية مباشرة مرتبطة بالفيديو"],
    "sub": ["8 تاغات فرعية متخصصة وأكثر تحديداً"],
    "general": ["7 تاغات عامة واسعة الانتشار متعلقة بالتخصص"]
  },
  "hook": "سيناريو نصي كامل لأول 15 ثانية من الفيديو (الـ Hook) مصمم لمنع ارتداد المشاهد وزيادة معدل الاستمرار",
  "bestUploadTime": "اقتراح أفضل أيام وأوقات الرفع بالتوقيت بناءً على تصنيف المحتوى والجمهور العربي المستهدف",
  "pinnedComment": "نص تعليق مثبت جاهز للنسخ يفتح نقاشاً مع الجمهور ويزيد التفاعل",
  "endScreenSuggestions": "اقتراحات لروابط فيديوهات (وصفية) ذكية يمكن وضعها في بطاقات الفيديو وشاشة النهاية لزيادة وقت المشاهدة الكلي للقناة",
  "shortsIdeas": ["3 أفكار لفيديوهات قصيرة Shorts/Reels مقتبسة من الفكرة الرئيسية، كل فكرة بجملة واحدة واضحة"],
  "highCpmKeywords": ["7 كلمات أو عبارات مفتاحية ذات عائد ربحي إعلاني مرتفع مرتبطة بالموضوع"],
  "cta": "جملة نداء للفعل (Call To Action) مبتكرة وغير مزعجة لطلب الاشتراك والتفاعل في وسط الفيديو",
  "timestamps": "هيكل مقترح لفواصل زمنية (Timestamps) بصيغة 00:00 وصف القسم، بحد أدنى 5 فواصل منطقية لهذا النوع من الفيديو"
}

اجعل المحتوى عملياً واحترافياً وقابلاً للاستخدام الفوري دون أي تعديل.`;
    }

    case "channel_report": {
      const { channelData } = data;
      return `أنت مستشار استراتيجي عالمي لتنمية قنوات اليوتيوب والمحتوى الرقمي.
لديك بيانات حقيقية مستخرجة من قناة يوتيوب عبر الـ API التالية:

${JSON.stringify(channelData, null, 2)}

بناءً على هذه البيانات فقط، أرجع تقريراً استراتيجياً شاملاً بصيغة JSON صارمة فقط بدون أي نص خارج JSON وبدون Markdown، حسب الهيكل بالضبط:
{
  "nicheConsistency": "تحليل مدى تخصص القناة أو تشتت محتواها بناءً على عناوين آخر الفيديوهات ووصف القناة، مع توضيح الانطباع العام (متخصصة / شبه متخصصة / عشوائية) وسبب ذلك",
  "titleErrors": "تحليل للأخطاء الشائعة أو نقاط الضعف في عناوين الفيديوهات الحالية من ناحية السيو والجاذبية، مع أمثلة محددة من العناوين المرسلة",
  "aboutRewrite": "إعادة كتابة كاملة ومحسّنة لقسم 'عن القناة' (About Section) بأسلوب احترافي جذاب ومتوافق مع السيو، بناءً على التخصص الظاهر من البيانات",
  "actionPlan": ["خطوة عملية فورية 1", "خطوة عملية فورية 2", "خطوة عملية فورية 3"],
  "nextVideoIdeas": ["فكرة فيديو قادم 1 مع توضيح لماذا ستحقق مشاهدات عالية", "فكرة فيديو قادم 2 مع التوضيح", "فكرة فيديو قادم 3 مع التوضيح"],
  "finalReport": "تقرير نهائي شامل ومنسق بنص عادي (يمكن استخدام أسطر جديدة وعناوين بسيطة بخطوط -) يلخص كل النقاط أعلاه بشكل منظم وجاهز للنسخ الفوري وعرضه على فريق العمل أو العميل"
}

كن دقيقاً ومحدداً واستخدم الأرقام الفعلية الموجودة في البيانات عند الإشارة إليها.`;
    }

    default:
      return null;
  }
}

function extractJson(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "الطريقة غير مسموحة. استخدم POST فقط." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "مفتاح GEMINI_API_KEY غير مهيأ في إعدادات Vercel." });
    return;
  }

  try {
    const { tool, data, image } = req.body || {};

    if (!tool) {
      res.status(400).json({ error: "حقل 'tool' مطلوب." });
      return;
    }

    const promptText = buildPrompt(tool, data || {});
    if (!promptText) {
      res.status(400).json({ error: "نوع الأداة (tool) غير معروف." });
      return;
    }

    const parts = [{ text: promptText }];

    if (tool === "thumbnail_analyzer") {
      if (!image || !image.base64 || !image.mimeType) {
        res.status(400).json({ error: "بيانات الصورة (image.base64 و image.mimeType) مطلوبة لتحليل الثمنيل." });
        return;
      }
      parts.push({
        inline_data: {
          mime_type: image.mimeType,
          data: image.base64
        }
      });
    }

    const geminiBody = {
      contents: [
        {
          role: "user",
          parts: parts
        }
      ],
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(GEMINI_URL + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody)
    });

    const json = await response.json();

    if (!response.ok) {
      const message = (json && json.error && json.error.message) || "حدث خطأ أثناء الاتصال بـ Gemini API.";
      res.status(response.status).json({ error: message, details: json });
      return;
    }

    const candidate = json.candidates && json.candidates[0];
    const rawText =
      candidate &&
      candidate.content &&
      candidate.content.parts &&
      candidate.content.parts[0] &&
      candidate.content.parts[0].text;

    if (!rawText) {
      res.status(502).json({ error: "لم يتم استلام رد نصي صالح من Gemini.", details: json });
      return;
    }

    let parsed;
    try {
      parsed = extractJson(rawText);
    } catch (e) {
      res.status(502).json({ error: "فشل تحليل استجابة الذكاء الاصطناعي كـ JSON.", raw: rawText });
      return;
    }

    res.status(200).json({ success: true, tool, result: parsed });
  } catch (err) {
    res.status(500).json({ error: "خطأ داخلي في السيرفر: " + err.message });
  }
};
