import { h, Component } from 'preact';
import { Router } from 'preact-router';
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
		cameraActive: false
	}

	toggleCamera () {
		console.log(this);
		const active = !this.state.cameraActive;
		this.setState({ cameraActive: active });
	}

	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		const { cameraActive } = this.state;
		const activeClass = classNames({
			'onfido-verify': true
		});
		return (
			<div id="app" className={activeClass}>
				<Router onChange={this.handleRoute}>
					<Home
						path='/'
						toggleCamera={::this.toggleCamera}
						{...this.state}
						{...this.props}
					/>
					<Camera
						path='/verify/:method'
						toggleCamera={::this.toggleCamera}
						{...this.state}
						{...this.props}
					/>
				</Router>
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
