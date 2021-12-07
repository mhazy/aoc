import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 5;

// solution path: /home/mark/development/personal/aoc2021/years/2021/05/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/05/data.txt
// problem url  : https://adventofcode.com/2021/day/5

interface Line {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

function parseData(input: string): Line[] {
	const parser = /^(\d+),(\d+) -> (\d+),(\d+)$/;
	return input.split("\n").map<Line>((line) => {
		const matches = parser.exec(line);
		if (matches) {
			return new Line(
				Number(matches[1]),
				Number(matches[2]),
				Number(matches[3]),
				Number(matches[4]),
			);
		}

		throw new Error("Failed to parse line " + line);
	});
}

class Line {
	constructor(x1: number, y1: number, x2: number, y2: number) {
		if (x1 < x2) {
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;
		} else {
			this.x1 = x2;
			this.y1 = y2;
			this.x2 = x1;
			this.y2 = y1;
		}
	}

	forEach(cb: (x: number, y: number) => void, includeDiagonal = false) {
		if (this.x1 === this.x2) {
			const start = Math.min(this.y1, this.y2); // Smaller of values
			const end = Math.max(this.y1, this.y2); // Larger of values
			for (let y = start; y <= end; y++) {
				cb(this.x1, y);
			}
		} else if (this.y1 === this.y2) {
			const start = Math.min(this.x1, this.x2); // Smaller of values
			const end = Math.max(this.x1, this.x2); // Larger of values
			for (let x = start; x <= end; x++) {
				cb(x, this.y1);
			}
		} else if (includeDiagonal) {
			// Assumes that lines always travel left to right
			if (this.x2 < this.x1) {
				throw new Error("Line is not left to right");
			}

			const slope = (this.y2 - this.y1) / (this.x2 - this.x1);
			if (Math.abs(slope) !== 1) {
				throw new Error("Line slope is not 1/-1");
			}

			let y = this.y1;
			for (let x = this.x1; x <= this.x2; x++) {
				cb(x, y);
				y = y + slope;
			}

		}
	}
}

function countOverlaps(lines: Line[], includeDiagonal = false): number {
	const regions: Record<string, number> = {};

	let i = lines.length;
	while (i > 0) {
		i--;
		const line = lines[i];

		line.forEach((x, y) => {
			const lineHash = `${x},${y}`;
			if (regions[lineHash] === undefined) {
				regions[lineHash] = 0;
			}
			regions[lineHash] = regions[lineHash] + 1;
		}, includeDiagonal);
	}

	return Object.values(regions).reduce((total, val) => total + (val >= 2 ? 1 : 0), 0);

}

async function p2021day5_part1(input: string, ...params: any[]) {
	return countOverlaps(parseData(input));
}

async function p2021day5_part2(input: string, ...params: any[]) {
	return countOverlaps(parseData(input), true);
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`,
		expected: "5",
	}];
	const part2tests: TestCase[] = [{
		input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`,
		expected: "12",
		extraArgs: [true],
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day5_part2(input, true));
	const part2After = performance.now();

	logSolution(5, 2021, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
