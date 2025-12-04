const DEFAULT_START_POSITION = 50;

const rotations: string[] = (
  await Deno.readTextFile("./day-01/part1.txt")
    .catch((err) => {
      console.error("Error reading file:", err);
      return "";
    })
    .then((data) => data?.split("\n") ?? [])
)
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

let position = DEFAULT_START_POSITION;
let code = 0;
const rotationHistory: number[] = [];
for (const rotation of rotations) {
  const direction = rotation.charAt(0);
  if (direction !== "R" && direction !== "L") {
    throw new Error(`Invalid rotation direction: ${direction}`);
  }
  const distance = parseInt(rotation.slice(1), 10);
  if (Number.isNaN(distance)) {
    throw new Error(`Invalid distance in rotation: ${rotation}`);
  }
  const step = direction === "R" ? 1 : -1;

  // Move one click at a time and count every time we hit 0
  for (let i = 0; i < distance; i++) {
    position = (((position + step) % 100) + 100) % 100;
    rotationHistory.push(position);
    if (position === 0) {
      code += 1;
    }
  }

  console.log(`New position: ${position}`);
}

console.log(`Final position: ${position}`);
console.log(`Times passed through 0: ${code}`);
