import axios, { AxiosResponse } from 'axios'

export interface IProductsGetResponse {
  products: any []
}

export interface IProductsGetError {
  error: string
}

export class ProductsApi {
    baseUrl: string;
    constructor (baseUrl: string) {
      this.baseUrl = baseUrl
    }

    async getProducts (searchTeam: string): Promise<AxiosResponse<IProductsGetResponse | IProductsGetError>> {
      return await axios.get(`${this.baseUrl}/products`, {
        params: { search: searchTeam }
      })
    }
}
