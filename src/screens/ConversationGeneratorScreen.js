import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import UnifiedConversationService from '../services/UnifiedConversationService';

const ConversationGeneratorScreen = ({ navigation, route }) => {
  const { situation } = route.params;
  const [userAge, setUserAge] = useState('');
  const [targetAge, setTargetAge] = useState('');
  const [relationship, setRelationship] = useState('');
  const [context, setContext] = useState('');
  const [selectedMood, setSelectedMood] = useState('casual');
  const [isLoading, setIsLoading] = useState(false);

  const conversationService = new UnifiedConversationService(process.env.OPENAI_API_KEY);

  const moods = [
    { id: 'casual', label: '캐주얼한', icon: 'happy-outline', color: '#10b981' },
    { id: 'professional', label: '전문적인', icon: 'business-outline', color: '#3b82f6' },
    { id: 'friendly', label: '친근한', icon: 'heart-outline', color: '#f59e0b' },
    { id: 'respectful', label: '정중한', icon: 'ribbon-outline', color: '#8b5cf6' },
  ];

  const relationshipOptions = [
    '직장 동료', '상사/부하', '가족', '친구', '처음 만나는 사람', '선후배', '기타'
  ];

  const generateConversation = async () => {
    if (!userAge || !targetAge) {
      Alert.alert('정보 입력 필요', '나이 정보를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // GPT API 호출로 단일 대화 주제 생성
      const conversationTopic = await conversationService.generateSingleConversationTopic('unified', {
        relationship: relationship || '친구',
        situation: context || '일상 대화',
        userAge,
        targetAge,
        mood: selectedMood
      });
      
      const conversationData = {
        situation,
        userAge,
        targetAge,
        relationship,
        context,
        mood: selectedMood,
        generatedTopic: conversationTopic // 단일 주제
      };

      navigation.navigate('Result', { conversationData });
    } catch (error) {
      Alert.alert('오류', '대화 주제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMoodOption = (mood) => (
    <TouchableOpacity
      key={mood.id}
      style={[
        styles.moodOption,
        selectedMood === mood.id && { ...styles.selectedMoodOption, borderColor: mood.color }
      ]}
      onPress={() => setSelectedMood(mood.id)}
    >
      <Ionicons 
        name={mood.icon} 
        size={24} 
        color={selectedMood === mood.id ? mood.color : '#64748b'} 
      />
      <Text style={[
        styles.moodLabel,
        selectedMood === mood.id && { color: mood.color, fontWeight: 'bold' }
      ]}>
        {mood.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" style={styles.header}>
          <LinearGradient
            colors={situation.color}
            style={styles.situationCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={situation.icon} size={32} color="white" />
            <View style={styles.situationInfo}>
              <Text style={styles.situationTitle}>{situation.title}</Text>
              <Text style={styles.situationSubtitle}>{situation.subtitle}</Text>
            </View>
          </LinearGradient>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>나의 나이</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 25"
              value={userAge}
              onChangeText={setUserAge}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>상대방의 나이 (추정)</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 45"
              value={targetAge}
              onChangeText={setTargetAge}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>관계</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relationshipScroll}>
              {relationshipOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.relationshipOption,
                    relationship === option && styles.selectedRelationshipOption
                  ]}
                  onPress={() => setRelationship(option)}
                >
                  <Text style={[
                    styles.relationshipText,
                    relationship === option && styles.selectedRelationshipText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionTitle}>대화 분위기</Text>
          <View style={styles.moodContainer}>
            {moods.map(renderMoodOption)}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>추가 상황 설명 (선택)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="예: 회사 워크샵에서 처음 만나게 됨, 공통 관심사 찾고 싶음"
              value={context}
              onChangeText={setContext}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </Animatable.View>
      </ScrollView>

      <Animatable.View animation="fadeInUp" delay={400} style={styles.footer}>
        <TouchableOpacity
          style={[styles.generateButton, isLoading && styles.disabledButton]}
          onPress={generateConversation}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ['#94a3b8', '#64748b'] : ['#667eea', '#764ba2']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <Ionicons name="hourglass-outline" size={20} color="white" />
                <Text style={styles.buttonText}>AI가 대화 주제 생성 중...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="sparkles" size={20} color="white" />
                <Text style={styles.buttonText}>AI 대화 주제 생성하기</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.footerNote}>🤖 AI가 상황에 맞는 맞춤형 대화 주제 1개를 생성해드립니다</Text>
      </Animatable.View>
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
  header: {
    padding: 20,
  },
  situationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  situationInfo: {
    marginLeft: 16,
    flex: 1,
  },
  situationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  situationSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  textArea: {
    height: 80,
  },
  relationshipScroll: {
    marginTop: 8,
  },
  relationshipOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    marginRight: 8,
  },
  selectedRelationshipOption: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  relationshipText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedRelationshipText: {
    color: 'white',
    fontWeight: '600',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    marginRight: 12,
    marginBottom: 12,
    minWidth: '45%',
  },
  selectedMoodOption: {
    borderWidth: 2,
  },
  moodLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.7,
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
  footerNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ConversationGeneratorScreen;