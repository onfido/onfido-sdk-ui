import { h, Component } from 'preact';
import getUserMedia from 'getusermedia';
import { connect, events } from '../../../../javascript-sdk-core/src'

export default class Camera extends Component {

	componentWillReceiveProps (nextProps) {
		const { cameraActive } = nextProps
		if (!cameraActive) {
			this.capture.stop()
		}
	}

	getBase64 = () => {
		this.ctx = this.canvas.getContext('2d')
		this.canvas.width = this.video.clientWidth
		this.canvas.height = this.video.clientHeight
		this.ctx.drawImage(this.video, 0, 0)
		const image = this.canvas.toDataURL('image/webp')
		const base64 = image.split(',')[1]
		const payload = {
			id: 1,
			messageType: 'face',
			image
		}
		console.log(payload)
		this.socket.sendMessage(base64)
	}

	capture = {
		start: () => this.interval = setInterval(() => this.getBase64(), 1000),
		stop: () => clearInterval(this.interval)
	}

	state = {
		something: false
	}

	componentWillMount () {
		this.socket = connect('something');
	}

	// gets called when this route is navigated to
	componentDidMount() {
		const { cameraActive, toggleCamera } = this.props;
		getUserMedia((err, stream) => {
			if (err) {
				console.log('failed');
			} else {
				const video = this.video
				const canvas = document.createElement('canvas');
				video.src = window.URL.createObjectURL(stream);
				video.onloadedmetadata = (e) => video.play();
				this.video = video;
				this.canvas = canvas;
			}
		});
		events.once('documentCapture', () => {
			toggleCamera();
		});
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		this.capture.stop()
	}

	// Note: `user` comes from the URL, courtesy of our router
	render() {
		const { toggleCamera } = this.props;
		return (
			<div id='onfido-camera' className='onfido-camera'>
				<button
					id='onfido-back'
					className='onfido-back'
					onClick={toggleCamera}
				>
					<span className='sans-serif'>&larr;</span> Back
				</button>
				<button id='onfido-capture' className='onfido-capture btn' onClick={this.capture.start}>Take photo</button>
				<video
					id='onfido-video'
					className='onfido-video'
					autoplay='autoplay'
					controls='true'
					muted
					controls='false'
					ref={(video) => { this.video = video }}
				/>
			</div>
		);
	}
}
