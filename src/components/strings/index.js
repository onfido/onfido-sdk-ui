export const uploadDesktop = (i18n) => ({
  driving_licence: {
    front: {
      title: i18n.t('uploadDesktop.driving_licence.front.title'),
      instructions: i18n.t('uploadDesktop.driving_licence.front.instructions'),
      webcam: i18n.t('uploadDesktop.driving_licence.front.webcam'),
    },
    back: {
      title: i18n.t('uploadDesktop.driving_licence.back.title'),
      instructions: i18n.t('uploadDesktop.driving_licence.back.instructions'),
      webcam: i18n.t('uploadDesktop.driving_licence.back.webcam')
    },
  },
  national_identity_card: {
    front: {
      title: i18n.t('uploadDesktop.national_identity_card.front.title'),
      instructions: i18n.t('uploadDesktop.national_identity_card.front.instructions'),
      webcam: i18n.t('uploadDesktop.national_identity_card.front.webcam'),
    },
    back: {
      title: i18n.t('uploadDesktop.national_identity_card.back.title'),
      instructions: i18n.t('uploadDesktop.national_identity_card.back.instructions'),
      webcam: i18n.t('uploadDesktop.national_identity_card.back.webcam')
    },
  },
  passport: {
    front: {
      title: i18n.t('uploadDesktop.passport.front.title'),
      instructions: i18n.t('uploadDesktop.passport.front.instructions'),
      webcam: i18n.t('uploadDesktop.passport.front.webcam'),
    },
  },
  document: {
    help: i18n.t('uploadDesktop.document.help'),
  },
  face: {
    title: i18n.t('uploadDesktop.face.title'),
    uploadTitle: i18n.t('uploadDesktop.face.uploadTitle'),
    instructions: i18n.t('uploadDesktop.face.instructions'),
    webcam: i18n.t('uploadDesktop.face.webcam'),
    help: i18n.t('uploadDesktop.face.help'),
    button: i18n.t('uploadDesktop.face.button'),
  },
  common: {
    parentheses: i18n.t('uploadDesktop.common.parentheses'),
  },
})


export const uploadMobile = (i18n) => ({
  driving_licence: {
    front: {
      title: i18n.t('uploadMobile.driving_licence.front.title'),
      instructions: i18n.t('uploadMobile.driving_licence.front.instructions'),
    },
    back: {
      title: i18n.t('uploadMobile.driving_licence.back.title'),
      instructions: i18n.t('uploadMobile.driving_licence.back.instructions'),
    },
  },
  national_identity_card: {
    front: {
      title: i18n.t('uploadMobile.national_identity_card.front.title'),
      instructions: i18n.t('uploadMobile.national_identity_card.front.instructions'),
    },
    back: {
      title: i18n.t('uploadMobile.national_identity_card.back.title'),
      instructions: i18n.t('uploadMobile.national_identity_card.back.instructions'),
    },
  },
  passport: {
    front: {
      title: i18n.t('uploadMobile.passport.front.title'),
      instructions: i18n.t('uploadMobile.passport.front.instructions'),
    },
  },
  face: {
    title: i18n.t('uploadMobile.face.title'),
    instructions: i18n.t('uploadMobile.face.instructions'),
  },
})

export const confirm = (i18n) => ({
  driving_licence: {
    message: i18n.t('confirm.driving_licence.message'),
  },
  national_identity_card: {
    message: i18n.t('confirm.national_identity_card.message'),
  },
  passport: {
    message: i18n.t('confirm.passport.message'),
  },
  document: {
    title: i18n.t('confirm.document.title'),
  },
  face: {
    title: i18n.t('confirm.face.title'),
    message: i18n.t('confirm.face.message'),
  },
  confirm: i18n.t('confirm.confirm'),
  continue: i18n.t('confirm.continue'),
  redo: i18n.t('confirm.redo'),
})
