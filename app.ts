import express from 'express'
import * as http from 'http'

import cors from 'cors'
import { CommonRoutesConfig } from './src/routes/common.route.config'
import LoadSourcesService from './src/services/load-sources.service'
import { IpRoutes } from './src/routes/ip.route.config'
require('dotenv').config({ path: './.env' });

const app: express.Application = express()
const helmet = require('helmet')
const server: http.Server = http.createServer(app)
const port = 3000
const routes: Array<CommonRoutesConfig> = []
const loadService = new LoadSourcesService()
const refreshTimout = parseInt(process.env.REFRESH|| '86400000')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(helmet())

app.use(cors())

loadService.CreateBlockList()

routes.push(new IpRoutes(app))

server.listen(port, () => {
  console.log('Server running on port 5000')
  setInterval( () => {
    loadService.CreateBlockList()
  }, refreshTimout)
})
