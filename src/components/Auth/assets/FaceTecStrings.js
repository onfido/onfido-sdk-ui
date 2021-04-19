const feedback = (el) => `auth_capture.feedback.${el}`
export const FaceTecStrings = (translate) => ({
  FaceTec_accessibility_cancel_button: translate(
    'auth_accessibility.back_button'
  ),
  FaceTec_feedback_center_face: translate(feedback('center_face')),
  FaceTec_feedback_face_not_found: translate(feedback('face_not_found')),
  FaceTec_feedback_move_phone_away: translate(feedback('move_back')),
  FaceTec_feedback_move_away_web: translate(feedback('move_back')),
  FaceTec_feedback_move_phone_closer: translate(feedback('move_close')),
  FaceTec_feedback_move_phone_to_eye_level: translate(feedback('eye_level')),
  FaceTec_feedback_move_to_eye_level_web: 'Look Straight Into Camera',
  FaceTec_feedback_face_not_looking_straight_ahead: translate(
    feedback('not_looking_straight_ahead')
  ),
  FaceTec_feedback_face_not_upright: translate(feedback('head_not_upright')),
  FaceTec_feedback_face_not_upright_mobile: translate(
    feedback('head_not_upright')
  ),
  FaceTec_feedback_hold_steady: translate(feedback('steady')),
  FaceTec_feedback_move_web_closer: translate(feedback('move_close')),
  FaceTec_feedback_move_web_even_closer: translate(feedback('move_closer')),
  FaceTec_feedback_use_even_lighting: translate(feedback('even_lighting')),

  FaceTec_instructions_header_ready: translate(
    'auth_capture.capture_start.title'
  ),
  FaceTec_instructions_message_ready: translate(
    'auth_capture.capture_start.body'
  ),
  FaceTec_action_im_ready: translate('auth_capture.start.button_primary'),

  FaceTec_result_facescan_upload_message: translate(
    'auth_capture.progress_loader'
  ),
  FaceTec_result_idscan_upload_message: translate(
    'auth_capture.progress_loader'
  ),

  FaceTec_retry_header: translate('auth_retry.title'),
  FaceTec_retry_subheader_message: translate('auth_retry.subtitle'),
  FaceTec_retry_your_image_label: '',
  FaceTec_retry_ideal_image_label: '',
  FaceTec_retry_instruction_message_1: 'Neutral Expression, No Smiling',
  FaceTec_retry_instruction_message_2: 'No Glare or Extreme Lighting',
  FaceTec_retry_instruction_message_3: 'Too Blurry, Clean Your Camera',
  FaceTec_action_ok: translate('auth_retry.button_primary'),

  FaceTec_camera_feed_issue_header: '<b>Issue Encrypting Camera Feed</b>',
  FaceTec_camera_feed_issue_subheader_message:
    'This system cannot be verified due to the following:',
  FaceTec_camera_feed_issue_table_header_1: 'Possible Issue',
  FaceTec_camera_feed_issue_table_header_2: 'Fix',
  FaceTec_camera_feed_issue_table_row_1_cell_1_firefox_permissions_error:
    'Camera permissions not remembered in Firefox.',
  FaceTec_camera_feed_issue_table_row_1_cell_2_firefox_permissions_error:
    'Check Remember Permissions.',
  FaceTec_camera_feed_issue_table_row_1_cell_1:
    'Camera already in use by another App.',
  FaceTec_camera_feed_issue_table_row_1_cell_2: 'Close the other App.',
  FaceTec_camera_feed_issue_table_row_2_cell_1:
    'A 3rd-Party App is modifying the video.',
  FaceTec_camera_feed_issue_table_row_2_cell_2:
    'Close/Uninstall the other App.',
  FaceTec_camera_feed_issue_table_row_3_cell_1:
    'Hardware not capable of being secured.',
  FaceTec_camera_feed_issue_table_row_3_cell_2: 'Use a different Device.',
  FaceTec_camera_feed_issue_subtable_message:
    "This App blocks suspicious webcam configurations. <a href='https://livenesscheckhelp.com/' target='_blank' style='text-decoration:underline;'>Learn More Here</a>.",
  FaceTec_camera_feed_issue_action: 'Try Again Anyway',
  FaceTec_camera_feed_issue_action_firefox_permissions_error: 'OK',

  FaceTec_camera_permission_header: translate('auth_permission.title_cam'),
  FaceTec_camera_permission_message: translate('auth_permission.body_cam'),
  FaceTec_camera_permission_launch_settings: translate(
    'auth_permission.button_primary_cam'
  ),

  FaceTec_enter_fullscreen_header: 'Full Screen Selfie Mode',
  FaceTec_enter_fullscreen_message:
    'Before we begin, please click the button below to open full screen mode',
  FaceTec_enter_fullscreen_action: 'Open Full Screen',

  FaceTec_initializing_camera: 'Starting Camera...',
  FaceTec_initializing_camera_still_loading: 'Encrypting Camera Feed...',

  FaceTec_idscan_type_selection_header:
    'Please Select Your<br>ID Document Type',
  FaceTec_action_select_id_card: 'PHOTO ID',
  FaceTec_action_select_passport: 'PASSPORT',
  FaceTec_idscan_capture_id_card_front_instruction_message:
    'Show Front of Photo ID',
  FaceTec_idscan_capture_id_card_back_instruction_message:
    'Show Back of Photo ID',
  FaceTec_idscan_capture_passport_instruction_message:
    'Show Passport Photo Page',
  FaceTec_action_take_photo: 'TAKE PHOTO',
  FaceTec_idscan_review_id_card_front_instruction_message:
    'Confirm Photo is Clear & Legible',
  FaceTec_idscan_review_id_card_back_instruction_message:
    'Confirm Photo is Clear & Legible',
  FaceTec_idscan_review_passport_instruction_message:
    'Confirm Photo is Clear & Legible',
  FaceTec_action_accept_photo: 'ACCEPT',
  FaceTec_action_retake_photo: 'RETAKE',
  FaceTec_result_idscan_unsuccess_message:
    "ID Photo<br/>Did Not Match<br>User's Face",

  FaceTec_result_success_message: 'Success!',
})
