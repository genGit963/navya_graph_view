import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LineGraph, GraphPoint} from 'react-native-graph';
import {dummy_date} from '../data/dummy_data';

type WeeklyData = {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  adjustedClose: string;
  volume: string;
  dividendAmount: string;
};

const Chart = () => {
  const dataArray: WeeklyData[] = Object.entries(
    dummy_date['Weekly Adjusted Time Series'],
  ).map(([date, data]) => ({
    date,
    open: data['1. open'],
    high: data['2. high'],
    low: data['3. low'],
    close: data['4. close'],
    adjustedClose: data['5. adjusted close'],
    volume: data['6. volume'],
    dividendAmount: data['7. dividend amount'],
  }));

//   console.log('convert: ', dataArray); // debugging

  const specificPrices = dataArray.map(item => {
    return {
      value: Number(item.adjustedClose),
      date: new Date(item.date),
    };
  });

  const graphPoints: GraphPoint[] = specificPrices;

  // state: current point
  const [currentPoint, setCurrentPoint] = useState<GraphPoint>(graphPoints[0]);
  const handleSelectedPoint = (point: GraphPoint) => {
    // console.log(point); //debugging
    setCurrentPoint(point);
  };

  return (
    <View style={styles.Container}>
      <View style={styles.Numbers}>
        <Text style={styles.CurrentValue}>
          {currentPoint.date.toDateString()}
        </Text>
        <Text style={[styles.CurrentValue, {color: 'blue', fontSize:24}]}>
          ${parseFloat(currentPoint.value.toFixed(2))}
        </Text>
      </View>

      <LineGraph
        style={styles.LineGraph}
        points={graphPoints}
        animated={true}
        color="#0073CF"
        gradientFillColors={['#0073CF', '#FFF']}
        enablePanGesture
        onPointSelected={handleSelectedPoint}
        // range={}
        enableIndicator
        indicatorPulsating
        enableFadeInMask
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    marginTop: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  Numbers: {
    alignItems: 'flex-start',
    width: '98%',
    height: 'auto',
    marginVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'lightblue',
  },
  CurrentValue: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  LineGraph: {height: 400, width: '98%'},
});

export default Chart;
