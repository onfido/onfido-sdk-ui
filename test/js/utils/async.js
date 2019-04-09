const async = require('async');

const promisify = fn => async (collection, asyncIteratee) =>
	new Promise((resolve, reject) => {
		fn(collection, async (...args) => {
			const done = args.pop()
			try {
				const result = await asyncIteratee(...args)
				done(null, result)
			}
			catch (e){
				done(e)
			}
		}, (error, result) => {
			if (error) reject(error)
			else resolve(result)
		})
	})

export const eachP = promisify(async.each)

// ES5 native `Array.prototype.forEach` is not async; since tests are executed asynchronously we're going to need an
// async version of `forEach`
export const asyncForEach = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i, arr);
    }
};
