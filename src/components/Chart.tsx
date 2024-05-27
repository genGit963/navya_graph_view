/**
 * It was just initial try to study data structure and 
 * restructuring process in graphical view 
 * go to /components/Graph.tsx 
 * file for actual graph view
 */

import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LineGraph, GraphPoint} from 'react-native-graph';
import {dummy_date} from '../data/dummy_data';
import {GraphRange} from 'react-native-graph/lib/typescript/LineGraphProps';
import {WeeklyData2 } from '../models/stock';

const Chart = () => {
  const dataArray: WeeklyData2[] = Object.entries(
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
      value: Number(item.open),
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

  // ---------------- range ---------------
  const highestDate = useMemo(
    () =>
      graphPoints.length !== 0 && graphPoints[graphPoints.length - 1] != null
        ? graphPoints[graphPoints.length - 1]!.date
        : undefined,
    [graphPoints],
  );

  const range: GraphRange | undefined = useMemo(() => {
    // if range is disabled, default to infinite range (undefined)
    // if (!enableRange) return undefined;
    if (graphPoints.length !== 0 && highestDate != null) {
      return {
        x: {
          min: graphPoints[0]!.date,
          max: new Date(highestDate.getTime() + 50 * 1000 * 60 * 60 * 24),
        },
        y: {
          min: 0,
          max: 200,
        },
      };
    } else {
      return {
        y: {
          min: 0,
          max: 200,
        },
      };
    }
  }, [highestDate, graphPoints]);

  return (
    <View style={styles.Container}>
      <View style={styles.Numbers}>
        <Text style={styles.CurrentValue}>
          {currentPoint.date.toDateString()}
        </Text>
        <Text style={[styles.CurrentValue, {color: 'blue', fontSize: 24}]}>
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
        range={range}
        enableIndicator
        indicatorPulsating
        enableFadeInMask
      />

      <View>

      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  CurrentValue: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  LineGraph: {height: 400, width: '98%'},
});

export default Chart;
