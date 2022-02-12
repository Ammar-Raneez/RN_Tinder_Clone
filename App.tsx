import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();                       // ignore AsyncStorage warning ftm

import { AuthProvider } from './hooks/useAuth';
import StackNavigator from './StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
      <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
