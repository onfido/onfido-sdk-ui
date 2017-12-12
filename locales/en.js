export const en = {
  welcome: {
    title: 'Open your new bank account',
    description_p_1: 'To open a bank account, we will need to verify your identity.',
    description_p_2: 'It will only take a couple of minutes.',
    next_button: 'Verify Identity'
  },
  document_selector: {
    title: 'Verify your identity',
    hint: 'Select the type of document you would like to upload',
  },
  upload_desktop: {
    driving_licence: {
      front: {
        title: 'Front of license',
        instructions: 'Upload front of license from your computer',
        webcam: 'Position the front of license in the frame (it will be automatically detected)',
      },
      back: {
        title: 'Back of license',
        instructions: 'Upload back of license from your computer',
        webcam: 'Position the back of license in the frame (it will be automatically detected)',
      },
    },
    national_identity_card: {
      front: {
        title: 'Front of card',
        instructions: 'Upload front of card from your computer',
        webcam: 'Position the front of card in the frame (it will be automatically detected)',
      },
      back: {
        title: 'Back of card',
        instructions: 'Upload back of card from your computer',
        webcam: 'Position the back of card in the frame (it will be automatically detected)',
      },
    },
    passport: {
      front: {
        title: 'Passport photo page',
        instructions: 'Upload passport photo page from your computer',
        webcam: 'Position your passport photo page in the frame (it will be automatically detected)',
      },
    },
    doc: {
      help: 'Having problems? Upload a file instead'
    },
    face: {
      title: 'Take a selfie',
      upload_title: 'Selfie',
      instructions: 'Upload a selfie from your computer',
      webcam: 'Position your face in the oval',
      help: 'Having problems? Upload a selfie instead',
      button: 'Take selfie',
    },
    common: {
      parentheses: '(or drop your file here)',
    },
  },
  upload_mobile: {
    driving_licence: {
      front: {
        title: 'Front of license',
        instructions: 'Take a photo of the front of your license',
      },
      back: {
        title: 'Back of license',
        instructions: 'Take a photo of the back of your license',
      },
    },
    national_identity_card: {
      front: {
        title: 'Front of card',
        instructions: 'Take a photo of the front of your card',
      },
      back: {
        title: 'Back of card',
        instructions: 'Take a photo of the back of your card',
      },
    },
    passport: {
      front: {
        title: 'Passport photo page',
        instructions: 'Take a photo of your passport photo page',
      },
    },
    face: {
      title: 'Take a selfie',
      instructions: 'Take a selfie showing your face',
    },
  },
  confirm: {
    driving_licence: {
      message: 'Make sure your license details are clear to read, with no blur or glare',
    },
    national_identity_card: {
      message: 'Make sure your card details are clear to read, with no blur or glare',
    },
    passport: {
      message: 'Make sure your passport details are clear to read, with no blur or glare',
    },
    doc: {
      title: 'Check readability',
    },
    face: {
      title: 'Check selfie',
      message: 'Make sure your selfie clearly shows your face',
    },
    confirm: 'Confirm',
    continue: 'Continue',
    redo: 'Redo',
  },
  complete: {
    message: 'Verification complete',
    submessage: 'Thank you.'
  },
  cross_device: {
    client_success: {
      title:'Uploads successful',
      sub_title:'You can now return to your computer to continue'
    },
    link: {
      title: 'Continue verification on your mobile',
      sub_title: 'We\’ll text a one-time secure link to your mobile',
      link_copy: {action: 'Copy', success: 'Copied'},
      button_copy: {action:  'Send link', status: 'Sending'},
      sms_label: 'Mobile number',
      copy_link_label: 'Copy link instead:'
    },
    submit: {
      title: 'Great, that’s everything we need',
      sub_title: 'We’re now ready to verify your identity',
      selfie_uploaded: 'Selfie uploaded',
      action: 'Submit verification',
      multiple_docs_uploaded:'Documents uploaded',
      one_doc_uploaded: 'Document uploaded'
    },
    phone_number_input: {
      placeholder: 'Enter mobile number',
      loading: 'Loading...'
    },
    mobile_connected: {
      title: {
        message: 'Connected to your mobile',
        submessage: 'Once you\'ve finished we\'ll take you to the next step',
      },
      tips: {
        item_1: 'Keep this window open while using your mobile',
        item_2: 'Your mobile link will expire in one hour',
        item_3: 'Don\'t refresh this page'
      }
    },
    mobile_notification_sent: {
      submessage: 'We’ve sent a secure link to %{number}',
      bold_message: 'It may take a few minutes to arrive',
      tips: {
        item_1: 'Keep this window open while using your mobile',
        item_2: 'Your mobile link will expire in one hour'
      },
      resend_link: 'Resend link'
    },
    switch_device: {
      header: 'Need to use your mobile to take photos?',
      submessage: 'Securely continue verification on your mobile'
    },
    tips: 'Tips'
  },
  errors: {
    invalid_capture: {message:'No document detected', instruction: 'Make sure all the document is in the photo'},
    invalid_type: {message: 'File not uploading', instruction: 'Try using another file type'},
    unsupported_file: {message: 'Unsupported file type', instruction: 'Try using a .jpg or .png file'},
    invalid_size: {message: 'File size too large', instruction: 'Size needs to be smaller than 10MB'},
    no_face: {message: 'No face found', instruction: 'Your face is needed in the selfie'},
    multiple_faces: {message: 'Multiple faces found', instruction: 'Only your face can be in the selfie'},
    server_error: {message: 'Connection lost', instruction: 'Please try again'},
    glare_detected: {message: 'Glare detected', instruction: 'All details should be clear and readable'},
    sms_failed: {message: "Something's gone wrong", instruction: "Copy the below link to your mobile instead"},
    sms_overuse: {message: 'Too many resend attempts', instruction: "Copy the below link to your mobile instead"},
    lazy_loading: {message: 'An error occurred while loading the component'},
    invalid_number: {message: 'Check your mobile number is correct'},
    generic_client_error: {message: 'Something\'s gone wrong', instruction: 'You\’ll need to restart your verification on your computer'}
  },
  passport: 'Passport',
  driving_licence: 'Driver\'s License',
  national_identity_card: 'Identity Card',
  back: 'back',
  cancel: 'Cancel'
}
