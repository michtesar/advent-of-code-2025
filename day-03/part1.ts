const banks: string[] = (
	await Deno.readTextFile("./day-03/part1.txt")
		.catch((err) => {
			console.error("Error reading file:", err);
			return "";
		})
		.then((data) => data?.split("\n") ?? [])
)
	.map((s) => s.trim())
	.filter((s) => s.length > 0);

function findMaxJoltage(bank: string): number {
	const digits = bank.split("").map((d) => parseInt(d, 10));

	if (digits.length < 2) {
		return 0;
	}

	// Build suffix maximum array: maxSuffix[i] = max digit from position i onwards
	const maxSuffix: number[] = new Array(digits.length);
	maxSuffix[digits.length - 1] = digits[digits.length - 1];

	for (let i = digits.length - 2; i >= 0; i--) {
		maxSuffix[i] = Math.max(digits[i], maxSuffix[i + 1]);
	}

	// For each position i as first digit, find best second digit
	let maxJoltage = 0;
	for (let i = 0; i < digits.length - 1; i++) {
		// Find maximum digit from positions i+1 onwards
		const maxSecondDigit = maxSuffix[i + 1];
		const joltage = digits[i] * 10 + maxSecondDigit;
		maxJoltage = Math.max(maxJoltage, joltage);
	}

	return maxJoltage;
}

let totalJoltage = 0;
for (const bank of banks) {
	const maxJoltage = findMaxJoltage(bank);
	totalJoltage += maxJoltage;
}

console.log(`Total output joltage: ${totalJoltage}`);
