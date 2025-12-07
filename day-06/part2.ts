const raw = await Deno.readTextFile("./day-06/part2.txt");

const lines = raw.replace(/\r\n/g, "\n").split("\n").filter((line) =>
	line.length > 0
);

const height = lines.length;
let width = 0;
for (let i = 0; i < height; i++) {
	const len = lines[i].length;
	if (len > width) width = len;
}

const grid: string[][] = new Array(height);
for (let r = 0; r < height; r++) {
	const padded = lines[r].padEnd(width, " ");
	const chars: string[] = new Array(width);
	for (let c = 0; c < width; c++) {
		chars[c] = padded[c];
	}
	grid[r] = chars;
}

const isSeparator: boolean[] = new Array(width);
for (let c = 0; c < width; c++) {
	let sep = true;
	for (let r = 0; r < height; r++) {
		if (grid[r][c] !== " ") {
			sep = false;
			break;
		}
	}
	isSeparator[c] = sep;
}

let total = 0;
let col = width - 1;
const bottomRow = height - 1;

while (col >= 0) {
	if (isSeparator[col]) {
		col--;
		continue;
	}

	const end = col;
	let start = col;
	while (start >= 0 && !isSeparator[start]) {
		start--;
	}
	start++;

	let op: string | null = null;
	for (let c = start; c <= end; c++) {
		const ch = grid[bottomRow][c];
		if (ch === "+" || ch === "*") {
			op = ch;
			break;
		}
	}
	if (!op) {
		col = start - 1;
		continue;
	}

	const values: number[] = [];
	for (let c = start; c <= end; c++) {
		let digits = "";
		for (let r = 0; r < bottomRow; r++) {
			const ch = grid[r][c];
			if (ch >= "0" && ch <= "9") {
				digits += ch;
			}
		}
		if (digits.length > 0) {
			values.push(Number(digits));
		}
	}

	if (values.length > 0) {
		if (op === "+") {
			let sum = 0;
			for (let i = 0; i < values.length; i++) {
				sum += values[i];
			}
			total += sum;
		} else {
			let prod = 1;
			for (let i = 0; i < values.length; i++) {
				prod *= values[i];
			}
			total += prod;
		}
	}

	col = start - 1;
}

console.log(total);
