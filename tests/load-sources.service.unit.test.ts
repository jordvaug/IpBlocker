/* eslint-disable no-unused-expressions */
import { expect, assert } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import LoadSourcesService from '../src/services/load-sources.service'

describe('Load Sources Service tests', () => {
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('----------------------------------------')
  })

  it('List should be loaded on creation.', () => {
    const sources = new LoadSourcesService()

    expect(sources.uris).to.be.not.be.empty
  })

  it('LoadSources() should enumerate over URLs and return responses.', async () => {
    const sources = new LoadSourcesService()
    const ipList: any = await sources.LoadSources()

    expect(ipList).to.be.not.empty
  })

  it('ProcessIPs() should convert string IPs to number form.', async () => {
    const sources = new LoadSourcesService()
    const testMap = new Map<string, number>()
    testMap.set('72.100.12.1', 0)

    const ipList = await sources.ProcessIPs(testMap)

    expect(ipList.get(1214516225)).to.eql(0)
  })

  it('ConvertCidrToIP() should return an array of addresses from a CIDR block.', () => {
    const sources = new LoadSourcesService()
    const url = '72.100.12.0/30'

    expect(sources.ConvertCidrToIP(url)).to.be.not.be.empty
  })

  it('ConvertCidrToIP() should return an empty array of addresses from an improperly formatted CIDR block.', () => {
    const sources = new LoadSourcesService()
    const url = '72.100.12.00/30'

    expect(sources.ConvertCidrToIP(url)).to.be.be.empty
  })

  it('ConvertCidrToIP() should return the decimal for of a decimal dot string address.', () => {
    const sources = new LoadSourcesService()
    const url = '72.100.12.0/32'

    const decimalIp = sources.ConvertCidrToIP(url)[0]

    assert(decimalIp === 1214516224, '72.100.12.0/32 is 1214516224')
  })
})
