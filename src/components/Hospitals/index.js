import React from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Line, Svg} from 'react-native-svg';
import {connect} from 'react-redux';

import asyncStorage from '@react-native-async-storage/async-storage';

import Skeleton from '../Skeleton';

import styles from '../../styles';

const searchContainerStyle = [
  styles.backgroundWhite,
  styles.paddingHorizontal20,
];

const searchInputParentStyle = [
  styles.flexRow,
  styles.flexJustifyBetween,
  styles.backgroundLightGray,
  styles.textDarkGray,
  styles.borderGray,
  styles.roundedMedium,
  styles.height48,
  styles.paddingLeft10,
  styles.paddingRight5,
];

const searchInputStyle = [styles.width90Percent];
const clearInputButtonStyle = [styles.flexOne, styles.flexCentered];

const scrollContainerStyle = [
  styles.backgroundWhite,
  styles.paddingHorizontal20,
];

const notFoundTextStyle = [styles.textDarkGray, styles.textCentered];

const hospitalsContainerStyle = [
  styles.backgroundLightGray,
  styles.roundedMedium,
  styles.padding10,
];

const mainTitleStyle = [styles.fontMedium, styles.textDarkGray];

const subtitleStyle = [
  styles.fontSmall,
  styles.textDarkGray,
  styles.textCapitalized,
];

const contactTextStyle = [styles.textDarkGray];

class Hospitals extends React.Component {
  _isLoaded = false;
  _hospitals = [];

  constructor(props) {
    super(props);
    this.state = {searchValue: '', hospitals: []};

    this.changeText = this.changeText.bind(this);
    this.clearText = this.clearText.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  filterData(text) {
    let hospitals = [];

    this._hospitals.forEach((currentData) => {
      const searchValue = text.toLowerCase();
      const currentHospital = currentData.nama.toLowerCase();
      const currentRegion = currentData.wilayah.split(', ')[1].toLowerCase();
      const currentAddress = currentData.alamat.toLowerCase();

      const allHospitals = [
        currentHospital,
        currentRegion,
        currentAddress,
      ].join();

      if (allHospitals.indexOf(searchValue) > -1) {
        hospitals.push(currentData);
      }
    });

    this.setState({hospitals});
  }

  changeText(text) {
    this.setState({searchValue: text});

    if (text) {
      this.filterData(text);
    } else {
      this.clearText();
    }
  }

  clearText() {
    this.setState({searchValue: '', hospitals: this._hospitals.slice(0, 15)});
  }

  async setData() {
    const localData = await asyncStorage.getItem('hospitals');

    if (!localData) {
      return;
    }

    const allHospitals = JSON.parse(localData);
    const hospitals = allHospitals.slice(0, 15);

    this._isLoaded = true;
    this._hospitals = allHospitals;

    this.setState({hospitals});
  }

  async updateData() {
    const hospitalsData = this.props.hospitals;
    const hospitals = hospitalsData;

    this._isLoaded = true;
    this._hospitals = hospitals;

    this.setState({hospitals});
  }

  loadMore() {
    const currentLength = this.state.hospitals.length;

    if (currentLength === this._hospitals.length) {
      return;
    }

    const nextHospitals = this._hospitals.slice(
      currentLength,
      currentLength + 15,
    );

    this.setState((state) => ({
      hospitals: [...state.hospitals, ...nextHospitals],
    }));
  }

  async componentDidMount() {
    try {
      await this.setData();
    } catch (error) {}
  }

  async componentDidUpdate(prevProps) {
    try {
      const needUpdate = prevProps.hospitals !== this.props.hospitals;

      if (needUpdate) {
        await this.updateData();
      }
    } catch (error) {}
  }

  render() {
    const loader = (
      <>
        <View style={styles.marginTop16}>
          <Skeleton height="99" width="full" />
        </View>
        <View style={styles.marginTop16}>
          <Skeleton height="99" width="full" />
        </View>
        <View style={styles.marginTop16}>
          <Skeleton height="99" width="full" />
        </View>
      </>
    );

    const searchInput = (
      <View style={[searchInputParentStyle, styles.marginTop12]}>
        <TextInput
          placeholder="Cari Rumah Sakit..."
          value={this.state.searchValue}
          onChangeText={(text) => this.changeText(text)}
          style={searchInputStyle}
          editable={
            this.state.hospitals.length === 0 && !this._isLoaded ? false : true
          }
        />
        {this.state.searchValue === '' ? null : (
          <TouchableOpacity
            onPress={this.clearText}
            style={clearInputButtonStyle}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              width="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x">
              <Line x1="18" y1="6" x2="6" y2="18" />
              <Line x1="6" y1="6" x2="18" y2="18" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    );

    const hospitalsNotFound = (
      <Text style={[notFoundTextStyle, styles.marginTop16]}>
        Rumah sakit tidak ditemukan
      </Text>
    );

    const hospitalsDataCard = ({item, index}) => {
      let hospitalName = item.nama;
      let hospitalRegion = item.wilayah.split(', ')[1];
      let hospitalAddress = item.alamat;
      let hospitalContact = item.telepon;

      const marginTop = index === 0 ? styles.marginTop16 : null;

      const marginBottom =
        index === this.state.hospitals.length - 1
          ? styles.marginBottom16
          : styles.marginBottom12;

      return (
        <View style={[hospitalsContainerStyle, marginTop, marginBottom]}>
          <Text style={mainTitleStyle}>{hospitalName}</Text>
          <Text
            style={
              subtitleStyle
            }>{`${hospitalAddress}, ${hospitalRegion}`}</Text>
          {hospitalContact ? (
            <Text style={[contactTextStyle, styles.marginTop4]}>
              Kontak : {hospitalContact}
            </Text>
          ) : null}
        </View>
      );
    };

    return (
      <>
        <View style={[searchContainerStyle, styles.marginTopMin12]}>
          {searchInput}
        </View>
        <FlatList
          style={scrollContainerStyle}
          showsVerticalScrollIndicator={false}
          data={this.state.hospitals}
          renderItem={hospitalsDataCard}
          keyExtractor={(hospital) => hospital.nama}
          ListEmptyComponent={this._isLoaded ? hospitalsNotFound : loader}
          onEndReached={this.state.searchValue === '' && this.loadMore}
          onEndReachedThreshold={0.5}
        />
      </>
    );
  }
}

const mapState = (state) => ({hospitals: state.hospitals});

export default connect(mapState)(Hospitals);
