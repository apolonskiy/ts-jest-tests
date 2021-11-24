import {
  CompanyApi, ILoginResponse,
  ICreateProductResponse,
  ICreateProductErrorResponse,
  ProductApi
} from '../../bineryApi'
import { binaryBaseUrl } from '../testConstants'

let companyApi: CompanyApi
let productApi: ProductApi

const testEmail = 'dev@mailinator.com'
const testPwd = '123456'

let authToken: string
describe('POST: /product', () => {
  beforeAll(async () => {
    companyApi = new CompanyApi(binaryBaseUrl)
    productApi = new ProductApi(binaryBaseUrl)

    const loginResp = await companyApi.login({ email: testEmail, password: testPwd })
    authToken = (loginResp.data as ILoginResponse).data.auth.token
  })
  afterEach(async () => {

  })

  const createPayload = {
    title: 'test',
    description: 'test',
    prices: [
      {
        price: '12',
        currency: 'USD',
        billingType: 'recurring',
        planInterval: 'monthly',
        trialDays: '5'
      },
      {
        price: '188',
        currency: 'HKD',
        billingType: 'recurring',
        planInterval: 'yearly',
        trialDays: '10'
      }
    ]
  }

  test('POST: /create with valid data successfully creates a product', async () => {
    const resp = await productApi.createProduct(createPayload, authToken)
    expect(resp.data).toBeDefined()
    expect(resp.status).toBe(200)
    expect((resp.data as ICreateProductResponse).success).toBeTruthy()
    expect((resp.data as ICreateProductResponse).error).toStrictEqual([])
    expect((resp.data as ICreateProductResponse).message).toBe('Product has been created successfully')
  })

  test('POST: /create with empty title returns an error', async () => {
    const invalidPayload = { ...createPayload, title: '' }
    const resp = await productApi.createProduct(invalidPayload, authToken)
    expect(resp.status).toBe(422)
    expect((resp.data as ICreateProductErrorResponse).errors[0]?.title).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[1]).toBeUndefined()
  })

  test('POST: /create without description returns success', async () => {
    const noDescPayload = { ...createPayload }
    delete noDescPayload.description
    const resp = await productApi.createProduct(noDescPayload, authToken)
    expect(resp.data).toBeDefined()
    expect(resp.status).toBe(200)
    expect((resp.data as ICreateProductResponse).success).toBeTruthy()
    expect((resp.data as ICreateProductResponse).error).toStrictEqual([])
    expect((resp.data as ICreateProductResponse).message).toBe('Product has been created successfully')
  })

  test('POST: /create with empty prices returns an error', async () => {
    const invalidPayload = { ...createPayload, prices: [] }
    const resp = await productApi.createProduct(invalidPayload, authToken)
    expect(resp.status).toBe(422)
    expect((resp.data as ICreateProductErrorResponse).errors[0]?.prices).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[1]).toBeUndefined()
  })

  test('POST: /create with empty prices and title returns two errors', async () => {
    const invalidPayload = { ...createPayload, prices: [], title: '' }
    const resp = await productApi.createProduct(invalidPayload, authToken)
    expect(resp.status).toBe(422)
    expect((resp.data as ICreateProductErrorResponse).errors[0]?.title).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[1]?.prices).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[2]).toBeUndefined()
  })

  test('POST: /create with empty properties in prices', async () => {
    const invalidPayload = JSON.parse(JSON.stringify(createPayload))
    // make all values empty, two of them will be invalid by API validation
    for (const key in invalidPayload.prices[0]) {
      invalidPayload.prices[0][key] = ''
    }
    const resp = await productApi.createProduct(invalidPayload, authToken)
    expect(resp.status).toBe(422)
    expect((resp.data as ICreateProductErrorResponse).errors[0]['prices[0].currency']).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[1]['prices[0].price']).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[2]).toBeUndefined()
  })

  test('POST: /create with price as empty object', async () => {
    const invalidPayload = JSON.parse(JSON.stringify(createPayload))
    // make object empty, 4 errors must happen (trialDays is not mandatory)
    delete invalidPayload.prices[0].price
    delete invalidPayload.prices[0].planInterval
    delete invalidPayload.prices[0].currency
    delete invalidPayload.prices[0].billingType
    delete invalidPayload.prices[0].trialDays
    const resp = await productApi.createProduct(invalidPayload, authToken)
    expect(resp.status).toBe(422)
    expect((resp.data as ICreateProductErrorResponse).errors[0]['prices[0].currency']).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[1]['prices[0].price']).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[2]['prices[0].billingType']).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[3]['prices[0].planInterval']).toBe('Invalid value')
    expect((resp.data as ICreateProductErrorResponse).errors[4]).toBeUndefined()
  })

  test('POST: /create with unexpected billingTime', async () => {
    const invalidPayload = JSON.parse(JSON.stringify(createPayload))
    invalidPayload.prices[0].billingType = 'This is  INVALID'
    const resp = await productApi.createProduct(invalidPayload, authToken)
    // TODO: This is unhandled error!!! this must br reworked
    expect(resp.status).toBe(500)
  })

  test('POST: /create with unexpected planInterval', async () => {
    const invalidPayload = JSON.parse(JSON.stringify(createPayload))
    invalidPayload.prices[0].planInterval = 'ALSO INVALID'
    const resp = await productApi.createProduct(invalidPayload, authToken)
    // TODO: This is unhandled error!!! this must br reworked
    expect(resp.status).toBe(500)
  })
})
