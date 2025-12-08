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

// Disjoint set union to find the connected components
const parent = new Array(points.length);
const size = new Array(points.length);

// Initialize parent and size arrays
// Each point is its own parent and has a size of 1
for (let i = 0; i < points.length; i++) {
	parent[i] = i;
	size[i] = 1;
}

/**
 * Find the parent of a point.
 *
 * @param x - The point to find the parent of.
 * @returns The parent of the point.
 */
function find(x: number): number {
	if (parent[x] !== x) {
		parent[x] = find(parent[x]);
	}
	return parent[x];
}

/**
 * Union two points into the same connected component.
 *
 * @param a - The first point.
 * @param b - The second point.
 */
function union(a: number, b: number): void {
	const ra = find(a);
	const rb = find(b);

	if (ra === rb) {
		// Both are already in the same component, skipping
		return;
	}

	// Attach smaller component to the larger one (by size)
	if (size[ra] < size[rb]) {
		parent[ra] = rb;
		size[rb] += size[ra];
	} else {
		parent[rb] = ra;
		size[ra] += size[rb];
	}
}

// Calculate the connected components
for (const edge of heap) {
	union(edge.i, edge.j);
}

const compSizes = new Map<number, number>();

for (let i = 0; i < points.length; i++) {
	const r = find(i);
	compSizes.set(r, (compSizes.get(r) ?? 0) + 1);
}

const sizes = Array.from(compSizes.values()).sort((a, b) => b - a);

console.log("Top component sizes:", sizes.slice(0, 10));

if (sizes.length < 3) {
	console.error("Less than 3 components, something is wrong.");
	Deno.exit(1);
}

const answer = sizes[0] * sizes[1] * sizes[2];
console.log("Answer:", answer);
