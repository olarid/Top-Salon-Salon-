import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { StyleSheet, Text, View } from 'react-native';  

import Icon from 'react-native-vector-icons/Ionicons';  

//Screens 
import SalonLogin from '../scenes/SalonLogin/SalonLogin'
import Welcome from '../scenes/Welcome'

//Employee 
import EmployeeLogin from '../scenes/Employee/EmployeeLogin';

//Customers 
import UpdateProfile from '../scenes/Customer/UpdateProfile';
import CustomerCheckin from '../scenes/Customer/CustomerCheckin';
import CustomerLogin from '../scenes/Customer/CustomerLogin';
import CreateProfile from '../scenes/Customer/CreateProfile';



//Customers Navigation 
const CustomerStack = createStackNavigator(  
  {  
      CustomerLogin: CustomerLogin,  
      UpdateProfile: UpdateProfile,  
      CustomerCheckin: CustomerCheckin,
      CreateProfile: CreateProfile  
  },  
  {  
      initialRouteName: "CustomerLogin"  
  }  
);  

CustomerStack.navigationOptions = ({ navigation }) => {   let
  tabBarVisible = true;   if (navigation.state.index > 0) {
       tabBarVisible = false;   }
 
     return {
       tabBarVisible,
     }; 
 };


//Homepage Navigations
const HomePage = createMaterialBottomTabNavigator(  
{  
      CustomerLogin: { screen: CustomerStack,  
          navigationOptions:{  
              tabBarLabel:'Customer Login',  
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>  
                  </View>),  
          }  
      },  
      EmployeeLogin: { screen: EmployeeLogin,  
          navigationOptions:{  
              tabBarLabel:'Employee Login', 
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>  
                  </View>), 
              // barStyle: { backgroundColor: '#f69b31' }
          }  
      },  
  },  
  {  
    initialRouteName: "CustomerLogin",  
    activeColor: '#f0edf6',  
    inactiveColor: '#5e5477',  
    barStyle: { backgroundColor: '#3a4256' },  
  },  
); 



//Main Navigator 
const Navigator =  createAppContainer(
  createSwitchNavigator(
    {
        SalonLogin: SalonLogin,
        HomePage: HomePage,
        Welcome: Welcome
    },
    {
      initialRouteName: 'Welcome',
    }
  )
);

export default Navigator;