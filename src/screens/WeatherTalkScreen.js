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

const WeatherTalkScreen = ({ navigation, route }) => {
  const { weather } = route.params;
  const [conversationTopic, setConversationTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const conversationService = new UnifiedConversationService(process.env.OPENAI_API_KEY);

  useEffect(() => {
    generateWeatherTopic();
  }, []);

  const generateWeatherTopic = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const topic = await conversationService.generateSingleConversationTopic('weather', { weather });
      setConversationTopic(topic);
    } catch (error) {
      console.error('Weather topic generation failed:', error);
      setError('대화 주제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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

  const getWeatherDescription = (weather) => {
    if (!weather) return '날씨 정보 없음';
    
    let description = `${weather.temperature}°C`;
    if (weather.sky === 'rainy') description += ', 비가 내려요';
    else if (weather.sky === 'snowy') description += ', 눈이 내려요';
    else if (weather.sky === 'cloudy') description += ', 흐려요';
    else description += ', 맑아요';
    
    return description;
  };

  const renderWeatherInfo = () => (
    <Animatable.View animation="fadeIn" style={styles.weatherCard}>
      <LinearGradient
        colors={['#00d2ff', '#3a7bd5']}
        style={styles.weatherGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherIcon}>{getWeatherIcon(weather)}</Text>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTitle}>현재 날씨</Text>
            <Text style={styles.weatherDescription}>{getWeatherDescription(weather)}</Text>
          </View>
        </View>
        
        {weather.humidity && (
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetailItem}>
              <Ionicons name="water-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.weatherDetailText}>습도 {weather.humidity}%</Text>
            </View>
            {weather.precipitation > 0 && (
              <View style={styles.weatherDetailItem}>
                <Ionicons name="rainy-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherDetailText}>강수량 {weather.precipitation}mm</Text>
              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </Animatable.View>
  );

  const renderConversationTopic = () => {
    if (isLoading) {
      return (
        <Animatable.View animation="fadeIn" style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d2ff" />
          <Text style={styles.loadingText}>AI가 날씨에 맞는 대화 주제를 생성 중입니다...</Text>
        </Animatable.View>
      );
    }

    if (error) {
      return (
        <Animatable.View animation="fadeIn" style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={generateWeatherTopic}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </Animatable.View>
      );
    }

    if (!conversationTopic) return null;

    return (
      <Animatable.View animation="fadeInUp" delay={300} style={styles.topicCard}>
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
        colors={['#00d2ff', '#3a7bd5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>오늘의 날씨 톡</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderWeatherInfo()}
        
        <Animatable.View animation="fadeIn" delay={200} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🤖 AI 추천 대화 주제</Text>
          <Text style={styles.sectionDescription}>
            현재 날씨를 분석하여 가장 적절한 대화 주제를 추천해드립니다
          </Text>
        </Animatable.View>

        {renderConversationTopic()}

        <Animatable.View animation="fadeInUp" delay={500} style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateWeatherTopic}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#94a3b8', '#64748b'] : ['#00d2ff', '#3a7bd5']}
              style={styles.buttonGradient}
            >
              <Ionicons 
                name={isLoading ? "hourglass-outline" : "refresh-outline"} 
                size={20} 
                color="white" 
              />
              <Text style={styles.buttonText}>
                {isLoading ? '생성 중...' : '새로운 주제 생성'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📚 날씨 대화 꿀팁</Text>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>1</Text>
            <Text style={styles.tipText}>날씨는 누구나 공감할 수 있는 안전한 대화 주제예요</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>2</Text>
            <Text style={styles.tipText}>개인적인 느낌이나 경험을 함께 공유하면 더 자연스러워요</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>3</Text>
            <Text style={styles.tipText}>날씨에서 시작해서 계획이나 취미로 대화를 확장해보세요</Text>
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
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  weatherCard: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  weatherGradient: {
    padding: 20,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weatherDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  weatherDetailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
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
    color: '#00d2ff',
    marginBottom: 4,
  },
  topicExample: {
    fontSize: 16,
    color: '#1e293b',
    fontStyle: 'italic',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d2ff',
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
    backgroundColor: '#00d2ff',
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

export default WeatherTalkScreen;