import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTailwind } from 'tailwind-rn';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

import ChatRow from './ChatRow';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const ChatList = () => {
  const tw = useTailwind();
  const { user } = useAuth();
  const [matches, setMatches] = useState<any>([]);

  // implicit return to call 'unsub' directly, since it returns an unsub
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches'),
          where('usersMatched', 'array-contains', user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );

  return matches.length > 0 ? (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tw('p-5')}>
      <Text style={tw('text-center text-lg')}>No matches at the moment 😢</Text>
    </View>
  );
};

export default ChatList;
