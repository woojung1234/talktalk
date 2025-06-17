/**
 * 관계별 대화 서비스
 * 세대, 직장, 모임, 가족 등 다양한 관계에서의 대화법을 제공합니다.
 */

class RelationshipConversationService {
  constructor() {
    this.relationshipTypes = {
      GENERATION: 'generation',    // 세대별
      WORKPLACE: 'workplace',      // 직장
      NETWORKING: 'networking',    // 모임/네트워킹
      FAMILY: 'family'             // 가족
    };

    this.conversationModes = {
      FORMAL: 'formal',            // 격식있는
      CASUAL: 'casual',            // 편안한
      PROFESSIONAL: 'professional', // 전문적인
      INTIMATE: 'intimate'         // 친밀한
    };
  }

  /**
   * 관계별 대화 주제 생성
   * @param {string} relationshipType - 관계 유형
   * @param {string} mode - 대화 모드
   * @returns {Object} 대화 가이드
   */
  generateRelationshipTopics(relationshipType, mode = 'casual') {
    const topics = this.getTopicsByRelationship(relationshipType);
    const filteredTopics = topics.filter(topic => topic.mode === mode || topic.mode === 'universal');
    
    return {
      relationship: this.getRelationshipTitle(relationshipType),
      mode: this.getModeTitle(mode),
      topics: filteredTopics.length > 0 ? filteredTopics : topics.slice(0, 6),
      guidelines: this.getRelationshipGuidelines(relationshipType),
      etiquette: this.getRelationshipEtiquette(relationshipType)
    };
  }

  /**
   * 관계 유형별 주제 목록
   */
  getTopicsByRelationship(relationshipType) {
    switch (relationshipType) {
      case this.relationshipTypes.GENERATION:
        return this.getGenerationTopics();
      
      case this.relationshipTypes.WORKPLACE:
        return this.getWorkplaceTopics();
      
      case this.relationshipTypes.NETWORKING:
        return this.getNetworkingTopics();
      
      case this.relationshipTypes.FAMILY:
        return this.getFamilyTopics();
      
      default:
        return this.getGenerationTopics();
    }
  }

  /**
   * 세대별 대화 주제
   */
  getGenerationTopics() {
    return [
      {
        mode: 'universal',
        title: '세대 간 공통 관심사',
        examples: [
          '요즘 날씨가 정말 변덕스럽네요',
          '건강 관리는 어떻게 하세요?',
          '맛있는 음식점 추천해주세요',
          '여행 가본 곳 중에 어디가 좋았어요?'
        ],
        ageGroup: 'all',
        icon: '🤝'
      },
      {
        mode: 'casual',
        title: '젊은 세대와 대화',
        examples: [
          '요즘 핫한 앱이나 서비스 있어요?',
          '추천할 만한 유튜브 채널 있어요?',
          '최신 트렌드 어떻게 따라잡아요?',
          '새로운 기술 배우는 걸 좋아해요?'
        ],
        ageGroup: '20-30s',
        icon: '📱'
      },
      {
        mode: 'formal',
        title: '기성세대와 대화',
        examples: [
          '경험에서 우러나온 조언을 듣고 싶어요',
          '옛날과 지금의 차이점이 궁금해요',
          '인생 선배로서 조언 부탁드려요',
          '전통적인 방식에 대해 알고 싶어요'
        ],
        ageGroup: '50+',
        icon: '🎓'
      },
      {
        mode: 'universal',
        title: '세대 차이 극복',
        examples: [
          '서로 다른 관점이 흥미로워요',
          '각자의 장점을 배울 수 있을 것 같아요',
          '소통 방식이 달라도 이해하려고 해요',
          '새로운 시각을 얻을 수 있어서 좋아요'
        ],
        ageGroup: 'all',
        icon: '🌉'
      }
    ];
  }

  /**
   * 직장 내 대화 주제
   */
  getWorkplaceTopics() {
    return [
      {
        mode: 'professional',
        title: '업무 관련 대화',
        examples: [
          '이 프로젝트에 대한 의견을 듣고 싶어요',
          '업무 효율성을 높일 방법이 있을까요?',
          '협업할 때 중요한 게 뭐라고 생각해요?',
          '목표 달성을 위한 전략을 세워볼까요?'
        ],
        hierarchy: 'peer',
        icon: '💼'
      },
      {
        mode: 'casual',
        title: '점심시간 대화',
        examples: [
          '오늘 점심 뭐 드실 예정이에요?',
          '맛있는 식당 아는 곳 있어요?',
          '커피 한 잔 하면서 이야기할까요?',
          '주말에 뭐 하셨어요?'
        ],
        hierarchy: 'peer',
        icon: '🍽️'
      },
      {
        mode: 'formal',
        title: '상급자와 대화',
        examples: [
          '보고드릴 사항이 있습니다',
          '조언을 구하고 싶은 일이 있어요',
          '업무 방향에 대해 확인하고 싶어요',
          '피드백을 받고 싶습니다'
        ],
        hierarchy: 'senior',
        icon: '👔'
      },
      {
        mode: 'casual',
        title: '후배와 대화',
        examples: [
          '업무 적응은 잘 되고 있어?',
          '궁금한 것 있으면 언제든 물어봐',
          '점심 같이 먹을까?',
          '회사 생활 팁을 알려줄게'
        ],
        hierarchy: 'junior',
        icon: '🤗'
      },
      {
        mode: 'professional',
        title: '회의에서 활용',
        examples: [
          '다른 관점에서 보면 어떨까요?',
          '실행 가능한 방안을 찾아볼까요?',
          '우선순위를 정해보는 게 좋겠어요',
          '구체적인 일정을 잡아볼까요?'
        ],
        hierarchy: 'all',
        icon: '📊'
      }
    ];
  }

  /**
   * 모임/네트워킹 대화 주제
   */
  getNetworkingTopics() {
    return [
      {
        mode: 'casual',
        title: '첫 인상 만들기',
        examples: [
          '안녕하세요! 처음 뵙겠습니다',
          '이런 모임은 어떻게 알게 되셨어요?',
          '어떤 일 하세요?',
          '여기 자주 오시나요?'
        ],
        context: 'introduction',
        icon: '👋'
      },
      {
        mode: 'professional',
        title: '전문적 네트워킹',
        examples: [
          '어떤 분야에서 일하세요?',
          '업계 동향에 대해 어떻게 생각하세요?',
          '도전적인 프로젝트 경험이 있으신가요?',
          '앞으로의 계획이나 목표가 있으시다면?'
        ],
        context: 'business',
        icon: '🤝'
      },
      {
        mode: 'casual',
        title: '취미 모임에서',
        examples: [
          '이 취미를 언제부터 시작하셨어요?',
          '어떤 점이 가장 재밌어요?',
          '초보자에게 조언해주신다면?',
          '관련된 커뮤니티나 모임 있나요?'
        ],
        context: 'hobby',
        icon: '🎨'
      },
      {
        mode: 'casual',
        title: '그룹 대화 참여',
        examples: [
          '흥미로운 이야기네요',
          '저도 비슷한 경험이 있어요',
          '다른 분들은 어떻게 생각하세요?',
          '좀 더 자세히 듣고 싶어요'
        ],
        context: 'group',
        icon: '👥'
      },
      {
        mode: 'professional',
        title: '연락처 교환',
        examples: [
          '연락처를 교환해도 될까요?',
          '다음에 또 만날 기회가 있으면 좋겠어요',
          '관련해서 더 이야기 나눠보고 싶어요',
          '도움이 될 만한 정보가 있으면 공유해드릴게요'
        ],
        context: 'exchange',
        icon: '📇'
      }
    ];
  }

  /**
   * 가족 간 대화 주제
   */
  getFamilyTopics() {
    return [
      {
        mode: 'intimate',
        title: '부모님과 대화',
        examples: [
          '요즘 어떻게 지내세요?',
          '건강은 괜찮으시죠?',
          '젊었을 때 이야기 들려주세요',
          '제가 도울 일이 있으면 말씀해주세요'
        ],
        relationship: 'parent',
        icon: '👨‍👩‍👧‍👦'
      },
      {
        mode: 'casual',
        title: '형제자매와 대화',
        examples: [
          '요즘 뭐하고 지내?',
          '추억 이야기 해볼까?',
          '서로 도울 일 있으면 언제든 말해',
          '가족 모임 언제 할까?'
        ],
        relationship: 'sibling',
        icon: '👫'
      },
      {
        mode: 'intimate',
        title: '자녀와 대화',
        examples: [
          '오늘 하루는 어땠어?',
          '학교에서 재밌는 일 있었어?',
          '궁금한 거 있으면 언제든 물어봐',
          '같이 시간 보낼까?'
        ],
        relationship: 'child',
        icon: '👨‍👧‍👦'
      },
      {
        mode: 'casual',
        title: '친척들과 대화',
        examples: [
          '안녕하세요! 오랜만이에요',
          '가족들은 모두 잘 지내시죠?',
          '근황이 궁금해요',
          '다음에 또 만나요'
        ],
        relationship: 'relative',
        icon: '🏠'
      },
      {
        mode: 'intimate',
        title: '깊은 가족 대화',
        examples: [
          '우리 가족의 소중함을 느껴요',
          '서로에게 고마운 마음을 전하고 싶어요',
          '가족으로서 더 잘할 수 있는 방법이 있을까요?',
          '앞으로도 계속 함께 해요'
        ],
        relationship: 'all',
        icon: '❤️'
      }
    ];
  }

  /**
   * 관계별 가이드라인
   */
  getRelationshipGuidelines(relationshipType) {
    const guidelines = {
      [this.relationshipTypes.GENERATION]: [
        '상대방의 세대적 특성을 이해하고 존중하세요',
        '공통 관심사를 찾아 대화의 접점을 만드세요',
        '서로 다른 관점을 배울 기회로 생각하세요',
        '판단보다는 이해하려는 자세를 유지하세요'
      ],
      [this.relationshipTypes.WORKPLACE]: [
        '업무 상황과 위치에 맞는 적절한 톤을 유지하세요',
        '개인적인 이야기와 업무적인 이야기를 구분하세요',
        '상대방의 시간을 존중하며 효율적으로 대화하세요',
        '건설적이고 협력적인 분위기를 만드세요'
      ],
      [this.relationshipTypes.NETWORKING]: [
        '진정성 있는 관심을 보이며 인위적이지 않게 하세요',
        '상대방에 대해 먼저 알아가려는 자세를 보이세요',
        '자신만 이야기하지 말고 균형잡힌 대화를 하세요',
        '장기적인 관계 구축을 염두에 두고 대화하세요'
      ],
      [this.relationshipTypes.FAMILY]: [
        '가족 간의 사랑과 관심을 표현하는 것을 주저하지 마세요',
        '세대 차이를 인정하고 서로를 이해하려 노력하세요',
        '가족만의 추억과 전통을 소중히 여기세요',
        '솔직하되 상처주지 않는 방식으로 소통하세요'
      ]
    };

    return guidelines[relationshipType] || guidelines[this.relationshipTypes.GENERATION];
  }

  /**
   * 관계별 에티켓
   */
  getRelationshipEtiquette(relationshipType) {
    const etiquette = {
      [this.relationshipTypes.GENERATION]: [
        '나이나 세대를 이유로 무시하거나 판단하지 마세요',
        '상대방의 경험과 지혜를 인정해주세요',
        '새로운 것을 거부하는 태도는 피해주세요',
        '상호 존중하는 분위기를 만들어주세요'
      ],
      [this.relationshipTypes.WORKPLACE]: [
        '회사 위계질서를 인식하되 과도하지 않게 하세요',
        '개인적인 문제는 업무에 영향주지 않게 주의하세요',
        '동료들과의 갈등은 전문적으로 해결하세요',
        '기밀정보나 뒷담화는 피해주세요'
      ],
      [this.relationshipTypes.NETWORKING]: [
        '상대방을 이용하려는 의도를 드러내지 마세요',
        '명함을 주고받을 때는 정중하게 하세요',
        '약속한 연락이나 만남은 반드시 지키세요',
        '다른 사람과의 관계를 소개할 때는 신중하게 하세요'
      ],
      [this.relationshipTypes.FAMILY]: [
        '가족 내 사생활은 존중해주세요',
        '다른 가족 구성원에 대한 험담은 피해주세요',
        '가족 모임에서는 화합을 우선시하세요',
        '경제적인 문제는 신중하게 접근하세요'
      ]
    };

    return etiquette[relationshipType] || etiquette[this.relationshipTypes.GENERATION];
  }

  /**
   * 관계 제목 반환
   */
  getRelationshipTitle(relationshipType) {
    const titles = {
      [this.relationshipTypes.GENERATION]: '세대별 대화',
      [this.relationshipTypes.WORKPLACE]: '직장 내 소통',
      [this.relationshipTypes.NETWORKING]: '모임 & 네트워킹',
      [this.relationshipTypes.FAMILY]: '가족 간 대화'
    };

    return titles[relationshipType] || '세대별 대화';
  }

  /**
   * 대화 모드 제목 반환
   */
  getModeTitle(mode) {
    const titles = {
      [this.conversationModes.FORMAL]: '격식있는 대화',
      [this.conversationModes.CASUAL]: '편안한 대화',
      [this.conversationModes.PROFESSIONAL]: '전문적인 대화',
      [this.conversationModes.INTIMATE]: '친밀한 대화'
    };

    return titles[mode] || '편안한 대화';
  }

  /**
   * 상황별 대화 전략
   * @param {string} situation - 상황 (meeting, conflict, celebration, etc.)
   * @returns {Object} 상황별 전략 가이드
   */
  getSituationStrategy(situation) {
    const strategies = {
      meeting: {
        title: '회의에서의 대화법',
        beforeMeeting: [
          '안건을 미리 검토하고 준비하세요',
          '참석자들의 입장을 파악해보세요',
          '명확한 목표를 설정하세요'
        ],
        duringMeeting: [
          '적극적으로 경청하세요',
          '건설적인 의견을 제시하세요',
          '다른 사람의 의견을 존중하세요',
          '구체적인 액션 아이템을 제안하세요'
        ],
        afterMeeting: [
          '결정사항을 다시 한번 확인하세요',
          '필요시 추가 논의를 제안하세요',
          '후속 조치에 대해 소통하세요'
        ]
      },
      conflict: {
        title: '갈등 상황 대화법',
        preparation: [
          '감정을 진정시키고 객관적으로 생각하세요',
          '상대방의 입장을 이해하려 노력하세요',
          '해결 방안을 미리 생각해보세요'
        ],
        conversation: [
          '"나" 메시지로 표현하세요',
          '상대방의 말을 끝까지 들어주세요',
          '감정적인 반응보다는 사실에 집중하세요',
          '해결책을 함께 찾아보세요'
        ],
        resolution: [
          '타협점을 찾아보세요',
          '앞으로의 개선사항을 약속하세요',
          '관계 회복을 위해 노력하세요'
        ]
      },
      celebration: {
        title: '축하 자리에서의 대화법',
        greetings: [
          '진심어린 축하 인사를 건네세요',
          '구체적인 성취에 대해 언급하세요',
          '상대방의 노력을 인정해주세요'
        ],
        conversation: [
          '긍정적이고 밝은 에너지를 유지하세요',
          '관련된 좋은 경험을 공유하세요',
          '미래에 대한 응원을 표현하세요',
          '자연스럽게 분위기를 즐기세요'
        ]
      }
    };

    return strategies[situation] || strategies.meeting;
  }

  /**
   * 문화적 배경 고려 대화법
   * @param {string} culture - 문화권 (korean, western, eastern, etc.)
   * @returns {Object} 문화별 대화 가이드
   */
  getCulturalGuidelines(culture) {
    const culturalGuides = {
      korean: {
        title: '한국 문화 대화법',
        honorifics: [
          '나이와 지위에 따른 존댓말 사용',
          '어른에게는 정중한 태도 유지',
          '상하관계를 인식한 대화'
        ],
        customs: [
          '술자리에서의 예의 지키기',
          '선후배 관계 인정하기',
          '체면을 고려한 대화',
          '간접적인 표현 선호'
        ]
      },
      western: {
        title: '서구 문화 대화법',
        directness: [
          '직접적이고 명확한 의사표현',
          '개인의 의견을 당당하게 표현',
          '논리적인 근거 제시'
        ],
        customs: [
          '개인주의적 가치 존중',
          '평등한 관계 인식',
          '효율성과 시간 중시',
          '프라이버시 존중'
        ]
      }
    };

    return culturalGuides[culture] || culturalGuides.korean;
  }
}

export default RelationshipConversationService;