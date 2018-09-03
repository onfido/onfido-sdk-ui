import { createSelector } from 'reselect'

// TODO remove the socket from the store. The store should just contain data,
// not working objects.
export const socket = state => state.globals.socket
