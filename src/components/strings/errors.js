export const errors = {
  'INVALID_CAPTURE': { message:'No document detected', instruction: 'Make sure the document is in the picture'},
  'CORRUPTED_FILE': {message: 'File not uploading', instruction: 'Try using another file type'},
  'UNSUPPORTED_FILE': {message: 'Unsupported file type', instruction: 'Try using a .jpg or .png file'},
  'INVALID_SIZE': {message: 'File size too large', instruction: 'Size needs to be smaller than 10MB'},
  'NO_FACE_ERROR': {message: 'No face found', instruction: 'Your face is needed in the picture'},
  'MULTIPLE_FACES_ERROR': {message: 'Multiple faces found', instruction: 'Only your face can be in the picture'},
  'SERVER_ERROR': {message: 'Connection lost', instruction: 'Please try again'}
}
