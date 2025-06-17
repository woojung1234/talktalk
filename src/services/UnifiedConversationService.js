/**
 * 통합 대화 서비스
 * 모든 유형의 대화 주제를 GPT API를 통해 생성합니다.
 */

import WeatherService from './WeatherService';

class UnifiedConversationService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.weatherService = new WeatherService(process.env.WEATHER_API_KEY);
  }

  /**
   * GPT API를 사용한 대화 주제 생성
   * @param {string} type - 대화 유형 (weather, love, relationship, daily, topics, situations)
   * @param {Object} context - 추가 컨텍스트 정보
   * @returns {Promise<Array>} 대화 주제 배열
   */
  async generateConversationTopics(type, context = {}) {
    try {
      let prompt = '';
      let systemMessage = '';

      switch (type) {
        case 'weather':
          return await this.generateWeatherTopics(context);
        
        case 'love':
          return await this.generateLoveTopics(context);
        
        case 'unified':
          return await this.generateUnifiedTopics(context);
        
        default:
          return await this.generateUnifiedTopics(context);
      }
    } catch (error) {
      console.error('Conversation generation error:', error);
      return this.getFallbackTopics(type);
    }
  }

  /**
   * 날씨 기반 대화 주제 생성
   */
  async generateWeatherTopics(context) {
    const weather = context.weather || await this.weatherService.getCurrentWeather(context.city);
    
    const systemMessage = `당신은 날씨를 활용한 자연스러운 대화 주제를 제안하는 전문가입니다. 
    현재 날씨 상황에 맞는 실제로 사용할 수 있는 대화 시작 멘트를 생성해주세요.`;

    const prompt = `현재 날씨 정보:
- 온도: ${weather.temperature}°C
- 하늘 상태: ${this.getSkyDescription(weather.sky)}
- 강수량: ${weather.precipitation}mm
- 습도: ${weather.humidity}%

이 날씨에 맞는 자연스러운 대화 주제 5개를 다음 형식으로 생성해주세요:

1. 카테고리명 | 실제 대화 예시 | 사용 팁
2. 카테고리명 | 실제 대화 예시 | 사용 팁
...

각 대화 예시는 실제로 사람들이 바로 사용할 수 있는 자연스러운 멘트여야 합니다.`;

    return await this.callGPTAPI(systemMessage, prompt, 'weather');
  }

  /**
   * 연애 코치 대화 주제 생성
   */
  async generateLoveTopics(context) {
    const { stage = 'first_meet', type = 'icebreaker', situation = '' } = context;

    const systemMessage = `당신은 연애 상담 전문가입니다. 
    각 연애 단계와 상황에 맞는 실제로 사용할 수 있는 대화법을 제안해주세요.`;

    const stageDescriptions = {
      'first_meet': '처음 만나는 상황',
      'getting_know': '서로 알아가는 단계',
      'some': '썸을 타는 단계',
      'dating': '연애 중인 단계',
      'long_term': '장기 연애 단계'
    };

    const typeDescriptions = {
      'icebreaker': '어색함을 깨는 대화',
      'deep_talk': '깊이 있는 대화',
      'flirting': '플러팅/애정표현',
      'conflict': '갈등 해결',
      'romance': '로맨틱한 분위기'
    };

    const prompt = `연애 상황:
- 관계 단계: ${stageDescriptions[stage]}
- 대화 유형: ${typeDescriptions[type]}
- 추가 상황: ${situation}

이 상황에 맞는 실제 사용 가능한 대화 가이드 5개를 다음 형식으로 생성해주세요:

1. 상황 설명 | 실제 대화 예시 | 사용할 때 주의점
2. 상황 설명 | 실제 대화 예시 | 사용할 때 주의점
...

각 대화 예시는 해당 연애 단계에서 실제로 사용할 수 있는 자연스러운 멘트여야 합니다.`;

    return await this.callGPTAPI(systemMessage, prompt, 'love');
  }

  /**
   * 통합 대화 주제 생성 (관계별, 일상, 주제별, 상황별 통합)
   */
  async generateUnifiedTopics(context) {
    const { 
      relationship = '친구', 
      situation = '일상 대화', 
      topic = '', 
      age_group = '20-30대',
      formality = '편안함'
    } = context;

    const systemMessage = `당신은 다양한 상황에서의 대화 주제를 추천하는 전문가입니다. 
    사용자의 상황과 관계에 맞는 실제로 사용할 수 있는 자연스러운 대화 주제를 제안해주세요.`;

    const prompt = `대화 상황:
- 관계: ${relationship}
- 상황: ${situation}
- 주제: ${topic || '자유'}
- 연령대: ${age_group}
- 분위기: ${formality}

이 상황에 맞는 실제 사용 가능한 대화 주제 6개를 다음 형식으로 생성해주세요:

1. 주제 카테고리 | 구체적인 대화 시작 멘트 | 대화를 이어가는 방법
2. 주제 카테고리 | 구체적인 대화 시작 멘트 | 대화를 이어가는 방법
...

각 대화 시작 멘트는 해당 관계와 상황에서 실제로 사용할 수 있는 자연스러운 표현이어야 합니다.`;

    return await this.callGPTAPI(systemMessage, prompt, 'unified');
  }

  /**
   * GPT API 호출
   */
  async callGPTAPI(systemMessage, prompt, type) {
    if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY') {
      console.log('Using fallback topics - OpenAI API key not configured');
      return this.getFallbackTopics(type);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`GPT API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from GPT API');
      }

      return this.parseGPTResponse(content, type);
    } catch (error) {
      console.error('GPT API call failed:', error);
      return this.getFallbackTopics(type);
    }
  }

  /**
   * GPT 응답 파싱
   */
  parseGPTResponse(content, type) {
    const lines = content.split('\n').filter(line => line.trim());
    const topics = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && /^\d+\./.test(trimmedLine)) {
        const parts = trimmedLine.split('|').map(part => part.trim());
        if (parts.length >= 3) {
          const [numberAndCategory, example, tip] = parts;
          const category = numberAndCategory.replace(/^\d+\.\s*/, '');
          
          topics.push({
            category: category,
            example: example,
            tip: tip,
            icon: this.getIconForCategory(category, type)
          });
        }
      }
    });

    return topics.length > 0 ? topics : this.getFallbackTopics(type);
  }

  /**
   * 카테고리별 아이콘 반환
   */
  getIconForCategory(category, type) {
    if (type === 'weather') {
      if (category.includes('더위') || category.includes('햇살')) return '☀️';
      if (category.includes('비') || category.includes('강수')) return '🌧️';
      if (category.includes('추위') || category.includes('겨울')) return '❄️';
      if (category.includes('바람')) return '💨';
      return '🌤️';
    }
    
    if (type === 'love') {
      if (category.includes('첫') || category.includes('만남')) return '👋';
      if (category.includes('플러팅') || category.includes('애정')) return '💕';
      if (category.includes('깊은') || category.includes('진솔')) return '💭';
      if (category.includes('로맨틱')) return '🌹';
      return '❤️';
    }
    
    return '💬';
  }

  /**
   * 하늘 상태 설명
   */
  getSkyDescription(sky) {
    switch (sky) {
      case 'clear': return '맑음';
      case 'cloudy': return '흐림';
      case 'rainy': return '비';
      case 'snowy': return '눈';
      default: return '보통';
    }
  }

  /**
   * Fallback 주제 (API 오류시)
   */
  getFallbackTopics(type) {
    const fallbackTopics = {
      weather: [
        {
          category: '날씨 느낌 공유',
          example: '오늘 날씨 어때? 나는 되게 상쾌한 느낌이야',
          tip: '날씨에 대한 개인적인 느낌을 먼저 공유하면 자연스러워요',
          icon: '🌤️'
        },
        {
          category: '계절 변화 이야기',
          example: '요즘 계절이 바뀌는 게 확실히 느껴져',
          tip: '계절 변화는 누구나 공감할 수 있는 안전한 주제예요',
          icon: '🍂'
        }
      ],
      love: [
        {
          category: '관심사 탐색',
          example: '평소에 뭐 하는 걸 좋아해?',
          tip: '상대방의 답변에 적극적으로 반응해주세요',
          icon: '💭'
        },
        {
          category: '공통점 찾기',
          example: '우리 취향이 비슷한 것 같아서 신기해',
          tip: '공통점을 발견하면 친밀감이 높아져요',
          icon: '💕'
        }
      ],
      unified: [
        {
          category: '일상 공유',
          example: '오늘 하루 어땠어? 특별한 일 있었어?',
          tip: '상대방의 일상에 관심을 보이는 것부터 시작하세요',
          icon: '☕'
        },
        {
          category: '관심사 이야기',
          example: '요즘 관심있는 거나 빠져있는 거 있어?',
          tip: '상대방의 열정을 이끌어내는 질문이에요',
          icon: '💡'
        }
      ]
    };

    return fallbackTopics[type] || fallbackTopics.unified;
  }
}

export default UnifiedConversationService;