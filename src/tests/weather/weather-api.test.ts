import { IWeatherGetError, IWeatherGetResponse, WeatherApi } from '../../apis'
import { baseUrl } from '../testConstants'

let weatherApi: WeatherApi
describe('GET: /weather', () => {
  beforeAll(() => {
    weatherApi = new WeatherApi(baseUrl)
  })

  test('Get weather by address works for valid address', async () => {
    const resp = await weatherApi.getWeather('Kyiv')
    expect((resp.data as IWeatherGetResponse).forecast).toBeDefined()
    expect(typeof (resp.data as IWeatherGetResponse).forecast).toEqual('string')
    expect((resp.data as IWeatherGetResponse).location).toBeDefined()
    expect(typeof (resp.data as IWeatherGetResponse).location).toEqual('string')
    expect((resp.data as IWeatherGetError).error).toBeUndefined()
  })

  test('Get weather by address works correctly for cyrillic payload', async () => {
    const resp = await weatherApi.getWeather('Прага')
    expect((resp.data as IWeatherGetResponse).forecast).toBeDefined()
    expect(typeof (resp.data as IWeatherGetResponse).forecast).toEqual('string')
    expect((resp.data as IWeatherGetResponse).location).toBeDefined()
    expect(typeof (resp.data as IWeatherGetResponse).location).toEqual('string')
    expect((resp.data as IWeatherGetError).error).toBeUndefined()
  })

  test('Get weather by address returns error for invalid address', async () => {
    const resp = await weatherApi.getWeather('!!!!!!!!')
    expect((resp.data as IWeatherGetResponse).forecast).toBeUndefined()
    expect((resp.data as IWeatherGetResponse).location).toBeUndefined()
    expect((resp.data as IWeatherGetError).error).toEqual('There has no been any location found. Try another search.')
  })
})

describe('GET: /weather/me', () => {
  beforeAll(() => {
    weatherApi = new WeatherApi(baseUrl)
  })

  test('Get weather by location works correctly for valid long and lat', async () => {
    const resp = await weatherApi.getWeatherAtMyLocation(30.4665545, 50.5215339)
    expect((resp.data as IWeatherGetResponse).forecast).toBeDefined()
    expect(typeof (resp.data as IWeatherGetResponse).forecast).toEqual('string')
    expect((resp.data as IWeatherGetResponse).location).toBeDefined()
    expect(typeof (resp.data as IWeatherGetResponse).location).toEqual('string')
    expect((resp.data as IWeatherGetError).error).toBeUndefined()
  })

  test('Get weather by location returns error for invalid longitude and latitude', async () => {
    const resp = await weatherApi.getWeatherAtMyLocation(-5, -5)
    expect((resp.data as IWeatherGetResponse).forecast).toBeUndefined()
    expect((resp.data as IWeatherGetResponse).location).toBeUndefined()
    expect((resp.data as IWeatherGetError).error).toEqual('There has no been any location found. Try another search.')
  })
})
