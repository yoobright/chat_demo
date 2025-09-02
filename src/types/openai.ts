export interface OpenAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    delta?: {
      role?: string
      content?: string
    }
    index: number
    finish_reason: string | null
  }[]
}
