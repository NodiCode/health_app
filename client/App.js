import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import DiagnosisScreen from './src/screens/DiagnosisScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
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
            options={{ title: 'Диагностика болезней' }}
          />
          <Stack.Screen 
            name="Diagnosis" 
            component={DiagnosisScreen} 
            options={{ title: 'Введите симптомы' }}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen} 
            options={{ title: 'Результаты' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}