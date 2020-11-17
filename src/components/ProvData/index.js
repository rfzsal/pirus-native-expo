import React from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Line, Svg} from 'react-native-svg';
import NumberFormat from 'react-number-format';
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

const provContainerStyle = [
  styles.backgroundLightGray,
  styles.roundedMedium,
  styles.padding10,
];

const dataContainerStyle = [
  styles.flexOne,
  styles.flexRow,
  styles.flexJustifyBetween,
];

const childDataContainerStyle = [styles.flexOne];
const childDataContainerTextStyle = [styles.textDarkGray, styles.textCentered];

const mainTitleStyle = [
  styles.fontMedium,
  styles.textDarkGray,
  styles.textCapitalized,
];

const mainTitleNonCapStyle = [styles.fontMedium, styles.textDarkGray];

class ProvData extends React.Component {
  _isLoaded = false;
  _province = [];

  constructor(props) {
    super(props);
    this.state = {searchValue: '', province: []};

    this.changeText = this.changeText.bind(this);
    this.clearText = this.clearText.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  filterData(text) {
    let province = [];

    this._province.forEach((currentData) => {
      const searchValue = text.toLowerCase();
      const currentProvince = currentData.provinsi.toLowerCase();

      if (currentProvince.indexOf(searchValue) > -1) {
        province.push(currentData);
      }
    });

    this.setState({province});
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
    this.setState({searchValue: '', province: this._province.slice(0, 10)});
  }

  async setData() {
    const localData = await asyncStorage.getItem('province');

    if (!localData) {
      return;
    }

    const allProvince = JSON.parse(localData).data;
    const province = allProvince.slice(0, 10);

    this._isLoaded = true;
    this._province = allProvince;

    this.setState({province});
  }

  async updateData() {
    const provinceData = this.props.province;
    const province = provinceData.data;

    this._isLoaded = true;
    this._province = province;

    this.setState({province});
  }

  loadMore() {
    const currentLength = this.state.province.length;

    if (currentLength === this._province.length) {
      return;
    }

    const nextProvince = this._province.slice(
      currentLength,
      currentLength + 10,
    );

    this.setState((state) => ({
      province: [...state.province, ...nextProvince],
    }));
  }

  async componentDidMount() {
    try {
      await this.setData();
    } catch (error) {}
  }

  async componentDidUpdate(prevProps) {
    try {
      const needUpdate = prevProps.province !== this.props.province;

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
          placeholder="Cari Provinsi..."
          value={this.state.searchValue}
          onChangeText={(text) => this.changeText(text)}
          style={searchInputStyle}
          editable={
            this.state.province.length === 0 && !this._isLoaded ? false : true
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

    const provNotFound = (
      <Text style={[notFoundTextStyle, styles.marginTop16]}>
        Provinsi tidak ditemukan
      </Text>
    );

    const provDataCard = ({item, index}) => {
      let province = item.provinsi;
      let isJakarta = false;

      if (province === 'DKI JAKARTA') {
        province = 'DKI Jakarta';
        isJakarta = true;
      }

      const marginTop = index === 0 ? styles.marginTop16 : null;

      const marginBottom =
        index === this.state.province.length - 1
          ? styles.marginBottom16
          : styles.marginBottom12;

      return (
        <View style={[provContainerStyle, marginTop, marginBottom]}>
          <Text style={isJakarta ? mainTitleNonCapStyle : mainTitleStyle}>
            {province}
          </Text>
          <View style={[dataContainerStyle, styles.marginTop12]}>
            <View syle={childDataContainerStyle}>
              <Text style={childDataContainerTextStyle}>Dirawat</Text>
              <NumberFormat
                value={item.jumlah_dirawat}
                displayType={'text'}
                thousandSeparator={true}
                renderText={(text) => (
                  <Text style={childDataContainerTextStyle}>{text}</Text>
                )}
              />
            </View>
            <View syle={childDataContainerStyle}>
              <Text style={childDataContainerTextStyle}>Sembuh</Text>
              <NumberFormat
                value={item.jumlah_sembuh}
                displayType={'text'}
                thousandSeparator={true}
                renderText={(text) => (
                  <Text style={childDataContainerTextStyle}>{text}</Text>
                )}
              />
            </View>
            <View syle={childDataContainerStyle}>
              <Text style={childDataContainerTextStyle}>Meninggal</Text>
              <NumberFormat
                value={item.jumlah_meninggal}
                displayType={'text'}
                thousandSeparator={true}
                renderText={(text) => (
                  <Text style={childDataContainerTextStyle}>{text}</Text>
                )}
              />
            </View>
          </View>
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
          data={this.state.province}
          renderItem={provDataCard}
          keyExtractor={(province) => province.provinsi}
          ListEmptyComponent={this._isLoaded ? provNotFound : loader}
          onEndReached={this.state.searchValue === '' && this.loadMore}
          onEndReachedThreshold={0.5}
        />
      </>
    );
  }
}

const mapState = (state) => ({province: state.province});

export default connect(mapState)(ProvData);
