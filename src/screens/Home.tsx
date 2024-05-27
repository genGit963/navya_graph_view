import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Chart from '../components/Chart';
import Graph from '../components/Graph';
import {TIME_SERIES_API} from '../api/stock-api';
import {dummy_date} from '../data/dummy_data';
import {ScrollView} from 'react-native-gesture-handler';

const HomeScreen = () => {
  const price_data = [
    {label: 'low', value: 'low'},
    {label: 'high', value: 'high'},
    {label: 'close', value: 'close'},
    {label: 'open', value: 'open'},
  ];
  const symbol = [
    {label: 'IBM', value: 'IBM'},
    {label: 'MSFT', value: 'MSFT'},
  ];

  let [ddSymbol, setDDSymbol] = useState<string>('low');
  let [ddPrice, setDDPrice] = useState<string>('IBM');
  const DropdownSymbol = () => {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    return (
      <View style={ddstyles.container}>
        <Dropdown
          style={[ddstyles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={ddstyles.placeholderStyle}
          selectedTextStyle={ddstyles.selectedTextStyle}
          inputSearchStyle={ddstyles.inputSearchStyle}
          iconStyle={ddstyles.iconStyle}
          data={symbol}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={symbol[0].label}
          value={ddSymbol}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setDDSymbol(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };
  const DropdownPrice = () => {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    return (
      <View style={ddstyles.container}>
        <Dropdown
          style={[ddstyles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={ddstyles.placeholderStyle}
          selectedTextStyle={ddstyles.selectedTextStyle}
          inputSearchStyle={ddstyles.inputSearchStyle}
          iconStyle={ddstyles.iconStyle}
          data={price_data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={price_data[0].label}
          value={ddPrice}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setDDPrice(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

  const [stockData, setStockData] = useState<any>({});

  useEffect(() => {
    const fetchStockChange = async () => {
      console.log('Alpha Vantage Calling for:', ddSymbol);
      await TIME_SERIES_API.time_series_weekly_adjusted(ddSymbol)
        .then(Response => {
          console.log('Alpha Vantage Res:', Response.data); // api testing
          setStockData(Response.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
    fetchStockChange();
  }, [ddSymbol]);

  return (
    <View style={style.Home}>
      <ScrollView>
        <View style={style.DDContainer}>
          <DropdownSymbol />
          <DropdownPrice />
        </View>

        {/*------- Dummy Data --------*/}
        {stockData && <Graph priceType={ddPrice} data={dummy_date} />}

        {/*------- API calling --------*/}
        {/* {stockData && <Graph priceType={ddPrice} data={stockData} />} */}

        {/* <Text>Initial try on 'react-native-graph'</Text>
        <Chart /> */}

        {/* -------Note------- */}
        <View style={style.Note}>
          <Text
            style={{
              color: 'red',
              fontSize: 18,
              textDecorationLine: 'underline',
            }}>
            Note
          </Text>
          <Text>
            Due to API calling limits 25/day, I have used dummy data copied from postman, or
            to see api calling uncomment : /*------- API calling --------*/ just below line.
          </Text>
          <Text>1. Look console messages and play with dropdown. </Text>
          <Text>
            2. When doing Api Calling I get: "Information": "Thank you for using
            Alpha Vantage! Our standard API rate limit is 25 requests per day.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  Home: {
    // alignItems:"center",
  },
  DDContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  Note: {
    width: '98%',
    margin: 'auto',
    padding: 5,
  },
});

const ddstyles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    padding: 16,
    width: '40%',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default HomeScreen;
