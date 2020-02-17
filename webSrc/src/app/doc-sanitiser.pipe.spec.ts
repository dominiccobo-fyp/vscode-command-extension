import { DocSanitiserPipe } from './doc-sanitiser.pipe';

describe('DocSanitiserPipe', () => {
  it('create an instance', () => {
    const pipe = new DocSanitiserPipe();
    expect(pipe).toBeTruthy();
  });
});
