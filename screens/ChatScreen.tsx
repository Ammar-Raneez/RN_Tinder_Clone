import { SafeAreaView, Platform, StatusBar } from 'react-native';
import React from 'react';

import ChatList from '../components/ChatList';
import Header from '../components/Header';

const ChatScreen = () => {
  return (
    <SafeAreaView
      style={[
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <Header title='Chat' />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
