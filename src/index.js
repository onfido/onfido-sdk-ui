// import 'lie';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import { Provider } from 'react-redux';
import { store } from '../../javascript-sdk-core/src'

let root;
function init() {
	let App = require('./components/app').default;
	root = render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.getElementById('onfido-mount'), root);
}

init();

if (module.hot) {
	module.hot.accept('./components/app', () => requestAnimationFrame( () => {
		flushLogs();
		init();
	}) );

	// optional: mute HMR/WDS logs
	let log = console.log,
		logs = [];
	console.log = (t, ...args) => {
		if (typeof t==='string' && t.match(/^\[(HMR|WDS)\]/)) {
			if (t.match(/(up to date|err)/i)) logs.push(t.replace(/^.*?\]\s*/m,''), ...args);
		}
		else {
			log.call(console, t, ...args);
		}
	};
	let flushLogs = () => console.log(`%c🚀 ${logs.splice(0,logs.length).join(' ')}`, 'color:#888;');
}
