import { CidrList } from '../models/cidr-list'
import { IpList } from '../models/ip-list'
import { SourcesList } from '../models/sources-list'
import IPCIDR from 'ip-cidr'

class CheckIpListService {
  public static CheckIp (ip: string): string {
    const cidrList = CidrList.getInstance()
    const ipList = IpList.getInstance()
    const sourcesList = SourcesList.getInstance()
    ip += '/32'
    const cidr = new IPCIDR(ip)
    const ipNumber = parseInt(cidr.end({ type: 'bigInteger' }).toString())
    const isInCidrList = cidrList.SearchForIp(cidrList.getRoot(), ipNumber)

    if (isInCidrList >= 0) {
      return sourcesList.getSource(isInCidrList)
    } else if (ipList.blockList.has(ipNumber)) {
      const index = ipList.blockList.get(ipNumber)
      if (index) {
        return sourcesList.getSource(index)
      } else {
        return 'NA'
      }
    } else {
      return 'Safe IP.'
    }
  }
}

export default CheckIpListService
