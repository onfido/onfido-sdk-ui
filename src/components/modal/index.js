import { VanillaModal } from 'vanilla-modal';
import { events } from '../../../../javascript-sdk-core/src';

const options = {
	modal: '.onfido-modal',
  modalInner: '.onfido-modal-inner',
  modalContent: '.onfido-modal-content',
	onBeforeClose: () => {
		events.emit('modalClose')
	},
	onBeforeOpen: () => {
		events.emit('modalOpen')
	}
};

const modal = new VanillaModal(options);

events.once('ready', () => {

	const button = document.getElementById('onfido-button');
	button.disabled = false;
	button.addEventListener('click', () => {
		modal.open('#onfido-mount')
	});

});
