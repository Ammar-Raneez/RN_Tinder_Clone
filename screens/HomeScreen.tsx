import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Platform,
  StatusBar,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTailwind } from 'tailwind-rn';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { collection, doc, onSnapshot } from 'firebase/firestore';

import { RootStackParamList } from '../StackNavigator';
import useAuth from '../hooks/useAuth';
import { db } from '../firebase';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState<any>([]);
  const tw = useTailwind();
  const swiperRef = useRef(null);

  useLayoutEffect(() => onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
    if (!snapshot.exists()) {
      navigation.navigate('Modal');
    }
  }), []);

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
          const data = snapshot.docs.filter((doc) => doc.id !== user.uid).map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setProfiles(data);
      });
    }

    fetchCards();
    return unsub;
  }, []);

  return (
    <SafeAreaView
      style={[{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }, tw('flex-1')]}
    >
      <View style={tw('items-center flex-row justify-between px-5')}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw('h-12 w-12 rounded-full')}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image style={tw('h-14 w-14')} source={require('../logo.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View style={tw('flex-1 -mt-6')}>
        <Swiper
          ref={swiperRef}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          containerStyle={{ backgroundColor: 'transparent' }}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red'
                }
              }
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  color: '#4DED30'
                }
              }
            }
          }}
          onSwipedLeft={() => {
            console.log('PASS')
          }}
          onSwipedRight={() => {
            console.log('MATCH')
          }}
          cards={profiles}
          renderCard={(card: any) => card ? (
            <View key={card.id} style={tw('bg-white h-3/4 rounded-xl')}>
              <Image
                style={tw('absolute top-0 h-full w-full rounded-xl')}
                source={{ uri: card.photoURL }}
              />
              <View
                style={[
                  tw('absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl'),
                  styles.cardShadow
                ]}
              >
                <View>
                  <Text style={tw('text-xl font-bold')}>
                    {card.displayName}
                  </Text>
                  <Text>{card.job}</Text>
                </View>
                <Text style={tw('text-2xl font-bold')}>{card.age}</Text>
              </View>
            </View>
          ) : (
            <View
              style={[
                tw('relative bg-white h-3/4 rounded-xl justify-center items-center'),
                styles.cardShadow
              ]}
            >
              <Text style={tw('pb-5 font-bold')}>No more profiles</Text>
              <Image
                style={tw('h-20 w-20')}
                height={100}
                width={30}
                source={{ uri: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037' }}
              />
            </View>
          )}
        />
      </View>

      <View style={tw('flex flex-row justify-evenly')}>
        <TouchableOpacity
          onPress={() => (swiperRef.current as any).swipeLeft()}
          style={tw('items-center justify-center rounded-full w-16 h-16 bg-red-200')}
        >
          <Entypo size={30} name="cross" color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => (swiperRef.current as any).swipeRight()}
          style={tw('items-center justify-center rounded-full w-16 h-16 bg-green-200')}
        >
          <AntDesign size={30} name="heart" color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2.1
  }
});

const DUMMY_DATA = [
  {
    firstName: 'Sonny',
    lastName: 'Sangha',
    job: 'Software Developer',
    photoURL: 'https://avatars.githubusercontent.com/u/24712956?v=4',
    age: 27,
    id: 123
  },
  {
    firstName: 'Elon',
    lastName: 'Musk',
    job: 'Software Developer',
    photoURL: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg',
    age: 40,
    id: 456
  },
  {
    firstName: 'Ammar',
    lastName: 'Raneez',
    job: 'Software Developer',
    photoURL: 'https://avatars.githubusercontent.com/u/54928498?v=4',
    age: 20,
    id: 789
  }
]