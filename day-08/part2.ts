type Point = { x: number; y: number; z: number };

const points: Point[] = await Deno.readTextFile("./day-08/part2.txt").then(
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

// Calculate all edges between all pairs of points
const edges: Edge[] = [];

for (let i = 0; i < points.length; i++) {
	for (let j = i + 1; j < points.length; j++) {
		const d = squaredDistance(points[i], points[j]);
		edges.push({ dist2: d, i, j });
	}
}

// Sort edges by distance (shortest first)
edges.sort((a, b) => a.dist2 - b.dist2);

console.log(`Total edges: ${edges.length}`);

// Disjoint set union (Union-Find) data structure
const parent = new Array(points.length);
const size = new Array(points.length);

// Initialize parent and size arrays
// Each point is its own parent and has a size of 1
for (let i = 0; i < points.length; i++) {
	parent[i] = i;
	size[i] = 1;
}

/**
 * Find the parent of a point with path compression.
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
 * Returns true if the union was successful (they were in different components),
 * false if they were already in the same component.
 *
 * @param a - The first point.
 * @param b - The second point.
 * @returns True if union was successful, false otherwise.
 */
function union(a: number, b: number): boolean {
	const ra = find(a);
	const rb = find(b);

	if (ra === rb) {
		// Both are already in the same component
		return false;
	}

	// Attach smaller component to the larger one (by size)
	if (size[ra] < size[rb]) {
		parent[ra] = rb;
		size[rb] += size[ra];
	} else {
		parent[rb] = ra;
		size[ra] += size[rb];
	}

	return true;
}

// Kruskal's algorithm: connect all points until they form one circuit
let lastEdge: Edge | null = null;
let components = points.length;

for (const edge of edges) {
	if (union(edge.i, edge.j)) {
		// Successfully connected two components
		components--;

		// If all points are now in one component, this is the last edge
		if (components === 1) {
			lastEdge = edge;
			break;
		}
	}
}

if (!lastEdge) {
	console.error("Failed to connect all points into one circuit");
	Deno.exit(1);
}

const answer = points[lastEdge.i].x * points[lastEdge.j].x;
console.log(`Last edge connects points ${lastEdge.i} and ${lastEdge.j}`);
console.log(
	`Point ${lastEdge.i}: (${points[lastEdge.i].x}, ${points[lastEdge.i].y}, ${points[lastEdge.i].z})`,
);
console.log(
	`Point ${lastEdge.j}: (${points[lastEdge.j].x}, ${points[lastEdge.j].y}, ${points[lastEdge.j].z})`,
);
console.log(`Answer: ${answer}`);
