import type {
  CaptureFlows,
  CaptureSteps,
  InstructionLocale,
} from '~types/docVideo'
import type { DocumentTypes, PoaTypes } from '~types/steps'

type CaptureSideLocale = {
  title: string
  body: string
}

type CaptureLocale = {
  front: CaptureSideLocale
  back?: CaptureSideLocale
}

type TitleLocale = {
  title: string
  subtitle: string
}

export const CONFIRM_PREVIEWS_LOCALES_MAPPING: Record<
  DocumentTypes | PoaTypes,
  string
> = {
  passport: 'doc_confirmation.body_passport',
  driving_licence: 'doc_confirmation.body_license',
  national_identity_card: 'doc_confirmation.body_id',
  residence_permit: 'doc_confirmation.body_permit',
  bank_building_society_statement: 'doc_confirmation.body_bank_statement',
  utility_bill: 'doc_confirmation.body_bill',
  council_tax: 'doc_confirmation.body_tax_letter',
  benefit_letters: 'doc_confirmation.body_benefits_letter',
  government_letter: 'doc_confirmation.body_government_letter',
}

export const CROSS_DEVICE_INTRO_LOCALES_MAPPING = {
  sms: 'cross_device_intro.list_item_send_phone',
  'take-photos': 'cross_device_intro.list_item_open_link',
  'return-to-computer': 'cross_device_intro.list_item_finish',
}

export const DOCUMENT_CAPTURE_LOCALES_MAPPING: Record<
  DocumentTypes,
  CaptureLocale
> = {
  passport: {
    front: {
      title: 'doc_submit.title_passport',
      body: 'photo_upload.body_passport',
    },
  },
  driving_licence: {
    front: {
      title: 'doc_submit.title_license_front',
      body: 'photo_upload.body_license_front',
    },
    back: {
      title: 'doc_submit.title_license_back',
      body: 'photo_upload.body_license_back',
    },
  },
  national_identity_card: {
    front: {
      title: 'doc_submit.title_id_front',
      body: 'photo_upload.body_id_front',
    },
    back: {
      title: 'doc_submit.title_id_back',
      body: 'photo_upload.body_id_back',
    },
  },
  residence_permit: {
    front: {
      title: 'doc_submit.title_permit_front',
      body: 'photo_upload.body_permit_front',
    },
    back: {
      title: 'doc_submit.title_permit_back',
      body: 'photo_upload.body_permit_back',
    },
  },
}

export const POA_CAPTURE_LOCALES_MAPPING: Record<
  PoaTypes,
  CaptureSideLocale
> = {
  bank_building_society_statement: {
    title: 'doc_submit.title_bank_statement',
    body: 'photo_upload.body_bank_statement',
  },
  utility_bill: {
    title: 'doc_submit.title_bill',
    body: 'photo_upload.body_bill',
  },
  council_tax: {
    title: 'doc_submit.title_tax_letter',
    body: 'photo_upload.body_tax_letter',
  },
  benefit_letters: {
    title: 'doc_submit.title_benefits_letter',
    body: 'photo_upload.body_benefits_letter',
  },
  government_letter: {
    title: 'doc_submit.title_government_letter',
    body: 'photo_upload.body_government_letter',
  },
}

type ImageQualityResults = 'cutoff' | 'blur' | 'glare' | 'good'

type ImageQualityGuideLocale = {
  label: string
}

export const IMAGE_QUALITY_GUIDE_LOCALES_MAPPING: Record<
  ImageQualityResults,
  ImageQualityGuideLocale
> = {
  cutoff: {
    label: 'upload_guide.image_detail_cutoff_label',
  },
  blur: {
    label: 'upload_guide.image_detail_blur_label',
  },
  glare: {
    label: 'upload_guide.image_detail_glare_label',
  },
  good: {
    label: 'upload_guide.image_detail_good_label',
  },
}

export const POA_INTRO_LOCALES_MAPPING: Record<string, string> = {
  shows_address: 'poa_intro.list_shows_address',
  matches_signup: 'poa_intro.list_matches_signup',
  most_recent: 'poa_intro.list_most_recent',
}

export const POA_GUIDANCE_LOCALES_MAPPING: Record<PoaTypes, TitleLocale> = {
  bank_building_society_statement: {
    title: 'doc_submit.title_bank_statement',
    subtitle: 'poa_guidance.subtitle_bank_statement',
  },
  utility_bill: {
    title: 'doc_submit.title_bill',
    subtitle: 'poa_guidance.subtitle_bill',
  },
  council_tax: {
    title: 'doc_submit.title_tax_letter',
    subtitle: 'poa_guidance.subtitle_tax_letter',
  },
  benefit_letters: {
    title: 'doc_submit.title_benefits_letter',
    subtitle: 'poa_guidance.subtitle_benefits_letter',
  },
  government_letter: {
    title: 'doc_submit.title_government_letter',
    subtitle: 'poa_guidance.subtitle_government_letter',
  },
}

export const POA_REQUIREMENTS_LOCALES_MAPPING: Record<string, string> = {
  address: 'poa_guidance.instructions.address',
  full_name: 'poa_guidance.instructions.full_name',
  issue_date: 'poa_guidance.instructions.issue_date',
  logo: 'poa_guidance.instructions.logo',
}

export type VideoIntroTypes = 'actions' | 'speak'

type VideoIntroLocale = {
  className: string
  localeKey: string
}

export const VIDEO_INTRO_LOCALES_MAPPING: Record<
  VideoIntroTypes,
  VideoIntroLocale
> = {
  actions: {
    className: 'twoActionsIcon',
    localeKey: 'video_intro.list_item_actions',
  },
  speak: {
    className: 'speakOutLoudIcon',
    localeKey: 'video_intro.list_item_speak',
  },
}

export const DOC_VIDEO_INSTRUCTIONS_MAPPING: Record<
  CaptureFlows,
  Record<CaptureSteps, InstructionLocale>
> = {
  passport: {
    intro: {
      title: 'doc_video_capture.header_passport',
      button: 'video_capture.button_primary_start',
    },
    front: {
      title: 'doc_video_capture.header_step1',
      button: 'doc_video_capture.button_primary_fallback',
    },
    back: {
      title: '',
      button: '',
    },
  },
  cardId: {
    intro: {
      title: 'doc_video_capture.header',
      button: 'video_capture.button_primary_start',
    },
    front: {
      title: 'doc_video_capture.header_step1',
      button: 'doc_video_capture.button_primary_fallback',
    },
    back: {
      title: 'doc_video_capture.header_step2',
      subtitle: 'doc_video_capture.detail_step2',
      button: 'doc_video_capture.button_primary_fallback_end',
    },
  },
  paperId: {
    intro: {
      title: 'doc_capture.header_folded_doc_front',
      subtitle: 'doc_capture.detail.folded_doc_front',
      button: 'video_capture.button_primary_start',
    },
    front: {
      title: 'doc_video_capture.header_step1',
      button: 'doc_video_capture.button_primary_fallback',
    },
    back: {
      title: 'doc_video_capture.header_paper_doc_step2',
      subtitle: 'doc_video_capture.detail_step2',
      button: 'doc_video_capture.button_primary_fallback_end',
    },
  },
}
