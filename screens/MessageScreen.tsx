import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTailwind } from 'tailwind-rn';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import Header from '../components/Header';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { db } from '../firebase';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const tw = useTailwind();
  const { matchDetails } = params as any;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any>([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches', matchDetails.id, 'messages'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      ),
    [matchDetails, db]
  );

  const sendMessage = () => {
    if (input.length === 0) {
      return;
    }

    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,

      // you should see your dp
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });

    setInput('');
  };

  return (
    <SafeAreaView
      style={[
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
        tw('flex-1'),
      ]}
    >
      <Header
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        callEnabled
      />

      <KeyboardAvoidingView
        // ios uses padding, android uses height
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        style={tw('flex-1')}
        keyboardVerticalOffset={10}
      >
        {/* when you click on a message, we need the keyboard to dismiss, w/o performing any action */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            inverted={true}
            data={messages}
            style={tw('pl-4')}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>

        <View
          style={tw(
            'flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2'
          )}
        >
          <TextInput
            style={tw('h-10 text-lg')}
            placeholder='Send Message...'
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button title='Send' color='#FF8564' onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
