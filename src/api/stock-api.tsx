import axios, {AxiosInstance} from 'axios';

const STOCK_API: AxiosInstance = axios.create({
  baseURL: `${process.env.API_BASE}`,
  timeout: 2000, //in 20 sec
});

export const TIME_SERIES_API = {

  time_series_weekly_adjusted: async (symbol: string) => {
    return await STOCK_API.request({
      method: 'GET',
      url: `/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${process.env.API_KEY}`,
      headers: {
        Accept: 'application/json'
      },
    });
  },
};
