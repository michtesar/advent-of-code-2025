const lines = await Deno.readTextFile("./day-05/part2.txt").then((data) =>
	data.split("\n"),
);

const ranges: number[][] = [];
for (const line of lines) {
	if (line.length === 0) break;
	const [start, end] = line.split("-").map(Number);
	ranges.push([start, end]);
}

// Sort ranges by start value
ranges.sort((a, b) => a[0] - b[0]);

// Merge overlapping intervals
const merged: number[][] = [];
for (const range of ranges) {
	const [start, end] = range;

	if (merged.length === 0) {
		merged.push([start, end]);
		continue;
	}

	const last = merged[merged.length - 1];
	const lastEnd = last[1];

	// If current range overlaps or is adjacent to the last merged range
	if (start <= lastEnd + 1) {
		// Merge: extend the end if needed
		last[1] = Math.max(lastEnd, end);
	} else {
		// No overlap, add as new interval
		merged.push([start, end]);
	}
}

// Calculate total unique numbers across all merged intervals
let totalUnique = 0;
for (const [start, end] of merged) {
	// Add 1 because both start and end are inclusive
	const count = end - start + 1;
	totalUnique += count;
}

console.log("Merged intervals:", merged.length);
console.log("Unique fresh IDs: %s", totalUnique);
