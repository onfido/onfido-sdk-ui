export const uploadDesktop = (i18n) => ({
  driving_licence: {
    front: {
      title: i18n.t('upload_desktop.driving_licence.front.title'),
      instructions: i18n.t('upload_desktop.driving_licence.front.instructions'),
      webcam: i18n.t('upload_desktop.driving_licence.front.webcam'),
    },
    back: {
      title: i18n.t('upload_desktop.driving_licence.back.title'),
      instructions: i18n.t('upload_desktop.driving_licence.back.instructions'),
      webcam: i18n.t('upload_desktop.driving_licence.back.webcam')
    },
  },
  national_identity_card: {
    front: {
      title: i18n.t('upload_desktop.national_identity_card.front.title'),
      instructions: i18n.t('upload_desktop.national_identity_card.front.instructions'),
      webcam: i18n.t('upload_desktop.national_identity_card.front.webcam'),
    },
    back: {
      title: i18n.t('upload_desktop.national_identity_card.back.title'),
      instructions: i18n.t('upload_desktop.national_identity_card.back.instructions'),
      webcam: i18n.t('upload_desktop.national_identity_card.back.webcam')
    },
  },
  passport: {
    front: {
      title: i18n.t('upload_desktop.passport.front.title'),
      instructions: i18n.t('upload_desktop.passport.front.instructions'),
      webcam: i18n.t('upload_desktop.passport.front.webcam'),
    },
  },
  document: {
    help: i18n.t('upload_desktop.doc.help'),
  },
  face: {
    title: i18n.t('upload_desktop.face.title'),
    uploadTitle: i18n.t('upload_desktop.face.upload_title'),
    instructions: i18n.t('upload_desktop.face.instructions'),
    webcam: i18n.t('upload_desktop.face.webcam'),
    help: i18n.t('upload_desktop.face.help'),
    button: i18n.t('upload_desktop.face.button'),
  },
  common: {
    parentheses: i18n.t('upload_desktop.common.parentheses'),
  },
})


export const uploadMobile = (i18n) => ({
  driving_licence: {
    front: {
      title: i18n.t('upload_mobile.driving_licence.front.title'),
      instructions: i18n.t('upload_mobile.driving_licence.front.instructions'),
    },
    back: {
      title: i18n.t('upload_mobile.driving_licence.back.title'),
      instructions: i18n.t('upload_mobile.driving_licence.back.instructions'),
    },
  },
  national_identity_card: {
    front: {
      title: i18n.t('upload_mobile.national_identity_card.front.title'),
      instructions: i18n.t('upload_mobile.national_identity_card.front.instructions'),
    },
    back: {
      title: i18n.t('upload_mobile.national_identity_card.back.title'),
      instructions: i18n.t('upload_mobile.national_identity_card.back.instructions'),
    },
  },
  passport: {
    front: {
      title: i18n.t('upload_mobile.passport.front.title'),
      instructions: i18n.t('upload_mobile.passport.front.instructions'),
    },
  },
  face: {
    title: i18n.t('upload_mobile.face.title'),
    instructions: i18n.t('upload_mobile.face.instructions'),
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
    title: i18n.t('confirm.doc.title'),
  },
  face: {
    title: i18n.t('confirm.face.title'),
    message: i18n.t('confirm.face.message'),
  },
  confirm: i18n.t('confirm.confirm'),
  continue: i18n.t('confirm.continue'),
  redo: i18n.t('confirm.redo'),
})
