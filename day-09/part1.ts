type Point = { x: number; y: number };

/**
 * Parse the input file to get all red tile coordinates.
 *
 * @param data - The raw input file content.
 * @returns An array of points representing red tile coordinates.
 */
function parseInput(data: string): Point[] {
	return data
		.trim()
		.split("\n")
		.filter((line) => line.trim().length > 0)
		.map((line) => {
			const [x, y] = line.split(",").map(Number);
			return { x, y };
		});
}

/**
 * Calculate the area of a rectangle formed by two opposite corner points.
 * The points must be diagonally opposite (different x and y coordinates).
 * The area is calculated inclusively, counting all tiles including the corners.
 *
 * @param p1 - The first corner point.
 * @param p2 - The second corner point.
 * @returns The area of the rectangle, or 0 if the points cannot form opposite corners.
 */
function calculateArea(p1: Point, p2: Point): number {
	// For two points to be opposite corners, they must have different x and y coordinates
	if (p1.x === p2.x || p1.y === p2.y) {
		return 0;
	}

	const width = Math.abs(p2.x - p1.x);
	const height = Math.abs(p2.y - p1.y);
	// Add 1 to both dimensions to count inclusively (including the corner tiles)
	return (width + 1) * (height + 1);
}

const redTiles = await Deno.readTextFile("./day-09/part1.txt")
	.catch((err) => {
		console.error("Error reading file:", err);
		return "";
	})
	.then(parseInput);

console.log(`Found ${redTiles.length} red tiles`);

let maxArea = 0;

// Check all pairs of red tiles to find the largest rectangle
for (let i = 0; i < redTiles.length; i++) {
	for (let j = i + 1; j < redTiles.length; j++) {
		const area = calculateArea(redTiles[i], redTiles[j]);
		if (area > maxArea) {
			maxArea = area;
		}
	}
}

console.log(`Largest rectangle area: ${maxArea}`);
