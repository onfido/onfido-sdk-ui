// Jest runs in js-dom, therefore missing setImmediate (node & IE only)
import { setImmediate } from 'timers'
global.setImmediate = setImmediate
