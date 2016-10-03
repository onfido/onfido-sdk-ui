import VanillaModal from 'vanilla-modal'
import { events } from 'onfido-sdk-core'
import style from './style.css'

const Modal = {}

const template = `
  <div class='${style.inner}'>
    <div class='${style.content}'></div>
  </div>
`

const generateModal = ({useModal}) => {
  const modal = document.createElement('div')
  modal.className = useModal ? style.modal : style.inline
  modal.innerHTML = template
  return modal;
}

Modal.create = (options) => {
  const modal = generateModal(options)

  const containerEl = document.getElementById(options.containerId)

  if (options.useModal) {
    options.mount = containerEl
    options.mount.parentNode.insertBefore(modal, options.mount.nextSibling)
  }
  else {
    options.mountRoot = containerEl
    options.mount = modal.getElementsByClassName(style.content)[0]
    options.mountRoot.appendChild(modal)
  }

  events.emit('modalMounted', options)
}

const vanillaOptions = {
  loadClass: style.vanillaModal,
  class: style.modalVisible,
  modal: '.'+style.modal,
  modalInner: '.'+style.inner,
  modalContent: '.'+style.content,
  onOpen: () => events.emit('onOpen'),
  onClose: () => events.emit('onClose'),
  onBeforeOpen: () => events.emit('onBeforeOpen'),
  onBeforeClose: () => events.emit('onBeforeClose')
}
console.log(vanillaOptions)

events.on('modalMounted', (options) => {
  if (options.useModal) {
    const modal = new VanillaModal(vanillaOptions)
    const button = document.getElementById(options.buttonId)
    const id = "#"+options.containerId
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
