const lines = await Deno.readTextFile("./day-05/part1.txt").then(data => data.split("\n"));

const ranges: number[][] = [];
for (const line of lines) {
  if (line.length === 0) break;
  const [start, end] = line.split("-").map(Number);
  ranges.push([start, end]);
}

console.log(ranges);

function isEmpty(line: string[]): boolean {
    return line.every(l => l.length === 0);
}

function isRange(line: string[]): boolean {
    return line.every(l => l.split("-").length === 2);
}

const ingredients: number[]= [];
for (const line of lines.map(line => line.split("\n"))) {
    if (!isEmpty(line) && !isRange(line)) {
        ingredients.push(Number(line[0]));
    }
}

function isInRange(number: number, range: number[]): boolean {
    return number >= range[0] && number <= range[1];
}

const freshIds: number[] = [];
for (const ingredient of ingredients) {
    for (const range of ranges) {
        if (isInRange(ingredient, range)) {
            console.debug('ingredient: %s, range: %s', ingredient, range);
            freshIds.push(ingredient);
        }
    }
}

function getUniqueFreshIds(freshIds: number[]): number[] {
    return freshIds.filter((id, index, self) => self.indexOf(id) === index);
}

const ids = getUniqueFreshIds(freshIds);
console.log("Unique fresh IDs: %s", ids.length);
