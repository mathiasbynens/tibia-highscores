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
			throw new Error(`TibiaData returned invalid JSON for ${url}`);
		}
		console.log('Error in API response. Retrying…');
		return fetchJson(url, validateFn, retryCount + 1);
	}

	if (!response.ok && response.status < 500) {
		const message = data.information?.status?.message;
		throw new Error(
			`TibiaData request failed with HTTP ${response.status}${message ? `: ${message}` : ''}`,
		);
	}

	if (
		!response.ok ||
		data.information?.status?.error ||
		(validateFn && !validateFn(data))
	) {
		if (retryCount > MAX_RETRY_COUNT) {
			const message = data.information?.status?.message;
			throw new Error(
				`TibiaData request failed after retries${message ? `: ${message}` : ''}`,
			);
		}
		console.log('Error in API response. Retrying…');
		return fetchJson(url, validateFn, retryCount + 1);
	}

	return data;
};
