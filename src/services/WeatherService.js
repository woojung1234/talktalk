import axios from 'axios';

const API_BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

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
    if (!this.serviceKey || this.serviceKey.includes('YOUR_')) {
      console.log('WeatherService: API 키가 없어 Mock 데이터를 사용합니다.');
      return this.getMockWeatherData();
    }
    try {
      const coords = this.locationCoords[city] || this.locationCoords['서울'];
      const now = new Date();
      const baseDate = this.formatDate(now);
      const baseTime = this.getBaseTime(now); // 개선된 시간 계산 로직 사용

      const url = `${API_BASE_URL}/getUltraSrtNcst`;
      const params = {
        serviceKey: decodeURIComponent(this.serviceKey),
        numOfRows: 10, pageNo: 1, dataType: 'JSON',
        base_date: baseDate, base_time: baseTime,
        nx: coords.nx, ny: coords.ny
      };

      const response = await axios.get(url, { params });
      
      if (response.data?.response?.header?.resultCode === '00' && response.data.response.body?.items?.item) {
        return this.parseWeatherData(response.data.response.body.items.item);
      }
      
      console.warn('Weather API에서 유효한 데이터를 받지 못했습니다. Mock 데이터로 대체합니다. 메시지:', response.data?.response?.header?.resultMsg || '내용 없음');
      return this.getMockWeatherData();

    } catch (error) {
      console.error('Weather API 호출 중 오류 발생:', error.message);
      return this.getMockWeatherData();
    }
  }

  /**
   * [수정됨] API 데이터 생성 시간(매시 40분)을 고려하여,
   * 45분 이전에는 안전하게 이전 시간의 데이터를 요청하도록 변경합니다.
   */
  getBaseTime(date) {
    let hour = date.getHours();
    if (date.getMinutes() < 45) { // 45분 미만일 경우, 이전 시간 데이터 요청
      hour = hour === 0 ? 23 : hour - 1;
    }
    return String(hour).padStart(2, '0') + '00';
  }

  getMockWeatherData() {
    const now = new Date();
    const hour = now.getHours();
    let baseTemp = (hour >= 6 && hour < 18) ? 22 : 18;
    const weatherConditions = ['clear', 'cloudy', 'rainy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    return {
      temperature: baseTemp + Math.floor(Math.random() * 4 - 2),
      precipitation: randomCondition === 'rainy' ? Math.random().toFixed(1) : 0,
      humidity: 55 + Math.floor(Math.random() * 20),
      windSpeed: (Math.random() * 3 + 1).toFixed(1),
      sky: randomCondition
    };
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
      switch (category) {
        case 'T1H': weatherData.temperature = parseFloat(obsrValue); break;
        case 'RN1': weatherData.precipitation = parseFloat(obsrValue); break;
        case 'REH': weatherData.humidity = parseFloat(obsrValue); break;
        case 'WSD': weatherData.windSpeed = parseFloat(obsrValue); break;
        case 'PTY': if (obsrValue !== '0') weatherData.sky = this.getPrecipitationType(obsrValue); break;
        case 'SKY': if (!weatherData.sky) weatherData.sky = this.getSkyCondition(obsrValue); break;
      }
    });
    if (!weatherData.sky) weatherData.sky = 'clear';
    return weatherData;
  }

  getPrecipitationType(ptyCode) {
    switch (String(ptyCode)) {
      case '1': return 'rainy'; case '2': return 'sleet'; case '3': return 'snowy';
      case '5': return 'rainy'; case '6': return 'sleet'; case '7': return 'snowy';
      default: return 'clear';
    }
  }

  getSkyCondition(skyCode) {
    switch (String(skyCode)) {
      case '1': return 'clear'; case '3': return 'cloudy'; case '4': return 'cloudy';
      default: return 'clear';
    }
  }
}

export default WeatherService;