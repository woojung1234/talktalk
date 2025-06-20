import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, Alert, ActivityIndicator, Modal, FlatList, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useServices } from '../contexts/ServicesContext';

const { width, height } = Dimensions.get('window');

const WeatherTalkScreen = ({ navigation, route }) => {
  const { weather: initialWeather } = route.params || {};
  const { unifiedConversationService, weatherService } = useServices();

  const [weather, setWeather] = useState(initialWeather);
  const [selectedRegion, setSelectedRegion] = useState('전주');
  const [conversationTopic, setConversationTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regionModalVisible, setRegionModalVisible] = useState(false);

  // 지역 목록 정의
  const regions = [
    { code: '서울', name: '서울특별시', emoji: '🏢' },
    { code: '전주', name: '전라북도 전주시', emoji: '🌾' },
    { code: '부산', name: '부산광역시', emoji: '🌊' },
    { code: '대구', name: '대구광역시', emoji: '🍎' },
    { code: '인천', name: '인천광역시', emoji: '✈️' },
    { code: '광주', name: '광주광역시', emoji: '🌸' },
    { code: '대전', name: '대전광역시', emoji: '🏛️' },
    { code: '울산', name: '울산광역시', emoji: '🏭' },
    { code: '세종', name: '세종특별자치시', emoji: '🏛️' },
    { code: '제주', name: '제주특별자치도', emoji: '🌴' }
  ];

  useEffect(() => {
    if (!initialWeather) {
      loadWeatherForRegion(selectedRegion);
    } else {
      generateWeatherTopic();
    }
  }, []);

  useEffect(() => {
    if (weather) {
      generateWeatherTopic();
    }
  }, [weather]);

  const loadWeatherForRegion = async (regionCode) => {
    if (!weatherService) {
      Alert.alert('오류', '날씨 서비스를 사용할 수 없습니다.');
      return;
    }

    setIsWeatherLoading(true);
    try {
      console.log(`WeatherTalkScreen: ${regionCode} 지역 날씨 로딩 시작`);
      const newWeather = await weatherService.getCurrentWeather(regionCode);
      
      if (newWeather) {
        setWeather(newWeather);
        setSelectedRegion(regionCode);
        console.log(`WeatherTalkScreen: ${regionCode} 날씨 로딩 성공`, newWeather);
      } else {
        throw new Error('날씨 데이터를 받아오지 못했습니다.');
      }
    } catch (error) {
      console.error(`WeatherTalkScreen: ${regionCode} 날씨 로딩 실패`, error);
      Alert.alert('오류', `${regionCode} 지역의 날씨 정보를 불러오는 데 실패했습니다.`);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleRegionChange = async (regionCode) => {
    setRegionModalVisible(false);
    if (regionCode !== selectedRegion) {
      await loadWeatherForRegion(regionCode);
    }
  };

  const generateWeatherTopic = async () => {
    if (!weather) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const topic = await unifiedConversationService.generateSingleConversationTopic('weather', { weather });
      setConversationTopic(topic);
    } catch (e) {
      console.error('Weather topic generation failed:', e);
      setError('대화 주제 생성 중 오류가 발생했습니다.');
      setConversationTopic(unifiedConversationService.getSingleFallbackTopic('weather'));
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (w) => {
    if (!w) return '🌤️';
    if (w.sky === 'rainy') return '🌧️';
    if (w.sky === 'snowy') return '❄️';
    if (w.sky === 'cloudy') return '☁️';
    if (w.sky === 'overcast') return '☁️';
    if (w.temperature >= 25) return '☀️';
    if (w.temperature <= 5) return '🥶';
    return '🌤️';
  };

  const getWeatherDescription = (w) => {
    if (!w) return '날씨 정보 없음';
    let description = `${w.temperature}°C`;
    if (w.sky === 'rainy') description += ', 비가 와요';
    else if (w.sky === 'snowy') description += ', 눈이 와요';
    else if (w.sky === 'cloudy') description += ', 흐려요';
    else if (w.sky === 'overcast') description += ', 흐려요';
    else description += ', 맑아요';
    return description;
  };

  const getCurrentRegionInfo = () => {
    return regions.find(region => region.code === selectedRegion) || regions[1]; // 기본값: 전주
  };

  const renderRegionSelector = () => {
    const currentRegion = getCurrentRegionInfo();
    
    return (
      <TouchableOpacity 
        style={styles.regionSelector} 
        onPress={() => setRegionModalVisible(true)}
        disabled={isWeatherLoading}
      >
        <View style={styles.regionInfo}>
          <Text style={styles.regionEmoji}>{currentRegion.emoji}</Text>
          <View style={styles.regionTextContainer}>
            <Text style={styles.regionName}>{currentRegion.name}</Text>
            <Text style={styles.regionLabel}>지역 변경하기</Text>
          </View>
        </View>
        {isWeatherLoading ? (
          <ActivityIndicator size="small" color="#00d2ff" />
        ) : (
          <Ionicons name="chevron-down" size={20} color="#00d2ff" />
        )}
      </TouchableOpacity>
    );
  };

  const renderRegionModal = () => {
    const renderRegionItem = ({ item, index }) => {
      const isSelected = item.code === selectedRegion;
      
      return (
        <Animatable.View 
          animation="fadeInUp" 
          delay={index * 50}
          style={[styles.regionItem, isSelected && styles.selectedRegionItem]}
        >
          <TouchableOpacity
            style={styles.regionItemContent}
            onPress={() => handleRegionChange(item.code)}
            disabled={isSelected}
          >
            <Text style={styles.regionItemEmoji}>{item.emoji}</Text>
            <View style={styles.regionItemTextContainer}>
              <Text style={[styles.regionItemName, isSelected && styles.selectedRegionText]}>
                {item.name}
              </Text>
              <Text style={[styles.regionItemCode, isSelected && styles.selectedRegionSubtext]}>
                {item.code}
              </Text>
            </View>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={24} color="#00d2ff" />
            )}
          </TouchableOpacity>
        </Animatable.View>
      );
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={regionModalVisible}
        onRequestClose={() => setRegionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>지역 선택</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setRegionModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={regions}
              renderItem={renderRegionItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              style={styles.regionList}
            />
          </View>
        </View>
      </Modal>
    );
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
          {weather?.isMockData && (
            <View style={styles.mockDataBadge}>
              <Text style={styles.mockDataText}>DEMO</Text>
            </View>
          )}
        </View>
        {weather?.humidity && (
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
            {weather.windSpeed && (
              <View style={styles.weatherDetailItem}>
                <Ionicons name="cloudy-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherDetailText}>풍속 {weather.windSpeed}m/s</Text>
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
          <Text style={styles.loadingText}>
            AI가 {getCurrentRegionInfo().name}의 날씨에 맞는 대화 주제를 생성 중입니다...
          </Text>
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

  if (!weather && !isWeatherLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#00d2ff', '#3a7bd5']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>오늘의 날씨 톡</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 지역 선택기 */}
        <Animatable.View animation="fadeInDown" delay={100}>
          {renderRegionSelector()}
        </Animatable.View>

        {/* 날씨 정보 */}
        {weather && renderWeatherInfo()}
        
        {/* 로딩 중일 때 */}
        {isWeatherLoading && (
          <Animatable.View animation="fadeIn" style={styles.weatherLoadingContainer}>
            <ActivityIndicator size="large" color="#00d2ff" />
            <Text style={styles.weatherLoadingText}>
              {getCurrentRegionInfo().name}의 날씨 정보를 불러오는 중...
            </Text>
          </Animatable.View>
        )}

        {/* AI 추천 대화 주제 섹션 */}
        {weather && !isWeatherLoading && (
          <>
            <Animatable.View animation="fadeIn" delay={200} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🤖 AI 추천 대화 주제</Text>
              <Text style={styles.sectionDescription}>
                {getCurrentRegionInfo().name}의 현재 날씨를 분석하여 가장 적절한 대화 주제를 추천해드립니다
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
          </>
        )}

        {/* 팁 섹션 */}
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

      {/* 지역 선택 모달 */}
      {renderRegionModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 60, paddingBottom: 16 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  
  // 지역 선택기 스타일
  regionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  regionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  regionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  regionTextContainer: {
    flex: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  regionLabel: {
    fontSize: 12,
    color: '#00d2ff',
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalCloseButton: {
    padding: 4,
  },
  regionList: {
    padding: 20,
  },
  regionItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  selectedRegionItem: {
    backgroundColor: '#e0f2fe',
    borderWidth: 2,
    borderColor: '#00d2ff',
  },
  regionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  regionItemEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  regionItemTextContainer: {
    flex: 1,
  },
  regionItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  regionItemCode: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedRegionText: {
    color: '#0284c7',
  },
  selectedRegionSubtext: {
    color: '#0284c7',
  },

  // 날씨 로딩 스타일
  weatherLoadingContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 20,
  },
  weatherLoadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },

  // 기존 스타일들
  weatherCard: { marginTop: 20, borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  weatherGradient: { padding: 20 },
  weatherHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, position: 'relative' },
  weatherIcon: { fontSize: 32, marginRight: 16 },
  weatherInfo: { flex: 1 },
  weatherTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  weatherDescription: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  mockDataBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mockDataText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherDetails: { flexDirection: 'row', flexWrap: 'wrap' },
  weatherDetailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 },
  weatherDetailText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginLeft: 4 },
  sectionHeader: { marginTop: 30, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  sectionDescription: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  loadingContainer: { alignItems: 'center', padding: 40, backgroundColor: 'white', borderRadius: 16 },
  loadingText: { marginTop: 16, fontSize: 14, color: '#64748b', textAlign: 'center' },
  errorContainer: { alignItems: 'center', padding: 40, backgroundColor: 'white', borderRadius: 16 },
  errorText: { marginTop: 16, marginBottom: 20, fontSize: 14, color: '#64748b', textAlign: 'center' },
  retryButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#ef4444', borderRadius: 8 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  topicCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  topicIcon: { fontSize: 24, marginRight: 12 },
  topicCategory: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  topicContent: { gap: 16 },
  topicLabel: { fontSize: 14, fontWeight: 'bold', color: '#00d2ff', marginBottom: -8 },
  topicExample: { fontSize: 16, color: '#1e293b', fontStyle: 'italic', backgroundColor: '#f1f5f9', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#00d2ff', lineHeight: 24 },
  tipLabel: { fontSize: 14, fontWeight: 'bold', color: '#f59e0b', marginBottom: -8, marginTop: 8 },
  topicTip: { fontSize: 14, color: '#4b5563', lineHeight: 20, backgroundColor: '#fef3c7', padding: 12, borderRadius: 8 },
  actionContainer: { marginTop: 30, marginBottom: 20 },
  generateButton: { borderRadius: 12, overflow: 'hidden' },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginLeft: 8 },
  tipsContainer: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 40 },
  tipsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  tipNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#00d2ff', color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center', lineHeight: 24, marginRight: 12 },
  tipText: { flex: 1, fontSize: 14, color: '#64748b', lineHeight: 20 },
});

export default WeatherTalkScreen;