import express from 'express'
import type { Express } from 'express'

const PORT = 8000
const app: Express = express()

app.listen(PORT, (): void => {
  console.log('Listening on port: ', PORT)
})
