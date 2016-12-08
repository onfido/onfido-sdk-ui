//the purpose of this module is to hold general functional programming functions
//why not just refer to a module directly?
//the reason for the indirection is that these functions are very standard
//but different modules have different compromises, some are more performant,
//but more bloated. Therefore a module was created to make it easier to swap
//the underlying module more easily.
import mapValues from 'object-loops/map'
import mapKeys from 'object-loops/map-keys'
import every from 'object-loops/every'

export { mapValues, every, mapKeys }
