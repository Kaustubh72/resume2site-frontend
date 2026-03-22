import { MAX_RESUME_FILE_SIZE_MB } from '../constants/app.constants';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const MAX_RESUME_FILE_SIZE_BYTES = MAX_RESUME_FILE_SIZE_MB * 1024 * 1024;

export function validateResumeFile(file: File): string | null {
  const fileName = file.name.toLowerCase();
  const isPdf = fileName.endsWith('.pdf');
  const isDocx = fileName.endsWith('.docx');
  const hasValidExtension = isPdf || isDocx;
  const hasValidMimeType = !file.type || ALLOWED_MIME_TYPES.includes(file.type);

  if (!hasValidExtension || !hasValidMimeType) {
    return 'Please upload a PDF or DOCX resume only.';
  }

  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
    return `Please upload a resume smaller than ${MAX_RESUME_FILE_SIZE_MB} MB.`;
  }

  return null;
}
