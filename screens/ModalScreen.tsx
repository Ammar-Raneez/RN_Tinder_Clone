import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'; 
import { useTailwind } from 'tailwind-rn';

import { db } from '../firebase';
import { RootStackParamList } from '../StackNavigator';
import useAuth from '../hooks/useAuth';

type ModalScreenNavigationProp = NavigationProp<RootStackParamList, 'Modal'>;

const ModalScreen = () => {
  const navigation = useNavigation<ModalScreenNavigationProp>();
  const { user } = useAuth();
  const tw = useTailwind();
  const [image, setImage] = useState<string>('');
  const [job, setJob] = useState<string>('');
  const [age, setAge] = useState<string>('');

  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      timestamp: serverTimestamp(),
      job,
      age
    }).then(() => {
      navigation.navigate('Home')
    }).catch((err) => alert(err));
  }

  return (
    <View style={tw('flex-1 items-center pt-4')}>
      <Image
        style={tw('h-20 w-full')}
        resizeMode="contain"
        source={{ uri: 'https://1000logos.net/wp-content/uploads/2018/07/Tinder-logo.png' }}
      />
      <Text
        style={tw('text-xl text-gray-500 p-2 font-bold')}
      >
        Welcome {user.displayName}
      </Text>
      <Text style={tw('text-center p-4 font-bold text-red-400')}>
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={image}

        // (text) => setImage(text) can be converted to as below
        onChangeText={setImage}
        placeholder="Enter a Profile Pic URL"
      />
      <Text style={tw('text-center p-4 font-bold text-red-400')}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        placeholder="Enter your Occupation"
      />
      <Text style={tw('text-center p-4 font-bold text-red-400')}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        placeholder="Enter your Age"
        maxLength={2}
        keyboardType="numeric"
      />

      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          tw('w-64 p-3 rounded-xl absolute bottom-10'),
          incompleteForm ? tw('bg-gray-400') : tw('bg-red-400')
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tw('text-center text-white text-xl')}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalScreen;
