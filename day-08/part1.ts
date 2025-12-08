const HEAP_SIZE = 1_000;

type Point = { x: number; y: number; z: number };

const points: Point[] = await Deno.readTextFile("./day-08/part1.txt").then(
	(data) =>
		data
			.trim()
			.split("\n")
			.map((line) => {
				const [x, y, z] = line.split(",").map(Number);
				return { x, y, z };
			}),
);

console.log(`Found ${points.length} points`);

type Edge = { dist2: number; i: number; j: number };

const edges: Edge[] = [];

/**
 * Calculate the squared distance between two points.
 * This is faster than calculating the Euclidean distance because
 * it avoids the square root operation.
 *
 * @param a - The first point.
 * @param b - The second point.
 * @returns The squared distance between the two points.
 */
function squaredDistance(a: Point, b: Point): number {
	return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
}

const heap: Edge[] = [];
let maxIndex = 0;

function insertEdge(dist2: number, i: number, j: number) {
	// 1. Keep adding edges until heap is full
	if (heap.length < HEAP_SIZE) {
		heap.push({ dist2, i, j });

		// If this is the last edge, update the biggest distance
		if (heap.length === 1 || dist2 > heap[maxIndex].dist2) {
			maxIndex = heap.length - 1;
		}

		return;
	}

	// 2. Check the heap for the biggest distance
	if (dist2 >= heap[maxIndex].dist2) {
		// New edge is bigger than the biggest distance, so we can skip it
		return;
	}

	// 3. Replace the biggest distance with the new distance
	heap[maxIndex] = { dist2, i, j };

	// 4. Find the new biggest distance in heap
	let newMax = 0;
	for (let k = 0; k < heap.length; k++) {
		if (heap[k].dist2 > heap[newMax].dist2) {
			newMax = k;
		}
	}

	maxIndex = newMax;
}

for (let i = 0; i < points.length; i++) {
	for (let j = i + 1; j < points.length; j++) {
		const d = squaredDistance(points[i], points[j]);
		insertEdge(d, i, j);
	}
}

// Sort all shortest edges
heap.sort((a, b) => a.dist2 - b.dist2);

console.log(heap.slice(0, 10));
