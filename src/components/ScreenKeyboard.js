import React from 'react';
import {Dimensions} from 'react-native'
import { VirtualKeyboard } from 'react-native-screen-keyboard';

import icBack from '../img/back.png';
import icOkay from '../img/okay.png';
import icLoading from '../img/loader.gif';
import {
  Block, Input, Text,
} from 'galio-framework';

const { height, width } = Dimensions.get('window');

class ScreenKeyboard extends React.Component {
    constructor(props){
        super(props);
        
    }
    state = {
        phone: '', 
        text: ''
    }
    
    keyDown(key){
        if(key.toString() == 'custom')
        {
            this.props.okayPressed(this.state.phone);
            this.setState({ text: '' })
            this.setState({ phone: '' })
            return; 
        }
        if(key.toString() == 'back')
        {
            key = this.state.phone.substr(0,this.state.phone.length-1);
            this.setState({ phone: key })
            this.formatPhone(key);
            return; 
        }
        if(this.state.phone.toString().length >= 10)
            return; 
        key = this.state.phone + key; 
        this.setState({ phone: key });
        this.formatPhone(key);
     }

     formatPhone = (ph) => {
        // Backspace and Delete keys
        ph = ph.toString();
        var deleteKey = false;
        var len = ph.length;
        if(len==0){
            ph=ph;
        }else if(len<3){
            ph='('+ph;
        }else if(len==3){
            ph = '('+ph + (deleteKey ? '' : ') ');
        }else if(len<6){
            ph='('+ph.substring(0,3)+') '+ph.substring(3,6);
        }else if(len==6){
            ph='('+ph.substring(0,3)+') '+ph.substring(3,6)+ (deleteKey ? '' : '-');
        }else{
            ph='('+ph.substring(0,3)+') '+ph.substring(3,6)+'-'+ph.substring(6,10);
        }
        this.setState({ text: ph })
        // return ph;
     }

    render() {
        return(

            <Block>
                <Input
                placeholder=""
                autoCapitalize="none"
                value={this.state.text}
                width={width}
                height= {50}
                // right
                icon="mobile-phone"
                family="font-awesome"
                iconSize={30}
                iconColor="#3a4256"
                editable = {false} 
                // onChangeText={text => this.handleChange('stag', text)}
                style={{borderRadius: 0, paddingBottom: 0, marginBottom: -8.2, fontSize: 25, textAlign:'center'}}
                />
                <VirtualKeyboard
                    onRef={ref => (this.keyboard = ref)}
                    onKeyDown={this.keyDown.bind(this)}
                    keyboardStyle={{marginTop: 0, marginBottom: 0, paddingBottom: 0}}
                    keyStyle={{backgroundColor: "#3a4256"}}
                    keyTextStyle={{color: "white"}}
                    keyboard= {[[1, 2, 3], [4, 5, 6], [7, 8, 9], [ this.props.isLoading?icLoading:icOkay, 0, icBack]]}
                />
            </Block>
        )
    }
}

export default ScreenKeyboard;