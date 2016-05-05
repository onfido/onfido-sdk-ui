import { h, Component } from 'preact';
import { Link, route } from 'preact-router';
import getUserMedia from 'getusermedia';
import Dropzone from 'react-dropzone';
import CountUp from 'countup.js';
import { connect, events } from '../../../../javascript-sdk-core/src';
import { filterImage } from '../utils';

const Countdown = () => (<span className='onfido-countdown'></span>)

export default class Camera extends Component {

	componentWillReceiveProps (nextProps) {
		const { method } = this.props;
		const { hasDocumentCaptured, hasFaceCaptured } = nextProps;
		const validDocumentCapture = (hasDocumentCaptured && method === 'document');
		const validFaceCapture = (hasFaceCaptured && method === 'face');
		if (validDocumentCapture || validFaceCapture) {
			route('/', true);
		};
	}

	captureImage = () => {
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.video.clientWidth;
		this.canvas.height = this.video.clientHeight;
		this.ctx.drawImage(this.video, 0, 0);
		const image = this.canvas.toDataURL('image/webp');
		this.handleImage(image);
	}

	handleFiles (files) {
		const { method } = this.props;
		const { faceCapture, documentCapture } = this.props.actions;
		switch (method) {
			case 'document':
				return files.map((file) => documentCapture(file));
			case 'face':
				return files.map((file) => faceCapture(file));
			default:
				return false;
		}
	}

	handleImage (image) {
		const { method, actions, socket } = this.props;
		const payload = {
			id: 1,
			messageType: method,
			image: filterImage(image)
		}
		console.log(payload);
		switch (method) {
			case 'document':
				return (() => {
					socket.sendMessage(payload.image);
					actions.documentCapture(payload);
				})();
			case 'face':
				return (() => {
					actions.faceCapture(payload);
					setTimeout(() => actions.setFaceCaptured(true), 1000);
				})();
			default:
				return false;
		}
	}

	capture = {
		once: () => {
			const options = {
			  useEasing : false,
			  useGrouping : false
			};
			const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options);
			countdown.start(() => {
				this.video.pause();
				this.captureImage();
			});
		},
		start: () => {
			this.interval = setInterval(() => this.captureImage(), 1000);
		},
		stop: () => {
			clearInterval(this.interval);
		}
	}

	createStream (stream) {
		const { hasDocumentCaptured, method } = this.props;
		const video = this.video;
		const canvas = document.createElement('canvas');
		video.src = window.URL.createObjectURL(stream);
		video.onloadedmetadata = (e) => video.play();
		this.video = video;
		this.canvas = canvas;
		if (method === 'document' && !hasDocumentCaptured) {
			this.capture.start();
		};
	}

	componentDidMount () {
		getUserMedia((err, stream) => {
			if (err) {
				// TODO handle the manual photo method when getUserMedia unsupported
				console.log('failed');
			} else {
				this.createStream(stream);
				this.bindEvents();
			}
		});
	}

	bindEvents () {
		events.on('modalOpen', () => this.capture.start());
		events.on('modalClose', () => this.capture.stop());
	}

	componentWillUnmount() {
		console.log('componentWillUnmount');
		this.capture.stop();
	}

	renderCaptureButton () {
		return (
			<button id='onfido-capture' className='btn' onClick={this.capture.once}>
				Take photo
			</button>
		);
	}

	renderPreviews () {
		const { documentCaptures, faceCaptures, method } = this.props;
		switch (method) {
			case 'document':
				return documentCaptures.map((file) => <img src={file.preview} />)
			case 'face':
				return faceCaptures.map((file) => <img src={file.preview} />)
			default:
				return false;
		}
	}

	renderUploader () {
		return (
			<div className='onfido-upload'>
				{this.renderPreviews()}
				<Dropzone onDrop={::this.handleFiles}>
					<div>Try dropping some files here, or click to select files to upload.</div>
				</Dropzone>
			</div>
		)
	}

	renderVideo () {
		return (
			<video
				id='onfido-video'
				className='onfido-video'
				autoplay='autoplay'
				controls='true'
				muted
				controls='false'
				ref={(video) => { this.video = video }}
			/>
		);
	}

	renderNav () {
		return (
			<div>
				<Link href='/' id='onfido-back' className='onfido-back'>
					<span className='sans-serif'>&larr;</span>&nbsp;Back
				</Link>
				<a rel='modal:close' className='onfido-close white'>×&nbsp;Close</a>
			</div>
		)
	}

	render() {
		const { method, supportsGetUserMedia } = this.props;
		const showFaceCapture = (!supportsGetUserMedia && method === 'face');
		return (
			<div id='onfido-camera' className='onfido-camera'>
				{this.renderNav()}
				{showFaceCapture && this.renderCaptureButton()}
				{showFaceCapture && <Countdown ref={(c) => { this.countdown = c }}/>}
				{!supportsGetUserMedia && this.renderVideo() || this.renderUploader()}
			</div>
		)
	}

}
