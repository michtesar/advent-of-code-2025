const diagram = await Deno.readTextFile("./day-07/part1.txt").then((data) =>
	data.trim().split("\n"),
);

// Find the starting position
let startRow = 0;
let startCol = 0;
for (let i = 0; i < diagram.length; i++) {
	const col = diagram[i].indexOf("S");
	if (col !== -1) {
		startRow = i;
		startCol = col;
		break;
	}
}

// Track active beam positions (row, col)
let beams: [number, number][] = [[startRow, startCol]];
let splitCount = 0;

// Process beams row by row
for (let row = startRow + 1; row < diagram.length; row++) {
	const newBeams: [number, number][] = [];

	for (const [_, beamCol] of beams) {
		const char = diagram[row][beamCol];

		if (char === "^") {
			// Splitter encountered - create two new beams
			splitCount++;
			// Left beam
			if (beamCol > 0) {
				newBeams.push([row, beamCol - 1]);
			}
			// Right beam
			if (beamCol < diagram[row].length - 1) {
				newBeams.push([row, beamCol + 1]);
			}
		} else {
			// Beam continues straight down
			newBeams.push([row, beamCol]);
		}
	}

	// Remove duplicate beam positions (multiple beams can converge)
	const uniqueBeams = new Set<string>();
	const deduplicatedBeams: [number, number][] = [];

	for (const beam of newBeams) {
		const key = `${beam[0]},${beam[1]}`;
		if (!uniqueBeams.has(key)) {
			uniqueBeams.add(key);
			deduplicatedBeams.push(beam);
		}
	}

	beams = deduplicatedBeams;

	// If no beams remain, we're done
	if (beams.length === 0) {
		break;
	}
}

console.log(splitCount);
