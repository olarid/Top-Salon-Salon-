
import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage'

class Welcome extends Component {

    componentDidMount () {
        this._bootstrapAsync();
        SplashScreen.hide();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const profile = await AsyncStorage.getItem('oslProfile');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.

        if(profile != null)
        {
            global.OSL_PROFILE = JSON.parse(profile);
            this.props.navigation.navigate('HomePage');
        }
        else 
        {
            this.props.navigation.navigate('SalonLogin');
        }
    };


    render () {
        return (
            <View>
            </View>
        );
    }
}


export default Welcome;