import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const ResultScreen = ({ navigation, route }) => {
  const { conversationData } = route.params;
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateTopics();
  }, []);

  const generateTopics = async () => {
    setIsLoading(true);
    
    // GPT API 호출 시뮬레이션 - 실제로는 여기서 OpenAI API 호출
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 더미 데이터 - 실제로는 GPT API 응답
    const mockTopics = [
      {
        id: 1,
        category: '최신 트렌드',
        title: '요즘 인기 있는 OTT 드라마',
        content: '최근 넷플릭스나 디즈니플러스에서 인기 있는 작품들에 대해 이야기해보세요. "요즘 어떤 드라마 보시나요?"라고 시작하면 자연스럽습니다.',
        tips: ['구체적인 작품명보다는 장르로 시작', '상대방의 취향을 먼저 물어보기', '스포일러 주의'],
        icon: 'tv-outline',
        color: '#3b82f6'
      },
      {
        id: 2,
        category: '업무 관련',
        title: '업계 동향과 변화',
        content: '최근 업계의 변화나 새로운 기술에 대한 생각을 나누어보세요. "요즘 AI 기술 발전이 우리 업무에 어떤 영향을 줄까요?"와 같은 질문이 좋습니다.',
        tips: ['상대방의 전문성 인정하기', '개인적인 경험담 포함', '미래 전망에 대한 의견 교환'],
        icon: 'trending-up-outline',
        color: '#10b981'
      },
      {
        id: 3,
        category: '라이프스타일',
        title: '건강 관리와 운동',
        content: '나이에 관계없이 관심이 많은 건강과 운동에 대해 이야기해보세요. "요즘 건강 관리는 어떻게 하고 계세요?"로 시작하면 좋습니다.',
        tips: ['개인적인 건강 정보는 적당히', '운동보다는 건강한 습관에 초점', '서로의 팁 공유하기'],
        icon: 'fitness-outline',
        color: '#f59e0b'
      },
      {
        id: 4,
        category: '문화생활',
        title: '주말 여가 활동',
        content: '주말이나 여가시간을 어떻게 보내는지에 대한 이야기는 세대를 불문하고 좋은 대화 주제입니다. "주말에는 보통 뭐 하시나요?"',
        tips: ['비용이 많이 드는 취미는 조심스럽게', '가족과의 시간에 대한 이야기 포함', '새로운 취미에 대한 관심 표현'],
        icon: 'calendar-outline',
        color: '#8b5cf6'
      },
      {
        id: 5,
        category: '음식 이야기',
        title: '맛집과 요리',
        content: '음식은 모든 세대가 공감할 수 있는 주제입니다. "이 근처에 맛있는 식당 아시나요?" 또는 "요즘 요리하시나요?"로 시작해보세요.',
        tips: ['지역별 맛집 정보 공유', '간단한 요리 레시피 이야기', '건강한 식습관에 대한 관심'],
        icon: 'restaurant-outline',
        color: '#ef4444'
      }
    ];
    
    setTopics(mockTopics);
    setIsLoading(false);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setString(text);
    Alert.alert('복사 완료', '클립보드에 복사되었습니다.');
  };

  const shareContent = async (topic) => {
    try {
      await Share.share({
        message: `💬 ${topic.title}\n\n${topic.content}\n\n💡 대화 팁:\n${topic.tips.map(tip => `• ${tip}`).join('\n')}\n\n📱 TalkTalk 앱에서 더 많은 대화 주제를 만나보세요!`,
        title: 'TalkTalk 대화 주제 공유'
      });
    } catch (error) {
      console.log('공유 오류:', error);
    }
  };

  const renderTopicCard = (topic, index) => (
    <Animatable.View
      key={topic.id}
      animation="fadeInUp"
      delay={index * 200}
      style={styles.topicCard}
    >
      <View style={styles.topicHeader}>
        <View style={styles.topicHeaderLeft}>
          <View style={[styles.iconContainer, { backgroundColor: topic.color + '20' }]}>
            <Ionicons name={topic.icon} size={24} color={topic.color} />
          </View>
          <View style={styles.topicHeaderText}>
            <Text style={styles.topicCategory}>{topic.category}</Text>
            <Text style={styles.topicTitle}>{topic.title}</Text>
          </View>
        </View>
        <View style={styles.topicActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => copyToClipboard(`${topic.title}\n\n${topic.content}`)}
          >
            <Ionicons name="copy-outline" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => shareContent(topic)}
          >
            <Ionicons name="share-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.topicContent}>{topic.content}</Text>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 대화 팁</Text>
        {topic.tips.map((tip, tipIndex) => (
          <Text key={tipIndex} style={styles.tipText}>• {tip}</Text>
        ))}
      </View>
    </Animatable.View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={styles.loadingIcon}
          >
            <Ionicons name="sparkles" size={48} color="#667eea" />
          </Animatable.View>
          <Text style={styles.loadingText}>AI가 맞춤 대화 주제를 생성하고 있어요...</Text>
          <Text style={styles.loadingSubtext}>
            {conversationData.userAge}세와 {conversationData.targetAge}세 간의 {conversationData.mood} 대화를 준비 중
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" style={styles.header}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>생성된 대화 주제</Text>
            <Text style={styles.summaryText}>
              {conversationData.userAge}세 ↔ {conversationData.targetAge}세 | {conversationData.relationship || '일반적인 관계'} | {conversationData.mood} 분위기
            </Text>
          </View>
        </Animatable.View>

        <View style={styles.topicsContainer}>
          {topics.map((topic, index) => renderTopicCard(topic, index))}
        </View>

        <Animatable.View animation="fadeInUp" delay={1000} style={styles.footer}>
          <TouchableOpacity
            style={styles.regenerateButton}
            onPress={generateTopics}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.buttonText}>새로운 주제 생성</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingIcon: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  topicsContainer: {
    paddingHorizontal: 20,
  },
  topicCard: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  topicHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicHeaderText: {
    flex: 1,
  },
  topicCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    lineHeight: 22,
  },
  topicActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  topicContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsContainer: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  regenerateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  homeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default ResultScreen;
