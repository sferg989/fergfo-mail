import { IClassName, ClassName } from './className';

describe('ClassName', () => {
  let classUnderTest: IClassName;

  beforeEach(() => {
    classUnderTest = new ClassName();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
