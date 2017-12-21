export const es = {
  welcome: {
    title: 'Abra su nueva cuenta bancaria',
    description_p_1: 'Para abrir una cuenta bancaria, necesitaremos verificar su identidad.',
    description_p_2: 'Sólo tomará un par de minutos.',
    next_button: 'Verificar identidad',
  },
  document_selector: {
    title: 'Verifique su identidad',
    hint: 'Seleccione el tipo de documento que desea subir',
  },
  capture: {
    driving_licence: {
      front: {
        title: 'Frente de la licencia',
        instructions: 'Suba el frente de la licencia desde su computadora',
        webcam: 'Coloque el frente de la licencia en el cuadro (será detectado automáticamente)',
      },
      back: {
        title: 'Reverso de la licencia',
        instructions: 'Suba el reverso de la licencia desde su computadora',
        webcam: 'Coloque el reverso de la licencia en el cuadro (será detectado automáticamente)',
      },
    },
    national_identity_card: {
      front: {
        title: 'Frente de la tarjeta',
        instructions: 'Suba el frente de la tarjeta desde su computadora',
        webcam: 'Coloque el frente de la tarjeta en el cuadro (será detectado automáticamente)',
      },
      back: {
        title: 'Reverso de la tarjeta',
        instructions: 'Suba el reverso de la tarjeta desde su computadora',
        webcam: 'Coloque el reverso de la tarjeta en el cuadro (será detectado automáticamente)',
      },
    },
    passport: {
      front: {
        title: 'Página con la foto del pasaporte',
        instructions: 'Suba la página con la foto del pasaporte desde su computadora',
        webcam: 'Coloque la página con la foto de su pasaporte en el cuadro (será detectado automáticamente)',
      },
    },
    document: {
      help: '¿Tiene algún problema? Suba un archivo en su lugar',
    },
    face: {
      title: 'Tómese una selfie',
      upload_title: 'Selfie',
      instructions: 'Suba una selfie desde su computadora',
      webcam: 'Coloque su cara en el óvalo',
      help: 'De modo alternativo, puede también subir un archivo',
      button: 'Tomar selfie',
    }
  },
  confirm: {
    document: {
      title: 'Compruebe la legibilidad',
    },
    driving_licence: {
      message: 'Asegúrese de que los datos de su licencia se puedan leer claramente, sin borrosidades ni brillo',
    },
    national_identity_card: {
      message: 'Asegúrese de que los datos de su tarjeta se puedan leer claramente, sin borrosidades ni brillo',
    },
    passport: {
      message: 'Asegúrese de que los datos de su pasaporte se puedan leer claramente, sin borrosidades ni brillo',
    },
    face: {
      title: 'Verificar selfie',
      message: 'Asegúrese de que la selfie muestre claramente su cara',
    },
    confirm: 'Confirmar',
    continue: 'Continuar',
    redo: 'Inténtelo nuevamente',
  },
  capture_parentheses: '(o arrastre aquí su archivo)',
  complete: {
    message: 'Verificación completa',
    submessage: 'Gracias.'
  },
  cross_device: {
    client_success: {
      title: 'Actualizaciones satisfactorias',
      sub_title: 'Ahora puede regresar a su computadora para continuar',
    },
    link: {
      title: 'Continúe la verificación en su dispositivo móvil',
      sub_title: 'Le mandaremos un mensaje de texto único con un enlace seguro a su móvil',
      link_copy: {action: 'Copiar', success: 'Copiado'},
      button_copy: {action:  'Enviar enlace', status: 'Enviando'},
      sms_label: 'Número de teléfono móvil',
      copy_link_label: 'Copiar enlace en su lugar:',
    },
    submit: {
      title: 'Genial, eso es todo lo que necesitamos',
      sub_title: 'Ahora estamos listos para verificar su identidad',
      selfie_uploaded: 'Selfie cargado',
      action: 'Enviar verificación',
      multiple_docs_uploaded:'Documentos cargados',
      one_doc_uploaded: 'Documento cargado',
    },
    phone_number_placeholder: 'Ingrese el número de celular',
    loading: 'Cargando...',
    mobile_connected: {
      title: {
        message: 'Conectado a su móvil',
        submessage: 'Una vez que haya terminado, le llevaremos al próximo paso',
      },
      tips: {
        item_1: 'Mantenga esta ventana abierta mientras usa su dispositivo móvil',
        item_2: 'Su enlace móvil caducará en una hora',
        item_3: 'No actualizar esta página',
      }
    },
    mobile_notification_sent: {
      title: 'Controle su dispositivo móvil',
      submessage: 'Hemos enviado un enlace seguro a %{number}',
      bold_message: 'Puede tardar unos minutos en llegar',
      tips: {
        item_1: 'Mantenga esta ventana abierta mientras usa su dispositivo móvil',
        item_2: 'Su enlace móvil caducará en una hora',
      },
      resend_link: 'Reenviar enlace',
    },
    switch_device: {
      header: '¿Necesita usar su móvil para tomar fotos?',
      submessage: 'Continúe la verificación de forma segura en su dispositivo móvil',
    },
    tips: 'Tips',
  },
  errors: {
    invalid_capture: {message:'No se detectó ningún documento', instruction: 'Asegúrese de que todo el documento esté en la foto'},
    invalid_type: {message: 'Archivo no cargado', instruction: 'Intenta usar otro tipo de archivo'},
    unsupported_file: {message: 'Tipo de archivo no soportado', instruction: 'Intente usar un archivo .jpg o .png'},
    invalid_size: {message: 'Tamaño de archivo demasiado grande', instruction: 'El tamaño debe ser menor de 10 MB'},
    no_face: {message: 'Rostro no encontrado', instruction: 'Su cara debe de estar en la selfie'},
    multiple_faces: {message: 'Múltiples caras encontradas', instruction: 'Solo su cara puede estar en la selfie'},
    server_error: {message: 'Conexión perdida', instruction: 'Inténtalo de nuevo'},
    glare_detected: {message: 'Detectado brillo', instruction: 'Todos los detalles deben ser claros y legibles'},
    sms_failed: {message: 'Algo salió mal', instruction: "Copie el enlace a continuación en su dispositivo móvil"},
    sms_overuse: {message: 'Demasiados intentos de reenvío', instruction: "Copie el enlace a continuación en su dispositivo móvil"},
    lazy_loading: {message: 'Se produjo un error al cargar el componente'},
    invalid_number: {message: 'Comprueba que su número de móvil sea correcto'},
    generic_client_error: {message: 'Algo salió mal', instruction: 'Deberá reiniciar tu verificación en su computadora'},
  },
  passport: 'Pasaporte',
  driving_licence: 'Licencia de conducir',
  national_identity_card: 'Tarjeta de identificación',
  short_passport: 'Pasaporte',
  short_driving_licence: 'licencia',
  short_national_identity_card: 'tarjeta',
  back: 'atrás',
  cancel: 'Cancelar',
}
