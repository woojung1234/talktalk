/**
 * 연애 코치 서비스
 * 썸부터 연애까지 단계별 대화 가이드를 제공합니다.
 */

class LoveCoachService {
  constructor() {
    this.relationshipStages = {
      FIRST_MEET: 'first_meet',      // 첫 만남
      GETTING_KNOW: 'getting_know',  // 알아가는 단계
      SOME: 'some',                  // 썸 단계
      DATING: 'dating',              // 연애 단계
      LONG_TERM: 'long_term'         // 장기 연애
    };

    this.conversationTypes = {
      ICEBREAKER: 'icebreaker',      // 아이스브레이커
      DEEP_TALK: 'deep_talk',        // 깊은 대화
      FLIRTING: 'flirting',          // 플러팅
      CONFLICT: 'conflict',          // 갈등 해결
      ROMANCE: 'romance'             // 로맨틱
    };
  }

  /**
   * 단계별 대화 주제 생성
   * @param {string} stage - 관계 단계
   * @param {string} type - 대화 유형
   * @returns {Object} 대화 가이드
   */
  generateLoveTopics(stage, type = 'icebreaker') {
    const topics = this.getTopicsByStage(stage);
    const filteredTopics = topics.filter(topic => topic.type === type);
    
    return {
      stage: this.getStageTitle(stage),
      type: this.getTypeTitle(type),
      topics: filteredTopics.length > 0 ? filteredTopics : topics.slice(0, 5),
      tips: this.getStageTips(stage),
      warnings: this.getStageWarnings(stage)
    };
  }

  /**
   * 단계별 주제 목록
   */
  getTopicsByStage(stage) {
    switch (stage) {
      case this.relationshipStages.FIRST_MEET:
        return this.getFirstMeetTopics();
      
      case this.relationshipStages.GETTING_KNOW:
        return this.getGettingKnowTopics();
      
      case this.relationshipStages.SOME:
        return this.getSomeTopics();
      
      case this.relationshipStages.DATING:
        return this.getDatingTopics();
      
      case this.relationshipStages.LONG_TERM:
        return this.getLongTermTopics();
      
      default:
        return this.getFirstMeetTopics();
    }
  }

  /**
   * 첫 만남 단계 주제
   */
  getFirstMeetTopics() {
    return [
      {
        type: this.conversationTypes.ICEBREAKER,
        title: '자연스러운 첫 인사',
        examples: [
          '안녕하세요! 처음 뵙겠습니다',
          '여기 자주 오시나요?',
          '날씨가 정말 좋네요',
          '이런 모임은 처음이에요'
        ],
        level: 'beginner',
        icon: '👋'
      },
      {
        type: this.conversationTypes.ICEBREAKER,
        title: '공통 관심사 찾기',
        examples: [
          '취미가 뭐예요?',
          '요즘 재밌게 본 드라마 있어요?',
          '음식 중에 뭘 제일 좋아하세요?',
          '여행 좋아하세요?'
        ],
        level: 'beginner',
        icon: '🤝'
      },
      {
        type: this.conversationTypes.ICEBREAKER,
        title: '가벼운 개인 정보',
        examples: [
          '어떤 일 하세요?',
          '어디 사세요? (동네 정도만)',
          '나이가 어떻게 되세요?',
          '형제자매 있으세요?'
        ],
        level: 'beginner',
        icon: '💭'
      }
    ];
  }

  /**
   * 알아가는 단계 주제
   */
  getGettingKnowTopics() {
    return [
      {
        type: this.conversationTypes.ICEBREAKER,
        title: '일상 이야기',
        examples: [
          '오늘 뭐 하셨어요?',
          '주말에 뭐 해요?',
          '스트레스 받을 때 뭐 해요?',
          '요즘 관심있는 게 있어요?'
        ],
        level: 'intermediate',
        icon: '☕'
      },
      {
        type: this.conversationTypes.DEEP_TALK,
        title: '가치관 알아보기',
        examples: [
          '인생에서 중요하게 생각하는 게 뭐예요?',
          '꿈이 있다면 뭐예요?',
          '가족이랑 친해요?',
          '친구들이랑은 어떻게 지내요?'
        ],
        level: 'intermediate',
        icon: '💡'
      },
      {
        type: this.conversationTypes.FLIRTING,
        title: '은근한 관심 표현',
        examples: [
          '말하는 방식이 재밌어요',
          '센스가 있으시네요',
          '같이 시간 보내니까 재밌어요',
          '또 언제 만날 수 있을까요?'
        ],
        level: 'intermediate',
        icon: '😊'
      }
    ];
  }

  /**
   * 썸 단계 주제
   */
  getSomeTopics() {
    return [
      {
        type: this.conversationTypes.FLIRTING,
        title: '썸 확인하기',
        examples: [
          '요즘 누구랑 연락 자주 해요?',
          '이상형이 어떻게 돼요?',
          '연애 언제 마지막에 했어요?',
          '저 어때요? 솔직히'
        ],
        level: 'advanced',
        icon: '💕'
      },
      {
        type: this.conversationTypes.ROMANCE,
        title: '로맨틱한 분위기',
        examples: [
          '별 보러 갈래요?',
          '같이 영화 볼까요?',
          '손 차가우시네요',
          '오늘 되게 예뻐 보여요'
        ],
        level: 'advanced',
        icon: '🌹'
      },
      {
        type: this.conversationTypes.DEEP_TALK,
        title: '진솔한 대화',
        examples: [
          '솔직히 저 어떻게 생각해요?',
          '우리 사이가 어떤 것 같아요?',
          '연애에 대해 어떻게 생각해요?',
          '진심으로 하고 싶은 말이 있어요'
        ],
        level: 'advanced',
        icon: '💭'
      }
    ];
  }

  /**
   * 연애 단계 주제
   */
  getDatingTopics() {
    return [
      {
        type: this.conversationTypes.ROMANCE,
        title: '연인다운 대화',
        examples: [
          '사랑해',
          '오늘도 고마워',
          '너랑 있으면 행복해',
          '우리 미래 계획 세워볼까?'
        ],
        level: 'expert',
        icon: '❤️'
      },
      {
        type: this.conversationTypes.DEEP_TALK,
        title: '관계 발전시키기',
        examples: [
          '서로에게 바라는 게 있을까?',
          '우리가 더 잘할 수 있는 건 뭘까?',
          '가족들한테 소개하고 싶어',
          '앞으로 어떤 커플이 되고 싶어?'
        ],
        level: 'expert',
        icon: '💑'
      },
      {
        type: this.conversationTypes.CONFLICT,
        title: '갈등 해결하기',
        examples: [
          '이야기 좀 해볼까?',
          '내가 잘못한 것 같아, 미안해',
          '서로 오해가 있었던 것 같아',
          '우리 이 문제 어떻게 해결할까?'
        ],
        level: 'expert',
        icon: '🤝'
      }
    ];
  }

  /**
   * 장기 연애 단계 주제
   */
  getLongTermTopics() {
    return [
      {
        type: this.conversationTypes.DEEP_TALK,
        title: '미래 계획',
        examples: [
          '결혼에 대해 어떻게 생각해?',
          '우리 5년 후 모습은 어떨까?',
          '아이들 갖고 싶어?',
          '어디서 살고 싶어?'
        ],
        level: 'expert',
        icon: '💍'
      },
      {
        type: this.conversationTypes.ROMANCE,
        title: '사랑 재확인',
        examples: [
          '처음 만났을 때 생각나?',
          '너의 어떤 점이 제일 좋아?',
          '우리 추억 중 가장 기억에 남는 건?',
          '매일 사랑한다고 말해도 부족해'
        ],
        level: 'expert',
        icon: '💝'
      },
      {
        type: this.conversationTypes.DEEP_TALK,
        title: '성장과 변화',
        examples: [
          '서로 어떻게 변했다고 생각해?',
          '앞으로 더 발전하고 싶은 부분은?',
          '서로 도움이 되는 방법은?',
          '우리만의 특별한 전통 만들어볼까?'
        ],
        level: 'expert',
        icon: '🌱'
      }
    ];
  }

  /**
   * 단계별 팁 제공
   */
  getStageTips(stage) {
    const tips = {
      [this.relationshipStages.FIRST_MEET]: [
        '자연스럽고 진솔한 모습을 보여주세요',
        '너무 개인적인 질문은 피해주세요',
        '상대방의 이야기를 잘 들어주세요',
        '밝고 긍정적인 에너지를 유지하세요'
      ],
      [this.relationshipStages.GETTING_KNOW]: [
        '공통 관심사를 찾아 대화를 이어가세요',
        '상대방의 취향과 성격을 파악해보세요',
        '적절한 유머와 재치를 섞어보세요',
        '꾸준한 관심과 배려를 보여주세요'
      ],
      [this.relationshipStages.SOME]: [
        '은근한 스킨십을 시도해보세요',
        '특별한 관심을 표현해보세요',
        '진솔한 마음을 조금씩 표현하세요',
        '상대방의 반응을 주의 깊게 살펴보세요'
      ],
      [this.relationshipStages.DATING]: [
        '서로의 감정을 솔직하게 표현하세요',
        '데이트 시간을 소중히 여기세요',
        '작은 갈등도 대화로 해결하세요',
        '서로의 성장을 응원해주세요'
      ],
      [this.relationshipStages.LONG_TERM]: [
        '초심을 잃지 않으려 노력하세요',
        '새로운 추억을 계속 만들어가세요',
        '서로의 변화를 인정하고 수용하세요',
        '미래에 대한 구체적인 계획을 세워보세요'
      ]
    };

    return tips[stage] || tips[this.relationshipStages.FIRST_MEET];
  }

  /**
   * 단계별 주의사항
   */
  getStageWarnings(stage) {
    const warnings = {
      [this.relationshipStages.FIRST_MEET]: [
        '너무 급하게 진전시키려 하지 마세요',
        '과도한 개인정보는 묻지 마세요',
        '외모 평가는 피해주세요'
      ],
      [this.relationshipStages.GETTING_KNOW]: [
        '과거 연애사는 자세히 묻지 마세요',
        '지나치게 끈적한 관심은 부담스러울 수 있어요',
        '상대방의 경계를 존중해주세요'
      ],
      [this.relationshipStages.SOME]: [
        '일방적인 감정 표현은 주의하세요',
        '질투나 집착은 금물입니다',
        '상대방의 일정을 너무 간섭하지 마세요'
      ],
      [this.relationshipStages.DATING]: [
        '서로의 개인 시간도 인정해주세요',
        '모든 것을 통제하려 하지 마세요',
        '과거에 매달리지 마세요'
      ],
      [this.relationshipStages.LONG_TERM]: [
        '당연함에 안주하지 마세요',
        '소통을 게을리 하지 마세요',
        '서로의 변화를 거부하지 마세요'
      ]
    };

    return warnings[stage] || warnings[this.relationshipStages.FIRST_MEET];
  }

  /**
   * 단계 제목 반환
   */
  getStageTitle(stage) {
    const titles = {
      [this.relationshipStages.FIRST_MEET]: '첫 만남',
      [this.relationshipStages.GETTING_KNOW]: '알아가는 단계',
      [this.relationshipStages.SOME]: '썸 단계',
      [this.relationshipStages.DATING]: '연애 단계',
      [this.relationshipStages.LONG_TERM]: '장기 연애'
    };

    return titles[stage] || '첫 만남';
  }

  /**
   * 대화 유형 제목 반환
   */
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

  /**
   * 상황별 응급 대화법
   * @param {string} situation - 상황 (awkward, rejected, fight, etc.)
   * @returns {Object} 응급 대화 가이드
   */
  getEmergencyTopics(situation) {
    const emergencyGuides = {
      awkward: {
        title: '어색한 상황 극복법',
        solutions: [
          '날씨나 주변 환경 언급하기',
          '공통 관심사로 화제 전환',
          '유머러스한 에피소드 공유',
          '상대방에게 질문 던지기'
        ],
        examples: [
          '아... 갑자기 조용해졌네요 ㅎㅎ',
          '저기 음악 좋은데요?',
          '아까 말씀하신 게 궁금한데...'
        ]
      },
      rejected: {
        title: '거절당했을 때 대처법',
        solutions: [
          '자연스럽게 받아들이기',
          '친구로 지내자고 제안',
          '시간을 두고 다시 접근',
          '자존감 유지하기'
        ],
        examples: [
          '아, 그렇구나. 괜찮아요',
          '그래도 좋은 친구로 지낼 수 있을까요?',
          '시간이 지나면 마음이 바뀔 수도 있겠죠?'
        ]
      },
      fight: {
        title: '싸웠을 때 화해법',
        solutions: [
          '먼저 사과하기',
          '감정보다 사실에 집중',
          '서로의 입장 이해하기',
          '앞으로 개선할 점 약속'
        ],
        examples: [
          '미안해, 내가 잘못 생각했나봐',
          '네 마음을 이해하지 못해서 미안해',
          '앞으로는 이런 일이 없도록 할게'
        ]
      }
    };

    return emergencyGuides[situation] || emergencyGuides.awkward;
  }

  /**
   * 데이트 장소별 대화 주제
   * @param {string} location - 데이트 장소
   * @returns {Array} 장소별 대화 주제
   */
  getLocationBasedTopics(location) {
    const locationTopics = {
      cafe: [
        '이 카페 분위기 어때요?',
        '커피 자주 마시는 편이에요?',
        '집중하기 좋은 카페 알고 있어요?',
        '디저트도 맛있어 보이네요'
      ],
      restaurant: [
        '음식 맛있어요?',
        '평소에 어떤 음식 좋아해요?',
        '요리 해봤어요?',
        '맛집 추천 받고 싶어요'
      ],
      movie: [
        '영화 어땠어요?',
        '평소에 어떤 장르 좋아해요?',
        '기억에 남는 영화 있어요?',
        '다음엔 어떤 영화 볼까요?'
      ],
      park: [
        '날씨 정말 좋네요',
        '산책 자주 해요?',
        '자연 속에 있으니까 기분이 좋아요',
        '운동은 어떤 걸 해요?'
      ]
    };

    return locationTopics[location] || locationTopics.cafe;
  }

  /**
   * MBTI별 맞춤 대화법
   * @param {string} mbti - MBTI 유형
   * @returns {Object} MBTI별 대화 가이드
   */
  getMBTIBasedTopics(mbti) {
    const mbtiGuides = {
      E: {
        tips: ['활발하고 에너지 넘치는 대화', '다양한 주제로 대화 확장'],
        topics: ['모임 이야기', '여행 경험', '새로운 도전', '사람들과의 추억']
      },
      I: {
        tips: ['깊이 있는 일대일 대화', '충분한 생각할 시간 제공'],
        topics: ['개인적인 관심사', '내면의 생각', '조용한 활동', '의미있는 경험']
      },
      S: {
        tips: ['구체적이고 현실적인 이야기', '실제 경험 중심 대화'],
        topics: ['일상 이야기', '구체적인 계획', '실용적인 정보', '현재 상황']
      },
      N: {
        tips: ['창의적이고 미래지향적 대화', '가능성과 아이디어 중심'],
        topics: ['미래 계획', '창의적 아이디어', '철학적 주제', '새로운 가능성']
      }
    };

    const type = mbti.charAt(0); // E/I 추출
    return mbtiGuides[type] || mbtiGuides.E;
  }
}

export default LoveCoachService;