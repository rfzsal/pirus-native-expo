import React from 'react';
import {Button, Text, View} from 'react-native';

import styles from '../../styles';

const containerStyle = [styles.padding20];

class HelloReact extends React.Component {
  constructor() {
    super();
    this.state = {angka: 0};

    this.tambahSatu = this.tambahSatu.bind(this);
  }

  tambahSatu() {
    this.setState((state) => ({angka: state.angka + 1}));
  }

  render() {
    return (
      <View style={containerStyle}>
        <Text>Angka saat ini adalah : {this.state.angka}</Text>
          <View style={styles.marginTop6}>
        <Button onPress={this.tambahSatu} title="tambah satu" />
        </View>
      </View>
    );
  }
}

export default HelloReact;
