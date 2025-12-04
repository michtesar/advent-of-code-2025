const banks: string[] = (
	await Deno.readTextFile("./day-03/part2.txt")
		.catch((err) => {
			console.error("Error reading file:", err);
			return "";
		})
		.then((data) => data?.split("\n") ?? [])
)
	.map((s) => s.trim())
	.filter((s) => s.length > 0);

function findMaxJoltage(bank: string, selectCount: number): number {
	const digits = bank.split("").map((d) => parseInt(d, 10));

	if (digits.length < selectCount) {
		return 0;
	}

	const result: number[] = [];
	for (let i = 0; i < digits.length; i++) {
		while (
			result.length > 0 &&
			digits[i] > result[result.length - 1] &&
			digits.length - i + (result.length - 1) >= selectCount
		) {
			result.pop();
		}

		// Add current digit if we haven't reached the limit
		if (result.length < selectCount) {
			result.push(digits[i]);
		}
	}

	// Convert result array to number
	return parseInt(result.join(""), 10);
}

let totalJoltage = 0;
for (const bank of banks) {
	const maxJoltage = findMaxJoltage(bank, 12);
	totalJoltage += maxJoltage;
}

console.log(`Total output joltage: ${totalJoltage}`);
