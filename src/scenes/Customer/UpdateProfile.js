import React from 'react';
import {
  Alert, Dimensions, KeyboardAvoidingView, StyleSheet, Platform, Image, ImageBackground, ScrollView, View,
   TouchableOpacity, ActivityIndicator
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";
// galio component
import {
  Block, Button, Input, NavBar, Text, withGalio, Icon, Card
} from 'galio-framework';
import theme from '../../theme';


const { height, width } = Dimensions.get('window');
import * as API from  '../../communications/api';


class UpdateProfile extends React.Component {
    static navigationOptions = {   title: 'Update Profile',  
        headerStyle: {  
            backgroundColor: theme.COLORS.BUTTON,  
        },  
        headerTintColor: theme.COLORS.WHITE,  
        headerTitleStyle: {  
        fontWeight: 'bold',  
        color: theme.COLORS.WHITE
        },  
    }; 
    state = {
        phone: '',
        date: new Date(global.CUST_Profile._customerBirthdayReal), 
        showDate: false, 
        //Profile: global.TP_PROFILE, 
        FirstName: global.CUST_Profile._customerFirstname, 
        LastName: global.CUST_Profile._customerLastname, 
        Email: global.CUST_Profile._customerEmail, 
        Phone: global.CUST_Profile._phone
    }

    updateProfile() 
    {
        if(this.state.FirstName == '')
        {
            Alert.alert('Error', 'First Name is Required');
            return; 
        }
        if(this.state.Email == '')
        {
            Alert.alert('Error', 'Email is Required');
            return; 
        }
        if(this.state.Phone == '')
        {
            Alert.alert('Error', 'Phone is Required');
            return; 
        }

        //GET /api/c/update/{name}/{lname}/{birthday}/{phone}/{email}/{salon}/{cid}
        //form the url 
        var dt =  format(this.state.date, "yyyy-MM-dd");

        var url = API.UpdateCustomer + this.state.FirstName+"/"+this.state.LastName+"/"+dt+"/"+this.state.Phone+
                "/"+this.state.Email+"/"  +global.OSL_PROFILE._salonID+
                "/"+global.CUST_Profile._customerId;

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
            // console.log(responseJson);
            this.setState({isLoading: false});
            if(responseJson._status == 200)
            {
                //Update Global Profile 
                global.CUST_Profile._customerFirstname = this.state.FirstName; 
                global.CUST_Profile._customerLastname = this.state.LastName; 
                global.CUST_Profile._customerEmail = this.state.Email; 
                global.CUST_Profile._phone = this.state.Phone; 
                global.CUST_Profile._customerBirthdayReal = dt ;  //Check the format here

                //Redirect to checkin 
                
                Alert.alert('Success', 'Your Information was successfully updated');
                this.props.navigation.navigate('CustomerCheckin');
            }
            else 
            {
                Alert.alert('Error', 'Unable to Update Information, Please try again');

            }
        })
        .catch((error) => {
            this.setState({isLoading: false});
            console.log(error);
            Alert.alert('Error', 'Unable to connect, please try again');
        });
    }   

    datePicker()
    {
        // console.log('Got here');
        this.setState({showDate: true});
    }
    setDate = (event, date) => {
        date = date || this.state.date;
        this.setState({
          showDate: Platform.OS === 'ios' ? true : false,
          date: date
        });
    }


  render() {
    const { navigation } = this.props;
    const { stag, password } = this.state;

    return (
    <Block flex={1} safe  style={{ backgroundColor: theme.COLORS.WHITE, height: height-78  }}>  
        <ScrollView >
        
            <Block >

                <Block flex={1} style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
                    
                    {
                        this.state.showDate &&
                        <DateTimePicker value={this.state.date}
                        mode='date'
                        is24Hour={true}
                        onChange={this.setDate} />
                    }


                    <Input
                        icon="user"
                        family="font-awesome"
                        iconSize={20}
                        iconColor="#3a4256"
                        placeholder="First Name"
                        autoCapitalize="none"
                        borderless
                        style={styles.mtext}
                        value= {this.state.FirstName}
                        onChangeText={ (text) => this.setState({FirstName: text})}
                    />
                    <Input
                        icon="user-circle"
                        family="font-awesome"
                        iconSize={20}
                        iconColor="#3a4256"
                        placeholder="Last Name"
                        autoCapitalize="none"
                        borderless
                        style={styles.mtext}
                        value= {this.state.LastName}
                        onChangeText={ (text) => this.setState({LastName: text})}
                    />
                    <Input
                        icon="at"
                        family="font-awesome"
                        iconSize={23}
                        iconColor="#3a4256"
                        placeholder="Email"
                        autoCapitalize="none"
                        borderless
                        type='email-address'
                        style={styles.mtext}
                        value= {this.state.Email}
                        onChangeText={ (text) => this.setState({Email: text})}
                    />
          
                    <Input
                        icon="mobile"
                        family="font-awesome"
                        iconSize={40}
                        iconColor="#3a4256"
                        placeholder="Phone"
                        autoCapitalize="none"
                        borderless
                        type='number-pad'
                        style={styles.mtext}
                        value= {this.state.Phone}
                        onChangeText={ (text) => this.setState({Phone: text})}
                    />
                    <TouchableOpacity onPress={() => this.datePicker()}>
                        <Text style={{paddingLeft: 15, marginBottom: -10, fontSize: 12}}>DOB</Text>
                        <Input
                            icon="clock"
                            family="font-awesome-5"
                            iconSize={20}
                            iconColor="#3a4256"
                            placeholder="Date Of Birth"
                            autoCapitalize="none"
                            borderless
                            style={styles.mtext}
                            editable = {false} 
                            value={this.state.date.toDateString()}  
                            // help='Date of Birth'   
                            
                        />
                    </TouchableOpacity>  
                </Block>
                <Block flex middle style={{marginTop: 30}}>
                    <Button
                        round
                        color="#3a4256"
                        onPress={() => this.updateProfile() }
                    >
                        {
                            this.state.isLoading ? (
                                <ActivityIndicator color='white'  />
                                ) : (
                            <Text style={{color: 'white'}}>Update Profile</Text>
                        )}
                    </Button>
                </Block>

            </Block>
        </ScrollView>
   
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
    alignSelf:'flex-end',
    },
  mtext: {
        borderBottomWidth: 1, borderBottomColor: '#3a4256'
  }
});

export default UpdateProfile;
