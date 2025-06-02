import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const situationCards = [
    {
      id: 1,
      title: '세대별 대화',
      subtitle: '20대와 50대 사이의 소통',
      icon: 'people-outline',
      color: ['#667eea', '#764ba2'],
      description: '다른 세대와 자연스럽게 대화하는 방법을 찾아보세요'
    },
    {
      id: 2,
      title: '직장 내 소통',
      subtitle: '상사, 동료와의 대화',
      icon: 'briefcase-outline',
      color: ['#f093fb', '#f5576c'],
      description: '업무 환경에서 효과적인 대화 주제를 제안받으세요'
    },
    {
      id: 3,
      title: '모임 & 네트워킹',
      subtitle: '스몰토크와 첫 만남',
      icon: 'chatbubbles-outline',
      color: ['#4facfe', '#00f2fe'],
      description: '처음 만나는 사람들과의 자연스러운 대화 시작하기'
    },
    {
      id: 4,
      title: '가족 간 대화',
      subtitle: '부모님, 자녀와의 소통',
      icon: 'home-outline',
      color: ['#43e97b', '#38f9d7'],
      description: '가족 구성원들과 더 깊이 있는 대화를 나누어보세요'
    }
  ];

  const renderSituationCard = (item, index) => (
    <Animatable.View
      key={item.id}
      animation="fadeInUp"
      delay={index * 200}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ConversationGenerator', { situation: item })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={item.color}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <Ionicons name={item.icon} size={32} color="white" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.headerTitle}>TalkTalk</Text>
          <Text style={styles.headerSubtitle}>
            AI가 추천하는 세대별 대화 주제
          </Text>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" delay={300}>
          <Text style={styles.sectionTitle}>어떤 상황에서 대화하시나요?</Text>
          <Text style={styles.sectionDescription}>
            상황을 선택하면 맞춤형 대화 주제를 추천해드려요
          </Text>
        </Animatable.View>

        <View style={styles.cardsContainer}>
          {situationCards.map((item, index) => renderSituationCard(item, index))}
        </View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.footer}>
          <View style={styles.featureContainer}>
            <Ionicons name="sparkles-outline" size={24} color="#667eea" />
            <Text style={styles.featureText}>
              실시간 트렌드 반영으로 항상 최신 대화 주제 제공
            </Text>
          </View>
          <View style={styles.featureContainer}>
            <Ionicons name="bulb-outline" size={24} color="#667eea" />
            <Text style={styles.featureText}>
              센스있는 대화 시작 방법과 팁도 함께 제공
            </Text>
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
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 30,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 30,
    lineHeight: 24,
  },
  cardsContainer: {
    marginBottom: 40,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 20,
    minHeight: 120,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  footer: {
    marginBottom: 40,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default HomeScreen;
