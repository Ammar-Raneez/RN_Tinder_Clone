import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTailwind } from 'tailwind-rn';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

import { RootStackParamList } from '../StackNavigator';
import { db } from '../firebase';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';

interface ChatRowProps {
  matchDetails: any;
}

type ChatRowNavigationProp = NavigationProp<RootStackParamList, 'Chat'>;

const ChatRow = ({ matchDetails }: ChatRowProps) => {
  const navigation = useNavigation<ChatRowNavigationProp>();
  const { user } = useAuth();
  const tw = useTailwind();
  const [matchedUserInfo, setMatchedUserInfo] = useState<any>(null);
  const [lastMessage, setLastMessage] = useState<string>('');

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches', matchDetails.id, 'messages'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );

  return (
    <TouchableOpacity
      style={[
        tw('flex-row items-center py-5 px-5 bg-white mx-3 my-1 rounded-lg'),
        styles.cardShadow,
      ]}
      onPress={() => navigation.navigate('Message', { matchDetails })}
    >
      <Image
        style={tw('rounded-full h-16 w-16 mr-4')}
        source={{ uri: matchedUserInfo?.photoURL }}
      />

      <View>
        <Text style={tw('text-lg font-semibold')}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || 'Say Hi!'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
