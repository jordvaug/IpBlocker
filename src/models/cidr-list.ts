import { Node } from './node'

export class CidrList {
    root: Node|null;
    size: number;
    private static instance: CidrList;

    private constructor () {
      this.root = null
      this.size = 0
    }

    public static getInstance (): CidrList {
      if (!CidrList.instance) {
        CidrList.instance = new CidrList()
      }
      return CidrList.instance
    }

    public static getNewInstance (): CidrList {
      CidrList.instance = new CidrList()

      return CidrList.instance
    }

    Insert (min: number, max: number, source: number) {
      const node = new Node(min, max, source)

      if (this.root === null) {
        this.root = node
        this.size++
      } else {
        this.InsertNode(this.root, node)
      }
    }

    InsertNode (node: Node, newNode: Node) {
      if (newNode.minAddress < node.minAddress) {
        if (node.left === null) {
          node.left = newNode
          this.size++
        } else {
          this.InsertNode(node.left, newNode)
        }
      } else {
        if (node.right === null) {
          node.right = newNode
          this.size++
        } else {
          this.InsertNode(node.right, newNode)
        }
      }
    }

    getRoot () {
      return this.root
    }

    SearchForIp (node: Node|null, ip: Number): number {
      if (node === null) {
        return -1
      } else if (ip < node.minAddress) {
        return this.SearchForIp(node.left, ip)
      } else if (ip > node.minAddress) {
        if (ip < node.maxAddress) {
          return node.source
        } else {
          return this.SearchForIp(node.right, ip)
        }
      } else { return node.source }
    }
}
