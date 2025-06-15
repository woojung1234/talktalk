import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class ConversationAI {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    console.log('💡 ConversationAI 초기화됨');
    console.log('🔑 API Key:', this.apiKey ? `${this.apiKey.substring(0, 7)}...` : 'NOT FOUND');
    console.log('API 키 상태:', this.apiKey ? '✅ 설정됨' : '❌ 설정되지 않음');
  }

  async generateConversationTopics(conversationData) {
    console.log('🚀 generateConversationTopics 호출됨');
    
    try {
      if (!this.apiKey) {
        console.warn('⚠️ API 키 없음. 기본 주제 반환');
        return this.getFallbackTopics(conversationData);
      }

      console.log('📡 OpenAI API 호출 시작...');
      const prompt = this.generatePrompt(conversationData);
      
      const response = await axios.post(OPENAI_API_URL, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 대화 주제 추천 전문가입니다. 응답은 반드시 유효한 JSON 배열만 반환하세요. 추가 설명이나 마크다운 포맷은 사용하지 마세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      console.log('✅ API 응답 받음');
      const content = response.data.choices[0].message.content;
      
      console.log('📄 GPT 응답 내용:');
      console.log('=== 응답 시작 ===');
      console.log(content);
      console.log('=== 응답 끝 ===');
      
      // JSON 정제
      let jsonContent = content.trim();
      
      // 마크다운 코드 블록 제거
      if (jsonContent.includes