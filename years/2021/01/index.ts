import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 1;

// solution path: /home/mark/development/personal/aoc2021/years/2021/01/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/01/data.txt
// problem url  : https://adventofcode.com/2021/day/1

async function processInput(input: string): Promise<number[]> {
	return input.split("\n").map(Number);
}


function getIncreased(numbers: number[]): number {
	let increasedCount = 0;
	for (let i = 1; i < numbers.length; i++) {
		if (numbers[i] > numbers[i - 1]) {
			increasedCount++;
		}
	}
	return increasedCount;
}

async function p2021day1_part1(input: string) {
	const numbers = await processInput(input);
	return getIncreased(numbers);
}

async function p2021day1_part2(input: string) {
	const numbers = await processInput(input);

	// TODO:
	//  - Stream numbers,
	const slidingSums = accumulateSums(3, numbers);
	return getIncreased(slidingSums);
}

function accumulateSums(span: number, numbers: number[]): number[] {
	const sums: number[] = [];
	for (let i = 0; i < numbers.length - span + 1; i++) {
		let currentSum = 0;
		for (let j = 0; j < span; j++) {
			currentSum += numbers[i + j];
		}
		sums.push(currentSum);
	}
	return sums;
}

async function run() {
	// Run tests

	const part1tests: TestCase[] = [
		{
			input: [199, 200, 208, 210, 200, 207, 240, 269, 260, 263].join('\n'),
			expected: "7",
		},
	];

	const part2tests: TestCase[] = [
		{
			input: [199, 200, 208, 210, 200, 207, 240, 269, 260, 263].join('\n'),
			expected: "5",
		},
	];
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2021day1_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2021day1_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2020, part1Solution, part2Solution);

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
