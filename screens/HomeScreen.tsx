import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';

import { RootStackParamList } from '../StackNavigator';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import generateId from '../lib/generateId';

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
      const passesSnapshot = await getDocs(collection(db, 'users', user.uid, 'passes'));
      const passes = passesSnapshot.docs.map((doc) => doc.id);
      const swipesSnapshot = await getDocs(collection(db, 'users', user.uid, 'swipes'));
      const swipes = swipesSnapshot.docs.map((doc) => doc.id);

      // filtering on firebase requires some value, so passing a value that will never be an id would be sufficient;
      const passedIds = passes.length > 0 ? passes : ['somedummyvalue'];
      const swipedIds = swipes.length > 0 ? swipes : ['somedummyvalue'];

      unsub = onSnapshot(
        query(collection(db, 'users'), where('id', 'not-in', [...passedIds, ...swipedIds])), (snapshot) => {
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

  const swipeLeft = async (cardIndex: number) => {
    if (!profiles[cardIndex]) {
      return;
    }

    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  }

  const swipeRight = async (cardIndex: number) => {
    if (!profiles[cardIndex]) {
      return;
    }

    const userSwiped = profiles[cardIndex];

    // Get more info of the current logged in user
    const loggedInProfile = (await getDoc(doc(db, 'users', user.uid))).data();

    // check if the user swiped on you
    const userSwipes = await getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid));
    if (userSwipes.exists()) {
      // A match has been formed (both have swiped)
      console.log(`You MATCHED with ${userSwiped.displayName}`);
      setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);

      // Create a MATCH
      setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
        users: {
          [user.uid]: loggedInProfile,
          [userSwiped.id]: userSwiped
        },
        usersMatched: [user.uid, userSwiped.id],
        timestamp: serverTimestamp()
      });

      navigation.navigate('Match', { loggedInProfile, userSwiped });
    } else {
      // User has swiped, you haven't yet
      console.log(`You swiped on ${userSwiped.displayName}`);
      setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
    }
  }

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
          onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
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

      <View style={[tw('flex flex-row justify-evenly'), { marginBottom: 20 }]}>
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
