import { VanillaModal } from 'vanilla-modal'
import { events } from 'onfido-sdk-core'

const Modal = {}

Modal.template = `
  <div class='onfido-modal-inner'>
    <div class='onfido-modal-content'></div>
  </div>
`

Modal.create = (options) => {
  const modal = document.createElement('div')
  modal.className = 'onfido-modal'
  modal.innerHTML = Modal.template
  options.mount.parentNode.insertBefore(modal, options.mount.nextSibling)
  events.emit('modalMounted', options)
}

Modal.options = {
  modal: '.onfido-modal',
  modalInner: '.onfido-modal-inner',
  modalContent: '.onfido-modal-content',
  onOpen: () => {
    events.emit('onOpen')
  },
  onClose: () => {
    events.emit('onClose')
  },
  onBeforeOpen: () => {
    events.emit('onBeforeOpen')
  },
  onBeforeClose: () => {
    events.emit('onBeforeClose')
  }
}

events.on('modalMounted', (options) => {
  const modal = new VanillaModal(Modal.options)
  const button = document.getElementById(options.buttonId)
  button.disabled = false
  const id = `#${options.mount.getAttribute('id')}`
  button.addEventListener('click', () => modal.open(id))
  events.on('onOpen', () => options.mount.style.display = 'block')
  events.on('onClose', () => options.mount.style.display = 'none')
  events.on('closeModal', () => modal.close())
})

export default Modal
