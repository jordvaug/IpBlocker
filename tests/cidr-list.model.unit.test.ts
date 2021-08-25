/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { CidrList } from '../src/models/cidr-list'

describe('CIDR List Tests', () => {
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('----------------------------------------')
  })

  it('Empty CIDR BS Tree should be created.', () => {
    const cidrList = CidrList.getInstance()

    expect(cidrList.root).to.be.null
  })

  it('Insert() should create and insert a new node in order.', () => {
    const cidrList = CidrList.getInstance()
    cidrList.Insert(1214516224, 1214516225, 0)

    expect(cidrList.root).to.be.not.null
  })

  it('SearchForIp() should return the IP source or null if the IP is not found.', () => {
    const cidrList = CidrList.getInstance()
    cidrList.Insert(1214516224, 1214516225, 0)
    const source = cidrList.SearchForIp(cidrList.getRoot(), 1214516224)

    expect(source).to.eql(0)
  })
})
