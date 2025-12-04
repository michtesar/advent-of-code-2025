const DEFAULT_START_POSITION = 50;

const rotations: string[] = (
	await Deno.readTextFile("./day-01/part1.txt")
		.catch((err) => {
			console.error("Error reading file:", err);
			return "";
		})
		.then((data) => data?.split("\n") ?? [])
)
	.map((s) => s.trim())
	.filter((s) => s.length > 0);

let position = DEFAULT_START_POSITION;
let code = 0;
for (const rotation of rotations) {
	const direction = rotation.charAt(0);
	if (direction !== "R" && direction !== "L") {
		throw new Error(`Invalid rotation direction: ${direction}`);
	}
	const distance = parseInt(rotation.slice(1), 10);
	if (Number.isNaN(distance)) {
		throw new Error(`Invalid distance in rotation: ${rotation}`);
	}
	const move = distance * (direction === "R" ? 1 : -1);

	// Update position
	position += move;

	// Wrap around using modulo arithmetic (handles both positive and negative overflow)
	position = ((position % 100) + 100) % 100;

	// Check whether we landed on position 0
	if (position === 0) {
		code += 1;
	}

	console.log(`New position: ${position}`);
}

console.log(`Final position: ${position}`);
console.log(`Code: ${code}`);
