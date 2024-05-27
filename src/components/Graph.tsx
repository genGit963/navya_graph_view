import {View, Text, StyleSheet} from 'react-native';
import {CartesianChart, Line, useChartPressState} from 'victory-native';
import {Circle, useFont} from '@shopify/react-native-skia';
import {WeeklyData} from '../models/stock';
import {format} from 'date-fns';
import {SharedValue} from 'react-native-reanimated';

function ToolTip({x, y}: {x: SharedValue<number>; y: SharedValue<number>}) {
  return <Circle cx={x} cy={y} r={8} color="darkblue" />;
}
interface GrapProps {
  priceType: string;
  data: any;
}

export default function Graph({priceType = 'low', data}: GrapProps) {
  const font = useFont(require('../assets/Inter-Medium.ttf'), 10);

  // destructuring to time series format
  const dataArray: WeeklyData[] = Object.entries(
    data['Weekly Adjusted Time Series'],
  ).map(([date, data]: any) => ({
    date,
    open: data['1. open'],
    high: data['2. high'],
    low: data['3. low'],
    close: data['4. close'],
  }));
  
  // graph-points acc. to specific price_type: low, high, close, open
  const specificPrices = dataArray.map(item => {
    switch (priceType) {
      case 'close':
        return {
          value: Number(item.close),
          date: Number(new Date(item.date)),
        };
      case 'low':
        return {
          value: Number(item.low),
          date: Number(new Date(item.date)),
        };
      case 'high':
        return {
          value: Number(item.high),
          date: Number(new Date(item.date)),
        };

      default:
        return {
          value: Number(item.open),
          date: Number(new Date(item.date)),
        };
    }
  });

// graph line press-sensing
  const {state, isActive} = useChartPressState({
    x: specificPrices[0].date,
    y: {value: specificPrices[0].value},
  });

  // muting the warning
  if (process.env.NODE_ENV !== 'production') {
    const originalWarn = console.error;
    console.error = (...args) => {
      if (
        args[0].includes(
          'Support for defaultProps will be removed from function components in a future major release.',
        )
      ) {
        return;
      }
      originalWarn(...args);
    };
  }

  return (
    <View style={styles.Container}>
      <View style={styles.CompanyDetail}>
        <Text style={{fontSize: 20, color: 'blue', fontWeight: '700'}}>
          {data['Meta Data']['2. Symbol']}
        </Text>
        <Text>{data['Meta Data']['3. Last Refreshed']}</Text>
        <Text>{data['Meta Data']['4. Time Zone']}</Text>
      </View>

      <View style={styles.Graph}>
        <CartesianChart
          chartPressState={state}
          data={specificPrices}
          xKey="date"
          yKeys={['value']}
          axisOptions={{
            font,
            tickCount: 5,
            labelColor: 'gray',
            labelOffset: {x: -2, y: 0},
            formatYLabel: v => '$' + `${v}`,
            formatXLabel: d => format(new Date(d), 'dd-mm-yyyy'),
          }}>
          {({points}) => (
            <>
              <Line
                points={points.value}
                color="blue"
                strokeWidth={specificPrices.length > 1000 ? 1 : 4}
                animate={{type: 'timing', duration: 2000}}
              />
              {isActive && (
                <ToolTip x={state.x.position} y={state.y.value.position} />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    height: 500,
    width: 'auto',
    alignItems: 'center',
  },
  CompanyDetail: {
    width: '96%',
    padding: 5,
  },
  Graph: {
    width: '96%',
    height: 400,
    marginVertical: 20,
  },
});
