# ai-horde

> Stable Horde request library

## Work in progress

### TODO

- Add image generation endpoints

## Installation and Usage

```sh
> npm install ai-horde
```

```ts
import * as horde from 'ai-horde'

const user = await horde.findUser('some-api-key')
```

## API

### generate

Dispatch an asynchronous text generation request

```ts
function generate(request: GenerateRequest, apikey?: string): Promise<{ id: string }>

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
const models = await horde.getModels('text')
const { id } = await horde.generate(params, apikey)
const response = await horde.waitForResponse(id)

return response.generations
```

```ts
function waitForResponse(id: string, timeoutSecs?: number): Promise<StatusResponse>

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

```ts
function findUser(apikey: string): Promise<FindUserResponse>

type FindUserResponse = {
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
