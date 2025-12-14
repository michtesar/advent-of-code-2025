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

/**
 * Check if a tile is valid (red or green).
 * Red tiles are explicitly stored, green tiles are on edges or inside polygon.
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param redTiles - Set of red tile coordinates
 * @param greenTiles - Set of green tile coordinates (on edges)
 * @param polygon - Polygon vertices
 * @returns True if tile is red or green
 */
function isValidTile(
	x: number,
	y: number,
	redTiles: Set<string>,
	greenTiles: Set<string>,
	polygon: number[][],
): boolean {
	const key = `${x},${y}`;
	if (redTiles.has(key)) return true;
	if (greenTiles.has(key)) return true;
	return isPointInPolygon(x, y, polygon);
}

// Precompute all rectangle pairs sorted by area (largest first)
// This allows us to find the maximum faster and skip smaller rectangles
type RectanglePair = {
	i: number;
	j: number;
	area: number;
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
};

const pairs: RectanglePair[] = [];
for (let i = 0; i < input.length; i++) {
	for (let j = i + 1; j < input.length; j++) {
		const [x1, y1] = input[i];
		const [x2, y2] = input[j];
		const rectMinX = Math.min(x1, x2);
		const rectMaxX = Math.max(x1, x2);
		const rectMinY = Math.min(y1, y2);
		const rectMaxY = Math.max(y1, y2);
		const area = (rectMaxX - rectMinX + 1) * (rectMaxY - rectMinY + 1);

		pairs.push({
			i,
			j,
			area,
			minX: rectMinX,
			maxX: rectMaxX,
			minY: rectMinY,
			maxY: rectMaxY,
		});
	}
}

/**
 * Check if a line segment intersects an axis-aligned bounding box (AABB).
 * Uses Liang-Barsky algorithm for efficient line-AABB intersection.
 *
 * @param x1 - Start x of line segment
 * @param y1 - Start y of line segment
 * @param x2 - End x of line segment
 * @param y2 - End y of line segment
 * @param rectMinX - Minimum x of rectangle
 * @param rectMaxX - Maximum x of rectangle
 * @param rectMinY - Minimum y of rectangle
 * @param rectMaxY - Maximum y of rectangle
 * @returns True if the line segment intersects the rectangle
 */
function lineIntersectsAABB(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	rectMinX: number,
	rectMaxX: number,
	rectMinY: number,
	rectMaxY: number,
): boolean {
	const dx = x2 - x1;
	const dy = y2 - y1;
	let t0 = 0;
	let t1 = 1;

	// Check each edge of the rectangle
	const edges = [
		{ p: -dx, q: x1 - rectMinX }, // Left
		{ p: dx, q: rectMaxX - x1 }, // Right
		{ p: -dy, q: y1 - rectMinY }, // Bottom
		{ p: dy, q: rectMaxY - y1 }, // Top
	];

	for (const edge of edges) {
		if (Math.abs(edge.p) < 1e-10) {
			// Line is parallel to this edge
			if (edge.q < 0) return false; // Line is outside
		} else {
			const t = edge.q / edge.p;
			if (edge.p < 0) {
				if (t > t1) return false;
				if (t > t0) t0 = t;
			} else {
				if (t < t0) return false;
				if (t < t1) t1 = t;
			}
		}
	}

	return t0 <= t1;
}

// Sort by area descending
pairs.sort((a, b) => b.area - a.area);

// Find the largest valid rectangle
let maxArea = 0;
for (const pair of pairs) {
	// Early exit: if this area is smaller than current max, we're done
	// (since pairs are sorted descending)
	if (pair.area <= maxArea) break;

	// Check if all tiles in rectangle are valid (red or green)
	// Optimize: check corners first - if all corners inside, rectangle is inside
	const corners = [
		[pair.minX, pair.minY],
		[pair.maxX, pair.minY],
		[pair.minX, pair.maxY],
		[pair.maxX, pair.maxY],
	];

	let allCornersInside = true;
	for (const [x, y] of corners) {
		if (!isPointInPolygon(x, y, input)) {
			allCornersInside = false;
			break;
		}
	}

	let isValid = true;
	if (allCornersInside) {
		// All corners inside = rectangle completely inside polygon
		// Check if rectangle intersects any edge (would make it invalid)
		let intersectsEdge = false;
		for (let i = 0; i < input.length && !intersectsEdge; i++) {
			const [x1, y1] = input[i];
			const [x2, y2] = input[(i + 1) % input.length];

			if (
				lineIntersectsAABB(
					x1,
					y1,
					x2,
					y2,
					pair.minX,
					pair.maxX,
					pair.minY,
					pair.maxY,
				)
			) {
				intersectsEdge = true;
			}
		}
		if (intersectsEdge) {
			isValid = false;
		}
		// If no edge intersection and all corners inside, all tiles are valid
	} else {
		// Some corners outside - check tiles individually
		for (let y = pair.minY; y <= pair.maxY && isValid; y++) {
			for (let x = pair.minX; x <= pair.maxX; x++) {
				if (!isValidTile(x, y, redTiles, greenTiles, input)) {
					isValid = false;
					break;
				}
			}
		}
	}

	if (isValid && pair.area > maxArea) {
		maxArea = pair.area;
	}
}

console.log(maxArea);
