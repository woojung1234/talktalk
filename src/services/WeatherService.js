/**
 * 기상청 단기예보 조회서비스 API
 * 실시간 날씨 정보를 조회하고 날씨 기반 대화 주제를 생성합니다.
 */

const API_BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

class WeatherService {
  constructor(serviceKey) {
    this.serviceKey = serviceKey;
    this.locationCoords = {
      // 주요 도시 좌표 (X, Y)
      서울: { nx: 60, ny: 127 },
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

  /**
   * 현재 위치의 날씨 정보 조회
   * @param {string} city - 도시명 (기본값: 서울)
   * @returns {Promise<Object>} 날씨 정보
   */
  async getCurrentWeather(city = '서울') {
    // API 키가 없거나 기본값인 경우 mock 데이터 반환
    if (!this.serviceKey || this.serviceKey === 'YOUR_WEATHER_API_KEY') {
      console.log('Using mock weather data - API key not configured');
      return this.getMockWeatherData();
    }

    try {
      const coords = this.locationCoords[city] || this.locationCoords['서울'];
      const now = new Date();
      const baseDate = this.formatDate(now);
      const baseTime = this.getBaseTime(now);

      const url = `${API_BASE_URL}/getUltraSrtNcst`;
      const params = new URLSearchParams({
        serviceKey: decodeURIComponent(this.serviceKey),
        numOfRows: 10,
        pageNo: 1,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: coords.nx,
        ny: coords.ny
      });

      console.log('Weather API URL:', `${url}?${params}`);
      
      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Weather API Response Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 200));

      // HTML 응답인 경우 (에러 페이지)
      if (responseText.trim().startsWith('<')) {
        console.log('Received HTML response instead of JSON - likely API key issue');
        return this.getMockWeatherData();
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.log('JSON parse error:', parseError);
        return this.getMockWeatherData();
      }

      console.log('Parsed weather data:', data);

      if (data.response && data.response.header && data.response.header.resultCode === '00') {
        if (data.response.body && data.response.body.items && data.response.body.items.item) {
          return this.parseWeatherData(data.response.body.items.item);
        } else {
          console.log('No weather items in response');
          return this.getMockWeatherData();
        }
      } else {
        console.log('API Error:', data.response?.header?.resultMsg || 'Unknown error');
        return this.getMockWeatherData();
      }
    } catch (error) {
      console.log('Weather API Error:', error);
      return this.getMockWeatherData();
    }
  }

  /**
   * 단기 예보 정보 조회 (간소화 버전)
   * @param {string} city - 도시명
   * @returns {Promise<Object>} 예보 정보
   */
  async getWeatherForecast(city = '서울') {
    // 현재 날씨 정보를 기반으로 간단한 예보 생성
    const currentWeather = await this.getCurrentWeather(city);
    
    return {
      today: currentWeather,
      tomorrow: {
        ...currentWeather,
        temperature: currentWeather.temperature + (Math.random() * 6 - 3) // ±3도 변화
      }
    };
  }

  /**
   * 날씨 기반 대화 주제 생성
   * @param {Object} weatherData - 날씨 정보
   * @returns {Array} 대화 주제 배열
   */
  generateWeatherTopics(weatherData) {
    const { temperature, precipitation, sky, humidity } = weatherData;
    const topics = [];

    // 온도 기반 주제
    if (temperature >= 25) {
      topics.push({
        category: 'hot',
        title: '더운 날씨 대화',
        suggestions: [
          '이런 더위에는 뭐 하고 지내?',
          '시원한 음식 추천 좀 해줘!',
          '에어컨 없이는 못 살겠어ㅠㅠ',
          '여름휴가 계획 있어?',
          '아이스크림 생각나지 않아?'
        ],
        icon: '☀️'
      });
    } else if (temperature <= 5) {
      topics.push({
        category: 'cold',
        title: '추운 날씨 대화',
        suggestions: [
          '이런 추위에는 따뜻한 차가 최고야',
          '겨울 코트 꺼낼 시간인 것 같아',
          '실내에서 할 만한 활동 추천해줘',
          '따뜻한 음식 먹고 싶다',
          '히터 틀어야겠어'
        ],
        icon: '❄️'
      });
    } else {
      topics.push({
        category: 'mild',
        title: '선선한 날씨 대화',
        suggestions: [
          '날씨가 딱 좋네!',
          '산책하기 좋은 날씨야',
          '이런 날씨면 기분도 좋아져',
          '야외 활동하기 딱이야',
          '카페에서 창가 자리 잡고 싶어'
        ],
        icon: '🌤️'
      });
    }

    // 강수 기반 주제
    if (precipitation > 0 || sky === 'rainy') {
      topics.push({
        category: 'rainy',
        title: '비 오는 날 대화',
        suggestions: [
          '비 소리 들으니까 기분이 어때?',
          '우산 챙겼어? 나는 깜빡했어ㅠ',
          '비 오는 날엔 전 생각나지 않아?',
          '실내 데이트 코스 추천해줘',
          '빗소리 들으며 음악 듣기 좋을 것 같아'
        ],
        icon: '🌧️'
      });
    }

    // 하늘 상태 기반 주제
    if (sky === 'clear') {
      topics.push({
        category: 'sunny',
        title: '맑은 날씨 대화',
        suggestions: [
          '날씨 좋으니까 나들이 갈까?',
          '이런 날에는 산책하기 딱 좋은데',
          '햇살이 정말 따뜻하다',
          '야외 활동 하고 싶어져',
          '파란 하늘이 너무 예뻐'
        ],
        icon: '☀️'
      });
    } else if (sky === 'cloudy') {
      topics.push({
        category: 'cloudy',
        title: '흐린 날씨 대화',
        suggestions: [
          '구름 많은 날이네, 선선해서 좋다',
          '흐린 날씨가 오히려 차분해',
          '사진 찍기엔 이런 날씨가 좋아',
          '구름 사이로 햇살이 이쁘네',
          '날씨가 촉촉해서 좋아'
        ],
        icon: '☁️'
      });
    }

    // 습도 기반 주제
    if (humidity >= 80) {
      topics.push({
        category: 'humid',
        title: '습한 날씨 대화',
        suggestions: [
          '습도가 너무 높아서 끈적해',
          '제습기 틀어야겠어',
          '이런 날씨엔 머리가 말을 안 들어',
          '습한 날씨 극복법 있어?',
          '에어컨 빵빵하게 틀고 싶어'
        ],
        icon: '💧'
      });
    }

    return topics.length > 0 ? topics : this.getDefaultWeatherTopics();
  }

  /**
   * Mock 날씨 데이터 (API 사용 불가시)
   */
  getMockWeatherData() {
    const now = new Date();
    const hour = now.getHours();
    
    // 시간대별 온도 변화 시뮬레이션
    let baseTemp = 20;
    if (hour >= 6 && hour < 12) baseTemp = 18; // 아침
    else if (hour >= 12 && hour < 18) baseTemp = 25; // 오후
    else if (hour >= 18 && hour < 22) baseTemp = 22; // 저녁
    else baseTemp = 15; // 밤

    const weatherConditions = ['clear', 'cloudy', 'rainy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    return {
      temperature: baseTemp + Math.floor(Math.random() * 6 - 3), // ±3도 변화
      precipitation: randomCondition === 'rainy' ? Math.random() * 10 : 0,
      humidity: 50 + Math.floor(Math.random() * 30), // 50-80%
      windSpeed: Math.random() * 5, // 0-5 m/s
      sky: randomCondition
    };
  }

  /**
   * 날짜 포맷팅 (YYYYMMDD)
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * 실황 조회용 기준 시간 (정시)
   */
  getBaseTime(date) {
    let hour = date.getHours();
    // 매시 10분 이후에 데이터가 제공되므로, 10분 전이면 이전 시간으로
    if (date.getMinutes() < 10) {
      hour = hour === 0 ? 23 : hour - 1;
    }
    return String(hour).padStart(2, '0') + '00';
  }

  /**
   * 예보 조회용 기준 시간 (0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
   */
  getForecastBaseTime(date) {
    const hour = date.getHours();
    const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
    
    for (let i = baseTimes.length - 1; i >= 0; i--) {
      if (hour >= parseInt(baseTimes[i].substring(0, 2))) {
        return baseTimes[i];
      }
    }
    return '2300'; // 자정 이후의 경우
  }

  /**
   * 실황 데이터 파싱
   */
  parseWeatherData(items) {
    const weatherData = {
      temperature: 20,
      precipitation: 0,
      humidity: 60,
      windSpeed: 2,
      sky: 'clear'
    };

    if (!Array.isArray(items)) {
      return weatherData;
    }

    items.forEach(item => {
      const value = parseFloat(item.obsrValue || item.fcstValue || 0);
      
      switch (item.category) {
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
          weatherData.sky = this.getPrecipitationType(item.obsrValue || item.fcstValue);
          break;
        case 'SKY': // 하늘상태
          weatherData.sky = this.getSkyCondition(item.obsrValue || item.fcstValue);
          break;
      }
    });

    return weatherData;
  }

  /**
   * 강수 형태 분류
   */
  getPrecipitationType(ptyCode) {
    switch (String(ptyCode)) {
      case '1': return 'rainy';
      case '2': return 'sleet';
      case '3': return 'snowy';
      case '4': return 'rainy'; // 소나기
      default: return 'clear';
    }
  }

  /**
   * 하늘 상태 분류
   */
  getSkyCondition(skyCode) {
    switch (String(skyCode)) {
      case '1': return 'clear';    // 맑음
      case '3': return 'cloudy';   // 구름많음
      case '4': return 'cloudy';   // 흐림
      default: return 'clear';
    }
  }

  /**
   * 기본 날씨 데이터 (API 오류 시)
   */
  getDefaultWeatherData() {
    return this.getMockWeatherData();
  }

  /**
   * 기본 예보 데이터
   */
  getDefaultForecastData() {
    return {
      today: this.getDefaultWeatherData(),
      tomorrow: this.getDefaultWeatherData()
    };
  }

  /**
   * 기본 날씨 주제
   */
  getDefaultWeatherTopics() {
    return [
      {
        category: 'general',
        title: '오늘의 날씨 이야기',
        suggestions: [
          '오늘 날씨 어때?',
          '날씨에 따라 기분이 달라지는 것 같아',
          '계절이 바뀌는 게 느껴져',
          '날씨 예보 봤어?',
          '이런 날씨엔 뭐하고 싶어?'
        ],
        icon: '🌤️'
      }
    ];
  }
}

export default WeatherService;