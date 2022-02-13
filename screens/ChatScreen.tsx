import React from 'react';
import { SafeAreaView, Platform, StatusBar } from 'react-native';
import Header from '../components/Header';

const ChatScreen = () => {
  return (
    <SafeAreaView
      style={[{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}
    >
      <Header callEnabled title="Chat" />
    </SafeAreaView>
  )
}

export default ChatScreen;
