import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../StackNavigator';
import useAuth from '../hooks/useAuth';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { logout } = useAuth();

  return (
    <View>
      <Text>HomeScreen</Text>
      <Button
        title="Go to chat screen"
        onPress={() => navigation.navigate("Chat")}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

export default HomeScreen;
