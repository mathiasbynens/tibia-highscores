import fetch from 'node-fetch-retry';

const MAX_RETRY_COUNT = 5;

export const fetchJson = async (url, validateFn, retryCount = 0) => {
	const response = await fetch(url, {
		retry: 3,
		pause: 1_000,
	});

	let data = null;
	try {
		data = await response.json();
	} catch {
		if (retryCount > MAX_RETRY_COUNT) {
			console.log('Too many retries. Giving up…');
			process.exit(1);
		}
		console.log('Error in API response. Retrying…');
		return fetchJson(url, validateFn, retryCount + 1);
	}

	if (data.information?.status?.error || (validateFn && !validateFn(data))) {
		if (retryCount > MAX_RETRY_COUNT) {
			console.log('Too many retries. Giving up…');
			process.exit(1);
		}
		console.log('Error in API response. Retrying…');
		return fetchJson(url, validateFn, retryCount + 1);
	}

	return data;
};
