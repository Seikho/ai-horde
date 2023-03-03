export type GenerateRequest = {
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

export type FindUserResponse = {
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

export type StatusResponse = {
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

export type Model = {
  name: string
  count: number
  performance: number
  queued: number
  eta: number
  type?: string
}
