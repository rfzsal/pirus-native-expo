import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';

import dateHelper from '../../helpers/date';
import styles from '../../styles';

const imageStyle = [styles.roundedMedium, styles.height225];
const mainHeaderStyle = [styles.fontMedium, styles.textDarkGray];
const dateTextStyle = [styles.textLightGray];

class AllNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {news: []};

    this.openNewsDetail = this.openNewsDetail.bind(this);
  }

  openNewsDetail(index) {
    if (this.state.news.length > 0) {
      const news = this.state.news[index];
      this.props.navigation.navigate('NewsDetail', {news});
    }
  }

  getNews() {
    const news = this.props.news;

    this.setState({news});
  }

  componentDidMount() {
    try {
      this.getNews();
    } catch (error) {}
  }

  render() {
    const news = this.state.news.map((currentNews, index) => {
      const marginBottom = index > 0 ? styles.marginTop24 : null;

      return (
        <TouchableOpacity
          onPress={() => this.openNewsDetail(index)}
          style={marginBottom}
          activeOpacity={0.75}
          key={index}>
          <Image source={{uri: currentNews.gambar}} style={imageStyle} />
          <Text style={dateTextStyle}>
            {dateHelper.formatDate(currentNews.tanggal)}
          </Text>
          <Text style={mainHeaderStyle}>{currentNews.judul}</Text>
        </TouchableOpacity>
      );
    });

    return news;
  }
}

export default AllNews;
