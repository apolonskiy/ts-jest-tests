import axios, { AxiosResponse } from 'axios'
import { bineryBaseUrl } from '../../bineryTests/testConstants'
import jwtDecode from 'jwt-decode'

export interface ILoginPayload {
  email: string
  password: string
}

export interface ILoginErrorResponse {
  errors: [ {[key: string]: any}]

}

export interface ILoginResponse {
  success: boolean
  error: string | []
  data: ILoginResponseData
}

export interface ILoginResponseData{
  message?: string
  auth?: {
    token: string
    type: string
  }
  companyData: {
    industryId: number
    businessTypeId: number
    companyName: string
    email: string
    dialCode: number | string | null
    phoneNumber: string
    registrationNumber: string
    website: string
    description: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    bankName: string
    branchName: string
    accountNumber: string
    routingNumber: number | null
    trialDays: number
    step: string
  }

}

export class CompanyApi {
    baseUrl: string;
    companyRoute = 'api/company';
    loginRoute = '/login'

    constructor (baseUrl = bineryBaseUrl) {
      this.baseUrl = baseUrl
    }

    async login (loginData: ILoginPayload): Promise<AxiosResponse<ILoginResponse | ILoginErrorResponse>> {
      try {
        const resp = await axios.post(`${this.baseUrl}${this.companyRoute}${this.loginRoute}`,
          loginData)
        return resp
      } catch (e: any) {
        return e?.response
      }
    }

    parseJwtToken (token: string): {[key: string]: any} {
      return jwtDecode(token)
    }
}
