# Onfido Web SDK Migration Guide

The guides below are provided to ease the transition of existing applications using the Onfido SDK from one version to another that introduces breaking API changes.

## `next`

`tearDown` is deprecated in favor of `safeTearDown` which is a promise that you can await to know when the sdk tear down is complete.

For all supported language the copy for the following string(s) has been added:

## Added strings

- `avc_face_capture:alert:mic_conflict_title`
- `doc_auto_capture:footer:manual_fallback_generic_document_back`
- `doc_auto_capture:footer:manual_fallback_generic_document_front`
- `doc_auto_capture:footer:position_generic_document_back`
- `doc_auto_capture:footer:position_generic_document_front`
- `doc_confirmation:body_generic_document`
- `doc_submit:title_generic_document_back`
- `doc_submit:title_generic_document_front`
- `photo_upload:body_id_back`
- `photo_upload:body_id_front`
- `profile_data:components::id_type_select::aus_specific::other`
- `profile_data:components::id_type_select::bra_specific::other`
- `profile_data:components::id_type_select::bra_specific::tax_id`
- `profile_data:components::id_type_select::driving_license`
- `profile_data:components::id_type_select::esp_specific::identity_card`
- `profile_data:components::id_type_select::gha_specific::social_insurance`
- `profile_data:components::id_type_select::identity_card`
- `profile_data:components::id_type_select::ind_specific::tax_id`
- `profile_data:components::id_type_select::ken_specific::other`
- `profile_data:components::id_type_select::nga_specific::identity_card`
- `profile_data:components::id_type_select::nga_specific::other`
- `profile_data:components::id_type_select::nga_specific::tax_id`
- `profile_data:components::id_type_select::other`
- `profile_data:components::id_type_select::passport`
- `profile_data:components::id_type_select::placeholder`
- `profile_data:components::id_type_select::tax_id`
- `profile_data:components::id_type_select::voter_id`
- `profile_data::field_labels::arg_specific::national_id_value`
- `profile_data::field_labels::can_specific::national_id_value`
- `profile_data::field_labels::chl_specific::national_id_value`
- `profile_data::field_labels::chn_specific::national_id_value`
- `profile_data::field_labels::col_specific::national_id_value`
- `profile_data::field_labels::dnk_specific::national_id_value`
- `profile_data::field_labels::fin_specific::national_id_value`
- `profile_data::field_labels::hkg_specific::national_id_value`
- `profile_data::field_labels::ita_specific::national_id_value`
- `profile_data::field_labels::jpn_specific::national_id_value`
- `profile_data::field_labels::lux_specific::national_id_value`
- `profile_data::field_labels::national_id_type`
- `profile_data::field_labels::national_id_value`
- `profile_data::field_labels::phl_specific::national_id_value`
- `profile_data::field_labels::pol_specific::national_id_value`
- `profile_data::field_labels::prt_specific::national_id_value`
- `profile_data::field_labels::tur_specific::national_id_value`
- `profile_data::field_validation::arg_specific::invalid_national_id_value`
- `profile_data::field_validation::arg_specific::required_national_id_value`
- `profile_data::field_validation::bra_specific::invalid_other`
- `profile_data::field_validation::bra_specific::invalid_tax_id`
- `profile_data::field_validation::bra_specific::required_other`
- `profile_data::field_validation::bra_specific::required_tax_id`
- `profile_data::field_validation::can_specific::invalid_national_id_value`
- `profile_data::field_validation::can_specific::required_national_id_value`
- `profile_data::field_validation::chl_specific::invalid_national_id_value`
- `profile_data::field_validation::chl_specific::required_national_id_value`
- `profile_data::field_validation::chn_specific::invalid_national_id_value`
- `profile_data::field_validation::chn_specific::required_national_id_value`
- `profile_data::field_validation::col_specific::invalid_national_id_value`
- `profile_data::field_validation::col_specific::required_national_id_value`
- `profile_data::field_validation::dnk_specific::invalid_national_id_value`
- `profile_data::field_validation::dnk_specific::required_national_id_value`
- `profile_data::field_validation::esp_specific::invalid_identity_card`
- `profile_data::field_validation::esp_specific::invalid_other`
- `profile_data::field_validation::esp_specific::required_identity_card`
- `profile_data::field_validation::esp_specific::required_other`
- `profile_data::field_validation::fin_specific::invalid_national_id_value`
- `profile_data::field_validation::fin_specific::required_national_id_value`
- `profile_data::field_validation::gha_specific::invalid_social_insurance`
- `profile_data::field_validation::gha_specific::required_social_insurance`
- `profile_data::field_validation::hkg_specific::invalid_national_id_value`
- `profile_data::field_validation::hkg_specific::required_national_id_value`
- `profile_data::field_validation::invalid_driving_license`
- `profile_data::field_validation::invalid_voter_id`
- `profile_data::field_validation::required_id_type`
- `profile_data::field_validation::required_id_value`
- `profile_data::field_validation::required_passport`
- `profile_data::field_validation::required_driving_license`
- `profile_data::field_validation::required_voter_id`
- `profile_data::field_validation::ita_specific::invalid_national_id_value`
- `profile_data::field_validation::jpn_specific::invalid_national_id_value`
- `profile_data::field_validation::jpn_specific::required_national_id_value`
- `profile_data::field_validation::ken_specific::invalid_other`
- `profile_data::field_validation::ken_specific::required_other`
- `profile_data::field_validation::lux_specific::invalid_national_id_value`
- `profile_data::field_validation::lux_specific::required_national_id_value`
- `profile_data::field_validation::mex_specific::invalid_identity_card`
- `profile_data::field_validation::mex_specific::invalid_tax_id`
- `profile_data::field_validation::mex_specific::required_identity_card`
- `profile_data::field_validation::mex_specific::required_tax_id`
- `profile_data::field_validation::mys_specific::invalid_national_id_value`
- `profile_data::field_validation::mys_specific::required_national_id_value`
- `profile_data::field_validation::nga_specific::invalid_identity_card`
- `profile_data::field_validation::nga_specific::invalid_other`
- `profile_data::field_validation::nga_specific::invalid_tax_id`
- `profile_data::field_validation::nga_specific::required_identity_card`
- `profile_data::field_validation::nga_specific::required_other`
- `profile_data::field_validation::nga_specific::required_tax_id`
- `profile_data::field_validation::phl_specific::invalid_national_id_value`
- `profile_data::field_validation::phl_specific::required_national_id_value`
- `profile_data::field_validation::pol_specific::invalid_national_id_value`
- `profile_data::field_validation::pol_specific::required_national_id_value`
- `profile_data::field_validation::prt_specific::invalid_national_id_value`
- `profile_data::field_validation::prt_specific::required_national_id_value`
- `profile_data::field_validation::reference::translation`
- `profile_data::field_validation::sgp_specific::invalid_national_id_value`
- `profile_data::field_validation::sgp_specific::required_national_id_value`
- `profile_data::field_validation::swe_specific::invalid_national_id_value`
- `profile_data::field_validation::swe_specific::required_national_id_value`
- `profile_data::field_validation::tur_specific::invalid_national_id_value`
- `profile_data::field_validation::tur_specific::required_national_id_value`
- `profile_data::national_id_number_title`
- `cross_device::button_primary_upload`
- `cross_device_intro::subtitle_upload`

## `11.0.0`

The deprecated `useLiveDocumentCapture` document option has been removed from Onfido's SDK. Please remove it.
The deprecated `useWebcam` document option has been removed from Onfido's SDK. Please remove it.

## Added strings

- `profile_data.components.id_type_select.placeholder`
- `profile_data.components.id_type_select.identity_card`
- `profile_data.components.id_type_select.passport`
- `profile_data.components.id_type_select.driving_license`
- `profile_data.components.id_type_select.tax_id`
- `profile_data.components.id_type_select.voter_id`
- `profile_data.components.id_type_select.aus_specific.other`
- `profile_data.components.id_type_select.esp_specific.identity_card`
- `profile_data.components.id_type_select.other`
- `profile_data.components.id_type_select.bra_specific.tax_id`
- `profile_data.components.id_type_select.bra_specific.other`
- `profile_data.components.id_type_select.ind_specific.tax_id`
- `profile_data.field_labels.national_id_type`
- `profile_data.field_labels.national_id_value`
- `profile_data.field_labels.arg_specific.national_id_value`
- `profile_data.field_labels.can_specific.national_id_value`
- `profile_data.field_labels.chn_specific.national_id_value`
- `profile_data.field_labels.ita_specific.national_id_value`
- `profile_data.field_labels.sgp_specific.national_id_value`
- `profile_data.field_labels.swe_specific.national_id_value`
- `profile_data.field_labels.tur_specific.national_id_value`
- `profile_data.field_validation.arg_specific.invalid_national_id_value`
- `profile_data.field_validation.bra_specific.invalid_tax_id`
- `profile_data.field_validation.bra_specific.invalid_other`
- `profile_data.field_validation.can_specific.invalid_national_id_value`
- `profile_data.field_validation.chn_specific.invalid_national_id_value`
- `profile_data.field_validation.ita_specific.invalid_national_id_value`
- `profile_data.field_validation.mex_specific.invalid_identity_card`
- `profile_data.field_validation.mex_specific.invalid_tax_id`
- `profile_data.field_validation.sgp_specific.invalid_national_id_value`
- `profile_data.field_validation.esp_specific.invalid_identity_card`
- `profile_data.field_validation.esp_specific.invalid_other`
- `profile_data.field_validation.swe_specific.invalid_national_id_value`
- `profile_data.field_validation.tur_specific.invalid_national_id_value`
- `profile_data.field_validation.invalid_driving_license`
- `profile_data.field_validation.invalid_voter_id`
- `profile_data.field_validation.invalid_passport`
- `profile_data.field_validation.invalid_national_id_value`
- `profile_data.national_id_number_title`
- `profile_data.components.id_type_select.mex_specific.identity_card`
- `profile_data.components.id_type_select.mex_specific.tax_id`
- `profile_data.field_validation.arg_specific.required_national_id_value`
- `profile_data.field_validation.bra_specific.required_tax_id`
- `profile_data.field_validation.bra_specific.required_other`
- `profile_data.field_validation.can_specific.required_national_id_value`
- `profile_data.field_validation.chn_specific.required_national_id_value`
- `profile_data.field_validation.ita_specific.required_national_id_value`
- `profile_data.field_validation.mex_specific.required_identity_card`
- `profile_data.field_validation.mex_specific.required_tax_id`
- `profile_data.field_validation.sgp_specific.required_national_id_value`
- `profile_data.field_validation.esp_specific.required_identity_card`
- `profile_data.field_validation.esp_specific.required_other`
- `profile_data.field_validation.swe_specific.required_national_id_value`
- `profile_data.field_validation.tur_specific.required_national_id_value`
- `profile_data.field_validation.required_national_id_value`
- `profile_data.field_validation.required_national_id_type`
- `profile_data.field_validation.required_national_voter_id`
- `profile_data.field_validation.required_national_passport`
- `profile_data.field_validation.required_national_driving_license`
- `profile_data.field_validation.hkg_specific.required_national_id_value`
- `profile_data.field_validation.hkg_specific.invalid_national_id_value`
- `profile_data.field_labels.hkg_specific.national_id_value`
- `profile_data.field_validation.jpn_specific.required_national_id_value`
- `profile_data.field_validation.jpn_specific.invalid_national_id_value`
- `profile_data.field_labels.jpn_specific.national_id_value`
- `profile_data.field_validation.chl_specific.required_national_id_value`
- `profile_data.field_validation.chl_specific.invalid_national_id_value`
- `profile_data.field_labels.chl_specific.national_id_value`
- `profile_data.field_validation.col_specific.required_national_id_value`
- `profile_data.field_validation.col_specific.invalid_national_id_value`
- `profile_data.field_labels.col_specific.national_id_value`
- `profile_data.field_validation.fin_specific.required_national_id_value`
- `profile_data.field_validation.fin_specific.invalid_national_id_value`
- `profile_data.field_labels.fin_specific.national_id_value`
- `profile_data.field_validation.gha_specific.required_social_insurance`
- `profile_data.field_validation.gha_specific.invalid_social_insurance`
- `profile_data.components.id_type_select.gha_specific.social_insurance`
- `profile_data.field_validation.ken_specific.required_other`
- `profile_data.field_validation.ken_specific.invalid_other`
- `profile_data.components.id_type_select.ken_specific.other`
- `profile_data.field_validation.lux_specific.required_national_id_value`
- `profile_data.field_validation.lux_specific.invalid_national_id_value`
- `profile_data.field_labels.lux_specific.national_id_value`
- `profile_data.field_validation.mys_specific.required_national_id_value`
- `profile_data.field_validation.mys_specific.invalid_national_id_value`
- `profile_data.field_labels.mys_specific.national_id_value`
- `profile_data.field_validation.nga_specific.required_other`
- `profile_data.field_validation.nga_specific.invalid_other`
- `profile_data.components.id_type_select.nga_specific.other`
- `profile_data.field_validation.nga_specific.required_identity_card`
- `profile_data.field_validation.nga_specific.invalid_identity_card`
- `profile_data.components.id_type_select.nga_specific.identity_card`
- `profile_data.field_validation.nga_specific.required_tax_id`
- `profile_data.field_validation.nga_specific.invalid_tax_id`
- `profile_data.components.id_type_select.nga_specific.tax_id`
- `profile_data.field_validation.phl_specific.required_national_id_value`
- `profile_data.field_validation.phl_specific.invalid_national_id_value`
- `profile_data.field_labels.phl_specific.national_id_value`
- `profile_data.field_validation.pol_specific.required_national_id_value`
- `profile_data.field_validation.pol_specific.invalid_national_id_value`
- `profile_data.field_labels.pol_specific.national_id_value`
- `profile_data.field_validation.prt_specific.required_national_id_value`
- `profile_data.field_validation.prt_specific.invalid_national_id_value`
- `profile_data.field_labels.prt_specific.national_id_value`

## `10.4.0`

## Updated strings

- `avc_intro:disclaimer` (ar, bg, cs, en_US, hr, hy, zh_CH, zh_TW)
- `doc_auto_capture:position_license_front` (en_GB)
- `avc_intro:button_primary_ready` (en_US)
- `avc_connection_error:button_secondary_restart_recording` (pl)
- `avc_no_face_detected:button_primary_restart` (pl)
- `welcome:trial_message` (pt)
- `welcome:info_original_document` (all)
- `avc_intro:disclaimer_camera_and_audio_on` (all)
- `nfc_scan:sheet:success` (all)

## `10.1.0` -> `10.2.0`

We have added new language(s):

- Arabic
- Armenian
- Bulgarian
- Chinese (Simplified)
- Chinese (Traditional)
- Croatian
- Danish
- English (United States)
- Estonian
- Finnish
- French (Canadian)
- Greek
- Hebrew
- Hindi
- Hungarian
- Indonesian
- Japanese
- Korean
- Latvian
- Lithuanian
- Malay
- Norwegian
- Persian
- Portuguese (Brazil)
- Russian
- Serbian
- Slovak
- Spanish (Latin America)
- Swedish
- Thai
- Turkish
- Ukrainian
- Vietnamese

## `9.1.4` -> `10.1.0`

We have added new language(s): **Czech, Polish, and Romanian**
The `useLiveDocumentCapture` beta document option has been deprecated from Onfido's SDK. You should think about removing it before the next major version.
The `useWebcam` alpha document option has been deprecated from Onfido's SDK. You should think about removing it before the next major version.

## Updated strings

- `profile_data.field_validation.too_long_line1`

## Added strings

- doc_auto_capture.button_accessibility
- doc_auto_capture.footer.position_identity_card_front
- doc_auto_capture.footer.position_identity_card_back
- doc_auto_capture.footer.position_residence_permit_front
- doc_auto_capture.footer.position_residence_permit_back
- doc_auto_capture.footer.position_license_front
- doc_auto_capture.footer.position_license_back
- doc_auto_capture.footer.position_passport
- doc_auto_capture.footer.manual_fallback_identity_card_front
- doc_auto_capture.footer.manual_fallback_identity_card_back
- doc_auto_capture.footer.manual_fallback_residence_permit_front
- doc_auto_capture.footer.manual_fallback_residence_permit_back
- doc_auto_capture.footer.manual_fallback_license_front
- doc_auto_capture.footer.manual_fallback_license_back
- doc_auto_capture.footer.manual_fallback_passport
- doc_auto_capture.footer.capturing
- doc_auto_capture.footer.captured
- doc_auto_capture.frame.flip_document
- doc_auto_capture.frame.hold_still
- doc_auto_capture.frame.no_document

## `9.1.1` -> `9.1.2`

The **English**, **Spanish**, **German**, **French**, **Italian**, **Dutch** and **Portuguese** copy for the following string(s) has been added:

### Added strings

- `welcome.trial_message`
- `welcome.start_workflow_button_trial`

## `8.2.0` -> `9.0.0`

The **English**, **Spanish**, **German**, **French**, **Italian**, **Dutch** and **Portuguese** copy for the following string(s) has been added:

### Added strings

- `avc_confirmation.button_primary_upload`
- `avc_confirmation.subtitle`
- `avc_confirmation.title`
- `avc_connection_error.button_primary_retry_upload`
- `avc_connection_error.button_secondary_restart_recording`
- `avc_connection_error.subtitle`
- `avc_connection_error.title`
- `avc_face_alignment.feedback_move_back`
- `avc_face_alignment.feedback_move_closer`
- `avc_face_alignment.feedback_no_face_detected`
- `avc_face_alignment.feedback_not_centered`
- `avc_face_alignment.title`
- `avc_face_capture.alert.timeout_body`
- `avc_face_capture.alert.timeout_button_primary`
- `avc_face_capture.alert.timeout_title`
- `avc_face_capture.alert.too_fast_body`
- `avc_face_capture.alert.too_fast_button_primary`
- `avc_face_capture.alert_too_fast_title`
- `avc_face_capture.title`
- `avc_face_capture.title_completed`
- `avc_intro.button_primary_ready`
- `avc_intro.disclaimer`
- `avc_intro.list_item_one`
- `avc_intro.list_item_two`
- `avc_intro.subtitle`
- `avc_intro.title`
- `avc_no_face_detected.button_primary_restart`
- `avc_no_face_detected.list_item_eyes`
- `avc_no_face_detected.list_item_face`
- `avc_no_face_detected.list_item_lighting`
- `avc_no_face_detected.list_item_mask`
- `avc_no_face_detected.title`
- `avc_uploading.title`

The **German, English, Spanish, French, Italian, Dutch, and Portuguese** copy for the following string(s) has been changed:

## Added:

- `doc_select.subtitle_entire_page`
- `doc_select.subtitle_front_back`
- `doc_select.subtitle_photo_page`
- `livenessV2.error_reload_instructions`
- `livenessV2.intro_note_no1`
- `livenessV2.intro_note_no2`
- `livenessV2.intro_ready_button`
- `livenessV2.intro_subtitle`
- `livenessV2.intro_warning`
- `livenessV2.success_main_button`
- `livenessV2.success_title`
- `outro.body_government_letter`
- `permission_recovery.subtitle_cam_old`
- `poa_cancel`
- `poa_err_invalid_file.message`
- `poa_err_invalid_file.ok`
- `poa_err_invalid_file.title`
- `profile_data.components.nationality_select.placeholder`
- `profile_data.components.pan.placeholder`
- `profile_data.components.ssn.placeholder`
- `profile_data.field_labels.email`
- `profile_data.field_labels.mobile_number`
- `profile_data.field_labels.nationality`
- `profile_data.field_labels.pan`
- `profile_data.field_labels.ssn`
- `profile_data.field_validation.required_email`
- `profile_data.field_validation.required_mobile_number`
- `profile_data.field_validation.required_nationality`
- `profile_data.field_validation.required_pan`
- `profile_data.field_validation.required_ssn`
- `profile_data.field_validation.too_short_first_name`
- `profile_data.field_validation.valid_email`
- `profile_data.field_validation.valid_mobile_number`
- `profile_data.field_validation.valid_pan`
- `profile_data.field_validation.valid_ssn`
- `profile_data.field_validation.gbr_specific.invalid_postcode`
- `retry_feedback.button_primary`
- `retry_feedback_id_expired.subtitle`
- `retry_feedback_id_expired.title`
- `retry_feedback_id_generic.subtitle`
- `retry_feedback_id_generic.title`
- `retry_feedback_id_unaccepted.subtitle`
- `retry_feedback_id_unaccepted.title`
- `retry_feedback_selfie_generic.subtitle`
- `retry_feedback_selfie_generic.title`
- `workflow_complete.pass.description`
- `workflow_complete.pass.title`
- `workflow_complete.reject.description`
- `workflow_complete.reject.title`

## Deleted:

- `profile_data.field_validation.usa_specific.required_postcode`
- `profile_data.field_validation.usa_specific.too_short_postcode`
- `profile_data.field_validation.usa_specific.too_long_postcode`
- `photo_upload.body_government_letter`

## Updated:

- `country_select.poa_alert.intro`
- `doc_select.section.input_placeholder_country`

The **German** copy for the following string(s) has been changed:

## Added:

- `doc_capture.button_primary`
- `doc_select.pill`
- `doc_select.section.input_country_not_found`
- `generic.errors.expired_token.instruction`
- `generic.errors.expired_token.message`
- `selfie_capture.body`
- `selfie_capture.button_primary`
- `video_capture.body_stop`
- `welcome.doc_video_subtitle`
- `workflow_erros.generic_title`
- `workflow_erros.no_workflow_run_id`
- `workflow_erros.reload_app`
- `workflow_erros.task_not_completed`
- `workflow_erros.task_not_retrieved`
- `workflow_erros.task_not_supported`

## Updated:

- `doc_select.button_government_letter`
- `doc_select.button_government_letter_detail`
- `doc_submit.title_government_letter`
- `profile_data.field_validation.required_first_name`
- `doc_confirmation.body_id`
- `doc_confirmation.body_license`
- `doc_confirmation.body_passport`
- `doc_confirmation.body_permit`
- `poa_intro.list_most_recent`
- `poa_intro.list_shows_address`
- `doc_video_capture.header_step2`

## Deleted:

- `profile_data.field_validation.too_long__line2`
- `profile_data.field_validation.too_long__line3`
- `doc_select.section.input_placeholder_country_copy`

The **English** copy for the following string(s) has been changed:

## Added:

- `doc_capture.button_primary`
- `doc_select.pill`
- `selfie_capture.body`
- `selfie_capture.button_primary`
- `video_capture.body_stop`
- `welcome.doc_video_subtitle`
- `doc_confirmation.body`
- `doc_select.button_bank_statement_non_uk`
- `profile_data.field_validation.too_long__line1`
- `profile_data.prompt.details_timeout`

## Updated:

- `welcome.start_workflow_button`
- `poa_guidance.subtitle_tax_letter`
- `poa_guidance.subtitle_benefits_letter`
- `cross_device_checklist.list_item_poa`
- `doc_confirmation.body_bank_statement`
- `doc_confirmation.body_benefits_letter`
- `doc_confirmation.body_bill`
- `doc_confirmation.body_tax_letter`
- `poa_guidance.subtitle_bank_statement`
- `poa_intro.list_matches_signup`
- `profile_data.address_title`
- `profile_data.personal_information_title`
- `workflow_erros.task_not_supported`

## Deleted:

- `profile_data.field_labels.usa_specific.ssn`
- `profile_data.field_validation.too_long_line1`
- `profile_data.field_validation.too_long_line2`
- `profile_data.field_validation.too_long_line3`
- `profile_data.field_validation.usa_specific.required_ssn`
- `profile_data.field_validation.usa_specific.invalid_ssn`
- `profile_data.prompt.detail_timeout`
- `cross_device_checklist.list_item_active_video`
- `poa_guidance.subtitle_government_letter`

The **Spanish** copy for the following string(s) has been changed:

## Added:

- `doc_capture.button_primary`
- `doc_select.pill`
- `doc_select.section.input_country_not_found`
- `generic.errors.expired_token.instruction`
- `generic.errors.expired_token.message`
- `selfie_capture.body`
- `selfie_capture.button_primary`
- `video_capture.body_stop`
- `welcome.doc_video_subtitle`
- `workflow_erros.generic_title`
- `workflow_erros.no_workflow_run_id`
- `workflow_erros.reload_app`
- `workflow_erros.task_not_completed`
- `workflow_erros.task_not_retrieved`
- `workflow_erros.task_not_supported`

## Updated:

- `doc_select.button_government_letter`
- `doc_select.button_government_letter_detail`
- `doc_submit.title_government_letter`
- `profile_data.field_validation.required_first_name`
- `doc_confirmation.body_id`
- `doc_confirmation.body_license`
- `doc_confirmation.body_passport`
- `doc_confirmation.body_permit`
- `profile_data.field_validation.too_long_town`
- `welcome.start_workflow_button`
- `profile_data.country_of_residence_title`

## Deleted:

- `profile_data.field_validation.too_long__line2`
- `profile_data.field_validation.too_long__line3`
- `doc_select.section.input_placeholder_country_copy`

The **French** copy for the following string(s) has been changed:

## Added:

- `doc_capture.button_primary`
- `doc_select.pill`
- `doc_select.section.input_country_not_found`
- `generic.errors.expired_token.instruction`
- `generic.errors.expired_token.message`
- `selfie_capture.body`
- `selfie_capture.button_primary`
- `video_capture.body_stop`
- `welcome.doc_video_subtitle`
- `workflow_erros.generic_title`
- `workflow_erros.no_workflow_run_id`
- `workflow_erros.reload_app`
- `workflow_erros.task_not_completed`
- `workflow_erros.task_not_retrieved`
- `workflow_erros.task_not_supported`

## Updated:

- `doc_select.button_government_letter`
- `doc_select.button_government_letter_detail`
- `doc_submit.title_government_letter`
- `profile_data.field_validation.required_first_name`
- `doc_confirmation.body_id`
- `doc_confirmation.body_license`
- `doc_confirmation.body_passport`
- `doc_confirmation.body_permit`
- `profile_data.field_validation.too_long_town`
- `poa_guidance.subtitle_tax_letter`
- `poa_guidance.subtitle_benefits_letter`
- `cross_device_session_linked.list_item_sent_by_you`

## Deleted:

- `profile_data.field_validation.too_long__line2`
- `profile_data.field_validation.too_long__line3`
- `doc_select.section.input_placeholder_country_copy`

The **Italian** copy for the following string(s) has been changed:

## Added:

- `doc_capture.button_primary`
- `doc_select.pill`
- `doc_select.section.input_country_not_found`
- `generic.errors.expired_token.instruction`
- `generic.errors.expired_token.message`
- `selfie_capture.body`
- `selfie_capture.button_primary`
- `video_capture.body_stop`
- `welcome.doc_video_subtitle`
- `workflow_erros.generic_title`
- `workflow_erros.no_workflow_run_id`
- `workflow_erros.reload_app`
- `workflow_erros.task_not_completed`
- `workflow_erros.task_not_retrieved`
- `workflow_erros.task_not_supported`

## Updated:

- `doc_select.button_government_letter`
- `doc_select.button_government_letter_detail`
- `doc_submit.title_government_letter`
- `profile_data.field_validation.required_first_name`
- `doc_confirmation.body_id`
- `doc_confirmation.body_license`
- `doc_confirmation.body_passport`
- `doc_confirmation.body_permit`
- `profile_data.field_validation.too_long_town`
- `welcome.start_workflow_button`
- `poa_guidance.subtitle_tax_letter`
- `avc_uploading.title`

## Deleted:

- `profile_data.field_validation.too_long__line2`
- `profile_data.field_validation.too_long__line3`
- `doc_select.section.input_placeholder_country_copy`

The **Portuguese** copy for the following string(s) has been changed:

## Added:

- `doc_capture.button_primary`
- `doc_select.pill`
- `doc_select.section.input_country_not_found`
- `generic.errors.expired_token.instruction`
- `generic.errors.expired_token.message`
- `selfie_capture.body`
- `selfie_capture.button_primary`
- `video_capture.body_stop`
- `welcome.doc_video_subtitle`
- `workflow_erros.generic_title`
- `workflow_erros.no_workflow_run_id`
- `workflow_erros.reload_app`
- `workflow_erros.task_not_completed`
- `workflow_erros.task_not_retrieved`
- `workflow_erros.task_not_supported`

## Updated:

- `doc_select.button_government_letter`
- `doc_select.button_government_letter_detail`
- `doc_submit.title_government_letter`
- `profile_data.field_validation.required_first_name`
- `doc_confirmation.body_id`
- `doc_confirmation.body_license`
- `doc_confirmation.body_passport`
- `doc_confirmation.body_permit`
- `profile_data.field_validation.too_long_town`
- `welcome.start_workflow_button`

## Deleted:

- `profile_data.field_validation.too_long__line2`
- `profile_data.field_validation.too_long__line3`
- `doc_select.section.input_placeholder_country_copy`

The **Dutch** copy for the following string(s) has been changed:

## Added:

- `doc_select.section.input_country_not_found`
- `generic.errors.expired_token.instruction`
- `generic.errors.expired_token.message`
- `workflow_erros.generic_title`
- `workflow_erros.no_workflow_run_id`
- `workflow_erros.reload_app`
- `workflow_erros.task_not_completed`
- `workflow_erros.task_not_retrieved`
- `workflow_erros.task_not_supported`

## Updated:

- `doc_select.button_government_letter`
- `doc_select.button_government_letter_detail`
- `doc_submit.title_government_letter`
- `profile_data.field_validation.required_first_name`
- `profile_data.field_validation.too_long_town`
- `poa_intro.list_most_recent`
- `poa_intro.list_shows_address`

## Deleted:

- `profile_data.field_validation.too_long__line2`
- `profile_data.field_validation.too_long__line3`
- `doc_select.section.input_placeholder_country_copy`

The **English**, **Spanish**, **German**, **French**, **Italian**, **Dutch** and **Portuguese** copy for the following string(s) has been added:

### Added strings

- `avc_confirmation.button_primary_upload`
- `avc_confirmation.subtitle`
- `avc_confirmation.title`
- `avc_connection_error.button_primary_retry_upload`
- `avc_connection_error.button_secondary_restart_recording`
- `avc_connection_error.subtitle`
- `avc_connection_error.title`
- `avc_face_alignment.feedback_move_back`
- `avc_face_alignment.feedback_move_closer`
- `avc_face_alignment.feedback_no_face_detected`
- `avc_face_alignment.feedback_not_centered`
- `avc_face_alignment.title`
- `avc_face_capture.alert.timeout_body`
- `avc_face_capture.alert.timeout_button_primary`
- `avc_face_capture.alert.timeout_title`
- `avc_face_capture.alert.too_fast_body`
- `avc_face_capture.alert.too_fast_button_primary`
- `avc_face_capture.alert_too_fast_title`
- `avc_face_capture.title`
- `avc_face_capture.title_completed`
- `avc_intro.button_primary_ready`
- `avc_intro.disclaimer`
- `avc_intro.list_item_one`
- `avc_intro.list_item_two`
- `avc_intro.subtitle`
- `avc_intro.title`
- `avc_no_face_detected.button_primary_restart`
- `avc_no_face_detected.list_item_eyes`
- `avc_no_face_detected.list_item_face`
- `avc_no_face_detected.list_item_lighting`
- `avc_no_face_detected.list_item_mask`
- `avc_no_face_detected.title`
- `avc_uploading.title`

## `8.1.1` -> `8.2.0`

The **English**, **Spanish**, **German**, **French**, **Italian**, **Dutch** and **Portuguese** copy for the following string(s) has been added:

### Added strings

- `welcome.start_workflow_button`
- `doc_multi_frame_capture.capture_progress_title`
- `doc_multi_frame_capture.instructions_title_front`
- `doc_multi_frame_capture.instructions_title_back`
- `profile_data.country_of_residence_title`
- `profile_data.personal_information_title`
- `profile_data.address_title`
- `profile_data.field_labels.first_name`
- `profile_data.field_labels.last_name`
- `profile_data.field_labels.dob`
- `profile_data.field_labels.country`
- `profile_data.field_labels.line1`
- `profile_data.field_labels.line2`
- `profile_data.field_labels.line3`
- `profile_data.field_labels.town`
- `profile_data.field_labels.postcode`
- `profile_data.field_labels.gbr_specific.town`
- `profile_data.field_labels.gbr_specific.postcode`
- `profile_data.field_labels.usa_specific.line1_helper_text`
- `profile_data.field_labels.usa_specific.line2_helper_text`
- `profile_data.field_labels.usa_specific.state`
- `profile_data.field_labels.usa_specific.postcode`
- `profile_data.field_validation.required_first_name`
- `profile_data.field_validation.required_last_name`
- `profile_data.field_validation.required_dob`
- `profile_data.field_validation.required_country`
- `profile_data.field_validation.required_line1`
- `profile_data.field_validation.required_postcode`
- `profile_data.field_validation.invalid`
- `profile_data.field_validation.invalid_dob`
- `profile_data.field_validation.too_short_last_name`
- `profile_data.field_validation.too_short_postcode`
- `profile_data.field_validation.too_long_last_name`
- `profile_data.field_validation.too_long_first_name`
- `profile_data.field_validation.too_long_postcode`
- `profile_data.field_validation.too_long__line1`
- `profile_data.field_validation.too_long__line2`
- `profile_data.field_validation.too_long__line3`
- `profile_data.field_validation.too_long_town`
- `profile_data.field_validation.gbr_specific.required_postcode`
- `profile_data.field_validation.gbr_specific.too_short_postcode`
- `profile_data.field_validation.gbr_specific.too_long_postcode`
- `profile_data.field_validation.usa_specific.required_state`
- `profile_data.field_validation.usa_specific.required_postcode`
- `profile_data.field_validation.usa_specific.too_short_postcode`
- `profile_data.field_validation.usa_specific.too_long_postcode`
- `profile_data.field_optional`
- `profile_data.button_continue`
- `profile_data.components.country_select.placeholder`
- `profile_data.components.state_select.placeholder`
- `profile_data.prompt.header_timeout`
- `profile_data.prompt.details_timeout`
- `profile_data.field_labels.usa_specific.ssn`
- `profile_data.field_validation.usa_specific.required_ssn`
- `profile_data.field_validation.usa_specific.invalid_ssn`
- `doc_select.section.header_country`
- `doc_select.section.input_country_not_found`
- `doc_select.section.input_placeholder_country`
- `doc_select.section.header_doc_type`
- `doc_select.subtitle_country`

### Removed strings

- `profile_data.personal_details_title`
- `profile_data.address_detials_title`
- `profile_data.button_submit`

### Change in SDK Options

- The deprecated `showCountrySelection` option has been removed.

## `8.0.0` -> `8.1.1`

### Added strings

- `generic.errors.geoblocked_error.message`
- `generic.errors.geoblocked_error.instruction`

## `6.20.0` -> `8.0.0`

### Change in SDK Options

- The `userConsent` step can't be added in the `steps` options anymore. This step is now enabled from your Onfido Dashboard.

## `6.19.0` -> `6.20.0`

### Change in UX flow for Proof of Address Step

- Proof of Address step now has an Issuing Country Selection screen before the Document Type Selection screen.

## `6.19.0` -> `6.20.0`

The **English**, **Spanish**, **German**, **French**, **Italian**, **Dutch** and **Portuguese** copy for the follinw string(s) has changed:

### Added strings

- `permission_recovery.title_both`
- `permission_recovery.subtitle_both`
- `permission_recovery.list_header_both`
- `permission_recovery.list_item_how_to_both`
- `permission.title_both`
- `permission.subtitle_both`
- `permission.body_both`
- `permission.button_primary_both`

### Changed strings

- `permission_recovery.subtitle_cam`

## `6.13.0` -> `6.14.0`

The **English**, **Spanish**, **German**, **French**, **Italian** and **Portuguese** copy for the following string(s) has changed:

### Added strings

- `cross_device_session_linked.button_primary`
- `cross_device_session_linked.info`
- `cross_device_session_linked.list_item_desktop_open`
- `cross_device_session_linked.list_item_sent_by_you`
- `cross_device_session_linked.subtitle`
- `cross_device_session_linked.title`

### Changed strings

- `generic.errors.request_error.message`

## `6.11.1` -> `6.12.0`

The **English**, **Spanish**, **German**, **French**, **Italian** and **Portuguese** copy for the following string(s) has changed:

### Changed strings

- `video_intro.list_item_actions`

## `6.10.2` -> `6.11.1`

The **English**, **Spanish**, **German**, **French**, **Italian** and **Portuguese** copy for the following string(s) has changed:

### Added strings

- `doc_capture.detail.folded_doc_front`
- `doc_capture.header_folded_doc_front`
- `doc_capture.prompt.button_card`
- `doc_capture.prompt.button_paper`
- `doc_capture.prompt.title_id`
- `doc_capture.prompt.title_license`
- `doc_video_capture.button_primary_fallback`
- `doc_video_capture.button_primary_fallback_end`
- `doc_video_capture.detail_step2`
- `doc_video_capture.header`
- `doc_video_capture.header_paper_doc_step2`
- `doc_video_capture.header_passport`
- `doc_video_capture.header_passport_progress`
- `doc_video_capture.header_step1`
- `doc_video_capture.header_step2`
- `doc_video_capture.prompt.detail_timeout`
- `doc_video_capture.stepper`
- `doc_video_capture.success_accessibility`
- `doc_video_confirmation.button_secondary`
- `doc_video_confirmation.title`
- `video_capture.prompt.header_timeout`
- `video_confirmation.body`
- `video_confirmation.button_primary`
- `video_confirmation.button_secondary`
- `welcome.list_header_doc_video`
- `welcome.list_item_doc_video_timeout`

## `6.9.0` -> `6.10.0`

### Added strings

- `doc_capture.detail.folded_doc_front`
- `doc_capture.header_folded_doc_front`
- `doc_capture.prompt.button_card`
- `doc_capture.prompt.button_paper`
- `doc_capture.prompt.title_id`
- `doc_capture.prompt.title_license`
- `doc_video_capture.button_primary_fallback`
- `doc_video_capture.button_primary_fallback_end`
- `doc_video_capture.detail_step2`
- `doc_video_capture.header`
- `doc_video_capture.header_paper_doc_step2`
- `doc_video_capture.header_passport`
- `doc_video_capture.header_passport_progress`
- `doc_video_capture.header_step1`
- `doc_video_capture.header_step2`
- `doc_video_capture.prompt.detail_timeout`
- `doc_video_capture.stepper`
- `doc_video_capture.success_accessibility`
- `doc_video_confirmation.button_secondary`
- `doc_video_confirmation.title`
- `video_capture.button_primary_start`
- `video_capture.prompt.header_timeout`
- `video_capture.header.challenge_turn_forward`
- `video_confirmation.body`
- `video_confirmation.button_primary`
- `video_confirmation.button_secondary`
- `welcome.subtitle`
- `welcome.list_header_doc_video`
- `welcome.list_header_webcam`
- `welcome.list_item_doc`
- `welcome.list_item_poa`
- `welcome.list_item_doc_video_timeout`
- `welcome.list_item_selfie`

The **English**, **Spanish**, **German**, and **French** copy for the following string(s) has changed:

### Changed strings

- `video_capture.button_primary_finish`
- `video_capture.button_primary_next`
- `video_capture.header.challenge_turn_left`
- `video_capture.header.challenge_turn_right`
- `welcome.title`
- `welcome.next_button`
- `cross_device_checklist.list_item_doc_multiple`
- `cross_device_checklist.list_item_doc_one`
- `cross_device_checklist.list_item_selfie`
- `cross_device_checklist.list_item_video`
- `cross_device_checklist.subtitle`
- `cross_device_checklist.title`
- `doc_confirmation.alert.no_doc_detail`
- `doc_confirmation.alert.no_doc_title`
- `doc_confirmation.body_id`
- `doc_confirmation.body_license`
- `doc_confirmation.body_passport`
- `doc_confirmation.body_permit`
- `doc_confirmation.button_primary_upload`
- `doc_select.button_passport_detail`
- `doc_select.title`
- `generic.errors.no_face.instruction`
- `generic.errors.no_face.message`
- `get_link.subtitle_url`
- `outro.body`
- `outro.title`
- `permission.body_cam`
- `selfie_capture.alert.timeout.detail`
- `selfie_capture.title`
- `selfie_confirmation.subtitle`
- `selfie_confirmation.title`
- `selfie_intro.subtitle`
- `upload_guide.button_primary`
- `video_capture.body`
- `video_capture.body_record`
- `video_confirmation.title`
- `video_intro.button_primary`
- `video_intro.list_item_actions`
- `video_intro.list_item_speak`

Only the **Spanish**, **German**, and **French** copy for the following string(s) has changed:

- `country_select.search.input_placeholder`

### Removed strings

- `video_capture.body_next`
- `video_capture.body_stop`
- `video_capture.button_stop_accessibility`
- `video_capture.header.challenge_turn_template`
- `welcome.description_p_1`
- `welcome.description_p_2`

## `6.8.0` -> `6.9.0`

The **English**, **Spanish**, **German**, and **French** copy for the following string(s) has changed:

### Added strings

- `auth_accessibility.back_button`
- `auth_cam_encrypt.loader`
- `auth_cam_start.loader`
- `auth_capture_start.body`
- `auth_capture_start.button_primary`
- `auth_capture_start.title`
- `auth_capture_start.feedback.center_face`
- `auth_capture_start.feedback.conditions_too_bright`
- `auth_capture_start.feedback.conditions_too_dark`
- `auth_capture_start.feedback.head_not_upright`
- `auth_capture_start.feedback.neutral_expression`
- `auth_capture_start.feedback.not_looking_straight`
- `auth_capture_start.feedback.remove_sunglasses`
- `auth_capture_start.feedback.steady_count_1`
- `auth_capture_start.feedback.steady_count_2`
- `auth_capture_start.feedback.steady_count_3`
- `auth_capture.feedback.center_face`
- `auth_capture.feedback.even_lighting`
- `auth_capture.feedback.eye_level`
- `auth_capture.feedback.face_not_found`
- `auth_capture.feedback.head_not_upright`
- `auth_capture.feedback.move_back`
- `auth_capture.feedback.move_close`
- `auth_capture.feedback.move_closer`
- `auth_capture.feedback.not_looking_straight`
- `auth_capture.feedback.steady`
- `auth_error.cam_encryption.body`
- `auth_error.cam_encryption.button_primary`
- `auth_error.cam_encryption.button_primary_firefox`
- `auth_error.cam_encryption.subtitle`
- `auth_error.cam_encryption.table_header_1`
- `auth_error.cam_encryption.table_header_2`
- `auth_error.cam_encryption.table_row_1_cell_1`
- `auth_error.cam_encryption.table_row_1_cell_1_firefox`
- `auth_error.cam_encryption.table_row_1_cell_2`
- `auth_error.cam_encryption.table_row_1_cell_2_firefox`
- `auth_error.cam_encryption.table_row_2_cell_1`
- `auth_error.cam_encryption.table_row_2_cell_2`
- `auth_error.cam_encryption.table_row_3_cell_1`
- `auth_error.cam_encryption.table_row_3_cell_2`
- `auth_error.cam_encryption.title`
- `auth_full_screen.body`
- `auth_full_screen.button_primary`
- `auth_full_screen.title`
- `auth_permission_denied.body_cam`
- `auth_permission_denied.button_primary_cam`
- `auth_permission.body_cam`
- `auth_permission.button_primary_cam`
- `auth_permission.title_cam`
- `auth_progress.loader`
- `auth_retry.body_blur`
- `auth_retry.body_neutral_expression`
- `auth_retry.body_too_bright`
- `auth_retry.button_primary`
- `auth_retry.subtitle`
- `auth_retry.title`
- `auth_upload_pass.body`

### Changed strings

The **English**, **Spanish**, **German**, and **French** copy for the following string(s) has changed:

## `6.6.0` -> `6.8.0`

### Added strings

The **English** copy for the following string(s) has been added:

`user_consent_load_fail.button_primary`
`user_consent_load_fail.detail`
`user_consent_load_fail.prompt.title`

**Note**: The consent screen copy is only available in **English**

## `6.5.0` -> `6.6.0`

### Added strings

The **English** copy for the following string(s) has been added:

`user_consent.button_primary`
`user_consent.button_secondary`
`user_consent.prompt.button_primary`
`user_consent.prompt.button_secondary`
`user_consent.prompt.no_consent_detail`
`user_consent.prompt.no_consent_title`

**Note**: The consent screen copy is only available in **English**

## `6.4.0` -> `6.5.0`

From version 6.5.0, TypeScript is officially supported. If you previously installed
[the DefinitelyTyped package](https://www.npmjs.com/package/@types/onfido-sdk-ui),
you can safely remove it because the distributed NPM package already contains
an `index.d.ts` declaration file.

## `6.1.0` -> `6.2.0`

### Changed strings

The **English**, **Spanish**, **German**, and **French** copy for the following string(s) has changed:

- `upload_guide.image_detail_blur_label`
- `upload_guide.image_detail_glare_label`
- `upload_guide.image_detail_good_label`

## `6.0.1` -> `6.1.0`

### Introduce `migrate_locales` script

From version `6.1.0`, Web SDK will use a new locale key naming convention that better supports scalability.
As a result, many key names will be changed and this might affect the integrator's custom locale options.
The `migrate_locales` script will help integrators migrate from the older key name convention
to the new one with minimal hassle.

To use the script:

- Upgrade `onfido-sdk-ui` package to latest version `6.1.0`
- Create a JSON file containing custom locales which was fed to `Onfido.init()` method. For instance:

  ```javascript
  // your-custom-language.json
  {
    "locale": "en_US",  // untouched keys
    "phrases": {        // required key
      "capture": {
        "driving_licence": {
          "front": {
            "instructions": "Driving license on web"
          }
        }
      },
      "complete.message": "Complete message on web"
    },
    "mobilePhrases": {  // optional key
      "capture.driving_licence.front.instructions": "Driving licence on mobile",
      "complete": {
        "message": "Complete message on mobile"
      }
    }
  }
  ```

- Consume the script directly from `node_modules/.bin`:

  ```shell
  $ migrate_locales --help                # to see the script's usage

  $ migrate_locales --list-versions       # to list all supported versions

  Supported versions:
    * from v0.0.1 to v1.0.0

  $ migrate_locales \
    --from-version v0.0.1 \
    --to-version v1.0.0 \
    --in-file your-custom-language.json \
    --out-file your-custom-language-migrated.json
  ```

- The migrated data should look like this:

  ```javascript
  // your-custom-language-migrated.json
  {
    "locale": "en_US",
    "phrases": {
      "new_screen": { // renamed key in nested object
        "driving_licence": {
          "front": {
            "instructions": "Driving license on web"
          }
        }
      },
      "screen_1.complete.message": "Complete message on web", // 2 generated keys from 1 old key
      "screen_2.complete.message": "Complete message on web"
      "mobilePhrases": { // force nesting because standalone `mobilePhrases` will be deprecated soon
        "new_screen.driving_licence.front.instructions": "Driving licence on mobile", // renamed key in dot notation
        "screen_1": { // 2 generated keys from 1 old key
          "complete": {
            "message": "Complete message on mobile"
          }
        },
        "screen_2": {
          "complete": {
            "message": "Complete message on mobile"
          }
        }
      }
    },
  }
  ```

- Notes: the script will preserve:

  - Order of the keys
  - Format: if your old keys are nested as an object, the migrated keys will be nested too. Otherwise,
    if your old keys are string with dot notation, the migrated keys will be string too.

## `5.10.0` -> `6.0.0`

### Change in UX flow for Document step

- Document step now has a Issuing Country Selection screen after the Document Type Selection screen. This screen is never displayed for **passport** documents and is disabled by default when only 1 document is preselected using the `documentTypes` option. This screen can still be included in the document capture flow of non-passport preselected documents by enabling the `showCountrySelection` option in the Document step configuration.

### Example of Document step with Country Selection for a preselected non-passport document

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": false,
          "driving_licence": false,
          "national_identity_card": true
        },
        "showCountrySelection": true
      }
    },
    "complete"
  ]
}
```

### Example of Document step without Country Selection for a preselected non-passport document (default behaviour)

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": false,
          "driving_licence": false,
          "national_identity_card": true
        },
        "showCountrySelection": false
      }
    },
    "complete"
  ]
}
```

### Example of Document step configurations with preselected documents where Country Selection will still be displayed

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": true,
          "driving_licence": true,
          "national_identity_card": true
        }
      }
    },
    "complete"
  ]
}
```

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "passport": true,
          "national_identity_card": true,
          "driving_licence": false
        }
      }
    },
    "complete"
  ]
}
```

### Added strings

- `country_selection.error`
- `country_selection.dropdown_error`
- `country_selection.placeholder`
- `country_selection.search`
- `country_selection.submit`
- `country_selection.title`
- `capture.residence_permit.front.title`
- `capture.residence_permit.back.title`
- `confirm.residence_permit.message`
- `document_selector.identity.residence_permit_hint`
- `residence_permit`

### Changed strings

The **English**, **Spanish**, **German**, and **French** copy for the following string(s) has changed:

- `document_selector.identity.title`
- `document_selector.identity.hint`

### Changed keys

The following keys have been renamed:

- `errors.server_error.instruction` => `errors.request_error.instruction`
- `errors.server_error.message` => `errors.request_error.message`

### Removed strings

- `SMS_BODY`

## `5.7.0` -> `5.10.0`

### Added strings

- `image_quality_guide.title`
- `image_quality_guide.sub_title`
- `image_quality_guide.all_good`
- `image_quality_guide.not_cut_off`
- `image_quality_guide.no_glare`
- `image_quality_guide.no_blur`
- `image_quality_guide.image_alt_text`
- `image_quality_guide.next_step`
- `mobilePhrases.image_quality_guide.title`
- `mobilePhrases.image_quality_guide.next_step`

### Changed strings

The **English** copy for the following string(s) has changed:

- `errors.invalid_capture`

## `5.6.0` -> `5.7.0`

With release 5.7.0 there are breaking changes that will affect integrators with customised languages or UI copy.

### Added strings

- `capture.face.intro.title`
- `capture.face.intro.subtitle`
- `capture.face.intro.selfie_instruction`
- `capture.face.intro.glasses_instruction`
- `capture.face.intro.accessibility.selfie_capture_tips`

- `continue`

- `cross_device.intro.title`
- `cross_device.intro.sub_title`
- `cross_device.intro.description_li_1`
- `cross_device.intro.description_li_2`
- `cross_device.intro.description_li_3`
- `cross_device.intro.action`

- `cross_device.link.sms_sub_title`
- `cross_device.link.copy_link_sub_title`
- `cross_device.link.qr_code_sub_title`
- `cross_device.link.options_divider_label`
- `cross_device.link.sms_option`
- `cross_device.link.copy_link_option`
- `cross_device.link.qr_code_option`

- `cross_device.link.qr_code.help_label`
- `cross_device.link.qr_code.help_step_1`
- `cross_device.link.qr_code.help_step_2`

- `cross_device.link.copy_link.action`
- `cross_device.link.copy_link.success`

### Removed strings

- `cross_device.intro.document.title`
- `cross_device.intro.document.take_photos`
- `cross_device.intro.document.action`

- `cross_device.intro.face.title`
- `cross_device.intro.face.take_photos`
- `cross_device.intro.face.action`

- `cross_device.link.sub_title`
- `cross_device.link.link_copy.action`
- `cross_device.link.link_copy.success`

### Changed strings

The **English** and **Spanish** copy for the following string(s) has changed:

- `cross_device.link.copy_link_label`
- `cross_device.link.sms_label`

## `5.0.0` -> `5.6.0`

With release 5.6.0 there is a breaking change that will affect integrators with customised languages or UI copy.

**Note:** The string custom translation version scheme has changed, going forward if the strings translations change it will result in a MINOR version change, therefore you are responsible for testing your translated layout in case you are using custom translations or copy.

### Added strings

- `capture.switch_device`

### Removed strings

- `cross_device.switch_device.submessage`

### Changed strings

The **English** and **Spanish** copy for the following string(s) has changed:

- `capture.upload_file`
- `errors.invalid_size.message`
- `errors.invalid_size.instruction`

The **English** copy for the following string(s) has changed:

- `capture.driving_licence.front.title`
- `capture.driving_licence.back.title`
- `capture.national_identity_card.front.title`
- `capture.national_identity_card.back.title`
- `capture.passport.front.title`
- `capture.bank_building_society_statement.front.title`
- `capture.utility_bill.front.title`
- `capture.benefit_letters.front.title`
- `capture.council_tax.front.title`
- `errors.invalid_type.message`
- `errors.invalid_type.instruction`

## `4.0.0` -> `5.0.0`

We have changed the behaviour of the document step. If the document step is initialised with only one document type, the document selector screen will not be displayed. If your application relies on the document selector screen, even if you are picking only one document, you will have to implement that UI yourself.

## `3.1.0` -> `4.0.0`

### Import breaking changes

We have changed how the SDK is exported, in order to reduce redundant transpiled code and to better trim dead code too. This led to a size reduction overall.

However, this has potentially created a breaking change for those consuming the SDK with an ES style of import. Classic window style import and commonjs require should work the same.

#### Example of old behaviour

```js
import Onfido from 'onfido-sdk-ui'

Onfido.init(...)
```

#### Example of new behaviour

```js
import {init} from 'onfido-sdk-ui'
init(...)
```

or

```js
import * as Onfido from 'onfido-sdk-ui'
Onfido.init(...)
```

### Style Breaking change

- We have internally changed the CSS units used in the SDK to be relative (`em`) units.

Therefore, if you previously set the font-size of `.onfido-sdk-ui-Modal-inner`, it is recommended that you remove this `font-size` override.

This is because we are looking to make the SDK compatible with `em`, but first we need to remove media queries which are not really compatible with that unit.

#### Example of old behaviour

```css
.onfido-sdk-ui-Modal-inner {
  font-size: 20px;
}
```

#### Example of new behaviour

```css
.a-more-specific-selector {
  font-size: 20px;
}
```

## `2.8.0` -> `3.0.0`

### Breaking changes

- Removed support for `buttonId`. From this version you will need to create a function that launches the SDK when a trigger element (ie a button) is clicked.

### Example of old behaviour

```html
<script>
  Onfido.init({
    useModal: true,
    buttonId: 'onfido-btn',
    token: 'YOUR_JWT_TOKEN',
    onComplete: function (data) {
      // callback for when everything is complete
      console.log('everything is complete')
    },
  })
</script>

<body>
  <button id="onfido-btn">Verify identity</button>
  <div id="onfido-mount"></div>
</body>
```

### Example of new behaviour

```html
<script>
  var onfido = {}

  function triggerOnfido() {
    onfido = Onfido.init({
      useModal: true,
      isModalOpen: true,
      onModalRequestClose: function () {
        // Update options with the state of the modal
        onfido.setOptions({ isModalOpen: false })
      },
      token: 'YOUR_JWT_TOKEN',
      onComplete: function (data) {
        // callback for when everything is complete
        console.log('everything is complete')
      },
    })
  }
</script>

<body>
  <!-- Use a button to trigger the Onfido SDK  -->
  <button onClick="triggerOnfido()">Verify identity</button>
  <div id="onfido-mount"></div>
</body>
```

## `1.1.0` -> `2.0.0`

### Breaking changes

- Removed `onDocumentCapture` that used to be fired when the document had been successfully captured, confirmed by the user and uploaded to the Onfido API
- Removed `onFaceCapture` callbacks that used to be fired when the face has beed successfully captured, confirmed by the user and uploaded to the Onfido API.
- Removed `getCaptures` function that used to return the document and face files captured during the flow.
- Changed the behaviour of `onComplete` callback. It used to return an object that contained all captures, now it doesn't return any data.

### Example of old behaviour

```js
Onfido.init({
  token: 'YOUR_JWT_TOKEN',
  containerId: 'onfido-mount',
  onDocumentCapture: function (data) {
    /*callback for when the*/ console.log(
      'document has been captured successfully',
      data
    )
  },
  onFaceCapture: function (data) {
    /*callback for when the*/ console.log('face capture was successful', data)
  },
  onComplete: function (capturesHash) {
    console.log('everything is complete')
    // data returned by the onComplete callback including the document and face files captured during the flow
    console.log(capturesHash)
    // function that used to return the document and face files captured during the flow.
    console.log(Onfido.getCaptures())
  },
})
```

### Example of new behaviour

```js
Onfido.init({
  // the JWT token that you generated earlier on
  token: 'YOUR_JWT_TOKEN',
  // id of the element you want to mount the component on
  containerId: 'onfido-mount',
  onComplete: function () {
    console.log('everything is complete')
    // You can now trigger your backend to start a new check
  },
})
```
