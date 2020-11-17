import React from 'react';
import {Image, TouchableOpacity, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';

import asyncStorage from '@react-native-async-storage/async-storage';

import Skeleton from '../Skeleton';

import dateHelper from '../../helpers/date';
import styles from '../../styles';

const mainHeaderContainerStyle = [
  styles.flexOne,
  styles.flexRow,
  styles.flexYCentered,
  styles.flexJustifyBetween,
];

const mainHeaderStyle = [styles.fontLarge, styles.textDarkGray];
const subtitleTextStyle = [styles.textLightGray];
const contentLinkStyle = [styles.textLightBlue];

const mainContainerStyle = [styles.width250];
const imageStyle = [styles.roundedMedium, styles.height150, styles.width250];
const mainTitleStyle = [styles.textDarkGray];
const dateTextStyle = [styles.fontSmall, styles.textLightGray];

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {news: []};

    this.openAllNews = this.openAllNews.bind(this);
    this.openNewsDetail = this.openNewsDetail.bind(this);
  }

  openAllNews() {
    if (this.state.news.length > 0) {
      const news = this.state.news;
      this.props.navigation.navigate('News', {news});
    }
  }

  openNewsDetail(index) {
    if (this.state.news.length > 0) {
      const news = this.state.news[index];
      this.props.navigation.navigate('NewsDetail', {news});
    }
  }

  async setNews() {
    const localData = await asyncStorage.getItem('news');

    if (!localData) {
      return;
    }

    const news = JSON.parse(localData);

    this.setState({news});
  }

  async updateNews() {
    const news = this.props.news;

    this.setState({news});
  }

  async componentDidMount() {
    try {
      await this.setNews();
    } catch (error) {}
  }

  async componentDidUpdate(prevProps) {
    try {
      const needUpdate = prevProps.news !== this.props.news;

      if (needUpdate) {
        await this.updateNews();
      }
    } catch (error) {}
  }

  render() {
    const loader = (
      <>
        <View style={styles.marginRight16}>
          <Skeleton height={175} width={250} />
        </View>
        <View style={styles.marginRight16}>
          <Skeleton height={175} width={250} />
        </View>
        <View>
          <Skeleton height={175} width={250} />
        </View>
      </>
    );

    const newsData = this.state.news.map((currentNews, index) => {
      const date = dateHelper.formatDate(currentNews.tanggal);
      let style = [mainContainerStyle, styles.marginRight16];

      if (index === this.state.news.length - 1) {
        style = mainContainerStyle;
      }

      return (
        <TouchableOpacity
          onPress={() => this.openNewsDetail(index)}
          style={style}
          key={index}
          activeOpacity={0.75}>
          <Image source={{uri: currentNews.gambar}} style={imageStyle} />
          <Text style={[dateTextStyle, styles.marginTop4]}>{date}</Text>
          <Text style={[mainTitleStyle, styles.marginTop6]}>
            {currentNews.judul}
          </Text>
        </TouchableOpacity>
      );
    });

    const news = (
      <View>
        <View style={mainHeaderContainerStyle}>
          <Text style={mainHeaderStyle}>Berita Terkini</Text>
          <TouchableOpacity onPress={this.openAllNews} activeOpacity={0.75}>
            <Text style={contentLinkStyle}>Selengkapnya</Text>
          </TouchableOpacity>
        </View>
        <Text style={subtitleTextStyle}>
          Dapatkan informasi Covid-19 terbaru
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.marginTop12}>
          {this.state.news.length === 0 ? loader : newsData}
        </ScrollView>
      </View>
    );

    return news;
  }
}

const mapState = (state) => ({news: state.news});

export default connect(mapState)(News);
