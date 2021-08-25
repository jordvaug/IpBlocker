import { CommonRoutesConfig } from './common.route.config'
import express from 'express'
import CheckIpListService from '../services/check-ip-list.service'
import isIp from 'is-ip'
import { body, CustomValidator, validationResult } from 'express-validator'

const isValidIp: CustomValidator = (value: string) => {
  if (!value) {
    throw new Error('No IP included in request.')
  }
  if (value.length > 20) {
    throw new Error('IP too long.')
  }
  if (!isIp(value)) {
    throw new Error('Not a valid IP.')
  }
  return true
}

export class IpRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'IpRoutes')
  }

  configureRoutes () {
    this.app.route('/checkip')
      .post(body('ip').custom(isValidIp), (req: express.Request, res: express.Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          res.status(400).send(errors.array())
        } else {
          const ip = req.body.ip
          console.time('Check IP')
          const source = CheckIpListService.CheckIp(ip)
          console.timeEnd('Check IP')
          if (source === 'Safe IP.') {
            res.status(200).json({
              blocked: false
            })
          } else {
            res.status(200).json({
              blocked: true,
              source: source
            })
          }
        }
      })
    return this.app
  }
}
