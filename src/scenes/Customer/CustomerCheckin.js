import React from 'react';
import {
  Alert, Dimensions, KeyboardAvoidingView, StyleSheet, Platform, Image, ImageBackground, ScrollView, 
  ActivityIndicator, View, YellowBox, Linking
} from 'react-native';

import {List, ListItem, Body, Right,  Left, Content} from 'native-base';
// galio component
import {
  Block, Button, Input, NavBar, Text, withGalio, Icon, Card, Switch
} from 'galio-framework';
import theme from '../../theme';


import * as API from  '../../communications/api';

const { height, width } = Dimensions.get('window');

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

class CustomerCheckin extends React.Component {
    static navigationOptions = {   title: 'Customer Checkin',  
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
      firstname:  global.CUST_Profile._customerFirstname,
      hasAppointment: false, 
      Services: [], 
      isLoading: true,
      isSaving: false, 
      activeServices: [], 
      policyAgree: false
      // AllCategories: []
  }
    
    componentDidMount () {
      this._bootstrapAsync();
    }

    /*A lot of activities is done here.  
        First the global custoemr object is checked for existence 
        and all the salon services will be gotten from the api. 
        The services will be marked as selected if there is existing appointment for tha tcustomer witht he services
    */
    _bootstrapAsync = async () => {
     
        //Check global 
        if(global.CUST_Profile  == null)
        {
          this.props.navigation.navigate('SalonLogin');
        }
        else 
        {
          console.log(global.CUST_Profile);
        }


        //Get services 
        var url = API.SalonServices+global.OSL_PROFILE._salonID
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
            //Add selected to the service objects 
            this.setState({Services: responseJson});

            
            //Load active services 
            if(global.CUST_Profile._appointmentActivities != null)
            {
              var act = global.CUST_Profile._appointmentActivities.split(":"); 
              this.setState({hasAppointment: true});
              this.setState({activeServices: act });
            }
            console.log(this.state.activeServices);
        })
        .catch((error) => {
            this.setState({isLoading: false});
            console.log(error);
            Alert.alert('Error', 'Unable to connect, please try again');
        });

    };

 

    selectService = (id) => {
      id = id.toString();
      if(this.state.activeServices.indexOf(id) == -1)
      {
        var sv = this.state.activeServices;
        sv.push(id);
        this.setState({activeServices: sv});
      }
      else 
      {
        var sv = this.state.activeServices;
        sv.splice( sv.indexOf(id) ,1)
        this.setState({activeServices: sv});
      }
    }

    checkSelected = (id) => {
      id = id.toString();
      if(this.state.activeServices.indexOf(id) == -1)
      {
        return false; 
      }
      return true; 
    }

    handleSwitch = (value) => {
      this.setState({policyAgree: value});
    }
    processCheckin() 
    {
        if(this.state.policyAgree == false)
        {
          Alert.alert("Error", "Please agree to the privacy policy");
          return; 
        }
        if(this.state.activeServices.length == 0)
        {
          Alert.alert("Error", "Please select a service");
          return; 
        }

        //Send record to server 
        //api/c/in/{id}/{reminder}/{services}/{appoid}/{salon}/{timezone}

        var apid = this.state.hasAppointment?global.CUST_Profile._appointmentId:-1;
        var svs = this.state.activeServices.join(",");

        var tzone =  global.OSL_PROFILE._timeZone;
        //format tzone 
        tzone = tzone.replace('.', '-');
        tzone = tzone.replace(/ /g, '_');

        var url = API.CheckinCustomer + global.CUST_Profile._customerId + "/1/" + svs + "/" + apid + 
                  "/" + global.OSL_PROFILE._salonID + "/" + tzone; 

        //Send request 
        this.setState({isSaving: true});
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
            this.setState({isSaving: false});
            if(responseJson._status == 1)
            {
               
                //Redirect to checkin 
                
                Alert.alert('Success', 'You have successfully checked in!!!');
                this.props.navigation.navigate('CustomerLogin');
            }
            else 
            {
                Alert.alert('Error', 'Unable to Check In, Please try again');

            }
        })
        .catch((error) => {
            this.setState({isSaving: false});
            console.log(error);
            Alert.alert('Error', 'Unable to connect, please try again');
        });

    }
    


  render() {
    return (
    <Block flex={1} safe  style={{ backgroundColor: theme.COLORS.WHITE, height: height-78  }}>  
        <ScrollView >
        
            <Block >
                <Block flex={1} style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
                  
                    { 
                      this.state.isLoading && 
                      <ActivityIndicator color={theme.COLORS.BUTTON}  />
                    }

                    <Text style={styles.sTitle} >Welcome, {this.state.firstname}</Text>
                    { 
                        this.state.hasAppointment && 
                        <Text style={styles.sSub} >You have an appointment!!!</Text>
                    }

                    {/* <Text style={styles.sTitle} >Select Services</Text> */}

                    <List
                        style = {{backgroundColor: "white", paddingTop: 20, marginLeft: 2, marginRight: 2, borderRadius: 15}}
                        dataArray={Object.keys(this.state.Services)}
                        keyExtractor={(item, index) => item.toString()}
                        nestedScrollEnabled = {true}
                        renderRow={data => {
                        return (

                          <Block>

                            <ListItem   
                                style={{height: 50, marginBottom:10, marginTop: 10}} itemDivider >
                                <Body style={{}}>
                                    <View style={{paddingBottom: 15, paddingTop: 5}}>
                                        <Text style={styles.listHeader}>{this.state.Services[data]._catname}</Text>
                                    </View>
                                </Body> 
                            </ListItem>
                              {
                                // Render Items 
                                this.state.Services[data]._services.map(item => (
                                  <ListItem 
                                    onPress= { () => {this.selectService(item._id)}}
                                    key={item._id} style={ this.checkSelected(item._id)?styles.listSelected: styles.listItem} >
                                    <Text style={this.checkSelected(item._id)?styles.textItemSelected: styles.textItem}>{item._name}</Text>
                                  </ListItem>
                                ))
                               
                              }

                          </Block>  
                          
                        );
                        }}
                    />
                    
                    <Block style={{flexDirection:"row", paddingTop: 30, paddingLeft: 5}} >
                        <View style={{width: '80%', flexDirection: 'row'}}>
                            <Text style={{color: theme.COLORS.BUTTON, fontWeight: 'bold'}}>I Agree to TopSalon </Text>
                            <Text 
                              style={{color: theme.COLORS.FACEBOOK, fontWeight: 'bold'}}  
                              onPress={() => Linking.openURL(API.PrivacyUrl)}>
                                Privacy Policy
                              </Text>
                        </View>
                       
                        <Switch
                          value={this.state.policyAgree}
                          trackColor="white"
                          style={{color:'white', width: '20%'}}

                          onChange={(val) => this.handleSwitch(val) }
                        />
                    </Block>
                </Block>
                <Block flex middle style={{marginTop: 30, marginBottom: 20}}>
                    <Button
                        round
                        color="#3a4256"
                        onPress={() => this.processCheckin() }
                    >
                        {
                            this.state.isSaving ? (
                                <ActivityIndicator color='white'  />
                                ) : (
                            <Text style={{color: 'white'}}>Check In</Text>
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
    resizeMode: 'cover', 
  },
  slogo: {
    maxWidth: width-(0.2*width),   width:width, height: 150, alignSelf: "center", marginTop:0
  },
  sTitle: {alignSelf: 'center', fontSize: 20, color: theme.COLORS.BUTTON, fontWeight:'bold', marginTop: 10, marginBottom: 5 },
  sSub: {alignSelf: 'center', fontSize: 18, color: theme.COLORS.BUTTON, fontWeight:'bold', marginTop: 0, marginBottom: 5 },
  button: {
    width: theme.SIZES.BASE * 2,
    borderColor: 'transparent',
    alignSelf:'flex-end',
    },
  mtext: {
        borderBottomWidth: 1, borderBottomColor: '#3a4256'
  },
  listHeader: {alignSelf: 'center', fontSize: 20, color: theme.COLORS.BUTTON, fontWeight:'bold', marginTop: 10, marginBottom: 5 },
  listItem: { paddingLeft: 10, marginLeft: 0 },
  listSelected: {
    paddingLeft: 10,
    color: theme.COLORS.WHITE,
    backgroundColor: theme.COLORS.BUTTON, marginLeft: 0
  }, 
  textItem: {

  },
  textItemSelected:{
    color: theme.COLORS.WHITE
  }
});

export default CustomerCheckin;
