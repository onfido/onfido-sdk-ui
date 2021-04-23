const feedback = (el) => `auth_capture.feedback.${el}`
const presessionFeedback = (el) => `auth_capture_start.feedback.${el}`
export const FaceTecStrings = (t) => ({
  FaceTec_accessibility_cancel_button: t('auth_accessibility.back_button'),
  FaceTec_feedback_center_face: t(feedback('center_face')),
  FaceTec_feedback_face_not_found: t(feedback('face_not_found')),
  FaceTec_feedback_move_phone_away: t(feedback('move_back')),
  FaceTec_feedback_move_away_web: t(feedback('move_back')),
  FaceTec_feedback_move_phone_closer: t(feedback('move_close')),
  FaceTec_feedback_move_phone_to_eye_level: t(feedback('eye_level')),
  FaceTec_feedback_move_to_eye_level_web: t(feedback('eye_level')),
  FaceTec_feedback_face_not_looking_straight_ahead: t(
    feedback('not_looking_straight_ahead')
  ),
  FaceTec_feedback_face_not_upright: t(feedback('head_not_upright')),
  FaceTec_feedback_face_not_upright_mobile: t(feedback('head_not_upright')),
  FaceTec_feedback_hold_steady: t(feedback('steady')),
  FaceTec_feedback_move_web_closer: t(feedback('move_close')),
  FaceTec_feedback_move_web_even_closer: t(feedback('move_closer')),
  FaceTec_feedback_use_even_lighting: t(feedback('even_lighting')),

  FaceTec_instructions_header_ready_desktop: t('auth_capture_start.title'),
  FaceTec_instructions_header_ready_1_mobile: t('auth_capture_start.title'),
  FaceTec_instructions_header_ready_2_mobile: '',
  FaceTec_instructions_message_ready_desktop: t('auth_capture_start.body'),
  FaceTec_instructions_message_ready_1_mobile: t('auth_capture_start.body'),
  FaceTec_instructions_message_ready_2_mobile: '',

  FaceTec_action_im_ready: t('auth_capture_start.button_primary'),

  FaceTec_result_facescan_upload_message: t('auth_progress.loader'),
  FaceTec_result_idscan_upload_message: t('auth_progress.loader'),

  FaceTec_retry_header: t('auth_retry.title'),
  FaceTec_retry_subheader_message: t('auth_retry.subtitle'),
  FaceTec_retry_your_image_label: '',
  FaceTec_retry_ideal_image_label: '',
  FaceTec_retry_instruction_message_1: t('auth_retry.body_neutral_expression'),
  FaceTec_retry_instruction_message_2: t('auth_retry.body_too_bright'),
  FaceTec_retry_instruction_message_3: t('auth_retry.body_blur'),
  FaceTec_action_ok: t('auth_retry.button_primary'),

  FaceTec_camera_feed_issue_header: t('auth_error.cam_encryption.title'),
  FaceTec_camera_feed_issue_subheader_message: t(
    'auth_error.cam_encryption.subtitle'
  ),
  FaceTec_camera_feed_issue_table_header_1: t(
    'auth_error.cam_encryption.table_header_1'
  ),
  FaceTec_camera_feed_issue_table_header_2: t(
    'auth_error.cam_encryption.table_header_2'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_1_firefox_permissions_error: t(
    'auth_error.cam_encryption.table_row_1_cell_1_firefox'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_2_firefox_permissions_error: t(
    'auth_error.cam_encryption.table_row_1_cell_2_firefox'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_1: t(
    'auth_error.cam_encryption.table_row_1_cell_1'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_2: t(
    'auth_error.cam_encryption.table_row_1_cell_2'
  ),
  FaceTec_camera_feed_issue_table_row_2_cell_1: t(
    'auth_error.cam_encryption.table_row_2_cell_1'
  ),
  FaceTec_camera_feed_issue_table_row_2_cell_2: t(
    'auth_error.cam_encryption.table_row_2_cell_2'
  ),
  FaceTec_camera_feed_issue_table_row_3_cell_1: t(
    'auth_error.cam_encryption.table_row_3_cell_1'
  ),
  FaceTec_camera_feed_issue_table_row_3_cell_2: t(
    'auth_error.cam_encryption.table_row_3_cell_2'
  ),
  FaceTec_camera_feed_issue_subtable_message: t(
    'auth_error.cam_encryption.body'
  ),
  FaceTec_camera_feed_issue_action: t(
    'auth_error.cam_encryption.button_primary'
  ),
  FaceTec_camera_feed_issue_action_firefox_permissions_error: t(
    'auth_error.cam_encryption.button_primary_firefox'
  ),

  FaceTec_camera_permission_header: t('auth_permission.title_cam'),
  FaceTec_camera_permission_message: t('auth_permission.body_cam'),
  FaceTec_camera_permission_launch_settings: t(
    'auth_permission.button_primary_cam'
  ),

  FaceTec_initializing_camera: t('auth_cam_start.loader'),
  FaceTec_initializing_camera_still_loading: t('auth_cam_encrypt.loader'),

  FaceTec_result_facemap_upload_message: t('auth_progress.loader'),
  FaceTec_result_success_message: t('auth_upload_pass.body'),

  FaceTec_presession_frame_your_face: t(presessionFeedback('center_face')),
  FaceTec_presession_position_face_straight_in_oval: t(
    presessionFeedback('head_not_upright')
  ),
  FaceTec_presession_eyes_straight_ahead: t(
    presessionFeedback('not_looking_straight')
  ),
  FaceTec_presession_hold_steady_1: t(presessionFeedback('steady_count_1')),
  FaceTec_presession_hold_steady_2: t(presessionFeedback('steady_count_2')),
  FaceTec_presession_hold_steady_3: t(presessionFeedback('steady_count_3')),
  FaceTec_presession_remove_dark_glasses: t(
    presessionFeedback('remove_sunglasses')
  ),
  FaceTec_presession_neutral_expression: t(
    presessionFeedback('neutral_expression')
  ),
  FaceTec_presession_conditions_too_bright: t(
    presessionFeedback('conditions_too_bright')
  ),
  FaceTec_presession_brigten_your_environment: t(
    presessionFeedback('conditions_too_dark')
  ),
  FaceTec_enter_fullscreen_header: t('auth_full_screen.title'),
  FaceTec_enter_fullscreen_message: t('auth_full_screen.body'),
  FaceTec_enter_fullscreen_action: t('auth_full_screen.button_primary'),
})
