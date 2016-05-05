import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Home {
	renderState (method, route) {
		if (method.complete) {
			return (<span class='btn btn-complete'>Complete</span>);
		} else {
			return (
				<Link href={route} className='onfido-method-selector'>
					{method.title}
				</Link>
			);
		}
	}

	renderMethod = (method, index) => {
		const classes = `onfido-method onfido-method-${method.type}`;
		const route = `verify/${method.route}`;
		return (
			<div className={classes}>
				<h1>{index + 1}</h1>
				<p>{method.hint}</p>
				{this.renderState(method, route)}
			</div>
		);
	}

	render () {
		const { hasDocumentCaptured, hasFaceCaptured } = this.props;
		const methods = [{
			route: 'document',
			type: 'documentCapture',
			hint: 'First, we need to capture a document via your camera or file upload.',
			title: 'Document capture',
			complete: hasDocumentCaptured
		},{
			route: 'face',
			type: 'faceCapture',
			hint: 'Next, we need you to take a photo of your face to match with the document.',
			title: 'Face capture',
			complete: hasFaceCaptured
		}];
		return (
			<div className='onfido-methods'>
				<a rel='modal:close' className='onfido-close'>×&nbsp;Close</a>
				{methods.map(this.renderMethod)}
			</div>
		);
	}
}
