import React from 'react';
import {
  Alert, Dimensions, StyleSheet, Platform, Image, ImageBackground, ActivityIndicator
} from 'react-native';

// galio component
import {
  Block, Button, Input, NavBar, Text, withGalio, Icon
} from 'galio-framework';


import AsyncStorage from '@react-native-community/async-storage'


import theme from '../../theme';

// import Icon from 'react-native-vector-icons';


const { height, width } = Dimensions.get('window');

import applogo from '../../img/Logo_white.png';
import bgSrc from '../../img/bgt2.jpg';


import * as API from  '../../communications/api';


class SalonLogin extends React.Component {
  state = {
    stag: '',
    password: '',
    isLoading: false
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  processLogin(){
    // alert(this.state.stag);
    if(this.state.stag == '')
    {
        Alert.alert('Error', 'Please Input Salon Tag');
        return; 
    }
    if(this.state.password == '')
    {
        Alert.alert('Error', 'Please Input your Password');
        return; 
    }

    var url = API.SalonLogin + this.state.stag + '/' + this.state.password ;

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
      this.setState({isLoading: false});
      console.log('test');
      console.log(responseJson);
      if(responseJson._salonName == null || responseJson._salonID == "Not Found")
      {
        Alert.alert('Error', 'Salon Not Found');
      }
      else 
      {
        responseJson._SalonPicture = API.PictureBaseUrl + responseJson._SalonPicture;

        AsyncStorage.setItem('oslProfile', JSON.stringify(responseJson) );  
            
        global.OSL_PROFILE = responseJson;
        this.props.navigation.navigate('HomePage');
      }
        // this.props.loginResponse(responseJson); 
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Error', 'Salon Not Found');
    });


  }


  render() {
    const { navigation } = this.props;
    const { stag, password } = this.state;

    return (
      <Block flex style={{ backgroundColor: theme.COLORS.WHITE }}>

       <ImageBackground style={styles.background} source={bgSrc} imageStyle= {{opacity:0.8}}>
          <Block row center space="between" style={{ marginVertical: theme.SIZES.BASE * 1.875 }}>
              <Block style={styles.logoContainer}>
                <Image source={applogo} style={styles.logoImage} />
              </Block>
          </Block>
          <Block flex center style={{ marginTop: theme.SIZES.BASE * 3, marginBottom: height * 0.0001 }}>
            <Text muted center size={theme.SIZES.FONT * 0.875} style={{ paddingHorizontal: theme.SIZES.BASE * 2.3,
            color: theme.COLORS.WHITE }}>
              Welcome to Salon Manager. Please login using your Salon Tag and Password to get started 
            </Text>
          </Block>

          <Block flex={2} center space="evenly">
            <Block flex={2}>
              <Input
                rounded
                placeholder="Salon Tag"
                autoCapitalize="none"
                style={{ width: width * 0.9 }}
                onChangeText={text => this.handleChange('stag', text)}
              />
              <Input
                rounded
                password
                viewPass
                placeholder="Password"
                style={{ width: width * 0.9 }}
                onChangeText={text => this.handleChange('password', text)}
              />
              <Text
                color={theme.COLORS.WHITE}
                size={theme.SIZES.FONT * 0.75}
                onPress={() => Alert.alert('Not implemented')}
                style={{ alignSelf: 'flex-end', lineHeight: theme.SIZES.FONT * 2 }}
              >
                Forgot your password?
              </Text>
            </Block>
            <Block flex middle>
              <Button
                round
                color="#3a4256"
                onPress={() => this.processLogin() }
              >
                 {
                    this.state.isLoading ? (
                          <ActivityIndicator color='white'  />
                          ) : (
                      <Text style={{color: 'white'}}>Sign In</Text>
                  )}
              </Button>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
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
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
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
});

export default SalonLogin;
