import { baseUrl } from '../testConstants'
import { IProductsGetError, IProductsGetResponse, ProductsApi } from '../../apis/products/products-api'

let productsApi: ProductsApi
describe('GET: /products', () => {
  beforeAll(() => {
    productsApi = new ProductsApi(baseUrl)
  })

  test('Get products returns successful response for a valid search term', async () => {
    const resp = await productsApi.getProducts('some stuff')
    expect((resp.data as IProductsGetResponse).products).toBeDefined()
    expect(Array.isArray((resp.data as IProductsGetResponse).products)).toBeTruthy()
    expect((resp.data as IProductsGetError).error).toBeUndefined()
  })

  test('Get products returns error response for an empty search term', async () => {
    const resp = await productsApi.getProducts('')
    expect((resp.data as IProductsGetResponse).products).toBeUndefined()
    expect((resp.data as IProductsGetError).error).toEqual('You must provide a search term.')
  })
})
