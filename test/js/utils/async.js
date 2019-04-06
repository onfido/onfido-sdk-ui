const async = require('async');

const promisify = function(original) {
	return function (...args) {
		return new Promise((resolve, reject) => {
			args.push((err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});

			original.apply(this, args);
		});
	};
}

export const eachP = promisify(async.each)

// ES5 native `Array.prototype.forEach` is not async; since tests are executed asynchronously we're going to need an
// async version of `forEach`
export const asyncForEach = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i, arr);
    }
};
