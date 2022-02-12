import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../StackNavigator';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="Go to chat screen" onPress={() => navigation.navigate("Chat")}/>
    </View>
  )
}

export default HomeScreen;
