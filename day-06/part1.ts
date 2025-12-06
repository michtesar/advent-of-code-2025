const rawData = await Deno.readTextFile("./day-06/part1.txt").then((data) =>
	data.split("\n"),
);

function isOperation(line: string): boolean {
	return line.includes("*") || line.includes("+");
}

function parseOperation(line: string): string[] {
	return line.replace(/\s/g, "").split("");
}

const operations: string[] = [];
const numbers: number[][] = [];
for (const line of rawData) {
	if (!line.length) continue;

	if (isOperation(line)) {
		operations.push(...parseOperation(line));
	} else {
		const row = line.match(/\d+/g)?.map(Number) || [];
		numbers.push(row);
	}
}
console.log(operations);
console.log(numbers);

let sum = 0;
for (let col = 0; col < operations.length; col++) {
	const operation = operations[col];

	const columnValues = numbers.map((row) => row[col]);
	console.debug("column: %s, operation: %s", columnValues, operation);
	switch (operation) {
		case "*": {
			const result = columnValues.reduce((a, b) => a * b, 1);
			console.debug("result: %s", result);
			sum += result;
			break;
		}
		case "+": {
			const result = columnValues.reduce((a, b) => a + b, 0);
			console.debug("result: %s", result);
			sum += result;
			break;
		}
	}
}

console.log(sum);
