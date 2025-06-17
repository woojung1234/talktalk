import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, Share, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useServices } from '../contexts/ServicesContext';

const ResultScreen = ({ navigation, route }) => {
  const { conversationData } = route.params;
  const { unifiedConversationService } = useServices();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(conversationData.generatedTopic);

  const generateNewTopic = async () => {
    setIsGenerating(true);
    try {
      const newTopic = await unifiedConversationService.generateSingleConversationTopic('unified', {
        relationship: conversationData.relationship || '친구',
        situation: conversationData.context || '일상 대화',
        userAge: conversationData.userAge,
        targetAge: conversationData.targetAge,
        mood: conversationData.mood
      });
      setCurrentTopic(newTopic);
    } catch (error) {
      Alert.alert('오류', '새로운 대화 주제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareConversation = async () => {
    if (!currentTopic) { Alert.alert('알림', '공유할 내용이 없습니다.'); return; }
    try {
      const shareContent = `TalkTalk 추천 대화\n\n💬 ${currentTopic.category}\n"${currentTopic.example}"\n\n💡 팁: ${currentTopic.tip}`;
      await Share.share({ message: shareContent, title: 'TalkTalk 추천 대화' });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const renderUserInfo = () => (
    <Animatable.View animation="fadeIn" delay={200} style={styles.infoCard}>
      <Text style={styles.infoTitle}>입력한 정보</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}><Ionicons name="person-outline" size={16} color="#64748b" /><Text style={styles.infoText}>나: {conversationData.userAge}세</Text></View>
        <View style={styles.infoItem}><Ionicons name="people-outline" size={16} color="#64748b" /><Text style={styles.infoText}>상대: {conversationData.targetAge}세</Text></View>
        {conversationData.relationship && (<View style={styles.infoItem}><Ionicons name="heart-outline" size={16} color="#64748b" /><Text style={styles.infoText}>관계: {conversationData.relationship}</Text></View>)}
        <View style={styles.infoItem}><Ionicons name="happy-outline" size={16} color="#64748b" /><Text style={styles.infoText}>분위기: {conversationData.mood}</Text></View>
      </View>
      {conversationData.context && (<View style={styles.contextContainer}><Text style={styles.contextLabel}>상황:</Text><Text style={styles.contextText}>{conversationData.context}</Text></View>)}
    </Animatable.View>
  );

  const renderConversationTopic = () => {
    if (!currentTopic) return null;
    return (
      <Animatable.View animation="fadeInUp" delay={300} style={styles.topicCard}>
        <View style={styles.topicHeader}>
          <View style={styles.topicTitleContainer}><Text style={styles.topicIcon}>{currentTopic.icon}</Text><Text style={styles.topicCategory}>{currentTopic.category}</Text></View>
          <TouchableOpacity onPress={shareConversation} style={styles.shareButton}><Ionicons name="share-outline" size={20} color="#667eea" /></TouchableOpacity>
        </View>
        <View style={styles.topicContent}><Text style={styles.topicLabel}>💬 추천 대화</Text><Text style={styles.topicExample}>"{currentTopic.example}"</Text><Text style={styles.tipLabel}>💡 사용 팁</Text><Text style={styles.topicTip}>{currentTopic.tip}</Text></View>
      </Animatable.View>
    );
  };

  const renderActionButtons = () => (
    <Animatable.View animation="fadeInUp" delay={500} style={styles.actionContainer}>
      <TouchableOpacity style={[styles.actionButton, styles.generateButton]} onPress={generateNewTopic} disabled={isGenerating}>
        <LinearGradient colors={isGenerating ? ['#94a3b8', '#64748b'] : ['#667eea', '#764ba2']} style={styles.buttonGradient}><Ionicons name={isGenerating ? "hourglass-outline" : "refresh-outline"} size={20} color="white" /><Text style={styles.buttonText}>{isGenerating ? '생성 중...' : '새로운 주제 생성'}</Text></LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.homeButton]} onPress={() => navigation.navigate('Home')}><View style={styles.homeButtonContent}><Ionicons name="home-outline" size={20} color="#667eea" /><Text style={styles.homeButtonText}>홈으로 돌아가기</Text></View></TouchableOpacity>
    </Animatable.View>
  );

  const renderTips = () => (
    <Animatable.View animation="fadeInUp" delay={600} style={styles.tipsContainer}>
      <Text style={styles.tipsTitle}>📚 대화 성공 꿀팁</Text>
      <View style={styles.tipItem}><Text style={styles.tipNumber}>1</Text><Text style={styles.tipText}>상대방의 답변에 진심으로 관심을 보이세요</Text></View>
      <View style={styles.tipItem}><Text style={styles.tipNumber}>2</Text><Text style={styles.tipText}>자연스럽게 자신의 이야기도 조금씩 섞어주세요</Text></View>
      <View style={styles.tipItem}><Text style={styles.tipNumber}>3</Text><Text style={styles.tipText}>반응이 좋지 않아도 다른 주제로 자연스럽게 넘어가세요</Text></View>
      <View style={styles.tipItem}><Text style={styles.tipNumber}>4</Text><Text style={styles.tipText}>대화는 주고받는 것이니 질문만 하지 말고 균형을 맞춰주세요</Text></View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <LinearGradient colors={conversationData.situation.color} style={styles.headerGradient}>
            <View style={styles.headerContent}><Ionicons name={conversationData.situation.icon} size={24} color="white" /><Text style={styles.headerTitle}>추천 대화 주제</Text></View>
            <Text style={styles.headerSubtitle}>🤖 AI가 맞춤형 대화를 생성해드렸어요!</Text>
          </LinearGradient>
        </Animatable.View>
        {renderUserInfo()}
        {renderConversationTopic()}
        {renderActionButtons()}
        {renderTips()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', },
  content: { flex: 1, },
  header: { marginBottom: 20, },
  headerGradient: { padding: 24, paddingTop: 60, },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 12, },
  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', marginTop: 8, },
  infoCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: -40, borderRadius: 16, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 16, },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', },
  infoItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 12, },
  infoText: { fontSize: 14, color: '#64748b', marginLeft: 8, },
  contextContainer: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', },
  contextLabel: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 4, },
  contextText: { fontSize: 14, color: '#64748b', lineHeight: 20, },
  topicCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: 20, borderRadius: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, },
  topicHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, },
  topicTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, },
  topicIcon: { fontSize: 24, marginRight: 12, color: '#667eea', },
  topicCategory: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', },
  shareButton: { padding: 8, },
  topicContent: { gap: 16, },
  topicLabel: { fontSize: 14, fontWeight: 'bold', color: '#667eea', marginBottom: -8, },
  topicExample: { fontSize: 16, color: '#1e293b', fontStyle: 'italic', backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#667eea', lineHeight: 24, },
  tipLabel: { fontSize: 14, fontWeight: 'bold', color: '#f59e0b', marginBottom: -8, marginTop: 8, },
  topicTip: { fontSize: 14, color: '#4b5563', lineHeight: 20, backgroundColor: '#fef3c7', padding: 12, borderRadius: 8, },
  actionContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 20, },
  actionButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 12, },
  generateButton: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginLeft: 8, },
  homeButton: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d1d5db', },
  homeButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 24, },
  homeButtonText: { fontSize: 16, fontWeight: 'bold', color: '#4b5563', marginLeft: 8, },
  tipsContainer: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 40, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, },
  tipsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 16, },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, },
  tipNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#667eea', color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center', lineHeight: 24, marginRight: 12, },
  tipText: { flex: 1, fontSize: 14, color: '#64748b', lineHeight: 20, },
});

export default ResultScreen;