import React from 'react';
import {ScrollView, View} from 'react-native';

import AllNews from '../components/AllNews';

import styles from '../styles';

const containerStyle = [styles.padding20];

const News = (props) => (
  <ScrollView
    style={styles.backgroundWhite}
    showsVerticalScrollIndicator={false}>
    <View style={containerStyle}>
      <AllNews news={props.route.params.news} navigation={props.navigation} />
    </View>
  </ScrollView>
);

export default News;
