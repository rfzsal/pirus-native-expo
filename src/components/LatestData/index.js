import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Rect, Svg, Text as TextSvg} from 'react-native-svg';
import {LineChart} from 'react-native-chart-kit';
import NumberFormat from 'react-number-format';
import {connect} from 'react-redux';

import asyncStorage from '@react-native-async-storage/async-storage';

import Skeleton from '../Skeleton';

import dateHelper from '../../helpers/date';
import styles from '../../styles';

const mainHeaderStyle = [styles.fontLarge, styles.textDarkGray];
const dateTextStyle = [styles.textLightGray];

const mainContainerStyle = [
  styles.flexOne,
  styles.flexRow,
  styles.flexJustifyBetween,
];

const childContainerNavyStyle = [
  styles.flexOne,
  styles.backgroundNavy,
  styles.roundedMedium,
  styles.padding10,
];

const childContainerRedStyle = [
  styles.flexOne,
  styles.backgroundLightRed,
  styles.roundedMedium,
  styles.padding10,
];

const childContainerYellowStyle = [
  styles.flexOne,
  styles.backgroundLightYellow,
  styles.roundedMedium,
  styles.padding10,
];

const childContainerGreenStyle = [
  styles.flexOne,
  styles.backgroundLightGreen,
  styles.roundedMedium,
  styles.padding10,
];

const chartStyle = [styles.roundedMedium];
const mainTitleStyle = [styles.fontMedium, styles.textWhite];
const childContainerTextStyle = [styles.textDarkGray, styles.textCentered];
const mainDataCountStyle = [styles.fontLarge, styles.textWhite];

const dataCountStyle = [
  styles.fontLarge,
  styles.textDarkGray,
  styles.textCentered,
];

class LatestData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chartTooltip: {}, daily: [], latest: {}, date: ''};
  }

  async setData() {
    const localData = await asyncStorage.getItem('daily');

    if (!localData) {
      return;
    }

    const dailyData = JSON.parse(localData);
    const latestData = dailyData[dailyData.length - 1];

    const daily = dailyData.slice(dailyData.length - 6);
    const positive = latestData.jumlah_positif;
    const active = latestData.jumlah_dirawat;
    const recovered = latestData.jumlah_sembuh;
    const death = latestData.jumlah_meninggal;

    const latest = {
      positive,
      active,
      recovered,
      death,
    };

    const millisDate = latestData.tanggal;
    const date = dateHelper.formatDate(millisDate);

    this.setState({daily, latest, date});
  }

  async updateData() {
    const dailyData = this.props.daily;
    const latestData = dailyData[dailyData.length - 1];

    const daily = dailyData.slice(dailyData.length - 6);
    const positive = latestData.jumlah_positif;
    const active = latestData.jumlah_dirawat;
    const recovered = latestData.jumlah_sembuh;
    const death = latestData.jumlah_meninggal;

    const latest = {
      positive,
      active,
      recovered,
      death,
    };

    const millisDate = latestData.tanggal;
    const date = dateHelper.formatDate(millisDate);

    this.setState({daily, latest, date});
  }

  async componentDidMount() {
    try {
      await this.setData();
    } catch (error) {}
  }

  async componentDidUpdate(prevProps) {
    try {
      const needUpdate = prevProps.daily !== this.props.daily;

      if (needUpdate) {
        await this.updateData();
      }
    } catch (error) {}
  }

  render() {
    const latestData = (
      <>
        <Text style={mainHeaderStyle}>Data Terkini</Text>
        <Text style={dateTextStyle}>
          {this.state.date || 'Senin, 2 Maret 2020'}
        </Text>
        <View style={[mainContainerStyle, styles.marginTop12]}>
          <View style={childContainerNavyStyle}>
            <Text style={mainTitleStyle}>Total Kasus Terkonfirmasi</Text>
            <NumberFormat
              value={this.state.latest.positive || 2}
              displayType={'text'}
              thousandSeparator={true}
              renderText={(text) => (
                <Text style={mainDataCountStyle}>{text}</Text>
              )}
            />
          </View>
        </View>
        <View style={[mainContainerStyle, styles.marginTop16]}>
          <View style={childContainerYellowStyle}>
            <Text style={childContainerTextStyle}>Dirawat</Text>
            <NumberFormat
              value={this.state.latest.active || 2}
              displayType={'text'}
              thousandSeparator={true}
              renderText={(text) => <Text style={dataCountStyle}>{text}</Text>}
            />
          </View>
          <View style={[childContainerGreenStyle, styles.marginHorizontal16]}>
            <Text style={childContainerTextStyle}>Sembuh</Text>
            <NumberFormat
              value={this.state.latest.recovered || 0}
              displayType={'text'}
              thousandSeparator={true}
              renderText={(text) => <Text style={dataCountStyle}>{text}</Text>}
            />
          </View>
          <View style={childContainerRedStyle}>
            <Text style={childContainerTextStyle}>Meninggal</Text>
            <NumberFormat
              value={this.state.latest.death || 0}
              displayType={'text'}
              thousandSeparator={true}
              renderText={(text) => <Text style={dataCountStyle}>{text}</Text>}
            />
          </View>
        </View>
      </>
    );

    const chartLoader = (
      <View style={styles.marginTop12}>
        <Skeleton height="238" width="full" />
      </View>
    );

    let datasetsLabel = [];
    let datasetsData = [];

    this.state.daily.forEach((data) => {
      const date = dateHelper.getDate(data.tanggal);

      datasetsLabel.push(date);
      datasetsData.push(data.penambahan.positif);
    });

    const chartData = {
      labels: datasetsLabel,
      datasets: [
        {
          data: datasetsData,
          color: (opacity = 1) => `rgba(44, 82, 130, ${opacity})`,
          strokeWidth: 5,
        },
      ],
    };

    const tooltip = () => {
      const chartTooltip = this.state.chartTooltip;
      let x = chartTooltip.x;
      let y = chartTooltip.y;

      if (y > 175) {
        y -= 30;
      }

      let xText = x + 20;
      let yText = y + 20;

      return x || y ? (
        <Svg>
          <Rect x={x} y={y} width="40" height="30" fill="#2c5282" />
          <TextSvg
            x={xText}
            y={yText}
            fill="white"
            fontWeight="bold"
            fontSize="14"
            textAnchor="middle">
            {this.state.chartTooltip.value}
          </TextSvg>
        </Svg>
      ) : null;
    };

    const chart = (
      <LineChart
        data={chartData}
        height={238}
        width={Dimensions.get('window').width - 40}
        withShadow={false}
        withVerticalLines={false}
        chartConfig={{
          decimalPlaces: 0,
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          propsForDots: {
            r: '5',
          },
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={[chartStyle, styles.marginTop12, styles.marginLeftMin14]}
        decorator={tooltip}
        onDataPointClick={(data) => {
          const isSamePoint =
            this.state.chartTooltip.x === data.x &&
            this.state.chartTooltip.y === data.y;

          if (isSamePoint) {
            this.setState({chartTooltip: {}});
            return;
          }

          const chartTooltip = {
            value: data.value,
            x: data.x,
            y: data.y,
          };

          this.setState({chartTooltip});
        }}
      />
    );

    const dailyData = (
      <>
        <Text style={mainHeaderStyle}>Statistik Penambahan Kasus</Text>
        {this.state.date ? chart : chartLoader}
      </>
    );

    return (
      <>
        <View style={styles.marginBottom12}>{latestData}</View>
        <View style={styles.marginTop16}>{dailyData}</View>
      </>
    );
  }
}

const mapState = (state) => ({daily: state.daily});

export default connect(mapState)(LatestData);
