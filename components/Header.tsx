import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  callEnabled: boolean;
}

function Header({ title, callEnabled }: HeaderProps) {
  const navigation = useNavigation();
  const tw = useTailwind();

  return (
    <View style={tw('p-2 flex-row items-center justify-between')}>
      <View style={tw('flex flex-row items-center')}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw('p-2')}
        >
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw('text-2xl font-bold pl-2')}>{title}</Text>
      </View>

      {callEnabled && (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity style={[tw('rounded-full p-3 bg-red-200')]}>
            <Foundation style={tw('')} name="telephone" size={22} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default Header;
