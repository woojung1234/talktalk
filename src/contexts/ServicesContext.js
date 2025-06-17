import React, { createContext, useContext, useState, useMemo } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import UnifiedConversationService from '../services/UnifiedConversationService';
import WeatherService from '../services/WeatherService';

const ServicesContext = createContext(null);

export const ServicesProvider = ({ children }) => {
  const services = useMemo(() => {
    const weatherService = new WeatherService(process.env.WEATHER_API_KEY);
    const unifiedConversationService = new UnifiedConversationService(process.env.OPENAI_API_KEY, weatherService);
    return { weatherService, unifiedConversationService };
  }, []);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices는 반드시 ServicesProvider 안에서 사용해야 합니다.');
  }
  return context;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
  },
});