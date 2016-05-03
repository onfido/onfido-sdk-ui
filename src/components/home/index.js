import { h, Component } from 'preact';
import classNames from 'classnames';

const methods = [{
	type: 'documentCapture',
	hint: 'First, we need to capture a document via your camera or file upload.',
	captureType: 'Document capture'
},{
	type: 'faceCapture',
	hint: 'Next, we need you to take a photo of your face to match with the document.',
	captureType: 'Face capture'
}];

export default class Home {
	renderMethod = (method, index) => {
		const classes = `onfido-method onfido-method-${method.type}`;
		const { complete } = this.props;
		return (
			<div className={classes}>
				<h1>{index + 1}</h1>
				{complete && <span className='onfido-verified'>Complete</span>}
				<p>{method.hint}</p>
				<button
					className='onfido-method-selector'
					onClick={this.props.toggleCamera}
					disabled={complete}
				>
					{method.captureType}
				</button>
			</div>
		);
	}
	render () {
		return (
			<div className='onfido-methods'>
				{methods.map(this.renderMethod)}
			</div>
		);
	}
}
