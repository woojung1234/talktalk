import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useServices } from '../contexts/ServicesContext';

const ConversationGeneratorScreen = ({ navigation }) => {
  const { unifiedConversationService } = useServices();
  const [relationship, setRelationship] = useState('친구');
  const [situation, setSituation] = useState('가볍게 카페에서');
  const [userAge, setUserAge] = useState('20대');
  const [targetAge, setTargetAge] = useState('20대');
  const [mood, setMood] = useState('casual');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!relationship || !situation || !userAge || !targetAge || !mood) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const context = { relationship, situation, userAge, targetAge, mood };
      const topic = await unifiedConversationService.generateSingleConversationTopic('unified', context);
      
      navigation.navigate('Result', {
        conversationData: {
          ...context,
          generatedTopic: topic,
          // ResultScreen에서 사용할 situation 객체 정보 추가
          situation: {
              icon: 'chatbubbles-outline',
              color: ['#667eea', '#764ba2']
          }
        }
      });
    } catch (error) {
      console.error("Topic Generation Error:", error);
      Alert.alert('오류', '대화 주제 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>맞춤 대화 주제 생성</Text>
        <Text style={styles.description}>AI에게 상황 정보를 알려주시면, 최적의 대화 주제를 추천해드려요.</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>나와 상대의 관계는?</Text>
          <TextInput style={styles.input} value={relationship} onChangeText={setRelationship} placeholder="예: 친구, 직장 동료, 연인" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>어떤 상황인가요?</Text>
          <TextInput style={styles.input} value={situation} onChangeText={setSituation} placeholder="예: 어색한 첫 만남, 차 안에서" />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.half]}>
            <Text style={styles.label}>내 나이대</Text>
            <TextInput style={styles.input} value={userAge} onChangeText={setUserAge} placeholder="예: 20대" />
          </View>
          <View style={[styles.inputGroup, styles.half]}>
            <Text style={styles.label}>상대방 나이대</Text>
            <TextInput style={styles.input} value={targetAge} onChangeText={setTargetAge} placeholder="예: 30대" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>원하는 대화 분위기</Text>
          <View style={styles.moodContainer}>
            {['casual', 'friendly', 'professional', 'respectful'].map(m => (
              <TouchableOpacity key={m} style={[styles.moodButton, mood === m && styles.selectedMood]} onPress={() => setMood(m)}>
                <Text style={[styles.moodText, mood === m && styles.selectedMoodText]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>AI 추천 받기</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  description: { fontSize: 16, color: '#64748b', marginBottom: 30, lineHeight: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#d1d5db' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { flex: 1, marginRight: 10 },
  moodContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  moodButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#d1d5db', marginRight: 8, marginBottom: 8 },
  selectedMood: { backgroundColor: '#667eea', borderColor: '#667eea' },
  moodText: { color: '#374151' },
  selectedMoodText: { color: 'white', fontWeight: 'bold' },
  generateButton: { backgroundColor: '#667eea', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default ConversationGeneratorScreen;