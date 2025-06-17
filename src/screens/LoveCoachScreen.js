import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import UnifiedConversationService from '../services/UnifiedConversationService';

const LoveCoachScreen = ({ navigation }) => {
  const [conversationTopic, setConversationTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState('first_meet');
  const [selectedType, setSelectedType] = useState('icebreaker');

  const conversationService = new UnifiedConversationService(process.env.OPENAI_API_KEY);

  const stages = [
    { id: 'first_meet', label: '첫 만남', icon: '👋', color: '#10b981' },
    { id: 'getting_know', label: '알아가기', icon: '🤔', color: '#3b82f6' },
    { id: 'some', label: '썸 단계', icon: '😊', color: '#f59e0b' },
    { id: 'dating', label: '연애 중', icon: '💕', color: '#ec4899' },
    { id: 'long_term', label: '장기 연애', icon: '💍', color: '#8b5cf6' },
  ];

  const types = [
    { id: 'icebreaker', label: '어색함 깨기', icon: 'ice-cream-outline' },
    { id: 'deep_talk', label: '깊은 대화', icon: 'chatbubble-ellipses-outline' },
    { id: 'flirting', label: '플러팅', icon: 'heart-outline' },
    { id: 'conflict', label: '갈등 해결', icon: 'shield-outline' },
    { id: 'romance', label: '로맨틱', icon: 'rose-outline' },
  ];

  useEffect(() => {
    generateLoveTopic();
  }, [selectedStage, selectedType]);

  const generateLoveTopic = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const topic = await conversationService.generateSingleConversationTopic('love', {
        stage: selectedStage,
        type: selectedType
      });
      setConversationTopic(topic);
    } catch (error) {
      console.error('Love topic generation failed:', error);
      setError('대화 주제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStageSelector = () => (
    <Animatable.View animation="fadeIn" delay={200} style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>연애 단계</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stageScroll}>
        {stages.map((stage) => (
          <TouchableOpacity
            key={stage.id}
            style={[
              styles.stageOption,
              selectedStage === stage.id && { 
                backgroundColor: stage.color,
                borderColor: stage.color 
              }
            ]}
            onPress={() => setSelectedStage(stage.id)}
          >
            <Text style={styles.stageEmoji}>{stage.icon}</Text>
            <Text style={[
              styles.stageLabel,
              selectedStage === stage.id && { color: 'white', fontWeight: 'bold' }
            ]}>
              {stage.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animatable.View>
  );

  const renderTypeSelector = () => (
    <Animatable.View animation="fadeIn" delay={300} style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>대화 유형</Text>
      <View style={styles.typeGrid}>
        {types.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeOption,
              selectedType === type.id && styles.selectedTypeOption
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Ionicons 
              name={type.icon} 
              size={24} 
              color={selectedType === type.id ? '#ff6b9d' : '#64748b'} 
            />
            <Text style={[
              styles.typeLabel,
              selectedType === type.id && { color: '#ff6b9d', fontWeight: 'bold' }
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animatable.View>
  );

  const renderConversationTopic = () => {
    if (isLoading) {
      return (
        <Animatable.View animation="fadeIn" style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b9d" />
          <Text style={styles.loadingText}>연애 코치 AI가 맞춤 대화를 생성 중입니다...</Text>
        </Animatable.View>
      );
    }

    if (error) {
      return (
        <Animatable.View animation="fadeIn" style={styles.errorContainer}>
          <Ionicons name="heart-dislike-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={generateLoveTopic}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </Animatable.View>
      );
    }

    if (!conversationTopic) return null;

    return (
      <Animatable.View animation="fadeInUp" delay={400} style={styles.topicCard}>
        <View style={styles.topicHeader}>
          <Text style={styles.topicIcon}>{conversationTopic.icon}</Text>
          <Text style={styles.topicCategory}>{conversationTopic.category}</Text>
        </View>
        
        <View style={styles.topicContent}>
          <Text style={styles.topicLabel}>💬 추천 대화</Text>
          <Text style={styles.topicExample}>"{conversationTopic.example}"</Text>
          
          <Text style={styles.tipLabel}>💡 사용 팁</Text>
          <Text style={styles.topicTip}>{conversationTopic.tip}</Text>
        </View>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <LinearGradient
        colors={['#ff6b9d', '#c44569']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>연애 코치 톡</Text>
          <View style={styles.placeholder} />
        </View>
        
        <Animatable.View animation="fadeIn" delay={100} style={styles.headerSubtitle}>
          <Text style={styles.subtitleText}>AI가 단계별 맞춤 연애 대화를 코칭해드려요</Text>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStageSelector()}
        {renderTypeSelector()}
        
        <Animatable.View animation="fadeIn" delay={400} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🤖 AI 연애 코치 추천</Text>
          <Text style={styles.sectionDescription}>
            선택하신 단계와 상황에 가장 적합한 대화법을 추천해드립니다
          </Text>
        </Animatable.View>

        {renderConversationTopic()}

        <Animatable.View animation="fadeInUp" delay={600} style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateLoveTopic}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#94a3b8', '#64748b'] : ['#ff6b9d', '#c44569']}
              style={styles.buttonGradient}
            >
              <Ionicons 
                name={isLoading ? "hourglass-outline" : "refresh-outline"} 
                size={20} 
                color="white" 
              />
              <Text style={styles.buttonText}>
                {isLoading ? '생성 중...' : '새로운 코칭 받기'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={700} style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💖 연애 대화 꿀팁</Text>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>1</Text>
            <Text style={styles.tipText}>상대방의 말을 끝까지 들어주고 공감해주세요</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>2</Text>
            <Text style={styles.tipText}>자신의 진솔한 이야기를 조금씩 공유해보세요</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>3</Text>
            <Text style={styles.tipText}>상대방이 관심있어 하는 주제를 기억해두세요</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>4</Text>
            <Text style={styles.tipText}>너무 급하게 진전시키려 하지 말고 천천히 접근하세요</Text>
          </View>
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
  header: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  headerSubtitle: {
    paddingHorizontal: 20,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  selectorContainer: {
    marginTop: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  stageScroll: {
    marginBottom: 10,
  },
  stageOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  stageEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  stageLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    marginBottom: 12,
  },
  selectedTypeOption: {
    borderColor: '#ff6b9d',
    backgroundColor: '#fef7f0',
  },
  typeLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
  },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 20,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  topicCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  topicIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  topicCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  topicContent: {
    gap: 16,
  },
  topicLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b9d',
    marginBottom: 4,
  },
  topicExample: {
    fontSize: 16,
    color: '#1e293b',
    fontStyle: 'italic',
    backgroundColor: '#fef7f0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b9d',
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
    marginTop: 8,
  },
  topicTip: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
  },
  actionContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b9d',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default LoveCoachScreen;