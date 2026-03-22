declare function describe(description: string, specDefinitions: () => void): void;
declare function it(expectation: string, assertion: () => void | Promise<void>): void;
declare function beforeEach(action: () => void | Promise<void>): void;
declare function expect(actual: any): any;

declare namespace jasmine {
  interface SpyObj<T> {
    [key: string]: any;
  }
  function createSpyObj<T>(baseName: string, methodNames: string[]): SpyObj<T>;
}
