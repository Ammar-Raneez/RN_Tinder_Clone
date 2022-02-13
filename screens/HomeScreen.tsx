import React from 'react';
import { Platform, StatusBar, Text, Button, SafeAreaView, View, TouchableOpacity, Image } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTailwind } from 'tailwind-rn';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../StackNavigator';
import useAuth from '../hooks/useAuth';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const tw = useTailwind();

  return (
    <SafeAreaView
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <View style={tw('items-center flex-row justify-between px-5')}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw('h-12 w-12 rounded-full')}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
      <TouchableOpacity>
        <Image style={tw('h-14 w-14')} source={require('../logo.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
      </TouchableOpacity>
      </View>

{/* 
      <Text>HomeScreen</Text>
      <Button
        title="Go to chat screen"
        onPress={() => navigation.navigate("Chat")}
      />
      <Button title="Logout" onPress={logout} /> */}
    </SafeAreaView>
  )
}

export default HomeScreen;
