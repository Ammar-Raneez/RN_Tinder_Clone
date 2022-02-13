import { SafeAreaView, Platform, StatusBar } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

import Header from '../components/Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params as any;

  return (
    <SafeAreaView
      style={[{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}
    >
      <Header
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        callEnabled
      />
    </SafeAreaView>
  );
}

export default MessageScreen;
