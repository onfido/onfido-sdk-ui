const feedback = (el) => `auth_capture.feedback.${el}`
const presessionFeedback = (el) => `auth_capture_start.feedback.${el}`
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
  FaceTec_feedback_move_to_eye_level_web: translate(feedback('eye_level')),
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

  FaceTec_instructions_header_ready_desktop: translate(
    'auth_capture_start.title'
  ),
  FaceTec_instructions_header_ready_1_mobile: translate(
    'auth_capture_start.title'
  ),
  FaceTec_instructions_header_ready_2_mobile: '',
  FaceTec_instructions_message_ready_desktop: translate(
    'auth_capture_start.body'
  ),
  FaceTec_instructions_message_ready_1_mobile: translate(
    'auth_capture_start.body'
  ),
  FaceTec_instructions_message_ready_2_mobile: '',

  FaceTec_action_im_ready: translate('auth_capture_start.button_primary'),

  FaceTec_result_facescan_upload_message: translate('auth_progress.loader'),
  FaceTec_result_idscan_upload_message: translate('auth_progress.loader'),

  FaceTec_retry_header: translate('auth_retry.title'),
  FaceTec_retry_subheader_message: translate('auth_retry.subtitle'),
  FaceTec_retry_your_image_label: '',
  FaceTec_retry_ideal_image_label: '',
  FaceTec_retry_instruction_message_1: translate(
    'auth_retry.body_neutral_expression'
  ),
  FaceTec_retry_instruction_message_2: translate('auth_retry.body_too_bright'),
  FaceTec_retry_instruction_message_3: translate('auth_retry.body_blur'),
  FaceTec_action_ok: translate('auth_retry.button_primary'),

  // FaceTec_camera_feed_issue_header: '<b>Issue Encrypting Camera Feed</b>',
  // FaceTec_camera_feed_issue_subheader_message:
  //   'This system cannot be verified due to the following:',
  // FaceTec_camera_feed_issue_table_header_1: 'Possible Issue',
  // FaceTec_camera_feed_issue_table_header_2: 'Fix',
  // FaceTec_camera_feed_issue_table_row_1_cell_1_firefox_permissions_error:
  //   'Camera permissions not remembered in Firefox.',
  // FaceTec_camera_feed_issue_table_row_1_cell_2_firefox_permissions_error:
  //   'Check Remember Permissions.',
  // FaceTec_camera_feed_issue_table_row_1_cell_1:
  //   'Camera already in use by another App.',
  // FaceTec_camera_feed_issue_table_row_1_cell_2: 'Close the other App.',
  // FaceTec_camera_feed_issue_table_row_2_cell_1:
  //   'A 3rd-Party App is modifying the video.',
  // FaceTec_camera_feed_issue_table_row_2_cell_2:
  //   'Close/Uninstall the other App.',
  // FaceTec_camera_feed_issue_table_row_3_cell_1:
  //   'Hardware not capable of being secured.',
  // FaceTec_camera_feed_issue_table_row_3_cell_2: 'Use a different Device.',
  // FaceTec_camera_feed_issue_subtable_message:
  //   "This App blocks suspicious webcam configurations. <a href='https://livenesscheckhelp.com/' target='_blank' style='text-decoration:underline;'>Learn More Here</a>.",
  // FaceTec_camera_feed_issue_action: 'Try Again Anyway',
  // FaceTec_camera_feed_issue_action_firefox_permissions_error: 'OK',

  FaceTec_camera_permission_header: translate('auth_permission.title_cam'),
  FaceTec_camera_permission_message: translate('auth_permission.body_cam'),
  FaceTec_camera_permission_launch_settings: translate(
    'auth_permission.button_primary_cam'
  ),

  FaceTec_initializing_camera: 'Starting Camera',
  FaceTec_initializing_camera_still_loading: 'Encrypting Camera Feed',

  FaceTec_result_facemap_upload_message: translate('auth_progress.loader'),
  FaceTec_result_success_message: 'Success!',

  FaceTec_presession_frame_your_face: translate(
    presessionFeedback('center_face')
  ),
  FaceTec_presession_position_face_straight_in_oval: translate(
    presessionFeedback('head_not_upright')
  ),
  FaceTec_presession_eyes_straight_ahead: translate(
    presessionFeedback('not_looking_straight')
  ),
  FaceTec_presession_hold_steady_1: translate(
    presessionFeedback('steady_count_1')
  ),
  FaceTec_presession_hold_steady_2: translate(
    presessionFeedback('steady_count_2')
  ),
  FaceTec_presession_hold_steady_3: translate(
    presessionFeedback('steady_count_3')
  ),
  FaceTec_presession_remove_dark_glasses: translate(
    presessionFeedback('remove_sunglasses')
  ),
  FaceTec_presession_neutral_expression: translate(
    presessionFeedback('neutral_expression')
  ),
  FaceTec_presession_conditions_too_bright: translate(
    presessionFeedback('conditions_too_bright')
  ),
  FaceTec_presession_brigten_your_environment: translate(
    presessionFeedback('conditions_too_dark')
  ),
})
