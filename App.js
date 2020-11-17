/**
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import store from './src/redux/store';

import Home from './src/pages/Home'; // komponen home
import Province from './src/pages/Province';
import Hospitals from './src/pages/Hospitals';
import News from './src/pages/News';
import NewsDetail from './src/pages/NewsDetail';

import HelloReact from './src/components/HelloReact'; // hapus ini

const Stack = createStackNavigator();

const App = () => (
  <>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HelloReact} // ubah komponen jadi home, cek import di atas
            options={{title: 'Pirus'}}
          />
          <Stack.Screen
            name="Province"
            component={Province}
            options={{title: 'Data Provinsi', headerStyle: {elevation: 0}}}
          />
          <Stack.Screen
            name="Hospitals"
            component={Hospitals}
            options={{title: 'Data Rumah Sakit', headerStyle: {elevation: 0}}}
          />
          <Stack.Screen
            name="News"
            component={News}
            options={{title: 'Berita Terkini'}}
          />
          <Stack.Screen
            name="NewsDetail"
            component={NewsDetail}
            options={{title: 'Berita'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  </>
);

export default App;
