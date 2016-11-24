//the purpose of this module is to hold general functional programming functions
//why not just refer to a module directly?
//the reason for the indirection is that these functions are very standard
//but different modules have different compromises, some are more performant,
//but more bloated. Therefore a module was created to make it easier to swap
//the underlying module more easily.

import { mapValues, every, mapKeys } from 'lodash'
export { mapValues, every, mapKeys }
