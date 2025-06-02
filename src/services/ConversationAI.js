import axios from 'axios';

// OpenAI API 설정
const OPENAI_API_KEY = 'your_openai_api_key_here'; // 실제 API 키로 교체 필요
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class ConversationAI {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
  }

  // 세대별 대화 주제 생성을 위한 프롬프트 생성
  generatePrompt(conversationData) {
    const { userAge, targetAge, relationship, context, mood, situation } = conversationData;
    
    const moodDescriptions = {
      casual: '편안하고 친근한',
      professional: '전문적이고 정중한',
      friendly: '따뜻하고 우호적인',
      respectful: '예의 바르고 공손한'
    };

    const currentTrends = this.getCurrentTrends();
    
    return `당신은 세대 간 소통 전문가입니다. 다음 상황에 맞는 5개의 대화 주제를 JSON 형식으로 생성해주세요.

상황 정보:
- 사용자 나이: ${userAge}세
- 상대방 나이: ${targetAge}세
- 관계: ${relationship || '일반적인 관계'}
- 대화 분위기: ${moodDescriptions[mood] || '편안한'}
- 상황 설명: ${context || '일반적인 만남'}
- 상황 카테고리: ${situation.title}

현재 트렌드 (2025년 6월 기준):
${currentTrends}

각 대화 주제는 다음 구조로 생성해주세요:
{
  "id": 숫자,
  "category": "카테고리명",
  "title": "대화 주제 제목",
  "content": "대화를 시작하는 방법과 구체적인 예시를 포함한 설명 (2-3문장)",
  "tips": ["팁1", "팁2", "팁3"],
  "icon": "ionicon 아이콘명 (outline 스타일)",
  "color": "hex 색상코드"
}

주의사항:
1. ${userAge}세와 ${targetAge}세 간의 세대 차이를 고려하여 양쪽 모두 관심을 가질 수 있는 주제 선택
2. 최신 트렌드를 반영하되 세대 구분 없이 접근 가능한 내용
3. ${moodDescriptions[mood]} 분위기에 맞는 대화 톤
4. 실제로 대화를 시작할 때 사용할 수 있는 구체적인 멘트 포함
5. 각 주제마다 실용적인 대화 팁 3개씩 제공

응답은 반드시 유효한 JSON 배열 형태로만 제공해주세요.`;
  }

  // 현재 트렌드 정보 (실제로는 실시간 데이터 API 연동)
  getCurrentTrends() {
    return `
- K-드라마: 넷플릭스 글로벌 인기작들
- AI 기술: ChatGPT, 생성형 AI의 일상화
- 건강 트렌드: 홈트레이닝, 웰니스
- 음식 트렌드: 비건 푸드, 로컬 맛집 탐방
- 여행: 국내 여행, 워케이션
- 재테크: 부동산, 투자 관심 증가
- 환경: 친환경 제품, 지속가능성
- 문화: 팝업스토어, 체험형 콘텐츠
    `;
  }

  // OpenAI API 호출
  async generateConversationTopics(conversationData) {
    try {
      const prompt = this.generatePrompt(conversationData);
      
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: '당신은 세대 간 소통을 돕는 전문 AI입니다. 한국 문화와 현재 트렌드를 잘 이해하고 있으며, 자연스럽고 실용적인 대화 주제를 제안합니다.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.8
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      
      // JSON 파싱 시도
      try {
        const topics = JSON.parse(content);
        return topics;
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        // JSON 파싱 실패 시 기본 주제 반환
        return this.getFallbackTopics(conversationData);
      }

    } catch (error) {
      console.error('OpenAI API 오류:', error);
      
      // API 호출 실패 시 기본 주제 반환
      return this.getFallbackTopics(conversationData);
    }
  }

  // API 실패 시 기본 주제들
  getFallbackTopics(conversationData) {
    const { userAge, targetAge, mood } = conversationData;
    
    return [
      {
        id: 1,
        category: '최신 트렌드',
        title: '요즘 인기 있는 콘텐츠',
        content: `최근 넷플릭스나 유튜브에서 인기 있는 콘텐츠에 대해 이야기해보세요. "${userAge < targetAge ? '요즘 젊은 사람들이 많이 보는' : '최근에 재미있게 본'} 프로그램이 있으신가요?"라고 시작하면 좋습니다.`,
        tips: ['구체적인 작품보다는 장르로 시작하기', '상대방의 취향을 먼저 물어보기', '서로 추천하며 대화 이어가기'],
        icon: 'tv-outline',
        color: '#3b82f6'
      },
      {
        id: 2,
        category: '일상 이야기',
        title: '건강 관리 방법',
        content: '나이에 관계없이 모두가 관심 있는 건강 관리에 대해 대화해보세요. "요즘 건강 관리는 어떻게 하고 계세요?"라고 자연스럽게 시작할 수 있습니다.',
        tips: ['개인적인 건강 정보는 적당한 선에서', '운동보다는 일상 습관에 초점', '서로의 건강 팁 공유하기'],
        icon: 'fitness-outline',
        color: '#10b981'
      },
      {
        id: 3,
        category: '문화생활',
        title: '주말 여가 활동',
        content: '주말이나 여가시간 활용법은 세대를 불문하고 좋은 대화 주제입니다. "주말에는 주로 뭘 하며 시간을 보내시나요?"로 대화를 시작해보세요.',
        tips: ['비용 부담이 큰 취미는 조심스럽게 접근', '가족과의 시간에 대한 이야기 포함', '새로운 취미에 대한 관심 표현'],
        icon: 'calendar-outline',
        color: '#f59e0b'
      },
      {
        id: 4,
        category: '음식 문화',
        title: '맛집과 요리 이야기',
        content: '음식은 모든 세대가 공감할 수 있는 주제입니다. "이 근처에 맛있는 식당 아시나요?" 또는 "집에서 요리 자주 하시나요?"로 대화를 시작해보세요.',
        tips: ['지역 맛집 정보 공유하기', '간단한 요리 레시피 이야기', '건강한 식습관에 대한 관심 표현'],
        icon: 'restaurant-outline',
        color: '#ef4444'
      },
      {
        id: 5,
        category: '라이프스타일',
        title: '계절과 날씨 이야기',
        content: '계절 변화나 날씨는 자연스러운 대화 시작점입니다. "요즘 날씨가 참 좋죠?" 또는 "이런 날씨에는 뭘 하는 게 좋을까요?"로 대화를 열어보세요.',
        tips: ['계절별 활동이나 추억 공유', '날씨에 따른 기분 변화 이야기', '계절 음식이나 옷차림 대화로 확장'],
        icon: 'sunny-outline',
        color: '#8b5cf6'
      }
    ];
  }

  // 대화 팁 추가 생성
  async generateAdditionalTips(topic, conversationData) {
    try {
      const prompt = `다음 대화 주제에 대해 ${conversationData.userAge}세와 ${conversationData.targetAge}세가 대화할 때 유용한 추가 팁 3가지를 제공해주세요.

대화 주제: ${topic.title}
내용: ${topic.content}

JSON 형식으로 응답해주세요:
{
  "tips": ["팁1", "팁2", "팁3"]
}`;

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const result = JSON.parse(content);
      return result.tips;

    } catch (error) {
      console.error('추가 팁 생성 오류:', error);
      return ['상대방의 의견을 먼저 들어보기', '개인적인 경험 공유하기', '긍정적인 반응 보이기'];
    }
  }
}

export default new ConversationAI();
