import React, { useState, useContext } from "react";
import 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';
import { Button, StyleSheet, ScrollView, View, Text, StatusBar, Switch, TouchableOpacity, Linking } from 'react-native';
import { windowHeight, windowWidth } from '../components/utils/Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import Cog from '../components/Cog';
import FancyCard from '../components/FancyCard';

import FormButton from '../components/Forms/FormButton';




export default ({ navigation: { goBack }, navigation }) => {
  // const [show, setShow] = useState(false)
  const { user, logout } = useContext(AuthContext);
  // const navigation = useNavigation()
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [isMenu, setIsMenu] = useState(false);

  const ExternalLinkBtn = (props) => {
    return <Button
      title={props.title}
      onPress={() => {
        Linking.openURL(props.url)
          .catch(err => {
            console.error("Failed opening page because: ", err)
            alert('Failed to open page')
          })
      }}
    />
  }


  return (
    <View style={styles.settings}>
      <View><Cog onPress={() => goBack()} /></View>
      <ScrollView style={styles.container}>

        <Text style={styles.header_text}>Settings</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20, }}>
          <FancyCard
            title='Become a Premium Member'
            onPress={() => navigation.navigate('Account')}
          />
        </View>
        <View style={styles.horizontal_rule} />
        <View>
          <View style={styles.inline_rule}>
            <Text style={styles.text}><Feather name="user" size={20} color='#747A21' />  Account</Text>
            <View style={{ alignSelf: 'flex-end' }}>
              {/* <Feather name= "chevron-right" size= {20} color= '#343A3F' /> */}
              <Feather name="chevron-down" size={20} color='#343A3F' />
            </View>
          </View>
          <View style={styles.horizontal_rule} />
          <TouchableOpacity onPress={() => navigation.navigate('Change Password')}>
            <Text style={styles.subtext}>Change Password</Text>
          </TouchableOpacity>
          <View style={styles.horizontal_rule} />
          <TouchableOpacity onPress={() => navigation.navigate('Update Account')}>
            <Text style={styles.subtext}>Update Account</Text>
          </TouchableOpacity>
          {/* <View style={styles.horizontal_rule} />
                <Text style={styles.subtext}>Delete Account</Text> */}

        </View>

        <View style={styles.horizontal_rule} />
        <View style={styles.inline_rule}>
          <Text style={styles.text}><Feather name="bell" size={20} color='#747A21' />  Notifications Enabled</Text>
          <View style={{ alignSelf: 'flex-end' }}>
            <Switch
              trackColor={{ false: "#767577", true: "#C7CAA6" }}
              thumbColor={isEnabled ? "#CD9A36" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>

        </View>

        <View style={styles.horizontal_rule} />
        <View>
          {/* <TouchableOpacity  onPress={()=> navigation.navigate('Privacy')}> */}
          <Text style={styles.text}><Feather name="lock" size={20} color='#747A21' />  Privacy & Security</Text>
          {/* </TouchableOpacity> */}
        </View>

        <View style={styles.horizontal_rule} />
        <TouchableOpacity onPress={() => navigation.navigate('Privacy Policy')}>
          <Text style={styles.subtext}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={styles.horizontal_rule} />
        <TouchableOpacity onPress={() => navigation.navigate('Terms and Conditions')}>
          <Text style={styles.subtext}>Terms and Conditions</Text>
        </TouchableOpacity>

        <View style={styles.horizontal_rule} />
        <View>

          <Text style={styles.text}><Feather name="help-circle" size={20} color='#747A21' />  About</Text>

          <View style={styles.horizontal_rule} />

          <ExternalLinkBtn title="About Us" url="https://montanarep.com/mission" />
          <View style={styles.horizontal_rule} />

          <ExternalLinkBtn title="Facebook" url="https://www.facebook.com/MontanaRep" />
          <View style={styles.horizontal_rule} />

          <ExternalLinkBtn title="Instagram" url="https://www.instagram.com/mtreptheatre/?hl=en" />
          <View style={styles.horizontal_rule} />

          <ExternalLinkBtn title="Rate us on the App Store" url="" />
          <View style={styles.horizontal_rule} />

          <ExternalLinkBtn title="Write a Review" url="" />
          <View style={styles.horizontal_rule} />
          <ExternalLinkBtn title="Contact Us" url="https://montanarep.com/contact" />

        </View>
        <View style={styles.horizontal_rule} />
        <View>
          <TouchableOpacity onPress={() => logout()}>
            <Text style={styles.text}><Feather name="log-out" size={20} color='red' />  Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.horizontal_rule} />

        <Text style={{ marginTop: 20, color: 'grey' }}>Version 0.1.0</Text>

        {/* A little bit wiggle room at the bottom for UX */}
        <View style={{ marginTop: 100, marginBottom: 100 }}></View>


      </ScrollView>

    </View>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },

  header_text: {
    fontSize: 24,
    fontFamily: 'FuturaPTDemi',
    textAlign: 'center',
    color: '#343A3F',
    marginBottom: 20,
  },

  inline_rule: {
    flexDirection: 'row',
    justifyContent: 'space-between'

  },

  horizontal_rule: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 10
  },
  settings: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'row-reverse',
  },
  settingsOpen: {
    position: 'absolute',
    top: 0,
    width: windowWidth,
    height: windowHeight,
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'white',
    // paddingBottom: 80,
  },
  text: {
    fontSize: 18,
    fontFamily: 'FuturaPTBook',
  },

  subtext: {
    fontSize: 18,
    fontFamily: 'FuturaPTBook',
    marginLeft: 60,
  },


});
