import { createSelector } from 'reselect'

export const capture = state => state.capture

// TODO remove the socket from the store. The store should just contain data,
// not working objects.
export const socket = state => state.globals.socket
