import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import Graph from "graphology";
import { dfs } from "graphology-traversal";

const YEAR = 2021;
const DAY = 11;

// solution path: /home/mark/development/personal/aoc2021/years/2021/11/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/11/data.txt
// problem url  : https://adventofcode.com/2021/day/11

type Coordinate = { x: number; y: number };

class MapPosition {
	constructor(value: number) {
		this._value = value;

		this._top = null;
		this._bottom = null;
		this._left = null;
		this._right = null;
	}

	private _top: MapPosition | null;

	set top(value: MapPosition) {
		this._top = value;
	}

	private _bottom: MapPosition | null;

	set bottom(value: MapPosition) {
		this._bottom = value;
	}

	private _left: MapPosition | null;

	set left(value: MapPosition) {
		this._left = value;
	}

	private _right: MapPosition | null;

	set right(value: MapPosition) {
		this._right = value;
	}

	private readonly _value: number;

	get value(): number {
		return this._value;
	}

	get neighbours(): MapPosition[] {
		return [this._top, this._bottom, this._left, this._right].filter(
			(position: MapPosition | null) => position instanceof MapPosition
		) as MapPosition[];
	}
}

class Map {
	static potentialPositions: Record<string, Coordinate> = {
		top: { x: 0, y: -1 },
		bottom: { x: 0, y: 1 },
		topLeft: { x: -1, y: -1 },
		bottomLeft: { x: -1, y: 1 },
		topRight: { x: 1, y: -1 },
		bottomRight: { x: 1, y: 1 },
		left: { x: -1, y: 0 },
		right: { x: 1, y: 0 },
	};

	private readonly _positions: MapPosition[];
	private readonly _width: number;

	constructor(positions: MapPosition[], width: number) {
		if (positions.length % width !== 0) {
			throw new Error("Amount of positions must be evenly divisible by width");
		}

		this._positions = positions;
		this._width = width;

		this.assignPositions();
	}

	forEach(cb: (position: MapPosition) => void) {
		this._positions.forEach(cb);
	}

	static from(values: number[][]): Map {
		const positions: MapPosition[] = [];

		if (values.length > 0) {
			const totalLines = values.length;
			const lineLength = values[0].length;

			for (let i = 0; i < totalLines; i++) {
				const line = values[i];

				if (line.length !== lineLength) {
					throw new Error("Received line with different length");
				}

				for (let j = 0; j < lineLength; j++) {
					positions.push(new MapPosition(values[i][j]));
				}
			}

			return new Map(positions, lineLength);
		}

		throw new Error("Failed to generate grid");
	}

	private coordToIndex({ x, y }: Coordinate): number {
		if (x < 0 || x >= this._width || y < 0 || y >= this._positions.length / this._width) {
			return -1;
		}

		return this._width * y + x;
	}

	private indexToCoord(index: number): Coordinate {
		const y = Math.floor(index / this._width);
		const x = index % this._width;
		return { x, y };
	}

	private assignPositions(): void {
		const totalPositions = this._positions.length;
		for (let i = 0; i < totalPositions; i++) {
			const coordinate = this.indexToCoord(i);
			const topIndex = this.coordToIndex({ x: coordinate.x, y: coordinate.y - 1 });
			const bottomIndex = this.coordToIndex({ x: coordinate.x, y: coordinate.y + 1 });
			const leftIndex = this.coordToIndex({ x: coordinate.x - 1, y: coordinate.y });
			const rightIndex = this.coordToIndex({ x: coordinate.x + 1, y: coordinate.y });

			if (topIndex >= 0) {
				this._positions[i].top = this._positions[topIndex];
			}
			if (bottomIndex >= 0) {
				this._positions[i].bottom = this._positions[bottomIndex];
			}
			if (leftIndex >= 0) {
				this._positions[i].left = this._positions[leftIndex];
			}
			if (rightIndex >= 0) {
				this._positions[i].right = this._positions[rightIndex];
			}
		}
	}
}

function parseInput(input: string): number[][] {
	return input.split("\n").map(line => line.split("").map(Number));
}

async function p2021day11_part1(input: string, ...params: any[]) {
	return "Not implemented";
}

async function p2021day11_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day11_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day11_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day11_part2(input));
	const part2After = performance.now();

	logSolution(11, 2021, part1Solution, part2Solution);

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
