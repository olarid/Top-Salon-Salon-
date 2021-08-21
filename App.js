/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Welcome from './src/scenes/Welcome'

import Navigator from './src/components/Navigator'

console.reportErrorsAsExceptions = false;

const App: () => React$Node = () => {
  return (
      <Navigator />
  );
};

export default App;
