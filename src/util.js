import { bindActionCreators } from 'redux';
import { unboundActions } from '../../javascript-sdk-core/src';

export function bindActions(unboundActions) {
	return dispatch => ({
		...bindActionCreators(unboundActions, dispatch)
	});
}
