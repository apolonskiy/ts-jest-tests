import axios, { AxiosResponse } from 'axios'

export interface IWeatherGetResponse {
  forecast: string
  location: string
}

export interface IWeatherGetError {
  error: string
}

export class WeatherApi {
    baseUrl: string;
    constructor (baseUrl: string) {
      this.baseUrl = baseUrl
    }

    async getWeather (location: string): Promise<AxiosResponse<IWeatherGetResponse | IWeatherGetError>> {
      return await axios.get(`${this.baseUrl}/weather`, {
        params: { address: location }
      })
    }

    async getWeatherAtMyLocation (longitude: number, latitude: number): Promise<AxiosResponse<IWeatherGetResponse | IWeatherGetError>> {
      return await axios.get(`${this.baseUrl}/weather/me`, {
        params: { longitude, latitude }
      })
    }
}
