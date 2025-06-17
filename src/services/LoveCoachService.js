import axios from 'axios';

// 백엔드에 구축하신 연애코치 가이드 API 주소로 변경해야 합니다.
const LOVE_COACH_API_URL = 'https://your-api-server.com/api/love-coach/guides';

class LoveCoachService {
  constructor() {
    this.guidesData = null;
    this.relationshipStages = { FIRST_MEET: 'first_meet', GETTING_KNOW: 'getting_know', SOME: 'some', DATING: 'dating', LONG_TERM: 'long_term' };
    this.conversationTypes = { ICEBREAKER: 'icebreaker', DEEP_TALK: 'deep_talk', FLIRTING: 'flirting', CONFLICT: 'conflict', ROMANCE: 'romance' };
  }

  async initialize() {
    if (this.guidesData) {
      console.log('LoveCoachService: 이미 데이터가 로드되었습니다.');
      return;
    }
    try {
      console.log(`LoveCoachService: API로부터 데이터 로드 시작... (URL: ${LOVE_COACH_API_URL})`);
      const response = await axios.get(LOVE_COACH_API_URL);
      if (response.data && typeof response.data === 'object') {
        this.guidesData = response.data;
        console.log('LoveCoachService: 데이터 로드 및 캐싱 완료.');
      } else {
        throw new Error('API 응답이 유효한 객체 형식이 아닙니다.');
      }
    } catch (error) {
      console.error('LoveCoachService: API 데이터 로드 중 오류가 발생했습니다.', error.message);
      this.guidesData = {};
    }
  }

  getTopicsByStage(stage) {
    return this.guidesData?.[stage]?.topics || [];
  }

  getStageTips(stage) {
    return this.guidesData?.[stage]?.tips || [];
  }

  getStageWarnings(stage) {
    return this.guidesData?.[stage]?.warnings || [];
  }

  getStageTitle(stage) {
    return this.guidesData?.[stage]?.title || '단계 정보';
  }

  getTypeTitle(type) {
    const titles = {
      [this.conversationTypes.ICEBREAKER]: '아이스브레이커',
      [this.conversationTypes.DEEP_TALK]: '깊은 대화',
      [this.conversationTypes.FLIRTING]: '플러팅',
      [this.conversationTypes.CONFLICT]: '갈등 해결',
      [this.conversationTypes.ROMANCE]: '로맨틱'
    };
    return titles[type] || '아이스브레이커';
  }
}

export default LoveCoachService;