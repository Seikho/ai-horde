import { get, post } from './request'
import { FindUserResponse, GenerateRequest, Model, StatusResponse } from './types'

const DEFAULT_API_KEY = '0000000000'

export async function generate(request: GenerateRequest, apikey = DEFAULT_API_KEY) {
  const url = `/generate/text/async`
  const res = await post<{ id: string }>({ url, body: request, apikey })
  return res
}

export async function waitForResponse(id: string, timeoutSecs?: number) {
  const url = `/generate/text/status/${id}`

  const start = Date.now()
  while (true) {
    if (timeoutSecs) {
      const diff = Date.now() - start
      if (diff >= timeoutSecs * 1000) {
        throw new Error(`Request timed out: Exceeded ${timeoutSecs} seconds`)
      }
    }

    const res = await get<StatusResponse>({ url })
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

export async function findUser(apikey: string) {
  const user = await get<FindUserResponse>({ url: `/find_user`, apikey })
  return user
}

export async function getModels(type: 'image' | 'text' = 'image') {
  const url = `/status/models?type=${type}`
  const models = await get<Model[]>({ url })
  return models
}

async function wait(secs = 2) {
  return new Promise((resolve) => setTimeout(resolve, secs * 1000))
}
