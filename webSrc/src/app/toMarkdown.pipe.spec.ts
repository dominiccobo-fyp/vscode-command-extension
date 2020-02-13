import { ToMarkdownPipe } from './toMarkdown.pipe';

describe('MarkdownPipe', () => {
  it('create an instance', () => {
    const pipe = new ToMarkdownPipe();
    expect(pipe).toBeTruthy();
  });


  it('should ouput formatted html', () => {
    const pipe = new ToMarkdownPipe();
    expect(pipe.transform('# Hi')).toBe('<h1 id="hi">Hi</h1>');
  });
});
