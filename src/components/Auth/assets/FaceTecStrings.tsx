import { TranslateCallback } from '~types/locales'

const FEEDBACK = {
  center_face: 'auth_capture.feedback.center_face',
  face_not_found: 'auth_capture.feedback.face_not_found',
  move_back: 'auth_capture.feedback.move_back',
  move_close: 'auth_capture.feedback.move_close',
  eye_level: 'auth_capture.feedback.eye_level',
  not_looking_straight_ahead:
    'auth_capture.feedback.not_looking_straight_ahead',
  head_not_upright: 'auth_capture.feedback.head_not_upright',
  steady: 'auth_capture.feedback.steady',
  move_closer: 'auth_capture.feedback.move_closer',
  even_lighting: 'auth_capture.feedback.even_lighting',
}

const PRESESSION_FEEDBACK = {
  center_face: 'auth_capture_start.feedback.center_face',
  head_not_upright: 'auth_capture_start.feedback.head_not_upright',
  not_looking_straight: 'auth_capture_start.feedback.not_looking_straight',
  steady_count_1: 'auth_capture_start.feedback.steady_count_1',
  steady_count_2: 'auth_capture_start.feedback.steady_count_2',
  steady_count_3: 'auth_capture_start.feedback.steady_count_3',
  remove_sunglasses: 'auth_capture_start.feedback.remove_sunglasses',
  neutral_expression: 'auth_capture_start.feedback.neutral_expression',
  conditions_too_bright: 'auth_capture_start.feedback.conditions_too_bright',
  conditions_too_dark: 'auth_capture_start.feedback.conditions_too_dark',
}

export const FaceTecStrings = (
  translate: TranslateCallback
): Record<string, string> => ({
  FaceTec_accessibility_cancel_button: translate(
    'auth_accessibility.back_button'
  ),
  FaceTec_feedback_center_face: translate(FEEDBACK['center_face']),
  FaceTec_feedback_face_not_found: translate(FEEDBACK['face_not_found']),
  FaceTec_feedback_move_phone_away: translate(FEEDBACK['move_back']),
  FaceTec_feedback_move_away_web: translate(FEEDBACK['move_back']),
  FaceTec_feedback_move_phone_closer: translate(FEEDBACK['move_close']),
  FaceTec_feedback_move_phone_to_eye_level: translate(FEEDBACK['eye_level']),
  FaceTec_feedback_move_to_eye_level_web: translate(FEEDBACK['eye_level']),
  FaceTec_feedback_face_not_looking_straight_ahead: translate(
    FEEDBACK['not_looking_straight_ahead']
  ),
  FaceTec_feedback_face_not_upright: translate(FEEDBACK['head_not_upright']),
  FaceTec_feedback_face_not_upright_mobile: translate(
    FEEDBACK['head_not_upright']
  ),
  FaceTec_feedback_hold_steady: translate(FEEDBACK['steady']),
  FaceTec_feedback_move_web_closer: translate(FEEDBACK['move_close']),
  FaceTec_feedback_move_web_even_closer: translate(FEEDBACK['move_closer']),
  FaceTec_feedback_use_even_lighting: translate(FEEDBACK['even_lighting']),

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

  FaceTec_camera_feed_issue_header: translate(
    'auth_error.cam_encryption.title'
  ),
  FaceTec_camera_feed_issue_subheader_message: translate(
    'auth_error.cam_encryption.subtitle'
  ),
  FaceTec_camera_feed_issue_table_header_1: translate(
    'auth_error.cam_encryption.table_header_1'
  ),
  FaceTec_camera_feed_issue_table_header_2: translate(
    'auth_error.cam_encryption.table_header_2'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_1_firefox_permissions_error: translate(
    'auth_error.cam_encryption.table_row_1_cell_1_firefox'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_2_firefox_permissions_error: translate(
    'auth_error.cam_encryption.table_row_1_cell_2_firefox'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_1: translate(
    'auth_error.cam_encryption.table_row_1_cell_1'
  ),
  FaceTec_camera_feed_issue_table_row_1_cell_2: translate(
    'auth_error.cam_encryption.table_row_1_cell_2'
  ),
  FaceTec_camera_feed_issue_table_row_2_cell_1: translate(
    'auth_error.cam_encryption.table_row_2_cell_1'
  ),
  FaceTec_camera_feed_issue_table_row_2_cell_2: translate(
    'auth_error.cam_encryption.table_row_2_cell_2'
  ),
  FaceTec_camera_feed_issue_table_row_3_cell_1: translate(
    'auth_error.cam_encryption.table_row_3_cell_1'
  ),
  FaceTec_camera_feed_issue_table_row_3_cell_2: translate(
    'auth_error.cam_encryption.table_row_3_cell_2'
  ),
  FaceTec_camera_feed_issue_subtable_message: translate(
    'auth_error.cam_encryption.body'
  ),
  FaceTec_camera_feed_issue_action: translate(
    'auth_error.cam_encryption.button_primary'
  ),
  FaceTec_camera_feed_issue_action_firefox_permissions_error: translate(
    'auth_error.cam_encryption.button_primary_firefox'
  ),

  FaceTec_camera_permission_header: translate('auth_permission.title_cam'),
  FaceTec_camera_permission_message: translate('auth_permission.body_cam'),
  FaceTec_camera_permission_launch_settings: translate(
    'auth_permission.button_primary_cam'
  ),

  FaceTec_initializing_camera: translate('auth_cam_start.loader'),
  FaceTec_initializing_camera_still_loading: translate(
    'auth_cam_encrypt.loader'
  ),

  FaceTec_result_facemap_upload_message: translate('auth_progress.loader'),
  FaceTec_result_success_message: translate('auth_upload_pass.body'),

  FaceTec_presession_frame_your_face: translate(
    PRESESSION_FEEDBACK['center_face']
  ),
  FaceTec_presession_position_face_straight_in_oval: translate(
    PRESESSION_FEEDBACK['head_not_upright']
  ),
  FaceTec_presession_eyes_straight_ahead: translate(
    PRESESSION_FEEDBACK['not_looking_straight']
  ),
  FaceTec_presession_hold_steady_1: translate(
    PRESESSION_FEEDBACK['steady_count_1']
  ),
  FaceTec_presession_hold_steady_2: translate(
    PRESESSION_FEEDBACK['steady_count_2']
  ),
  FaceTec_presession_hold_steady_3: translate(
    PRESESSION_FEEDBACK['steady_count_3']
  ),
  FaceTec_presession_remove_dark_glasses: translate(
    PRESESSION_FEEDBACK['remove_sunglasses']
  ),
  FaceTec_presession_neutral_expression: translate(
    PRESESSION_FEEDBACK['neutral_expression']
  ),
  FaceTec_presession_conditions_too_bright: translate(
    PRESESSION_FEEDBACK['conditions_too_bright']
  ),
  FaceTec_presession_brigten_your_environment: translate(
    PRESESSION_FEEDBACK['conditions_too_dark']
  ),
  FaceTec_enter_fullscreen_header: translate('auth_full_screen.title'),
  FaceTec_enter_fullscreen_message: translate('auth_full_screen.body'),
  FaceTec_enter_fullscreen_action: translate('auth_full_screen.button_primary'),
})
