const diagram = await Deno.readTextFile("./day-07/part2.txt").then((data) =>
	data.trim().split("\n"),
);

// Locate the teleporter start position
let startRow = 0;
let startCol = 0;
for (let row = 0; row < diagram.length; row++) {
	const col = diagram[row].indexOf("S");
	if (col !== -1) {
		startRow = row;
		startCol = col;
		break;
	}
}

const addCount = (map: Map<number, bigint>, col: number, value: bigint) => {
	const current = map.get(col) ?? 0n;
	map.set(col, current + value);
};

let beams = new Map<number, bigint>([[startCol, 1n]]);

for (let row = startRow + 1; row < diagram.length; row++) {
	const newBeams = new Map<number, bigint>();

	for (const [col, count] of beams) {
		if (count === 0n) {
			continue;
		}

		const char = diagram[row][col] ?? ".";

		if (char === "^") {
			if (col > 0) {
				addCount(newBeams, col - 1, count);
			}
			if (col < diagram[row].length - 1) {
				addCount(newBeams, col + 1, count);
			}
		} else {
			addCount(newBeams, col, count);
		}
	}

	if (newBeams.size === 0) {
		beams = newBeams;
		break;
	}

	beams = newBeams;
}

let timelineCount = 0n;
for (const count of beams.values()) {
	timelineCount += count;
}

console.log(timelineCount.toString());
