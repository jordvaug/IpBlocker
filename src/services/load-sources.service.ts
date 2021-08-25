import config from '../config/sources.json'
import { CidrList } from '../models/cidr-list'
import { AxiosResponse } from 'axios'
import { IpList } from '../models/ip-list'
import { SourcesList } from '../models/sources-list'
import IPCIDR from 'ip-cidr'
import isIp from 'is-ip'
import isCidr from 'is-cidr'

const axios = require('axios').default

class LoadSourcesService {
    uris: string[] = [];

    constructor () {
      this.uris = config.uriList
    }

    async CreateBlockList () {
      console.time('Load Sources')
      const responses = await this.LoadSources()
      this.ProcessSources(responses)

      const list = IpList.getInstance()
      console.log('Map size: ' + list.blockList.size * 2 * 8 + ' Bytes')
      const tree = CidrList.getInstance()
      console.log('Tree size: ' + tree.size * 3 * 8 + ' Bytes')
      console.timeEnd('Load Sources')
    }

    LoadSources () {
      const requests:any[] = []

      this.uris.forEach(addr => {
        requests.push(axios.get(addr))
      })

      return Promise.all(requests)
        .then((responses:any[]) => {
          return responses
        })
        .catch((exception: any) => {
          console.log(`Error retrieving response: ${exception}`)
          return []
        })
    }

    ProcessSources (responses: AxiosResponse[]) {
      const ipList = new Map<string, number>()
      const cidrList = CidrList.getNewInstance()
      const sourcesList = SourcesList.getInstance()
      let index = 0

      try {
        responses.forEach(res => {
          const responseArray = res.data.split('\n')
          sourcesList.sources.push(res.config.url || 'None')

          responseArray.forEach((result: string) => {
            if (isIp(result)) {
              ipList.set(result, index)
            } else if (isCidr(result)) {
              const ipRange = this.ConvertCidrToIP(result)
              cidrList.Insert(ipRange[0], ipRange[1], index)
            }
          })
          index++
        })
      } catch (exception: any) {
        console.log(`Error processing responses: ${exception}`)
        return [null, null]
      }

      this.ProcessIPs(ipList)
      console.log('Resident Set Size: ' + process.memoryUsage().rss / 1000)
      console.log('Heap Used: ' + process.memoryUsage().heapUsed / 1000)
    }

    ProcessIPs (stringList:Map<string, number>) {
      const ipList = IpList.getNewInstance()

      for (let [key, value] of stringList) {
        if (isIp(key)) {
          key += '/32'
          const cidr = new IPCIDR(key)
          const decimalIp = parseInt(cidr.end({ type: 'bigInteger' }).toString())

          ipList.blockList.set(decimalIp, value)
        }
      }
      return ipList.blockList
    }

    ConvertCidrToIP (block: string) {
      if (!IPCIDR.isValidAddress(block)) {
        return []
      }

      const cidr = new IPCIDR(block)
      const max = parseInt(cidr.end({ type: 'bigInteger' }).toString())
      const min = parseInt(cidr.start({ type: 'bigInteger' }).toString())
      return [min, max]
    }
}

export default LoadSourcesService
