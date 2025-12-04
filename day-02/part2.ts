const codes = await Deno.readTextFile("./day-02/part1.txt").catch(
    (err) => {
        console.error("Error reading file:", err);
        return "";
    },
).then((data) => data?.split(",") ?? []);

function isRepeatedSequence(s: string): boolean {
    if (s.length < 2) return false;
    if (s.startsWith("0")) return false;
    // Check for any divisor of length that yields at least 2 repeats
    for (let unit = 1; unit <= Math.floor(s.length / 2); unit++) {
        if (s.length % unit !== 0) continue;
        const times = s.length / unit;
        if (times < 2) continue;
        const pattern = s.slice(0, unit);
        if (pattern.repeat(times) === s) return true;
    }
    return false;
}

let result = 0n;
for (const code of codes) {
    const parts = code.split("-");
    if (parts.length !== 2) {
        console.error(`Invalid code format: ${code}`);
        Deno.exit(1);
    }
    const start = BigInt(parts[0]);
    const end = BigInt(parts[1]);
    if (start > end) {
        console.error(`Invalid range: ${code}`);
        Deno.exit(1);
    }

    // We'll iterate through the range. Ranges in the puzzle are reasonably small,
    // so a straightforward loop is fine; use BigInt loop.
    for (let n = start; n <= end; n++) {
        const s = n.toString();
        if (isRepeatedSequence(s)) {
            result += n;
        }
    }
}

console.log(`Final code: ${result.toString()}`);
