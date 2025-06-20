import axios from 'axios';

// HTTPS 사용으로 변경
const API_BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

class WeatherService {
  constructor(serviceKey) {
    this.serviceKey = serviceKey;
    this.locationCoords = {
      서울: { nx: 60, ny: 127 },
      전주: { nx: 63, ny: 89 },
      부산: { nx: 98, ny: 76 },
      대구: { nx: 89, ny: 90 },
      인천: { nx: 55, ny: 124 },
      광주: { nx: 58, ny: 74 },
      대전: { nx: 67, ny: 100 },
      울산: { nx: 102, ny: 84 },
      세종: { nx: 66, ny: 103 },
      제주: { nx: 52, ny: 38 }
    };
  }

  async getCurrentWeather(city = '전주') {
    // 배포 환경에서 더 안전한 방식으로 API 키 확인
    const isApiKeyValid = this.serviceKey && 
                         this.serviceKey !== 'YOUR_WEATHER_API_KEY' && 
                         this.serviceKey.length > 10 && 
                         !this.serviceKey.includes('undefined') &&
                         !this.serviceKey.includes('null');
    
    if (!isApiKeyValid) {
      console.log('WeatherService: API 키가 없거나 유효하지 않아 Mock 데이터를 사용합니다.', {
        hasKey: !!this.serviceKey,
        keyLength: this.serviceKey?.length || 0,
        keyPreview: this.serviceKey ? this.serviceKey.substring(0, 10) + '...' : 'none'
      });
      return this.getMockWeatherData();
    }

    try {
      const coords = this.locationCoords[city] || this.locationCoords['서울'];
      const now = new Date();
      const baseDate = this.formatDate(now);
      const baseTime = this.getBaseTime(now);

      // 네트워크 요청 전 로그
      console.log('WeatherService: API 요청 시작', {
        city,
        coords,
        baseDate,
        baseTime,
        apiKeyPreview: this.serviceKey.substring(0, 10) + '...'
      });

      const url = `${API_BASE_URL}/getUltraSrtNcst`;
      const params = {
        serviceKey: decodeURIComponent(this.serviceKey),
        numOfRows: 10,
        pageNo: 1,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: coords.nx,
        ny: coords.ny
      };

      // 타임아웃 및 재시도 로직 추가
      const response = await this.makeRequestWithRetry(url, params, 3);
      
      console.log('WeatherService: API 응답 수신', {
        status: response.status,
        resultCode: response.data?.response?.header?.resultCode,
        resultMsg: response.data?.response?.header?.resultMsg,
        hasItems: !!response.data?.response?.body?.items?.item
      });
      
      if (response.data?.response?.header?.resultCode === '00' && 
          response.data.response.body?.items?.item) {
        const weatherData = this.parseWeatherData(response.data.response.body.items.item);
        console.log('WeatherService: 실제 날씨 데이터 파싱 성공', weatherData);
        return weatherData;
      }
      
      console.warn('WeatherService: API에서 유효한 데이터를 받지 못했습니다. Mock 데이터로 대체합니다.', {
        resultCode: response.data?.response?.header?.resultCode,
        resultMsg: response.data?.response?.header?.resultMsg
      });
      return this.getMockWeatherData();

    } catch (error) {
      console.error('WeatherService: API 호출 중 오류 발생', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        isNetworkError: error.code === 'NETWORK_ERROR' || !error.response
      });
      return this.getMockWeatherData();
    }
  }

  /**
   * 재시도 로직을 포함한 HTTP 요청
   */
  async makeRequestWithRetry(url, params, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`WeatherService: API 요청 시도 ${attempt}/${maxRetries}`);
        
        const response = await axios.get(url, { 
          params,
          timeout: 10000, // 10초 타임아웃
          headers: {
            'User-Agent': 'TalkTalk-Weather-App/1.0',
            'Accept': 'application/json'
          }
        });
        
        return response;
      } catch (error) {
        lastError = error;
        console.warn(`WeatherService: 시도 ${attempt} 실패`, {
          message: error.message,
          status: error.response?.status
        });
        
        // 마지막 시도가 아니면 잠시 대기
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * [API 데이터 생성 시간 고려] 더 안전한 시간 계산
   */
  getBaseTime(date) {
    let hour = date.getHours();
    const minute = date.getMinutes();
    
    // API 데이터는 매시 40분에 업데이트되므로, 50분 전에는 이전 시간 데이터 요청
    if (minute < 50) {
      hour = hour === 0 ? 23 : hour - 1;
    }
    
    return String(hour).padStart(2, '0') + '00';
  }

  /**
   * 배포 환경에서도 안정적인 Mock 데이터 생성
   */
  getMockWeatherData() {
    const now = new Date();
    const hour = now.getHours();
    const season = this.getCurrentSeason(now);
    
    // 계절별 기본 온도 설정
    let baseTemp;
    switch (season) {
      case 'spring': baseTemp = (hour >= 6 && hour < 18) ? 18 : 12; break;
      case 'summer': baseTemp = (hour >= 6 && hour < 18) ? 28 : 22; break;
      case 'autumn': baseTemp = (hour >= 6 && hour < 18) ? 20 : 15; break;
      case 'winter': baseTemp = (hour >= 6 && hour < 18) ? 8 : 2; break;
      default: baseTemp = (hour >= 6 && hour < 18) ? 20 : 15;
    }
    
    const weatherConditions = ['clear', 'cloudy', 'rainy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const mockData = {
      temperature: baseTemp + Math.floor(Math.random() * 6 - 3), // -3도 ~ +3도 변동
      precipitation: randomCondition === 'rainy' ? (Math.random() * 2).toFixed(1) : 0,
      humidity: 45 + Math.floor(Math.random() * 30), // 45-75%
      windSpeed: (Math.random() * 4 + 0.5).toFixed(1), // 0.5-4.5 m/s
      sky: randomCondition
    };
    
    console.log('WeatherService: Mock 데이터 생성', {
      season,
      hour,
      data: mockData
    });
    
    return mockData;
  }

  getCurrentSeason(date) {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  parseWeatherData(items) {
    const weatherData = {};
    
    items.forEach(item => {
      const { category, obsrValue } = item;
      const value = parseFloat(obsrValue);
      
      switch (category) {
        case 'T1H': // 기온
          weatherData.temperature = value;
          break;
        case 'RN1': // 1시간 강수량
          weatherData.precipitation = value;
          break;
        case 'REH': // 습도
          weatherData.humidity = value;
          break;
        case 'WSD': // 풍속
          weatherData.windSpeed = value;
          break;
        case 'PTY': // 강수형태
          if (obsrValue !== '0') {
            weatherData.sky = this.getPrecipitationType(obsrValue);
          }
          break;
        case 'SKY': // 하늘상태
          if (!weatherData.sky) {
            weatherData.sky = this.getSkyCondition(obsrValue);
          }
          break;
      }
    });
    
    // 기본값 설정
    if (!weatherData.sky) weatherData.sky = 'clear';
    if (!weatherData.temperature) weatherData.temperature = 20;
    if (!weatherData.humidity) weatherData.humidity = 60;
    if (!weatherData.precipitation) weatherData.precipitation = 0;
    if (!weatherData.windSpeed) weatherData.windSpeed = 1.0;
    
    return weatherData;
  }

  getPrecipitationType(ptyCode) {
    switch (String(ptyCode)) {
      case '1': return 'rainy';  // 비
      case '2': return 'sleet';  // 비/눈
      case '3': return 'snowy';  // 눈
      case '5': return 'rainy';  // 빗방울
      case '6': return 'sleet';  // 빗방울/눈
      case '7': return 'snowy';  // 눈
      default: return 'clear';
    }
  }

  getSkyCondition(skyCode) {
    switch (String(skyCode)) {
      case '1': return 'clear';   // 맑음
      case '3': return 'cloudy';  // 구름많음
      case '4': return 'cloudy';  // 흐림
      default: return 'clear';
    }
  }
}

export default WeatherService;