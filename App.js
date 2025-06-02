import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ConversationGeneratorScreen from './src/screens/ConversationGeneratorScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#4f46e5" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'TalkTalk',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="ConversationGenerator" 
          component={ConversationGeneratorScreen} 
          options={{ 
            title: '대화 주제 생성',
            headerBackTitle: '뒤로'
          }} 
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{ 
            title: '추천 대화 주제',
            headerBackTitle: '뒤로'
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
