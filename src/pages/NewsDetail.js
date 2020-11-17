import React from 'react';
import {ScrollView} from 'react-native';

import News from '../components/NewsDetail';

import styles from '../styles';

const NewsDetail = (props) => (
  <ScrollView
    style={styles.backgroundWhite}
    showsVerticalScrollIndicator={false}>
    <News news={props.route.params.news} />
  </ScrollView>
);

export default NewsDetail;
