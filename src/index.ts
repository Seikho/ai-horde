import needle from 'needle'
import { ApiType, FindUserResponse, GenerateRequest, StatusResponse } from './types'

const DEFAULT_API_KEY = '0000000000'

const urls = {
  horde: `https://stablehorde.net/api/v2`,
  kobold: `https://koboldai.net/api/v2`,
}

export async function generate(type: ApiType, request: GenerateRequest, apikey = DEFAULT_API_KEY) {
  const url = type === 'kobold' ? `/generate/async` : `/generate/text/async`
  const res = await post<{ id: string }>({ type, url, body: request, apikey })
  return res
}

export async function waitForResponse(type: ApiType, id: string, timeoutSecs?: number) {
  const url = type === 'horde' ? `/generate/text/status/${id}` : `/generate/check/${id}`

  const start = Date.now()
  while (true) {
    if (timeoutSecs) {
      const diff = Date.now() - start
      if (diff >= timeoutSecs * 1000) {
        throw new Error(`Request timed out: Exceeded ${timeoutSecs} seconds`)
      }
    }

    const res = await get<StatusResponse>({ url, type })
    if (res.done) {
      return res
    }

    if (res.faulted) {
      const error: any = new Error(`Generation failed: Faulted`)
      error.body = res
      throw error
    }

    await wait()
  }
}

/**
 * If the 'type' is not provided both APIs will be queried
 *
 * @param apikey
 * @param type
 * @returns
 */
export async function findUser(apikey: string, type?: ApiType) {
  if (type) {
    const user = await get<FindUserResponse>({ url: '/find_user', type, apikey })
    return { ...user, type }
  }

  const [horde, kobold] = await Promise.allSettled([
    get<FindUserResponse>({ url: `/find_user`, type: 'horde', apikey }),
    get<FindUserResponse>({ url: `/find_user`, type: 'kobold', apikey }),
  ])

  if (horde.status === 'fulfilled') {
    return { ...horde.value, type: 'horde' as const }
  }

  if (kobold.status === 'fulfilled') {
    return { ...kobold.value, type: 'kobold' as const }
  }

  throw new Error(`User not found`)
}

async function post<T = any>({ type, url, apikey, body }: PostReq) {
  const baseUrl = urls[type]
  const headers: any = {}
  if (apikey) {
    headers.apikey = apikey
  }
  const res = await needle('post', `${baseUrl}${url}`, body, { json: true, headers })
  if (res.statusCode && res.statusCode >= 400) {
    const error: any = new Error(`${res.statusMessage}: ${res.statusCode}`)
    error.body = res.body
    throw error
  }

  return res.body as T
}

async function get<T = any>({ type, url, apikey }: Omit<PostReq, 'body'>) {
  const baseUrl = urls[type]
  const headers: any = {}
  if (apikey) {
    headers.apikey = apikey
  }
  const res = await needle('get', `${baseUrl}${url}`, { json: true, headers })
  if (res.statusCode && res.statusCode >= 400) {
    const error: any = new Error(`${res.statusMessage}: ${res.statusCode}`)
    error.body = res.body
    throw error
  }

  return res.body as T
}

async function wait(secs = 2) {
  return new Promise((resolve) => setTimeout(resolve, secs * 1000))
}

type PostReq = {
  type: ApiType
  url: string
  apikey?: string
  body: any
}
