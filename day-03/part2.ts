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

/**
 * Finds the maximum joltage by selecting exactly 12 batteries from a bank.
 * Uses a greedy approach: keep the largest digits possible while maintaining order.
 */
function findMaxJoltage(bank: string, selectCount: number): number {
	const digits = bank.split("").map((d) => parseInt(d, 10));

	if (digits.length < selectCount) {
		return 0;
	}

	// We need to remove (length - selectCount) digits
	// To maximize the number, we want to remove smaller digits, especially from the left
	const toRemove = digits.length - selectCount;
	const result: number[] = [];

	for (let i = 0; i < digits.length; i++) {
		// While we can still remove digits and current digit is larger than last kept digit
		// We can remove if: remaining digits (including current) + (result.length - 1) >= selectCount
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
