# ai-horde

> Stable Horde and Kobold Horde request library

## Work in progress

### TODO

- Add image generation endpoints

## Installation and Usage

```sh
> npm install ai-horde
```

```ts
import * as ai from 'ai-horde'

const user = await ai.findUser('some-api-key')
```

## API

### generate

Dispatch an asynchronous text generation request

```ts
// Return: P
function generate(
  type: 'horde' | 'kobold',
  request: GenerateRequest,
  apikey?: string
): Promise<{ id: string }>

type GenerateRequest = {
  prompt: string
  params: {
    n?: number
    max_context_length: number
    max_length: number
    frmtadsnsp?: boolean
    frmtrmblln?: boolean
    frmtrmspch?: boolean
    frmttriminc?: boolean
    rep_pen?: number
    rep_pen_range?: number
    rep_pen_slope?: number
    singleline?: boolean
    soft_prompt?: string
    temperature?: number
    tfs?: number
    top_a?: number
    top_k?: number
    top_p?: number
    typical?: number
    sampler_order?: number
  }
  trusted_workers?: boolean
  nsfw?: boolean
  workers?: string[]
  models?: string[]
}
```

### waitForResponse

Wait for a text generation response

Example:

```ts
const { id } = await generate('horde', params, apikey)
const response = await waitForResposne('horde', id)

return response.generations
```

```ts
function waitForResponse(
  type: 'horde' | 'kobold',
  id: string,
  timeoutSecs?: number
): Promise<StatusResponse>

type StatusResponse = {
  finished: number
  processing: number
  restarted: number
  waiting: number
  done: boolean
  faulted: boolean
  wait_time: number
  queue_position: number
  kudos: number
  is_possible: boolean
  generations: Array<{
    worker_id: string
    worker_name: string
    model: string
    state: string
    text: string
    seed: number
  }>
}
```

### findUser

Retrieve user information. If `type` is not provided, both Horde APIs will be queried and the valid response will be returned.

```ts
function findUser(apikey: string, type?: 'horde' | 'kobold'): Promise<FindUserResponse>

type FindUserResponse = {
  type: 'horde' | 'kobold'
  kudos_details: {
    accumulated: number
    gifted: number
    admin: number
    received: number
    recurring: number
  }
  usage: {
    tokens: number
    requests: number
  }
  contributions: {
    tokens: number
    fulfillments: number
  }
  username: string
  id: number
  kudos: number
  concurrency: number
  worker_invited: number
  moderator: boolean
  worker_count: number
  worker_ids: string[]
  trusted: number
  pseudonymous: number
}
```
