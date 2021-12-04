import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 3;

// solution path: /home/mark/development/personal/aoc2021/years/2021/03/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/03/data.txt
// problem url  : https://adventofcode.com/2021/day/3

function parseInput(input: string): number[] {
	return input.split("\n").map((value) => parseInt(value, 2));
}

type BitCount = {
	onBits: number;
	offBits: number;
	checkValue: number;
}

const DEFAULT_MAX_BITS = 12;

function generateBitCount(input: number[], bit: number): BitCount {
	const bitCount: BitCount = { onBits: 0, offBits: 0, checkValue: Math.pow(2, bit) };

	input.forEach((value) => {
		bitCount.onBits += (value & bitCount.checkValue) === 0 ? 0 : 1;
		bitCount.offBits += (value & bitCount.checkValue) === bitCount.checkValue ? 0 : 1;
	});

	return bitCount;
}

async function p2021day3_part1(input: string, maxBit = DEFAULT_MAX_BITS) {
	const values = parseInput(input);

	// least common bit
	let epsilon = 0;
	// most common bit
	let gamma = 0;

	for (let i = 0; i < maxBit; i++) {
		const bitCount = generateBitCount(values, i);
		if (bitCount.onBits > bitCount.offBits) {
			// 1 is the most common,
			gamma = gamma | bitCount.checkValue;
		} else {
			epsilon = epsilon | bitCount.checkValue;
		}
	}

	return epsilon * gamma;
}

type PredicateFn = (bitCount: BitCount) => boolean;

function filter(checkFn: PredicateFn, maxBit: number, values: number[]): number[] {
	let copiedValues = [...values];
	// Different from part 1, start checks from leftmost bit
	for (let i = maxBit - 1; i >= 0; i--) {
		const bitCount = generateBitCount(copiedValues, i);
		copiedValues = copiedValues.filter((number) => {
			if (checkFn(bitCount)) {
				return (number & bitCount.checkValue) === bitCount.checkValue;
			}
			return (number & bitCount.checkValue) === 0;
		});

		if (copiedValues.length === 1) {
			return copiedValues;
		}
	}
	throw new Error("Did not filter to single value");
}

function filterRecursive(checkFn: PredicateFn, curBit: number, values: number[]): number[] {
	let filteredValues = [...values];
	const bitCount = generateBitCount(filteredValues, curBit);
	filteredValues = filteredValues.filter((number) => {
		if (checkFn(bitCount)) {
			return (number & bitCount.checkValue) === bitCount.checkValue;
		} else {
			return (number & bitCount.checkValue) === 0;
		}
	});

	if (filteredValues.length > 1) {
		return filterRecursive(checkFn, curBit - 1, filteredValues);
	} else if (filteredValues.length === 1) {
		return filteredValues;
	}

	throw new Error("Did not filter to single value");
}

const mostCheckFn = (bitCount: BitCount) => bitCount.onBits >= bitCount.offBits;
const leastCheckFn = (bitCount: BitCount) => bitCount.onBits < bitCount.offBits;

async function p2021day3_part2(input: string, maxBit = DEFAULT_MAX_BITS) {
	const values = parseInput(input);
	const mostRemaining = filter(mostCheckFn, maxBit, values);
	const leastRemaining = filter(leastCheckFn, maxBit, values);
	return leastRemaining[0] * mostRemaining[0];
}

async function p2021day3_part2_recursive(input: string, maxBit = DEFAULT_MAX_BITS) {
	const values = parseInput(input);
	const mostRemaining = filterRecursive(mostCheckFn, maxBit - 1, values);
	const leastRemaining = filterRecursive(leastCheckFn, maxBit - 1, values);
	return leastRemaining[0] * mostRemaining[0];
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
		expected: "198",
		extraArgs: [5],
	}];
	const part2tests: TestCase[] = [{
		input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
		expected: "230",
		extraArgs: [5],
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day3_part2_recursive(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day3_part1(input, 12));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day3_part2(input, 12));
	const part2After = performance.now();

	const part2RecursiveBefore = performance.now();
	const part2RecursiveSolution = String(await p2021day3_part2_recursive(input, 12));
	const part2RecursiveAfter = performance.now();

	logSolution(3, 2021, part1Solution, part2Solution);

	if (part2Solution !== part2RecursiveSolution) {
		throw new Error("Got different results for part2 functions");
	}

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log(chalk.gray(`Part 2 (recursive): ${util.formatTime(part2RecursiveAfter - part2RecursiveBefore)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
