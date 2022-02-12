import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { useTailwind } from 'tailwind-rn';

import useAuth from '../hooks/useAuth';
import { RootStackParamList } from '../StackNavigator';

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const tw = useTailwind();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, []);

  return (
    <View style={tw('flex-1')}>
      <ImageBackground
        resizeMode='cover'
        style={tw('flex-1')}
        source={{ uri: 'https://tinder.com/static/tinder.png' }}
      >
        <TouchableOpacity
          style={[
            tw('absolute bottom-40 w-52 bg-white p-4 rounded-2xl'),
            { marginHorizontal: '25%' }
          ]}
          onPress={signInWithGoogle}
        >
          <Text
            style={tw('font-semibold text-center')}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen;
