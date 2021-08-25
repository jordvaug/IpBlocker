export class IpList {
    private static instance: IpList;
    blockList: Map<number, number>

    private constructor () {
      this.blockList = new Map<number, number>()
    }

    public static getInstance (): IpList {
      if (!IpList.instance) {
        IpList.instance = new IpList()
      }
      return IpList.instance
    }

    public static getNewInstance (): IpList {
      IpList.instance = new IpList()

      return IpList.instance
    }
}
