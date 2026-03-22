import { MAX_RESUME_FILE_SIZE_BYTES, validateResumeFile } from './file.util';

describe('validateResumeFile', () => {
  it('accepts a PDF file', () => {
    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });

    expect(validateResumeFile(file)).toBeNull();
  });

  it('rejects unsupported extensions', () => {
    const file = new File(['resume'], 'resume.txt', { type: 'text/plain' });

    expect(validateResumeFile(file)).toBe('Please upload a PDF or DOCX resume only.');
  });

  it('rejects files larger than 5 MB', () => {
    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: MAX_RESUME_FILE_SIZE_BYTES + 1 });

    expect(validateResumeFile(file)).toBe('Please upload a resume smaller than 5 MB.');
  });
});
