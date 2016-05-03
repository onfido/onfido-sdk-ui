import { h, Component } from 'preact';
import {Modal} from 'vanilla-modal';

export default class Modal extends Component {

	componentDidMount () {
		console.log(this);
		const modalOptions = {
			modal: '.onfido-modal',
		  modalInner: '.onfido-modal-inner',
		  modalContent: '.onfido-modal-content',
			onBeforeClose: () => {
				// capture.stop()
			},
			onBeforeOpen: () => {
				// capture.init()
			}
		};
		const modal = new VanillaModal(modalOptions);
	}

	render () {
		return (
			<div className='onfido-modal' ref={(modal) => { this.modal = modal }}>
				<div className='onfido-modal-inner'>
					<a rel='modal:close'>× Close</a>
					<div className='onfido-modal-content'></div>
				</div>
			</div>
		);
	}

}
