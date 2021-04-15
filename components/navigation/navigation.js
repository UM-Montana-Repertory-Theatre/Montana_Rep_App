import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import home from './assets/homeIcon.png'
import map from './assets/mapIcon.png'
import cal from './assets/upcomingIcon.png'
import { SafeAreaView } from 'react-native';

function Navigation({ navigation }) {
  return (
    <SafeAreaView>
      <View style={styles.navBar}>
        <TouchableOpacity style={{ alignSelf: 'center', margin: 25, marginTop: 30, }} onPress={() => navigation.navigate('Home')}>
          <Image source={home} />
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 5, }} onPress={() => navigation.navigate('Map')}>
          <Image source={map} />
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: 'center', margin: 25, marginTop: 30, }} onPress={() => navigation.navigate('Schedule')}>
          <Image source={cal} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navBar: {
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 1)',

    // alignSelf: 'flex-end',
    position: 'absolute',
    width: '100%',
    maxHeight: 55,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Navigation;