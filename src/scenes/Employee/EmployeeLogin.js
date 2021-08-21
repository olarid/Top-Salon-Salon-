import React from 'react';
import {Alert, Dimensions, KeyboardAvoidingView, StyleSheet, Platform, Image, View, ScrollView} from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import Modal, { ModalContent, ModalFooter, ModalButton, ModalTitle } from 'react-native-modals';

// galio component
import {Block, Button, Input, NavBar, Text, withGalio, Icon, Card} from 'galio-framework';
import theme from '../../theme';



import ScreenKeyboard from '../../components/ScreenKeyboard';

const { height, width } = Dimensions.get('window');


import * as API from  '../../communications/api';

class EmployeeLogin extends React.Component {

  constructor(props) {
    super(props);
    //Loading default 
    this.state = {
      isTabBarVisible: false,
      phone: '',
      showModal: false, 
      firstname: '', 
      isLoading: false 
    };
  }


  static navigationOptions = {  
    headerShown: false,
  }; 



  processLogin = (phone) => {

    if(phone == '')
    {
        Alert.alert('Error', 'Please Input Your Phone');
        return; 
    }

    this.setState({phone: phone});
    this.setState({showModal: true});
   
  }

  checkInOut = (action) => 
  {
    var base = action == "in"?API.EmployeeLogin:API.EmployeeLogout;
    var tzone =  global.OSL_PROFILE._timeZone;
    //format tzone 
    tzone = tzone.replace('.', '-');
    tzone = tzone.replace(/ /g, '_');

    var msg = action == 'in' ? 'You have successfully checked in!!!':'You have successfully checked out!!!';

    var url = base + this.state.phone + '/' +  global.OSL_PROFILE._salonID + '/' + tzone;

    this.setState({showModal: false});

    //Send request 
    this.setState({isLoading: true});
    let data = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: ''
    }

    fetch(url, data)
    .then(response => response.json())  //promise
    .then(responseJson => {
      console.log(responseJson);
      this.setState({isLoading: false});
      this.setState({showModal: false});
      if(responseJson._status != null &&  responseJson._status > 0)
      {
        Alert.alert('Success', msg);
      }
      else if (responseJson._status != null)
      {
        Alert.alert('Error','You have already checked '+ action + ' OR Invalid Phone Number'); 
      }
      else 
      {
        Alert.alert('Error', 'Unable to Check '+action);
      }
    })
    .catch((error) => {
      this.setState({isLoading: false});
      this.setState({showModal: false});
      console.log(error);
      Alert.alert('Error', 'Unable to connect, please try again');
    });
    // this.props.navigation.navigate('UpdateProfile');
  }

  logOut()
  {
    AsyncStorage.removeItem('oslProfile');
    this.props.navigation.navigate('SalonLogin');
  }

  modalHide()
  {
    this.setState({showModal: false});
  }

  showProfile()
  {
    this.setState({showModal: false});
    this.props.navigation.navigate('UpdateProfile');
  }

  showCheckin()
  {
    this.setState({showModal: false});
    this.props.navigation.navigate('CustomerCheckin');
  }
  


  render() {
    const { navigation } = this.props;
    const { stag, password } = this.state;

    return (
      
    <ScrollView>
      <Modal
          visible={this.state.showModal}
          width = {0.7}
          // modalTitle={<ModalTitle title="Appointment" />}
          footer={
          <ModalFooter style={{backgroundColor: theme.COLORS.BUTTON}}>
              <ModalButton textStyle = {{fontSize: 15, color: "white"}}
              text="Check In"
              onPress={() => this.checkInOut('in')}
              />
              <ModalButton textStyle = {{fontSize: 15, color: "white"}}
              text="Check Out"
              onPress={() => this.checkInOut('out')}
              />
          </ModalFooter>
          }
        >
        <ModalContent style={{paddingTop: 20}}>
            <View style={styles.iContainer}>
                <Text>What would you like to do?</Text>
            </View>
        </ModalContent>
      </Modal>
      <Block flex={1} safe  style={{ backgroundColor: theme.COLORS.WHITE, height: height-78, 
        flexDirectoin: 'column', justifyContent: 'space-between'   }}>

        <NavBar  
          right = {
            <Button
            key="right-options"
            color="transparent"
            style={styles.button}
            onPress={() => this.logOut()}
            >
              <Icon size={theme.SIZES.BASE * 1.0625} name="power-off" family="font-awesome" color={theme.COLORS.BUTTON} />
            </Button>
          } 
        />
            



          <Block flex={1}>
              <Image source={{uri: global.OSL_PROFILE._SalonPicture}}
              
              style={styles.slogo} resizeMode="contain"/>
              
              <Text style={styles.sTitle} >EMPLOYEE LOGIN</Text>
          </Block>
        
          <ScreenKeyboard isLoading = {this.state.isLoading} okayPressed = {this.processLogin} />


      </Block>
    </ScrollView>
   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  logoContainer: {
      flex: 3,
      alignItems: 'center',
      justifyContent: 'center',
  },

  logoImage: {
      width: 250,
      height: 80,
  },
  background: {
    flex: 1,
    width: null,
    // height: DEVICE_HEIGHT,
    resizeMode: 'cover'
  },
  slogo: {
    maxWidth: width-(0.2*width),   width:width, height: 150, alignSelf: "center", marginTop:0
  },
  sTitle: {alignSelf: 'center', fontSize: 25, color: theme.COLORS.BUTTON, fontWeight:'bold', marginTop: 10, marginBottom: 33 },
  button: {
    width: theme.SIZES.BASE * 2,
    borderColor: 'transparent',
    alignSelf:'flex-end'
  },
});



 
export default EmployeeLogin;




