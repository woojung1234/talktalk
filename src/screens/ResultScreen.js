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
import ConversationAI from '../services/ConversationAI';

const ResultScreen = ({ navigation, route }) => {
  const { conversationData } = route.params;
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateTopics();
  }, []);

  const generateTopics = async () => {
    console.log('🎬 ResultScreen generateTopics 시작');
    setIsLoading(true);
    
    try {
      // 실제 GPT API 호출
      console.log('📞 ConversationAI.generateConversationTopics 호출 중...');
      const generatedTopics = await ConversationAI.generateConversationTopics(conversationData);
      
      console.log('📦 받은 주제 데이터:', generatedTopics);
      console.log('📊 주제 개수:', generatedTopics.length);
      console.log('🔍 첫 번째 주제:', generatedTopics[0]);
      
      setTopics(generatedTopics);
      console.log('✅ setTopics 완료');
      
    } catch (error) {
      console.error('❌ 대화 주제 생성 오류:', error);
      Alert.alert(
        '오류', 
        'AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.',
        [
          { text: '기본 주제 보기', onPress: () => loadFallbackTopics() },
          { text: '다시 시도', onPress: () => generateTopics() }
        ]
      );
    } finally {
      setIsLoading(false);
      console.log('🏁 generateTopics 완료, isLoading:', false);
    }
  };

  const loadFallbackTopics = () => {
    console.log('🔄 기본 주제 로드');
    const fallbackTopics = ConversationAI.getFallbackTopics(conversationData);
    setTopics(fallbackTopics);
    console.log('📝 기본 주제 설정 완료:', fallbackTopics.length);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
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

  const renderTopicCard = (topic, index) => {
    console.log(`🎨 렌더링 중: 주제 ${index + 1}`, topic.title);
    
    return (
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
  };

  console.log('🖼️ ResultScreen 렌더링 중');
  console.log('⏳ isLoading:', isLoading);
  console.log('📋 topics 길이:', topics.length);

  if (isLoading) {
    console.log('⌛ 로딩 화면 표시');
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

  console.log('🎯 메인 화면 표시, 주제 개수:', topics.length);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" style={styles.header}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>🤖 AI 추천 대화 주제 ({topics.length}개)</Text>
            <Text style={styles.summaryText}>
              {conversationData.userAge}세 ↔ {conversationData.targetAge}세 | {conversationData.relationship || '일반적인 관계'} | {conversationData.mood} 분위기
            </Text>
          </View>
        </Animatable.View>

        <View style={styles.topicsContainer}>
          {topics.length > 0 ? (
            topics.map((topic, index) => renderTopicCard(topic, index))
          ) : (
            <View style={styles.noTopicsContainer}>
              <Text style={styles.noTopicsText}>주제를 불러오는 중입니다...</Text>
            </View>
          )}
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
                <Text style={styles.buttonText}>새로운 AI 주제 생성</Text>
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
  noTopicsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noTopicsText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
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
