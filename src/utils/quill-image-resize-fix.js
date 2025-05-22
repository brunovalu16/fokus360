import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';

if (typeof window !== 'undefined' && Quill && ImageResize) {
  Quill.register('modules/imageResize', ImageResize);
}
