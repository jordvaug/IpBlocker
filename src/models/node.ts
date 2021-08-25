export class Node {
    left: Node|null;
    right: Node|null;
    minAddress: number;
    maxAddress: number;
    source: number;

    constructor (_min: number, _max: number, _source: number) {
      this.minAddress = _min
      this.maxAddress = _max
      this.source = _source
      this.left = null
      this.right = null
    }
}
