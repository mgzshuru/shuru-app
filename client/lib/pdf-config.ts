import { pdfjs } from 'react-pdf';

// Configure PDF.js worker
// Using CDN for better compatibility and to avoid bundling issues
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export { pdfjs };
