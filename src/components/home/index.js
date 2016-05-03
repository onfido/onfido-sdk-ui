import { h, Component } from 'preact';
import { Link } from 'preact-router';
import classNames from 'classnames';

const methods = [{
	route: 'document',
	type: 'documentCapture',
	hint: 'First, we need to capture a document via your camera or file upload.',
	captureType: 'Document capture'
},{
	route: 'face',
	type: 'faceCapture',
	hint: 'Next, we need you to take a photo of your face to match with the document.',
	captureType: 'Face capture'
}];

export default class Home {
	renderMethod = (method, index) => {
		const classes = `onfido-method onfido-method-${method.type}`;
		const { complete } = this.props;
		const route = `verify/${method.route}`;
		return (
			<div className={classes}>
				<h1>{index + 1}</h1>
				{complete && <span className='onfido-verified'>Complete</span>}
				<p>{method.hint}</p>
				<Link
					href={route}
					className='onfido-method-selector'
					onClick={this.props.toggleCamera.bind(method.captureType)}
					disabled={complete}
				>
					{method.captureType}
				</Link>
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
