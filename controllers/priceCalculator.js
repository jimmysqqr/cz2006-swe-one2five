// Method to calculate the average price of a list of flats
const avgCalc = (flatList) => {
	let sum = 0;
	for (let flat of flatList) {
		sum += parseInt(flat.monthly_rent);
	}
	return sum / flatList.length;
};

// Method to calculate the 10th and 90th percentile price of a list of flats
const percentileCalc = (flatList) => {
	const asc = (arr) => arr.sort((a, b) => a - b); // sort array ascending
	const priceList = asc(flatList.map((flat) => parseInt(flat.monthly_rent)));

	const pctl = (sorted, p) => {
		const pos = (sorted.length - 1) * p;
		const base = Math.floor(pos);
		const rest = pos - base;
		if (sorted[base + 1] !== undefined) {
			return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
		} else {
			return sorted[base];
		}
	};

	return [pctl(priceList, 0.1), pctl(priceList, 0.9)];
};

// Method to predict the future price of a specific flat based on rented-out flats that are similar to the Target Flat
const predictPrice = (flatList) => {
	// find y when x = 13 (2022-01)

	const estimate_coef = (x_arr, y_arr) => {
		// number of points
		const n = x_arr.length;

		// mean of x and y
		const sum_x = x_arr.reduce((a, b) => a + b);
		const sum_y = y_arr.reduce((a, b) => a + b);
		const m_x = sum_x / n;
		const m_y = sum_y / n;

		// cross-deviation and deviation about x
		const SS_xy =
			x_arr
				.map((x, i) => {
					return x * y_arr[i];
				})
				.reduce((a, b) => a + b) -
			n * m_y * m_x;
		const SS_xx =
			x_arr.map((x) => x * x).reduce((a, b) => a + b) - n * m_x * m_x;

		// regression coefficients
		const b_1 = SS_xy / SS_xx;
		const b_0 = m_y - b_1 * m_x;

		return [b_0, b_1];
	};
	const y = flatList.map((flat) => parseInt(flat.monthly_rent));
	const x = flatList.map((flat) => {
		const date = JSON.stringify(flat.rental_approval_date);
		return parseInt(date.substring(5, 7));
	});
	const b = estimate_coef(x, y);
	const y_pred = b[0] + b[1] * 13; // x = 13 meaning 2022-01-01

	return y_pred;
};

module.exports = {
	avgCalc,
	percentileCalc,
	predictPrice
};