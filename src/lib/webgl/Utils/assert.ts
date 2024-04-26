export const assert = <T>(input: T | null, errorMsg?: string): T => {
	if (!input) {
		throw new Error(errorMsg ?? 'Assertion failed');
	}
	return input;
};
