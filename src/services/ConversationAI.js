import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class ConversationAI {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    console.log('💡 ConversationAI 초기화됨');
    console.log('🔑 API Key:', this.apiKey ? `${this.apiKey.substring(0, 7)}...` : 'NOT FOUND');
    console.log('API 키 상태:', this.apiKey ? '✅ 설정됨' : '❌ 설정되지 않음');
  }

  async generateConversationTopics(conversationData) {
    console.log('🚀 generateConversationTopics 호출됨');
    
    try {
      if (!this.apiKey) {
        console.warn('⚠️ API 키 없음. 기본 주제 반환');
        return this.getFallbackTopics(conversationData);
      }

      console.log('📡 OpenAI API 호출 시작...');
      const prompt = this.generatePrompt(conversationData);
      
      const response = await axios.post(OPENAI_API_URL, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 대화 주제 추천 전문가입니다. 응답은 반드시 유효한 JSON 배열만 반환하세요. 추가 설명이나 마크다운 포맷은 사용하지 마세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      console.log('✅ API 응답 받음');
      const content = response.data.choices[0].message.content;
      
      console.log('📄 GPT 응답 내용:');
      console.log('=== 응답 시작 ===');
      console.log(content);
      console.log('=== 응답 끝 ===');
      
      // JSON 정제
      let jsonContent = content.trim();
      
      // 마크다운 코드 블록 제거
      if (jsonContent.includes('```')) {
        const matches = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (matches) {
          jsonContent = matches[1].trim();
        }
      }
      
      console.log('🔧 정제된 JSON:');
      console.log(jsonContent);
      
      const topics = JSON.parse(jsonContent);
      console.log('🎉 JSON 파싱 성공!');
      console.log('📊 파싱된 주제들:', topics);
      
      if (Array.isArray(topics) && topics.length > 0) {
        return topics.map((topic, index) => ({
          id: topic.id || index + 1,
          category: topic.category || '일반',
          title: topic.title || '대화 주제',
          content: topic.content || '대화를 시작해보세요.',
          tips: Array.isArray(topic.tips) ? topic.tips : ['자연스럽게 대화하기'],
          icon: topic.icon || 'chatbubble-outline',
          color: topic.color || '#3b82f6'
        }));
      }
      
      throw new Error('Invalid array response');
      
    } catch (error) {
      console.error('❌ 오류 발생:', error.message);
      if (error.response) {
        console.error('API 응답 상태:', error.response.status);
        console.error('API 오류 데이터:', error.response.data);
      }
      return this.getFallbackTopics(conversationData);
    }
  }

  generatePrompt(conversationData) {
    const { userAge, targetAge, relationship, context, mood, situation } = conversationData;
    
    const moodMap = {
      casual: '편안하고 친근한',
      professional: '전문적이고 정중한', 
      friendly: '따뜻하고 우호적인',
      respectful: '예의 바르고 공손한'
    };

    return `${userAge}세와 ${targetAge}세가 ${relationship || '일반적인 관계'}에서 ${moodMap[mood] || '편안한'} 분위기로 대화할 수 있는 주제 5개를 JSON 배열로 생성해주세요.

다음 JSON 형식을 정확히 따라주세요:

[
  {
    "id": 1,
    "category": "최신 트렌드",
    "title": "구체적인 대화 주제",
    "content": "대화를 시작하는 구체적인 방법과 예시",
    "tips": ["팁1", "팁2", "팁3"],
    "icon": "tv-outline",
    "color": "#3b82f6"
  }
]

상황: ${situation.title}
추가 정보: ${context || '없음'}

아이콘은 다음 중에서 선택: tv-outline, trending-up-outline, fitness-outline, restaurant-outline, calendar-outline, chatbubble-outline, book-outline, musical-notes-outline, car-outline, home-outline

색상은 hex 코드로 제공해주세요.

응답은 JSON 배열만 반환하고 다른 텍스트는 포함하지 마세요.`;
  }

  getCurrentTrends() {
    return `
- K-드라마, AI 기술, 건강 트렌드, 음식 문화, 여행, 재테크, 환경, 문화생활
    `;
  }

  getFallbackTopics(conversationData) {
    console.log('🔄 기본 주제 반환 중...');
    return [
      {
        id: 1,
        category: '최신 트렌드',
        title: '요즘 인기 있는 콘텐츠',
        content: '최근 넷플릭스나 유튜브에서 인기 있는 콘텐츠에 대해 이야기해보세요.',
        tips: ['장르로 시작하기', '취향 물어보기', '추천하며 대화 이어가기'],
        icon: 'tv-outline',
        color: '#3b82f6'
      },
      {
        id: 2,
        category: '일상 이야기', 
        title: '건강 관리 방법',
        content: '나이에 관계없이 관심 있는 건강 관리에 대해 대화해보세요.',
        tips: ['적당한 선에서', '일상 습관 초점', '팁 공유하기'],
        icon: 'fitness-outline',
        color: '#10b981'
      },
      {
        id: 3,
        category: '문화생활',
        title: '주말 여가 활동', 
        content: '주말이나 여가시간 활용법에 대해 이야기해보세요.',
        tips: ['비용 고려하기', '가족 시간 포함', '새로운 취미 관심'],
        icon: 'calendar-outline',
        color: '#f59e0b'
      },
      {
        id: 4,
        category: '음식 문화',
        title: '맛집과 요리 이야기',
        content: '음식 관련 대화로 자연스럽게 소통해보세요.',
        tips: ['맛집 정보 공유', '요리 레시피', '건강한 식습관'],
        icon: 'restaurant-outline', 
        color: '#ef4444'
      },
      {
        id: 5,
        category: '라이프스타일',
        title: '계절과 날씨 이야기',
        content: '계절 변화나 날씨 관련 자연스러운 대화를 시작해보세요.',
        tips: ['계절 활동 공유', '기분 변화 이야기', '옷차림 대화'],
        icon: 'sunny-outline',
        color: '#8b5cf6'
      }
    ];
  }
}

export default new ConversationAI();
