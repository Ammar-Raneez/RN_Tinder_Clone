import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import ModalScreen from './screens/ModalScreen';
import MatchScreen from './screens/MatchScreen';
import useAuth from './hooks/useAuth';
import MessageScreen from './screens/MessageScreen';

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Login: undefined;
  Modal: undefined;
  Message: any;
  Match: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
            <Stack.Screen name="Match" component={MatchScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default StackNavigator;
