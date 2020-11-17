import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import asyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Separator from '../components/Separator';
import LatestData from '../components/LatestData';
import MoreInfo from '../components/MoreInfo';
import News from '../components/News';

import {
  setDailyData,
  setProvinceData,
  setNews,
  setHospitals,
} from '../redux/actions';

import getServer from '../config/server';
import styles from '../styles';

const containerStyle = [styles.padding20];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isRefreshing: false};

    this.refreshData = this.refreshData.bind(this);
  }

  async refreshData() {
    try {
      this.setState({isRefreshing: true});

      await this.loadCovidDataSync();
    } catch (error) {
    } finally {
      this.setState({isRefreshing: false});
    }
  }

  async loadDailyData() {
    const server = getServer('daily');
    const data = await axios.get(server);
    const dailyData = data.data;

    await asyncStorage.setItem('daily', JSON.stringify(dailyData));

    this.props.setDailyData(dailyData);
  }

  async loadProvinceData() {
    const server = getServer('province');
    const data = await axios.get(server);
    const provinceData = data.data;

    await asyncStorage.setItem('province', JSON.stringify(provinceData));

    this.props.setProvinceData(provinceData);
  }

  async loadNewsData() {
    const server = getServer('news');
    const data = await axios.get(server);
    const news = data.data;

    await asyncStorage.setItem('news', JSON.stringify(news));

    this.props.setNews(news);
  }

  async loadHospitalData() {
    const server = getServer('hospitals');
    const data = await axios.get(server);
    const hospitals = data.data;

    await asyncStorage.setItem('hospitals', JSON.stringify(hospitals));

    this.props.setHospitals(hospitals);
  }

  loadCovidData() {
    this.loadDailyData();
    this.loadProvinceData();
    this.loadNewsData();
    this.loadHospitalData();
  }

  async loadCovidDataSync() {
    await this.loadDailyData();
    await this.loadProvinceData();
    await this.loadNewsData();
    await this.loadHospitalData();
  }

  componentDidMount() {
    try {
      this.loadCovidData();
    } catch (error) {}
  }

  render() {
    return (
      <ScrollView
        style={styles.backgroundWhite}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.refreshData}
            colors={['#3fa1ff']}
          />
        }>
        <View style={containerStyle}>
          <LatestData />
        </View>
        <Separator />
        <View style={containerStyle}>
          <MoreInfo navigation={this.props.navigation} />
        </View>
        <Separator />
        <View style={containerStyle}>
          <News navigation={this.props.navigation} />
        </View>
      </ScrollView>
    );
  }
}

const mapDispatch = {setDailyData, setProvinceData, setNews, setHospitals};

export default connect(null, mapDispatch)(Home);
