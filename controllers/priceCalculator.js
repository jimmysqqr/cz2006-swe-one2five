// Method to calculate the average price of a list of flats
const avgCalc = (flatList) => {
	let sum = 0;
	for (let flat of flatList) {
		sum += flat.monthly_rent;
	}
	return sum / flatList.length;
};

// Method to calculate the 10th and 90th percentile price of a list of flats
const percentileCalc = (flatList) => {
	const asc = (arr) => arr.sort((a, b) => a - b); // sort array ascending
	const priceList = asc(flatList.map((flat) => flat.monthly_rent));

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
const predictPrice = (flatList) => {};

/*
rentedOutFlatList = [
    { // NS
        monthly_rent:3000,
        lat:1.3471940782229364,
        lng:103.68077682078855
    },
    { // Pioneer mall
        monthly_rent:5000,
        lat:1.3418851208330858, 
        lng:103.69738694571976
    }
];

console.log(avgCalc(rentedOutFlatList));
console.log(percentileCalc(rentedOutFlatList));

*/
