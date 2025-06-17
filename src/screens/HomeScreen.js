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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import WeatherService from '../services/WeatherService';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // 기상청 API 키 (실제 사용시 환경변수로 관리)
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'YOUR_WEATHER_API_KEY';

  useEffect(() => {
    initializeWeatherService();
  }, []);

  const initializeWeatherService = async () => {
    try {
      const weatherService = new WeatherService(WEATHER_API_KEY);
      const weather = await weatherService.getCurrentWeather('서울');
      setCurrentWeather(weather);
    } catch (error) {
      console.log('Weather service initialization failed:', error);
      // 기본값으로 설정
      setCurrentWeather({ temperature: 20, sky: 'clear' });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weather) => {
    if (!weather) return '🌤️';
    
    if (weather.sky === 'rainy') return '🌧️';
    if (weather.sky === 'snowy') return '❄️';
    if (weather.sky === 'cloudy') return '☁️';
    if (weather.temperature >= 25) return '☀️';
    if (weather.temperature <= 5) return '🥶';
    return '🌤️';
  };

  const situationCards = [
    {
      id: 1,
      title: '오늘의 날씨 톡',
      subtitle: `${currentWeather?.temperature || 20}°C ${getWeatherIcon(currentWeather)}`,
      icon: 'partly-sunny-outline',
      color: ['#00d2ff', '#3a7bd5'],
      description: '실시간 날씨에 맞는 대화 주제를 AI가 추천해드려요',
      isNew: true,
      badge: 'LIVE',
      type: 'weather'
    },
    {
      id: 2,
      title: '연애 코치 톡',
      subtitle: '썸부터 연애까지 가이드',
      icon: 'heart-outline',
      color: ['#ff6b9d', '#c44569'],
      description: '단계별 연애 대화법과 상황별 멘트를 AI가 제안해드려요',
      isNew: true,
      badge: 'HOT',
      type: 'love'
    },
    {
      id: 3,
      title: '통합 대화 도우미',
      subtitle: '모든 상황에 통하는 맞춤 대화',
      icon: 'chatbubbles-outline',
      color: ['#667eea', '#764ba2'],
      description: '관계, 상황, 주제를 고려한 개인 맞춤형 대화 주제',
      type: 'unified'
    }
  ];

  const renderSituationCard = (item, index) => (
    <Animatable.View
      key={item.id}
      animation="fadeInUp"
      delay={index * 150}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={item.color}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {item.isNew && (
            <View style={[styles.badge, { backgroundColor: item.badge === 'HOT' ? '#ff4757' : '#2ed573' }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          
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

  const handleCardPress = (item) => {
    if (item.type === 'weather') {
      navigation.navigate('WeatherTalk', { weather: currentWeather });
    } else if (item.type === 'love') {
      navigation.navigate('LoveCoach');
    } else {
      navigation.navigate('ConversationGenerator', { 
        situation: item,
        conversationType: item.type
      });
    }
  };

  const renderWeatherInfo = () => {
    if (!currentWeather) return null;

    return (
      <Animatable.View animation="fadeIn" delay={200} style={styles.weatherContainer}>
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherIcon}>{getWeatherIcon(currentWeather)}</Text>
          <View style={styles.weatherTextContainer}>
            <Text style={styles.weatherTemp}>{currentWeather.temperature}°C</Text>
            <Text style={styles.weatherDesc}>실시간 날씨 기반 AI 대화 추천</Text>
          </View>
        </View>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.headerTitle}>TalkTalk</Text>
          <Text style={styles.headerSubtitle}>
            AI가 추천하는 완벽한 대화 가이드
          </Text>
        </Animatable.View>
        
        {renderWeatherInfo()}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" delay={300}>
          <Text style={styles.sectionTitle}>어떤 대화를 시작하시겠어요?</Text>
          <Text style={styles.sectionDescription}>
            AI가 상황에 맞는 완벽한 대화 주제를 추천해드립니다
          </Text>
        </Animatable.View>

        <View style={styles.cardsContainer}>
          {situationCards.map((item, index) => renderSituationCard(item, index))}
        </View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.footer}>
          <Text style={styles.footerTitle}>🤖 AI 기반 스마트 추천</Text>
          
          <View style={styles.featureContainer}>
            <Ionicons name="cloud-outline" size={24} color="#00d2ff" />
            <Text style={styles.featureText}>
              <Text style={styles.featureBold}>실시간 날씨 AI:</Text> 현재 날씨를 분석하여 적절한 대화 주제 생성
            </Text>
          </View>
          
          <View style={styles.featureContainer}>
            <Ionicons name="heart-outline" size={24} color="#ff6b9d" />
            <Text style={styles.featureText}>
              <Text style={styles.featureBold}>연애 코치 AI:</Text> 관계 단계별 맞춤 대화법과 실전 멘트 제공
            </Text>
          </View>
          
          <View style={styles.featureContainer}>
            <Ionicons name="chatbubbles-outline" size={24} color="#667eea" />
            <Text style={styles.featureText}>
              <Text style={styles.featureBold}>통합 대화 AI:</Text> 상황, 관계, 나이, 성향을 고려한 개인화 추천
            </Text>
          </View>

          <View style={styles.featureContainer}>
            <Ionicons name="sparkles-outline" size={24} color="#43e97b" />
            <Text style={styles.featureText}>
              <Text style={styles.featureBold}>스마트 학습:</Text> 사용 패턴을 학습하여 더 정확한 추천 제공
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  weatherContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  weatherTextContainer: {
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 20,
    minHeight: 130,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  featureBold: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default HomeScreen;