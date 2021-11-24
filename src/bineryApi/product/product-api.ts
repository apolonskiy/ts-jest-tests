import { bineryBaseUrl } from '../../bineryTests/testConstants'
import axios, { AxiosResponse } from 'axios'

export interface ICreateProductPayload {
  title: string
  description?: string
  prices: IPricePayload []
}

export interface IPricePayload {
  price: string
  currency: string
  billingType: string // TODO: find out the possible values for this one
  'planInterval': string
  trialDays?: string
}

export interface ICreateProductErrorResponse {
  errors: Array<{[key: string]: any}>

}

export interface ICreateProductResponse {
  success: boolean
  error: []
  'message': 'Product has been created successfully'
}

export class ProductApi {
    baseUrl: string;
    productRoute = '/api/product';
    createProductRoute = '/create'

    constructor (baseUrl = bineryBaseUrl) {
      this.baseUrl = baseUrl
    }

    async createProduct (productPayload: ICreateProductPayload, authToken: string): Promise<AxiosResponse<ICreateProductResponse | ICreateProductErrorResponse>> {
      try {
        const resp = await axios.post(`${this.baseUrl}${this.productRoute}${this.createProductRoute}`,
          productPayload,
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        )
        return resp
      } catch (e: any) {
        return e?.response
      }
    }
}
