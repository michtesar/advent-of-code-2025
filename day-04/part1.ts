const grid = await Deno.readTextFile("./day-04/part1.txt")
	.catch((err) => {
		console.error("Error reading file:", err);
		return "";
	})
	.then(
		(data) =>
			data
				?.split("\n")
				.filter((line) => line.trim())
				.map((line) => line.trim().split("")) ?? [],
	);

function getSurroundingCells(grid: string[][], x: number, y: number): string[] {
	const cells = [];
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			cells.push(grid[y + i]?.[x + j]);
		}
	}
	return cells;
}

function countPaperRolls(cells: string[]): number {
	return cells.filter((cell) => cell === "@").length;
}

function markPaperRoll(grid: string[][], x: number, y: number) {
	grid[y][x] = "x";
}

function printGrid(grid: string[][]) {
	for (const row of grid) {
		console.log(row.join(""));
	}
}

function isPaperRoll(cell: string): boolean {
	return cell === "@";
}

const paperRolls: { x: number; y: number }[] = [];

for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[y].length; x++) {
		if (isPaperRoll(grid[y][x])) {
			const cells = getSurroundingCells(grid, x, y);
			if (countPaperRolls(cells) <= 4) {
				paperRolls.push({ x, y });
			}
		}
	}
}

// Mark all paper rolls
for (const { x, y } of paperRolls) {
	markPaperRoll(grid, x, y);
}

printGrid(grid);

console.log(`Paper rolls: ${paperRolls.length}`);
