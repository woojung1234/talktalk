import WeatherService from './WeatherService';

class UnifiedConversationService {
  constructor(apiKey, weatherService) {
    this.apiKey = apiKey;
    this.weatherService = weatherService;
  }

  async generateSingleConversationTopic(type, context = {}) {
    try {
      switch (type) {
        case 'weather':
          return await this.generateSingleWeatherTopic(context);
        case 'love':
          return await this.generateSingleLoveTopic(context);
        case 'unified':
          return await this.generateSingleUnifiedTopic(context);
        default:
          console.warn(`알 수 없는 대화 유형 '${type}'이 요청되어 'unified'로 처리합니다.`);
          return await this.generateSingleUnifiedTopic(context);
      }
    } catch (error) {
      console.error(`[${type}] 대화 주제 생성 중 오류:`, error);
      return this.getSingleFallbackTopic(type);
    }
  }

  async generateSingleLoveTopic(context) {
    const { stage = 'first_meet', type = 'icebreaker' } = context;
    const systemMessage = `당신은 수많은 연애 상담 경험을 가진 센스 넘치는 연애 코치입니다. 진부하고 뻔한 조언이 아닌, 상대방의 마음을 사로잡을 창의적이고 구체적인 대화법 1개를 제안해주세요. 요청받은 '관계 단계'와 '대화 유형'에 딱 맞는 '단계별 꿀팁'과 '주의사항'도 반드시 함께 생성해야 합니다. 반드시 지정된 JSON 형식으로만 답변해야 합니다. 다른 설명은 절대 추가하지 마세요.`;
    const stageDescriptions = { 'first_meet': '처음 만나는 상황', 'getting_know': '서로 알아가는 단계', 'some': '썸을 타는 단계', 'dating': '연애 중인 단계', 'long_term': '장기 연애 단계' };
    const typeDescriptions = { 'icebreaker': '어색함을 깨는 대화', 'deep_talk': '깊이 있는 대화', 'flirting': '플러팅/애정표현', 'conflict': '갈등 해결', 'romance': '로맨틱한 분위기' };
    const prompt = `
연애 상황:
- 관계 단계: ${stageDescriptions[stage]}
- 필요한 대화 유형: ${typeDescriptions[type]}

이 상황에 가장 적합한 독창적인 대화 가이드 1개를 아래 JSON 형식에 맞춰 생성해주세요.
'contextual_tips'와 'contextual_warnings' 배열에는 현재 관계 단계에 맞는 조언을 2~3개씩 담아주세요.

\`\`\`json
{
  "category": "현재 상황을 나타내는 구체적인 카테고리 (예: 첫 만남의 어색함 깨기)",
  "example": "이 상황에서 실제로 사용할 수 있는 자연스럽고 매력적인 대화 예시 문장",
  "tip": "위 'example' 문장을 사용할 때의 표정, 타이밍, 혹은 추가적으로 하면 좋을 행동에 대한 꿀팁",
  "icon": "상황에 어울리는 이모지 1개 (👋, 🤔, 😊, 💕, 💍, 💬 등)",
  "contextual_tips": [
    "현재 '${stageDescriptions[stage]}' 단계에서 명심해야 할 꿀팁 1",
    "현재 '${stageDescriptions[stage]}' 단계에서 명심해야 할 꿀팁 2"
  ],
  "contextual_warnings": [
    "현재 '${stageDescriptions[stage]}' 단계에서 절대 피해야 할 주의사항 1",
    "현재 '${stageDescriptions[stage]}' 단계에서 절대 피해야 할 주의사항 2"
  ]
}
\`\`\`
`;
    return await this.callGPTAPI(systemMessage, prompt, 'love');
  }

  async generateSingleUnifiedTopic(context) {
    const { relationship = '친구', situation = '일상적인 만남', userAge = '20대', targetAge = '20대', mood = 'casual' } = context;
    const moodMap = { casual: '편안하고 친근한', professional: '전문적이고 정중한', friendly: '따뜻하고 우호적인', respectful: '예의 바르고 공손한' };
    const systemMessage = `당신은 다양한 상황과 관계에 맞는 대화 주제를 추천하는 뛰어난 커뮤니케이션 전문가입니다. 상황 정보를 바탕으로, 자연스럽고 흥미로운 대화 주제 1개만 생성해주세요. 반드시 지정된 JSON 형식으로만 답변해야 합니다. 다른 설명은 절대 추가하지 마세요.`;
    const prompt = `대화 상황 정보:\n- 나와 상대의 관계: ${relationship}\n- 구체적인 상황: ${situation}\n- 내 나이대: ${userAge}\n- 상대방 나이대: ${targetAge}\n- 원하는 대화 분위기: ${moodMap[mood] || '편안한'}\n\n이 상황에 가장 적합한 대화 주제 1개를 아래 JSON 형식에 맞춰 생성해주세요:\n\`\`\`json\n{\n  "category": "대화 주제의 카테고리 (예: 최신 기술 트렌드, 주말 계획)",\n  "example": "대화를 바로 시작할 수 있는 구체적인 질문 또는 제안 문장",\n  "tip": "이 주제로 대화를 더 재미있게 이어갈 수 있는 구체적인 팁",\n  "icon": "주제에 맞는 이모지 1개"\n}\n\`\`\``;
    return await this.callGPTAPI(systemMessage, prompt, 'unified');
  }

  async generateSingleWeatherTopic(context) {
    const weather = context.weather || await this.weatherService.getCurrentWeather(context.city || '서울');
    const systemMessage = `당신은 날씨를 활용한 자연스러운 대화 주제를 제안하는 창의적인 전문가입니다. 현재 날씨 정보에 딱 맞는, 센스 있고 마음을 끄는 대화 시작 멘트를 1개만 생성해주세요. 반드시 지정된 JSON 형식으로만 답변해야 합니다. 다른 설명은 절대 추가하지 마세요.`;
    const prompt = `현재 날씨 정보:\n- 지역: ${context.city || '서울'}\n- 온도: ${weather.temperature}°C\n- 하늘 상태: ${this.getSkyDescription(weather.sky)}\n- 1시간 강수량: ${weather.precipitation || 0}mm\n- 습도: ${weather.humidity || 50}%\n\n이 날씨에 가장 적합한 대화 주제 1개를 아래 JSON 형식에 맞춰 생성해주세요:\n\`\`\`json\n{\n  "category": "날씨를 나타내는 한두 단어의 카테고리 (예: 쨍쨍한 오후, 비 내리는 저녁)",\n  "example": "사람들이 바로 사용할 수 있는 자연스럽고 감성적인 대화 예시 문장",\n  "tip": "이 대화를 사용할 때 상대방의 반응을 유도할 수 있는 구체적인 팁",\n  "icon": "날씨에 맞는 이모지 1개 (☀️, 🌧️, ☁️, ❄️, 🌤️, 💧, 💨 등)"\n}\n\`\`\``;
    return await this.callGPTAPI(systemMessage, prompt, 'weather');
  }

  async callGPTAPI(systemMessage, prompt, type) {
    if (!this.apiKey || this.apiKey.includes('YOUR_')) {
      console.warn(`[${type}] OpenAI API 키가 설정되지 않았습니다. Fallback 주제를 사용합니다.`);
      return this.getSingleFallbackTopic(type);
    }
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemMessage }, { role: 'user', content: prompt }], max_tokens: 500, temperature: 0.8, response_format: { type: "json_object" } }),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`GPT API 오류: ${response.status} - ${errorBody.error.message}`);
      }
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) { throw new Error('GPT API로부터 내용 없는 응답을 받았습니다.'); }
      return this.parseSingleGPTResponse(content, type);
    } catch (error) {
      console.error('GPT API 호출 또는 파싱 실패:', error);
      return this.getSingleFallbackTopic(type);
    }
  }

  parseSingleGPTResponse(content, type) {
    try {
      const parsedData = JSON.parse(content);
      if (type === 'love') {
        if (parsedData.category && parsedData.example && parsedData.tip && parsedData.contextual_tips && parsedData.contextual_warnings) {
          return parsedData;
        }
      } else if (parsedData.category && parsedData.example && parsedData.tip) {
        return {
          category: parsedData.category,
          example: parsedData.example.replace(/^"|"$/g, ''),
          tip: parsedData.tip,
          icon: parsedData.icon || this.getIconForCategory(parsedData.category, type),
          type: type
        };
      }
      throw new Error('파싱된 JSON에 필수 필드가 누락되었습니다.');
    } catch (error) {
      console.error('GPT 응답 JSON 파싱 오류:', error, "| 원본 내용:", content);
      return this.getSingleFallbackTopic(type);
    }
  }

  getIconForCategory(category, type) {
    if (type === 'weather') { if (category.includes('더위') || category.includes('햇살') || category.includes('쨍쨍')) return '☀️'; if (category.includes('비') || category.includes('강수')) return '🌧️'; if (category.includes('추위') || category.includes('겨울')) return '❄️'; if (category.includes('바람')) return '💨'; return '🌤️'; }
    if (type === 'love') { if (category.includes('첫') || category.includes('만남')) return '👋'; if (category.includes('플러팅') || category.includes('애정')) return '💕'; if (category.includes('깊은') || category.includes('진솔')) return '💭'; if (category.includes('로맨틱')) return '🌹'; return '❤️'; }
    return '💬';
  }

  getSkyDescription(sky) {
    switch (sky) { case 'clear': return '맑음'; case 'cloudy': return '구름 많음'; case 'rainy': return '비'; case 'snowy': return '눈'; case 'sleet': return '진눈깨비'; default: return '보통'; }
  }

  getSingleFallbackTopic(type) {
    const fallbackData = {
      weather: { category: '날씨 느낌 공유', example: '오늘 날씨 진짜 좋네요! 괜히 기분까지 상쾌해지는 것 같아요.', tip: '날씨에 대한 개인적인 느낌을 먼저 공유하면 상대방도 편하게 답할 수 있어요.', icon: '🌤️', type: 'weather' },
      love: { category: '관심사 탐색', example: '요즘 혹시 새롭게 빠져있는 거 있으세요? 저는 유튜브로 캠핑 영상 보는 거에 푹 빠졌어요.', tip: '자신의 이야기를 먼저 살짝 공개하며 질문하면 상대방이 부담 없이 대답하기 쉬워요.', icon: '💭', contextual_tips: ['상대방의 취미를 존중해주세요.'], contextual_warnings: ['너무 취조하듯 묻지 마세요.'] },
      unified: { category: '일상 공유', example: '오늘 하루 어땠어요? 뭔가 특별한 일이라도 있었나요?', tip: '상대방의 일상에 관심을 보이는 것부터 시작하세요.', icon: '☕', type: 'unified' }
    };
    return fallbackData[type] || fallbackData.unified;
  }
}

export default UnifiedConversationService;