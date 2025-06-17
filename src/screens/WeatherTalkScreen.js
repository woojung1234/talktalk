import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import WeatherService from '../services/WeatherService';

const { width, height } = Dimensions.get('window');

const WeatherTalkScreen = ({ navigation, route }) => {
  const [weatherTopics, setWeatherTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const { weather } = route.params || {};
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'YOUR_WEATHER_API_KEY';

  useEffect(() => {
    generateWeatherTopics();
  }, []);

  const generateWeatherTopics = async () => {
    try {
      const weatherService = new WeatherService(WEATHER_API_KEY);
      const topics = weatherService.generateWeatherTopics(weather);
      setWeatherTopics(topics);
    } catch (error) {
      console.log('Failed to generate weather topics:', error);
      // 기본 주제 설정
      setWeatherTopics([
        {
          category: 'general',
          title: '오늘의 날씨 이야기',
          suggestions: [
            '오늘 날씨 어때?',
            '날씨에 따라 기분이 달라지는 것 같아',
            '계절이 바뀌는 게 느껴져',
            '날씨 예보 봤어?'
          ],
          icon: '🌤️'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherBackground = () => {
    if (!weather) return ['#667eea', '#764ba2'];
    
    if (weather.sky === 'rainy') return ['#4facfe', '#00f2fe'];
    if (weather.sky === 'snowy') return ['#a8edea', '#fed6e3'];
    if (weather.sky === 'cloudy') return ['#667eea', '#764ba2'];
    if (weather.temperature >= 25) return ['#ff9a9e', '#fecfef'];
    if (weather.temperature <= 5) return ['#a8edea', '#fed6e3'];
    return ['#667eea', '#764ba2'];
  };

  const getWeatherIcon = () => {
    if (!weather) return '🌤️';
    
    if (weather.sky === 'rainy') return '🌧️';
    if (weather.sky === 'snowy') return '❄️';
    if (weather.sky === 'cloudy') return '☁️';
    if (weather.temperature >= 25) return '☀️';
    if (weather.temperature <= 5) return '🥶';
    return '🌤️';
  };

  const getWeatherDescription = () => {
    if (!weather) return '날씨 정보를 가져올 수 없습니다';
    
    let description = `현재 기온 ${weather.temperature}°C`;
    if (weather.humidity) {
      description += `, 습도 ${weather.humidity}%`;
    }
    if (weather.precipitation > 0) {
      description += `, 강수량 ${weather.precipitation}mm`;
    }
    return description;
  };

  const renderTopicCard = (topic, index) => (
    <Animatable.View
      key={index}
      animation="fadeInUp"
      delay={index * 200}
      style={styles.topicCard}
    >
      <TouchableOpacity
        onPress={() => setSelectedTopic(selectedTopic === index ? null : index)}
        activeOpacity={0.8}
      >
        <View style={styles.topicHeader}>
          <Text style={styles.topicIcon}>{topic.icon}</Text>
          <Text style={styles.topicTitle}>{topic.title}</Text>
          <Ionicons 
            name={selectedTopic === index ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#64748b" 
          />
        </View>
      </TouchableOpacity>

      {selectedTopic === index && (
        <Animatable.View animation="fadeInDown" style={styles.suggestionContainer}>
          {topic.suggestions.map((suggestion, suggestionIndex) => (
            <TouchableOpacity
              key={suggestionIndex}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
              activeOpacity={0.7}
            >
              <View style={styles.suggestionContent}>
                <Ionicons name="chatbubble-outline" size={20} color="#667eea" />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
              <Ionicons name="copy-outline" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </Animatable.View>
      )}
    </Animatable.View>
  );

  const handleSuggestionPress = async (suggestion) => {
    try {
      await Share.share({
        message: suggestion,
        title: '날씨 대화 주제',
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={getWeatherBackground()} style={styles.loadingContainer}>
          <Animatable.View animation="pulse" iterationCount="infinite">
            <Text style={styles.loadingText}>날씨 기반 대화 주제 생성 중...</Text>
          </Animatable.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={getWeatherBackground()} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <Text style={styles.weatherIcon}>{getWeatherIcon()}</Text>
          <Text style={styles.headerTitle}>오늘의 날씨 톡</Text>
          <Text style={styles.weatherDescription}>{getWeatherDescription()}</Text>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" delay={300}>
          <Text style={styles.sectionTitle}>
            날씨에 맞는 대화 주제 {weatherTopics.length}개
          </Text>
          <Text style={styles.sectionDescription}>
            현재 날씨 상황에 최적화된 대화 주제를 추천해드려요
          </Text>
        </Animatable.View>

        <View style={styles.topicsContainer}>
          {weatherTopics.map((topic, index) => renderTopicCard(topic, index))}
        </View>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.tipsContainer}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={24} color="#f59e0b" />
            <Text style={styles.tipTitle}>날씨 대화 팁</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              🌡️ 온도 차이를 언급하면 자연스럽게 대화가 시작돼요
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              ☔ 비 오는 날엔 실내 활동이나 추억 이야기가 좋아요
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              ☀️ 맑은 날엔 야외 활동이나 계획 세우기 대화를 추천해요
            </Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.footer}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={generateWeatherTopics}
          >
            <LinearGradient 
              colors={['#667eea', '#764ba2']} 
              style={styles.refreshGradient}
            >
              <Ionicons name="refresh-outline" size={20} color="white" />
              <Text style={styles.refreshText}>새로운 주제 생성</Text>
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
  weatherIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  weatherDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
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
  suggestionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 12,
  },
  tipItem: {
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footer: {
    marginBottom: 40,
  },
  refreshButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  refreshGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WeatherTalkScreen;