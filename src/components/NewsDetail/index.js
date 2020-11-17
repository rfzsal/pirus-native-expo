import React from 'react';
import {Image, Text, View} from 'react-native';

import dateHelper from '../../helpers/date';
import styles from '../../styles';

const imageStyle = [styles.height225];
const containerStyle = [styles.paddingHorizontal20];
const mainHeaderStyle = [styles.fontLarge, styles.textDarkGray];
const dateTextStyle = [styles.textLightGray];
const contentTextStyle = [styles.textDarkGray];

class NewsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {news: {}, data: []};
  }

  getNews() {
    const news = this.props.news;
    const data = news.data;

    this.setState({news, data});
  }

  async componentDidMount() {
    try {
      this.getNews();
    } catch (error) {}
  }

  render() {
    const newsData = this.state.data.map((text) => {
      return `${text}\n\n`;
    });

    const newsImage = this.state.news.gambar;

    const news = (
      <View>
        <Image source={{uri: newsImage}} style={imageStyle} />
        <View style={[containerStyle, styles.marginTop12]}>
          <Text style={mainHeaderStyle}>{this.state.news.judul}</Text>
          <Text style={dateTextStyle}>
            {dateHelper.formatDate(this.state.news.tanggal)}
          </Text>
          <Text style={[contentTextStyle, styles.marginTop16]}>{newsData}</Text>
        </View>
      </View>
    );

    return news;
  }
}

export default NewsDetail;
