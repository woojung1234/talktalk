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
    
    // 프로덕션 환경 감지
    this.isProduction = __DEV__ === false;
    
    // 지역별 캐시 설정 (5분간 캐시)
    this.weatherCacheByRegion = new Map(); // 지역별 캐시 저장
    this.CACHE_DURATION = 5 * 60 * 1000; // 5분
  }

  async getCurrentWeather(city = '전주') {
    // 지역별 캐시 키 생성
    const cacheKey = city;
    
    // 해당 지역의 캐시된 데이터가 있고 유효하면 반환
    const cachedData = this.weatherCacheByRegion.get(cacheKey);
    if (cachedData && Date.now() < cachedData.expiry) {
      console.log(`WeatherService: ${city} 지역 캐시된 데이터 사용`);
      return cachedData.data;
    }

    // API 키 검증 강화
    const isApiKeyValid = this.validateApiKey();
    
    if (!isApiKeyValid) {
      console.log('WeatherService: API 키가 없거나 유효하지 않아 Mock 데이터를 사용합니다.', {
        hasKey: !!this.serviceKey,
        keyLength: this.serviceKey?.length || 0,
        keyPreview: this.serviceKey ? this.serviceKey.substring(0, 10) + '...' : 'none',
        isProduction: this.isProduction,
        city
      });
      
      // 지역별 Mock 데이터 생성 및 캐시
      const mockData = this.getMockWeatherData(city);
      this.cacheWeatherData(city, mockData);
      return mockData;
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
        apiKeyPreview: this.serviceKey.substring(0, 10) + '...',
        isProduction: this.isProduction
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

      // 프로덕션 환경에서는 더 강력한 재시도 로직
      const maxRetries = this.isProduction ? 5 : 3;
      const response = await this.makeRequestWithRetry(url, params, maxRetries);
      
      console.log(`WeatherService: ${city} API 응답 수신`, {
        status: response.status,
        resultCode: response.data?.response?.header?.resultCode,
        resultMsg: response.data?.response?.header?.resultMsg,
        hasItems: !!response.data?.response?.body?.items?.item,
        coords
      });
      
      if (response.data?.response?.header?.resultCode === '00' && 
          response.data.response.body?.items?.item) {
        const weatherData = this.parseWeatherData(response.data.response.body.items.item, city);
        console.log(`WeatherService: ${city} 실제 날씨 데이터 파싱 성공`, weatherData);
        
        // 데이터 검증 및 지역별 캐시
        const validatedData = this.validateAndCleanWeatherData(weatherData);
        this.cacheWeatherData(city, validatedData);
        return validatedData;
      }
      
      console.warn(`WeatherService: ${city} API에서 유효한 데이터를 받지 못했습니다. Mock 데이터로 대체합니다.`, {
        resultCode: response.data?.response?.header?.resultCode,
        resultMsg: response.data?.response?.header?.resultMsg
      });
      
      const mockData = this.getMockWeatherData(city);
      this.cacheWeatherData(city, mockData);
      return mockData;

    } catch (error) {
      console.error(`WeatherService: ${city} API 호출 중 오류 발생`, {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        isNetworkError: error.code === 'NETWORK_ERROR' || !error.response,
        isProduction: this.isProduction
      });
      
      // 오류 발생 시에도 해당 지역의 캐시된 데이터가 있으면 사용 (만료되었어도)
      if (cachedData) {
        console.log(`WeatherService: ${city} 오류 발생으로 만료된 캐시 데이터 사용`);
        return cachedData.data;
      }
      
      const mockData = this.getMockWeatherData(city);
      this.cacheWeatherData(city, mockData);
      return mockData;
    }
  }

  /**
   * API 키 유효성 검증 강화
   */
  validateApiKey() {
    if (!this.serviceKey) return false;
    
    // 기본 검증
    if (this.serviceKey === 'YOUR_WEATHER_API_KEY' || 
        this.serviceKey.includes('undefined') ||
        this.serviceKey.includes('null') ||
        this.serviceKey.length < 10) {
      return false;
    }
    
    // 프로덕션 환경에서는 더 엄격한 검증
    if (this.isProduction) {
      // 기상청 API 키 패턴 검증 (일반적으로 긴 문자열)
      if (this.serviceKey.length < 50) {
        console.warn('WeatherService: API 키가 너무 짧습니다. 유효한 기상청 API 키인지 확인해주세요.');
        return false;
      }
    }
    
    return true;
  }

  /**
   * 지역별 날씨 데이터 캐싱
   */
  cacheWeatherData(city, data) {
    this.weatherCacheByRegion.set(city, {
      data: data,
      expiry: Date.now() + this.CACHE_DURATION,
      timestamp: Date.now()
    });
    console.log(`WeatherService: ${city} 지역 데이터 캐시됨 (${this.CACHE_DURATION / 1000}초간 유효)`);
  }

  /**
   * 재시도 로직을 포함한 HTTP 요청 (프로덕션 최적화)
   */
  async makeRequestWithRetry(url, params, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`WeatherService: API 요청 시도 ${attempt}/${maxRetries}`);
        
        // 프로덕션에서는 더 긴 타임아웃과 안정적인 헤더 설정
        const timeout = this.isProduction ? 15000 : 10000;
        
        const response = await axios.get(url, { 
          params,
          timeout,
          headers: {
            'User-Agent': 'TalkTalk-Weather-App/1.0',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
          },
          // 네트워크 오류에 대한 추가 설정
          validateStatus: (status) => status < 500, // 5xx 에러만 재시도
          maxRedirects: 5
        });
        
        return response;
      } catch (error) {
        lastError = error;
        console.warn(`WeatherService: 시도 ${attempt} 실패`, {
          message: error.message,
          status: error.response?.status,
          code: error.code
        });
        
        // 마지막 시도가 아니면 지수 백오프로 대기
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // 최대 10초
          console.log(`WeatherService: ${delay}ms 후 재시도`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * [API 데이터 생성 시간 고려] 프로덕션용 시간 계산
   */
  getBaseTime(date) {
    let hour = date.getHours();
    const minute = date.getMinutes();
    
    // API 데이터는 매시 10분 후에 업데이트되므로, 더 안전한 마진 적용
    if (minute < 10) {
      hour = hour === 0 ? 23 : hour - 1;
    }
    
    // 프로덕션에서는 이전 시간 데이터를 요청하여 안정성 확보
    if (this.isProduction && minute < 15) {
      hour = hour === 0 ? 23 : hour - 1;
    }
    
    return String(hour).padStart(2, '0') + '00';
  }

  /**
   * 지역별 현실적인 Mock 데이터 생성
   */
  getMockWeatherData(city = '전주') {
    const now = new Date();
    const hour = now.getHours();
    const season = this.getCurrentSeason(now);
    const month = now.getMonth() + 1;
    
    // 지역별 기본 온도 차이 적용
    const regionTempModifier = this.getRegionTemperatureModifier(city);
    
    // 현재 계절과 월을 고려한 더 현실적인 온도 설정
    let baseTemp;
    switch (season) {
      case 'spring': 
        baseTemp = month === 3 ? 12 : month === 4 ? 18 : 22;
        baseTemp += (hour >= 6 && hour < 18) ? 5 : -3;
        break;
      case 'summer': 
        baseTemp = month === 6 ? 25 : month === 7 ? 29 : 27;
        baseTemp += (hour >= 6 && hour < 18) ? 3 : -5;
        break;
      case 'autumn': 
        baseTemp = month === 9 ? 22 : month === 10 ? 18 : 12;
        baseTemp += (hour >= 6 && hour < 18) ? 3 : -4;
        break;
      case 'winter': 
        baseTemp = month === 12 ? 5 : month === 1 ? 2 : 8;
        baseTemp += (hour >= 6 && hour < 18) ? 4 : -3;
        break;
      default: 
        baseTemp = (hour >= 6 && hour < 18) ? 20 : 15;
    }
    
    // 지역별 온도 보정 적용
    baseTemp += regionTempModifier;
    
    // 시간대별 현실적인 날씨 패턴 (지역별로 다르게)
    let weatherConditions;
    const regionWeatherPattern = this.getRegionWeatherPattern(city, hour);
    weatherConditions = regionWeatherPattern;
    
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    // 지역별 습도 차이 (해안 지역 vs 내륙 지역)
    const regionHumidityModifier = this.getRegionHumidityModifier(city);
    
    const mockData = {
      temperature: Math.round(baseTemp + (Math.random() * 4 - 2)), // ±2도 변동
      precipitation: randomCondition === 'rainy' ? 
        parseFloat((Math.random() * 3 + 0.1).toFixed(1)) : 0, // 0.1~3.1mm
      humidity: Math.min(95, Math.max(30, 
        (randomCondition === 'rainy' ? 
          75 + Math.floor(Math.random() * 20) : // 비올 때 75-95%
          45 + Math.floor(Math.random() * 35)) + regionHumidityModifier)), // 일반적으로 45-80% + 지역보정
      windSpeed: parseFloat((Math.random() * 3 + 0.5).toFixed(1)), // 0.5-3.5 m/s
      sky: randomCondition,
      city: city, // 어느 지역 데이터인지 명시
      isMockData: !this.isProduction // 개발 환경에서만 표시
    };
    
    console.log(`WeatherService: ${city} Mock 데이터 생성`, {
      season,
      month,
      hour,
      regionTempModifier,
      regionHumidityModifier,
      data: mockData,
      isProduction: this.isProduction
    });
    
    return mockData;
  }

  /**
   * 지역별 온도 보정값 계산
   */
  getRegionTemperatureModifier(city) {
    const modifiers = {
      '제주': 3,     // 따뜻함
      '부산': 2,     // 해양성 기후로 온화
      '울산': 1,     // 해안 지역
      '광주': 1,     // 남부 지역
      '대전': 0,     // 중부 내륙
      '전주': 0,     // 중부 내륙
      '서울': -1,    // 도시열섬 효과 있지만 위도 고려
      '대구': -1,    // 분지 지형으로 일교차 큼
      '인천': -1,    // 서해안 영향
      '세종': -1     // 내륙 지역
    };
    
    return modifiers[city] || 0;
  }

  /**
   * 지역별 습도 보정값 계산
   */
  getRegionHumidityModifier(city) {
    const modifiers = {
      '부산': 15,    // 해안 지역
      '인천': 15,    // 해안 지역
      '울산': 12,    // 해안 지역
      '제주': 10,    // 섬 지역
      '광주': 5,     // 남부 지역
      '서울': 0,     // 기준
      '전주': 0,     // 기준
      '대전': -5,    // 내륙
      '세종': -5,    // 내륙
      '대구': -10    // 분지 지형으로 건조
    };
    
    return modifiers[city] || 0;
  }

  /**
   * 지역별 날씨 패턴 계산
   */
  getRegionWeatherPattern(city, hour) {
    // 해안 지역은 비 확률이 높음
    const coastalCities = ['부산', '인천', '울산', '제주'];
    // 내륙 지역은 맑은 날씨가 많음
    const inlandCities = ['대구', '대전', '세종'];
    
    if (hour >= 6 && hour < 10) {
      // 아침은 대체로 맑음
      if (coastalCities.includes(city)) {
        return ['clear', 'clear', 'cloudy'];
      } else {
        return ['clear', 'clear', 'clear', 'cloudy'];
      }
    } else if (hour >= 14 && hour < 18) {
      // 오후에 비 가능성
      if (coastalCities.includes(city)) {
        return ['clear', 'cloudy', 'rainy', 'rainy'];
      } else if (inlandCities.includes(city)) {
        return ['clear', 'clear', 'cloudy'];
      } else {
        return ['clear', 'cloudy', 'rainy'];
      }
    } else {
      // 기타 시간대
      if (coastalCities.includes(city)) {
        return ['clear', 'cloudy', 'rainy'];
      } else {
        return ['clear', 'clear', 'cloudy'];
      }
    }
  }

  /**
   * 날씨 데이터 검증 및 정리 (프로덕션용)
   */
  validateAndCleanWeatherData(weatherData) {
    // 데이터 유효성 검증
    const validatedData = { ...weatherData };
    
    // 온도 범위 검증 (-50°C ~ 60°C)
    if (validatedData.temperature < -50 || validatedData.temperature > 60) {
      console.warn('WeatherService: 비정상적인 온도값 감지, 보정됨', validatedData.temperature);
      validatedData.temperature = 20; // 기본값으로 보정
    }
    
    // 습도 범위 검증 (0% ~ 100%)
    if (validatedData.humidity < 0 || validatedData.humidity > 100) {
      console.warn('WeatherService: 비정상적인 습도값 감지, 보정됨', validatedData.humidity);
      validatedData.humidity = 60; // 기본값으로 보정
    }
    
    // 강수량 음수 체크
    if (validatedData.precipitation < 0) {
      validatedData.precipitation = 0;
    }
    
    // 풍속 음수 체크
    if (validatedData.windSpeed < 0) {
      validatedData.windSpeed = 1.0;
    }
    
    return validatedData;
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

  /**
   * 수정된 parseWeatherData 함수 - 강수형태 우선 처리
   */
  parseWeatherData(items, city) {
    const weatherData = {};
    let precipitationType = null; // 강수형태를 별도로 저장
    let skyCondition = null;      // 하늘상태를 별도로 저장
    
    // 디버깅을 위한 원시 데이터 로깅 (개발 환경에서만)
    if (!this.isProduction) {
      console.log(`WeatherService: ${city} 원시 API 데이터`, items.map(item => ({
        category: item.category,
        value: item.obsrValue
      })));
    }
    
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
          if (!this.isProduction) {
            console.log(`WeatherService: ${city} PTY 코드 ${obsrValue} 감지`);
          }
          precipitationType = this.getPrecipitationType(obsrValue);
          break;
        case 'SKY': // 하늘상태
          if (!this.isProduction) {
            console.log(`WeatherService: ${city} SKY 코드 ${obsrValue} 감지`);
          }
          skyCondition = this.getSkyCondition(obsrValue);
          break;
      }
    });
    
    // 강수형태가 있으면 우선 적용, 없으면 하늘상태 적용
    if (precipitationType && precipitationType !== 'clear') {
      weatherData.sky = precipitationType;
      if (!this.isProduction) {
        console.log(`WeatherService: ${city} 강수형태 적용 - ${precipitationType}`);
      }
    } else if (skyCondition) {
      weatherData.sky = skyCondition;
      if (!this.isProduction) {
        console.log(`WeatherService: ${city} 하늘상태 적용 - ${skyCondition}`);
      }
    } else {
      weatherData.sky = 'clear';
      if (!this.isProduction) {
        console.log(`WeatherService: ${city} 기본값(clear) 적용`);
      }
    }
    
    // 데이터 일관성 검증
    this.validateWeatherConsistency(weatherData, city);
    
    // 기본값 설정
    if (!weatherData.temperature) weatherData.temperature = 20;
    if (!weatherData.humidity) weatherData.humidity = 60;
    if (!weatherData.precipitation) weatherData.precipitation = 0;
    if (!weatherData.windSpeed) weatherData.windSpeed = 1.0;
    
    // 지역 정보 추가
    weatherData.city = city;
    
    return weatherData;
  }

  /**
   * 날씨 데이터 일관성 검증
   */
  validateWeatherConsistency(weatherData, city) {
    // 강수량이 있는데 하늘 상태가 맑음인 경우
    if (weatherData.precipitation > 0 && weatherData.sky === 'clear') {
      console.warn(`WeatherService: ${city} 데이터 불일치 감지`, {
        precipitation: weatherData.precipitation,
        sky: weatherData.sky,
        message: '강수량이 있는데 하늘 상태가 맑음으로 설정됨'
      });
      
      // 강수량 기준으로 하늘 상태 보정
      if (weatherData.precipitation >= 1.0) {
        weatherData.sky = 'rainy';
        console.log(`WeatherService: ${city} 강수량 기준으로 rainy로 보정`);
      }
    }
    
    // 습도가 90% 이상인데 하늘 상태가 맑음인 경우 (프로덕션에서는 경고만)
    if (weatherData.humidity >= 90 && weatherData.sky === 'clear' && !this.isProduction) {
      console.warn(`WeatherService: ${city} 높은 습도 감지`, {
        humidity: weatherData.humidity,
        sky: weatherData.sky,
        message: '습도가 높은데 하늘 상태가 맑음으로 설정됨'
      });
    }
  }

  getPrecipitationType(ptyCode) {
    switch (String(ptyCode)) {
      case '0': return 'clear';   // 없음
      case '1': return 'rainy';   // 비
      case '2': return 'sleet';   // 비/눈
      case '3': return 'snowy';   // 눈
      case '4': return 'rainy';   // 소나기
      case '5': return 'rainy';   // 빗방울
      case '6': return 'sleet';   // 빗방울/눈날림
      case '7': return 'snowy';   // 눈날림
      default: return 'clear';
    }
  }

  getSkyCondition(skyCode) {
    switch (String(skyCode)) {
      case '1': return 'clear';   // 맑음
      case '3': return 'cloudy';  // 구름많음
      case '4': return 'overcast'; // 흐림
      default: return 'clear';
    }
  }

  /**
   * 특정 지역 캐시 초기화
   */
  clearCacheForRegion(city) {
    this.weatherCacheByRegion.delete(city);
    console.log(`WeatherService: ${city} 지역 캐시가 초기화되었습니다.`);
  }

  /**
   * 전체 캐시 초기화
   */
  clearAllCache() {
    this.weatherCacheByRegion.clear();
    console.log('WeatherService: 모든 지역의 캐시가 초기화되었습니다.');
  }

  /**
   * 캐시 상태 확인
   */
  getCacheStatus() {
    const status = {};
    this.weatherCacheByRegion.forEach((value, key) => {
      status[key] = {
        isValid: Date.now() < value.expiry,
        expiresIn: Math.max(0, value.expiry - Date.now()),
        cachedAt: new Date(value.timestamp).toLocaleString()
      };
    });
    return status;
  }
}

export default WeatherService;