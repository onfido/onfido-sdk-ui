import VanillaModal from 'vanilla-modal'
import { events } from 'onfido-sdk-core'

const Modal = {}

Modal.template = `
  <div class='onfido-modal-inner'>
    <div class='onfido-modal-content'></div>
  </div>
`

Modal.create = (options) => {
  const modal = document.createElement('div')
  modal.className = options.useModal ? 'onfido-modal' : 'onfido-inline-modal'
  modal.innerHTML = Modal.template

  if (options.useModal) {
    options.mount.parentNode.insertBefore(modal, options.mount.nextSibling)
  }
  else {
    options.mountRoot = options.mount
    options.mount = modal.getElementsByClassName('onfido-modal-content')[0]
    options.mountRoot.appendChild(modal)
  }

  events.emit('modalMounted', options)
}

Modal.options = {
  modal: '.onfido-modal',
  modalInner: '.onfido-modal-inner',
  modalContent: '.onfido-modal-content',
  onOpen: () => events.emit('onOpen'),
  onClose: () => events.emit('onClose'),
  onBeforeOpen: () => events.emit('onBeforeOpen'),
  onBeforeClose: () => events.emit('onBeforeClose')
}

events.on('modalMounted', (options) => {
  if(options.useModal) {
    const modal = new VanillaModal(Modal.options)
    const button = document.getElementById(options.buttonId)
    const id = `#${options.mount.getAttribute('id')}`
    button.addEventListener('click', () => modal.open(id))
    events.on('onOpen', () => options.mount.style.display = 'block')
    events.on('onClose', () => options.mount.style.display = 'none')
    events.on('closeModal', () => modal.close())
    events.once('ready', () => button.disabled = false)
  }
  else {
    events.emit('onBeforeOpen')
    events.emit('onOpen')
    options.mountRoot.style.display = 'block'
  }
})

export default Modal
