export class SourcesList {
    private static instance: SourcesList;
    public sources: Array<string>;

    private constructor () {
      this.sources = []
    }

    public static getInstance (): SourcesList {
      if (!SourcesList.instance) {
        SourcesList.instance = new SourcesList()
      }
      return SourcesList.instance
    }

    public getSource (index: number): string {
      return this.sources[index]
    }
}
