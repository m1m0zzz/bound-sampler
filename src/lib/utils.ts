export function toBase64(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
	});
}

// default min: 0, max: 1
export function clamp(value: number, min?: number, max?: number) {
	return Math.max(min || 0, Math.min(value, max || 1));
}
