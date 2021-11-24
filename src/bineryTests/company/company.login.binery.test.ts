import { CompanyApi, ILoginErrorResponse, ILoginResponse } from '../../bineryApi'
import { bineryBaseUrl } from '../testConstants'

const testEmail = 'dev@mailinator.com'
const testPwd = '123456'

const loginSuccessMessage = 'Logged in successfully'

let companyApi: CompanyApi
describe('POST: /company', () => {
  beforeAll(() => {
    companyApi = new CompanyApi(bineryBaseUrl)
  })

  test('POST: /login with valid credentials must return expected response', async () => {
    const resp = await companyApi.login({ email: testEmail, password: testPwd })
    expect(resp?.data).toBeDefined()
    expect(resp.status).toBe(200)
    expect((resp.data as ILoginResponse).success).toEqual(true)
    expect((resp.data as ILoginResponse).error).toEqual([])
    const { data: loginData } = resp.data as ILoginResponse
    expect(loginData.message).toEqual(loginSuccessMessage)
    expect(loginData.auth).toBeDefined()
    const { email } = companyApi.parseJwtToken(loginData.auth?.token as string)
    expect(email).toEqual(testEmail)
    expect(typeof loginData.auth?.type).toEqual('string')
    expect(loginData.companyData).toBeDefined()
  })

  test('POST: /login with not existing email must return Company Not Found error', async () => {
    const resp = await companyApi.login({ email: 'dev2@example.com', password: testPwd })
    expect(resp?.data).toBeDefined()
    expect(resp.status).toBe(404)
    expect((resp.data as ILoginResponse).success).toEqual(false)
    expect((resp.data as ILoginResponse).error).toBe('Company not found')
    expect((resp.data as ILoginResponse).data).toStrictEqual({})
  })

  test('POST: /login with invalid email must return 404 error', async () => {
    const resp = await companyApi.login({ email: 'invalid email', password: testPwd })
    expect(resp?.data).toBeDefined()
    expect(resp.status).toBe(422)
    expect((resp.data as ILoginErrorResponse).errors).toBeDefined()
    expect((resp.data as ILoginErrorResponse).errors[0]?.email).toBe('Invalid value')
  })

  test('POST: /login with wrong password must return incorrect password error', async () => {
    const resp = await companyApi.login({ email: testEmail, password: 'wrongPwd' })
    expect(resp?.data).toBeDefined()
    // TODO: This should ot return 200 sinnce this is an error response
    expect(resp.status).toBe(200)
    expect((resp.data as ILoginResponse).success).toEqual(false)
    expect((resp.data as ILoginResponse).error).toBe('Password is incorrect')
    expect((resp.data as ILoginResponse).data).toStrictEqual({})
  })
})
