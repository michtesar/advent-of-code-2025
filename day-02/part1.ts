const codes = await Deno.readTextFile("./day-02/part1.txt")
	.catch((err) => {
		console.error("Error reading file:", err);
		return "";
	})
	.then((data) => data?.split(",") ?? []);

function isRepeatedTwice(s: string): boolean {
	if (s.length % 2 !== 0) return false;
	if (s.startsWith("0")) return false;
	const half = s.length / 2;
	return s.slice(0, half) === s.slice(half);
}

let result = 0n;
for (const code of codes) {
	const parts = code.split("-");
	if (parts.length !== 2) {
		console.error(`Invalid code format: ${code}`);
		Deno.exit(1);
	}
	const start = BigInt(parts[0]);
	const end = BigInt(parts[1]);
	if (start > end) {
		console.error(`Invalid range: ${code}`);
		Deno.exit(1);
	}

	for (let n = start; n <= end; n++) {
		const s = n.toString();
		if (isRepeatedTwice(s)) {
			// Add the whole number (as BigInt)
			result += n;
		}
	}
}

console.log(`Final code: ${result.toString()}`);
