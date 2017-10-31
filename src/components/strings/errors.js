export const errors = {
  'INVALID_CAPTURE': { message:'No document detected', instruction: 'Make sure all the document is in picture'},
  'INVALID_TYPE': {message: 'File not uploading', instruction: 'Try using another file type'},
  'UNSUPPORTED_FILE': {message: 'Unsupported file type', instruction: 'Try using a .jpg or .png file'},
  'INVALID_SIZE': {message: 'File size too large', instruction: 'Size needs to be smaller than 10MB'},
  'NO_FACE_ERROR': {message: 'No face found', instruction: 'Your face is needed in the selfie'},
  'MULTIPLE_FACES_ERROR': {message: 'Multiple faces found', instruction: 'Only your face can be in the selfie'},
  'SERVER_ERROR': {message: 'Connection lost', instruction: 'Please try again'},
  'GLARE_DETECTED': {message: 'Glare detected', instruction: 'All details should be clear and readable'},
  'SMS_FAILED': {message: "Something's gone wrong", instruction: "Try typing the link below into your mobile browser"},
  'SMS_OVERUSE': {message: '', instruction: ""}
}
