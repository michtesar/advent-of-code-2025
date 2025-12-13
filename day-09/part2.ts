const input = await Deno.readTextFile("./day-09/part2.txt")
	.then((data) => data.split("\n").filter((line) => line.length > 0))
	.then((lines) => lines.map((line) => line.split(",").map(Number)));

// Create a set of red tiles
const redTiles = new Set<string>();
for (const [x, y] of input) {
	redTiles.add(`${x},${y}`);
}

// Find all green tiles (on paths between consecutive red tiles)
const greenTiles = new Set<string>();

// Add tiles on straight lines between consecutive red tiles
for (let i = 0; i < input.length; i++) {
	const [x1, y1] = input[i];
	const [x2, y2] = input[(i + 1) % input.length];

	// Fill in the straight line between these two points
	if (x1 === x2) {
		// Vertical line
		const startY = Math.min(y1, y2);
		const endY = Math.max(y1, y2);
		for (let y = startY; y <= endY; y++) {
			if (!redTiles.has(`${x1},${y}`)) {
				greenTiles.add(`${x1},${y}`);
			}
		}
	} else if (y1 === y2) {
		// Horizontal line
		const startX = Math.min(x1, x2);
		const endX = Math.max(x1, x2);
		for (let x = startX; x <= endX; x++) {
			if (!redTiles.has(`${x},${y1}`)) {
				greenTiles.add(`${x},${y1}`);
			}
		}
	}
}

// Find all tiles inside the loop using ray casting (point-in-polygon)
function isPointInPolygon(x: number, y: number, polygon: number[][]): boolean {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i];
		const [xj, yj] = polygon[j];

		// Ray casting algorithm: check if ray from point crosses edge
		const intersect =
			yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
}

// Find bounds of the grid
const maxX = Math.max(...input.map(([x]) => x));
const maxY = Math.max(...input.map(([, y]) => y));
const minX = Math.min(...input.map(([x]) => x));
const minY = Math.min(...input.map(([, y]) => y));

// Find all tiles inside the loop
for (let x = minX; x <= maxX; x++) {
	for (let y = minY; y <= maxY; y++) {
		const key = `${x},${y}`;
		if (!redTiles.has(key) && !greenTiles.has(key)) {
			if (isPointInPolygon(x, y, input)) {
				greenTiles.add(key);
			}
		}
	}
}

// Create a set of all valid tiles (red or green)
const validTiles = new Set<string>();
for (const key of redTiles) validTiles.add(key);
for (const key of greenTiles) validTiles.add(key);

// Find the largest rectangle with red corners that only contains red/green tiles
let maxArea = 0;

for (let i = 0; i < input.length; i++) {
	for (let j = i + 1; j < input.length; j++) {
		const [x1, y1] = input[i];
		const [x2, y2] = input[j];

		// Ensure x1 <= x2 and y1 <= y2 for easier rectangle calculation
		const minX = Math.min(x1, x2);
		const maxX = Math.max(x1, x2);
		const minY = Math.min(y1, y2);
		const maxY = Math.max(y1, y2);

		// Check if all tiles in the rectangle are valid (red or green)
		let isValid = true;
		for (let x = minX; x <= maxX; x++) {
			for (let y = minY; y <= maxY; y++) {
				if (!validTiles.has(`${x},${y}`)) {
					isValid = false;
					break;
				}
			}
			if (!isValid) break;
		}

		if (isValid) {
			const area = (maxX - minX + 1) * (maxY - minY + 1);
			if (area > maxArea) {
				maxArea = area;
			}
		}
	}
}

console.log(maxArea);
