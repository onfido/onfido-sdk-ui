export function filterImage (image) {
	switch (typeof image) {
		case 'string':
			return image.split(',')[1];
		case 'object':
			return image;
		default:
			return;
	}
}
