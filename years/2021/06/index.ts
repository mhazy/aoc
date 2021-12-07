import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 6;

// solution path: /home/mark/development/personal/aoc2021/years/2021/06/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/06/data.txt
// problem url  : https://adventofcode.com/2021/day/6

function setupCounters(seed: number[]): number[] {
	const counters = new Array<number>(9);

	counters.fill(0);

	seed.forEach((number) => {
		counters[number] += 1;
	});

	return counters;
}

const rotateArrayRightToLeft = <T>(values: T[]): T[] => [...values, values[0]].slice(1);

function getNextCounterState(counters: number[]): number[] {
	if (counters.length !== 9) {
		throw new Error("Counter state is not 9 values");
	}

	// Cycle array right to left (8 -> 7, 0 -> 8)
	const nextCounters = rotateArrayRightToLeft(counters);

	// "Each day, a 0 becomes a 6 and adds a new 8" -- or, all the 0's became 8's _and_ 6's.
	nextCounters[6] += nextCounters[8];

	return nextCounters;
}

async function p2021day6_part1(input: string, numberOfIterations: number = 80) {
	const numbers = input.split(",").map(Number);
	const initialState: number[] = setupCounters(numbers);

	let i = 0;

	let finalState = initialState;
	while (i < numberOfIterations) {
		finalState = getNextCounterState(finalState);
		i = i + 1;
	}

	return finalState.reduce((total, value) => total + value, 0);
}

async function p2021day6_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [{
		input: "3,4,3,1,2",
		expected: "26",
		extraArgs: [18],
	}, {
		input: "3,4,3,1,2",
		expected: "5934",
		extraArgs: [80],
	}, {
		input: "3,4,3,1,2",
		expected: "26984457539",
		extraArgs: [256],
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day6_part1(input, 80));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day6_part1(input, 256));
	const part2After = performance.now();

	logSolution(6, 2021, part1Solution, part2Solution);

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
