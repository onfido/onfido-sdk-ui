import { h, Component } from 'preact';
import classNames from 'classnames';
import {uniqueId} from 'lodash';
import getUserMedia from 'getusermedia';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Home from './home';
import Camera from './camera';

import { unboundActions, store } from '../../../javascript-sdk-core/src';

class App extends Component {
	state = {
		cameraActive: false,
		isOpen: false
	}

	toggleCamera () {
		const active = !this.state.cameraActive;
		this.setState({ cameraActive: active });
	}

	render() {
		console.log(this.props)
		const { cameraActive } = this.state;
		const activeClass = classNames({
			'onfido-verify': true,
			'onfido-active': cameraActive
		});
		return (
			<div id="app" className={activeClass}>
				<Home {...this.state} toggleCamera={::this.toggleCamera}/>
				<Camera {...this.state} toggleCamera={::this.toggleCamera}/>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return {
		documentCaptures: state.documentCaptures,
		faceCaptures: state.faceCaptures,
		...state.globals
	};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
