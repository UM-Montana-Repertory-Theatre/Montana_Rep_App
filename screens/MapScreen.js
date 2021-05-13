import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { Text, View, Image, StyleSheet, TouchableOpacity, Dimensions, PermissionsAndroid, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Animated, AnimatedRegion } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import Cog from '../components/Cog';
import PlayingBanner from '../components/playingBanner';
import Geolocation from 'react-native-geolocation-service';
import * as geolib from 'geolib';
import { useFocusEffect } from '@react-navigation/native';


import { db } from '../components/Firebase/firebase';


export default ({ navigation }) => {

  const [locationPermission, setLocationPermission] = useState(false);
  // const iosLocationPermission = 
  const [currentPosition, setCurrentPosition] = useState();
  const [currentRegion, setCurrentRegion] = useState();
  const [contentData, setContentData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    //requestLocationPermission();
    if (Platform.OS === "android") {
      checkPermissions(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else if (Platform.OS === "ios") {
      checkPermissions(PERMISSIONS.IOS.LOCATION_ALWAYS);
    };

    db.collection("content").onSnapshot((snapshot) => {
      setContentData(snapshot.docs.map((doc) => ({ id: doc.id, content: doc.data() })));

    })
  }, []);

  function checkPermissions(type) {
    check(type)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            const requestPermission = request(type)
              .then((result) => {
                switch (result) {
                  case RESULTS.GRANTED:
                    setLocationPermission(true);
                    console.log('The permission is granted');
                    break;
                  case RESULTS.BLOCKED:
                    console.log('The permission is denied and not requestable anymore');
                    break;
                }
              });

            console.log('The permission has not been requested / is denied but requestable');
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            setLocationPermission(true);
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        // …
      });
  }

  // const requestLocationPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: "Montana Repertory Theatre Location Permission",
  //         message:
  //           "We need access to your location " +
  //           "to use the community map",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK"
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("Location Permission Granted");
  //     } else {
  //       console.log("Location Permission Denied");
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  function getCurrentLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position.coords);
        setIsLoading(false);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  useEffect(() => {
    //React.useCallback(() => {
    if (locationPermission) {
      getCurrentLocation();

      const interval = setInterval(() => {
        getCurrentLocation();
        //console.log('This will run every 5 seconds');
      }, 5000);

      return () => clearInterval(interval);

    }
    //}, [])
  }, [locationPermission]);


  function selectPlay(id, pointId) {
    navigation.navigate('Play', {
      id: id,
      pointId: pointId,
    });
  }

  function selectEvent(id, pointId) {
    navigation.navigate('Event', {
      id: id,
      pointId: pointId,
    });
  }

  function selectSponsor(id, pointId) {
    navigation.navigate('Sponsor', {
      id: id,
      pointId: pointId,
    });
  }

  function onRegionChange(region) {
    setCurrentRegion(region);
  }

  const Markers = () => {

    if (contentData !== null) {

      var contents = contentData.map(({ id, content }) => content.geopoints.map((geopoints, pointId) => {
        if (geopoints.latitude !== '' && geopoints.longitude !== '') {

          if (content.type == "easterEgg") {
            var distance = (geolib.getDistance(currentPosition, geopoints));
            let reveal;
            if (distance < 30) {
              reveal = true;
            }

            if (reveal) {
              return <Marker
                key={pointId}
                coordinate={{
                  latitude: geopoints.latitude * 1,
                  longitude: geopoints.longitude * 1,
                }}
                image={require('../assets/GoPlay_PinGift.png')}
                onPress={e => selectPlay(id, pointId)}
              >
                <Callout tooltip>
                  <View>
                    <View style={styles.bubble}>
                      <Text style={styles.name}>{content.title}</Text>
                    </View>
                    <View style={styles.arrowBorder} />
                    <View style={styles.arrow} />
                  </View>
                </Callout>
              </Marker>

            }

          } else if (content.type == "play") {
            return <Marker
              key={pointId}
              coordinate={{
                latitude: geopoints.latitude * 1,
                longitude: geopoints.longitude * 1,
              }}
              image={require('../assets/GoPlay_PinGold.png')}
              onPress={e => selectPlay(id, pointId)}
              style={{height: 10, }}
              resizeMode="contain"
            >
              <Callout tooltip>
                <View>
                  <View style={styles.bubble}>
                    <Text style={styles.name}>{content.title}</Text>
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>
          } else if (content.category == "mtrep") {
            return <Marker
              key={pointId}
              coordinate={{
                latitude: geopoints.latitude * 1,
                longitude: geopoints.longitude * 1,
              }}
              image={require('../assets/GoPlay_PinGreen.png')}
              onPress={e => selectEvent(id, pointId)}
            >
              <Callout tooltip>
                <View>
                  <View style={styles.bubble}>
                    <Text style={styles.name}>{content.title}</Text>
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>

          } else if (content.type == "sponsor") {
            return <Marker
              key={pointId}
              coordinate={{
                latitude: geopoints.latitude * 1,
                longitude: geopoints.longitude * 1,
              }}
              image={require('../assets/GoPlay_PinCopper.png')}
              onPress={e => selectSponsor(id, pointId)}
            >
              <Callout tooltip>
                <View>
                  <View style={styles.bubble}>
                    <Text style={styles.name}>{content.title}</Text>
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>
          } else {
            return <Marker
              key={pointId}
              coordinate={{
                latitude: geopoints.latitude * 1,
                longitude: geopoints.longitude * 1,
              }}
              image={require('../assets/GoPlay_PinCopper.png')}
              onPress={e => selectEvent(id, pointId)}
            >
              <Callout tooltip>
                <View>
                  <View style={styles.bubble}>
                    <Text style={styles.name}>{content.title}</Text>
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>
          }
        }
      }))

      return (
        <>
          {contents}

        </>
      );
    }
  }

  return (
    <View>
      <Cog onPress={() => navigation.navigate('Settings')} />
      {!isLoading ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.00220,
            longitudeDelta: 0.00220,
          }}
          //region={currentRegion}
          //onRegionChangeComplete={onRegionChange}
        >

          <Markers />

          {/* Device Location Marker
          <Marker.Animated
            coordinate={{
              latitude: deviceLatitude,
              longitude: deviceLongitude,
            }}
            image={require('../assets/map_marker.png')}
          /> */}


        </MapView>
      ) : (null)}

      {/* <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      /> */}

    </View>
  );
};


const styles = StyleSheet.create({
  map: {
    height: '100%'
  },
  container: {
    flex: 1,
  },
  bubble: {
    elevation: 2,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'FuturaPT-Book',
    flexDirection: 'row'
  },
  nameDescription: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'FuturaPT-Book',
    flexDirection: 'row'
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#FFF',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32

  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5
  },
  image: {
    flex: 3,
    width: 120,
    height: 80,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -100,
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 550,
  },

});

