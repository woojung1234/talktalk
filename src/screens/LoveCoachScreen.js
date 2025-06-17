import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import LoveCoachService from '../services/LoveCoachService';

const { width, height } = Dimensions.get('window');

const LoveCoachScreen = ({ navigation }) => {
  const [selectedStage, setSelectedStage] = useState('first_meet');
  const [selectedType, setSelectedType] = useState('icebreaker');
  const [loveTopics, setLoveTopics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);

  const loveCoachService = new LoveCoachService();

  const relationshipStages = [
    { id: 'first_meet', title: '첫 만남', icon: '👋', color: '#10b981' },
    { id: 'getting_know', title: '알아가는 단계', icon: '🤝', color: '#3b82f6' },
    { id: 'some', title: '썸 단계', icon: '💕', color: '#f59e0b' },
    { id: 'dating', title: '연애 단계', icon: '❤️', color: '#ef4444' },
    { id: 'long_term', title: '장기 연애', icon: '💍', color: '#8b5cf6' }
  ];

  const conversationTypes = [
    { id: 'icebreaker', title: '아이스브레이커', icon: 'snow-outline' },
    { id: 'deep_talk', title: '깊은 대화', icon: 'heart-outline' },
    { id: 'flirting', title: '플러팅', icon: 'rose-outline' },
    { id: 'conflict', title: '갈등 해결', icon: 'shield-outline' },
    { id: 'romance', title: '로맨틱', icon: 'star-outline' }
  ];

  useEffect(() => {
    generateLoveTopics();
  }, [selectedStage, selectedType]);

  const generateLoveTopics = () => {
    setLoading(true);
    try {
      const topics = loveCoachService.generateLoveTopics(selectedStage, selectedType);
      setLoveTopics(topics);
    } catch (error) {
      console.log('Failed to generate love topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStageSelector = () => (
    <View style={styles.stageSelector}>
      <Text style={styles.selectorTitle}>관계 단계를 선택하세요</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stageScroll}>
        {relationshipStages.map((stage, index) => (
          <Animatable.View key={stage.id} animation="fadeInRight" delay={index * 100}>
            <TouchableOpacity
              style={[
                styles.stageButton,
                selectedStage === stage.id && { backgroundColor: stage.color }
              ]}
              onPress={() => setSelectedStage(stage.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.stageIcon}>{stage.icon}</Text>
              <Text style={[
                styles.stageText,
                selectedStage === stage.id && styles.stageTextSelected
              ]}>
                {stage.title}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );

  const renderTypeSelector = () => (
    <View style={styles.typeSelector}>
      <Text style={styles.selectorTitle}>대화 유형을 선택하세요</Text>
      <View style={styles.typeGrid}>
        {conversationTypes.map((type, index) => (
          <Animatable.View key={type.id} animation="fadeInUp" delay={index * 100}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === type.id && styles.typeButtonSelected
              ]}
              onPress={() => setSelectedType(type.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={type.icon} 
                size={24} 
                color={selectedType === type.id ? 'white' : '#64748b'} 
              />
              <Text style={[
                styles.typeText,
                selectedType === type.id && styles.typeTextSelected
              ]}>
                {type.title}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </View>
  );

  const renderTopicCard = (topic, index) => (
    <Animatable.View
      key={index}
      animation="fadeInUp"
      delay={index * 150}
      style={styles.topicCard}
    >
      <TouchableOpacity
        onPress={() => setExpandedTopic(expandedTopic === index ? null : index)}
        activeOpacity={0.8}
      >
        <View style={styles.topicHeader}>
          <Text style={styles.topicIcon}>{topic.icon}</Text>
          <Text style={styles.topicTitle}>{topic.title}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{topic.level}</Text>
          </View>
          <Ionicons 
            name={expandedTopic === index ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#64748b" 
          />
        </View>
      </TouchableOpacity>

      {expandedTopic === index && (
        <Animatable.View animation="fadeInDown" style={styles.exampleContainer}>
          {topic.examples.map((example, exampleIndex) => (
            <TouchableOpacity
              key={exampleIndex}
              style={styles.exampleItem}
              onPress={() => handleExamplePress(example)}
              activeOpacity={0.7}
            >
              <View style={styles.exampleContent}>
                <Text style={styles.exampleText}>"{example}"</Text>
              </View>
              <Ionicons name="share-outline" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </Animatable.View>
      )}
    </Animatable.View>
  );

  const handleExamplePress = async (example) => {
    try {
      await Share.share({
        message: `"${example}"\n\n- TalkTalk 연애 코치에서`,
        title: '연애 대화 가이드',
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const renderTipsAndWarnings = () => {
    if (!loveTopics || !loveTopics.tips) return null;

    return (
      <View style={styles.adviceContainer}>
        <Animatable.View animation="fadeInLeft" style={styles.tipsSection}>
          <View style={styles.adviceHeader}>
            <Ionicons name="bulb-outline" size={24} color="#10b981" />
            <Text style={styles.adviceTitle}>💡 단계별 팁</Text>
          </View>
          {loveTopics.tips.map((tip, index) => (
            <View key={index} style={styles.adviceItem}>
              <Text style={styles.adviceText}>• {tip}</Text>
            </View>
          ))}
        </Animatable.View>

        <Animatable.View animation="fadeInRight" style={styles.warningsSection}>
          <View style={styles.adviceHeader}>
            <Ionicons name="warning-outline" size={24} color="#f59e0b" />
            <Text style={styles.adviceTitle}>⚠️ 주의사항</Text>
          </View>
          {loveTopics.warnings.map((warning, index) => (
            <View key={index} style={styles.adviceItem}>
              <Text style={styles.adviceText}>• {warning}</Text>
            </View>
          ))}
        </Animatable.View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#ff6b9d', '#c44569']} style={styles.loadingContainer}>
          <Animatable.View animation="pulse" iterationCount="infinite">
            <Text style={styles.loadingText}>연애 코치 가이드 준비 중...</Text>
          </Animatable.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ff6b9d', '#c44569']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <Text style={styles.headerIcon}>💕</Text>
          <Text style={styles.headerTitle}>연애 코치 톡</Text>
          <Text style={styles.headerSubtitle}>
            {loveTopics?.stage} - {loveTopics?.type}
          </Text>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStageSelector()}
        {renderTypeSelector()}

        {loveTopics && loveTopics.topics && (
          <Animatable.View animation="fadeIn" delay={300}>
            <Text style={styles.sectionTitle}>
              추천 대화 주제 {loveTopics.topics.length}개
            </Text>
            <Text style={styles.sectionDescription}>
              현재 관계 단계에 최적화된 대화법을 제안해드려요
            </Text>

            <View style={styles.topicsContainer}>
              {loveTopics.topics.map((topic, index) => renderTopicCard(topic, index))}
            </View>
          </Animatable.View>
        )}

        {renderTipsAndWarnings()}

        <Animatable.View animation="fadeInUp" delay={800} style={styles.footer}>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => navigation.navigate('EmergencyGuide')}
          >
            <LinearGradient 
              colors={['#ef4444', '#dc2626']} 
              style={styles.emergencyGradient}
            >
              <Ionicons name="medical-outline" size={20} color="white" />
              <Text style={styles.emergencyText}>응급 상황 대화법</Text>
            </LinearGradient>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stageSelector: {
    marginTop: 20,
    marginBottom: 30,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  stageScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  stageButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stageIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  stageText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  stageTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  typeSelector: {
    marginBottom: 30,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: (width - 60) / 3,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#ff6b9d',
  },
  typeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  typeTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 24,
  },
  topicsContainer: {
    marginBottom: 30,
  },
  topicCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  topicIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  levelBadge: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  levelText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  exampleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fef7f7',
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b9d',
  },
  exampleContent: {
    flex: 1,
  },
  exampleText: {
    fontSize: 15,
    color: '#374151',
    fontStyle: 'italic',
  },
  adviceContainer: {
    marginBottom: 30,
  },
  tipsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  warningsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 12,
  },
  adviceItem: {
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footer: {
    marginBottom: 40,
  },
  emergencyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  emergencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default LoveCoachScreen;