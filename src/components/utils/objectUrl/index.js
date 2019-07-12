/*
Babel runtime is too conservative when it comes to URL and its methods.
It actually imports the whole URL object regardless of how you use it,
which is a pretty big module!
This is true even if you just want to use some methods of URL.

In addition, some of the methods of URL are actually supported by old browsers,
such as IE 11. However, since it's an all or nothing deal,
even if you use supported methods, babel runtime will still import the whole module.

The reason for this is probably because core-js only has one big module for URL.

In the end, in order to avoid the runtime to import the whole corejs URL module
unecessarly for the ObjectURL methods, which are supported by IE11,
this module was created. Which as different babelrc that does not have the runtime.
This way the URL module does not get imported and the bundle does not get bloated.
*/
export const createObjectURL = URL.createObjectURL
export const revokeObjectURL = URL.revokeObjectURL
