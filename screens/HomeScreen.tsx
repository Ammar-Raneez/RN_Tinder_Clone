import React from 'react';
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

import { RootStackParamList } from '../StackNavigator';
import useAuth from '../hooks/useAuth';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const tw = useTailwind();

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
        <TouchableOpacity>
          <Image style={tw('h-14 w-14')} source={require('../logo.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View style={tw('flex-1 -mt-6')}>
        <Swiper
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
          cards={DUMMY_DATA}
          renderCard={(card) => (
            <View key={card.id} style={tw('bg-white h-3/4 rounded-xl')}>
              <Image
                style={tw('absolute top-0 h-full w-full rounded-xl')}
                source={{ uri: card.photoURL }}
              />
              <View
                style={[
                  tw('absolute bottom-0 bg-white w-full flex-row justify-between h-20 px-6 py-2 rounded-b-xl'),
                  styles.cardShadow
                ]}
              >
                <View>
                  <Text style={tw('text-xl font-bold')}>
                    {card.firstName} {card.lastName}
                  </Text>
                  <Text>{card.job}</Text>
                </View>
                <Text style={tw('text-2xl font-bold')}>{card.age}</Text>
              </View>
            </View>
          )}
        />
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