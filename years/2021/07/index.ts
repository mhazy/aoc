import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 7;

// solution path: /home/mark/development/personal/aoc2021/years/2021/07/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/07/data.txt
// problem url  : https://adventofcode.com/2021/day/7

function parseInput(input: string): number[] {
	return input.split(',').map(Number).sort();
}

function getMedian(numbers: number[]): number {
	// Assumes already sorted
	if (numbers.length % 2 === 0) {
		// even count
		const position = numbers.length / 2;
		return (numbers[position] + numbers[position + 1] + 1) / 2;
	} else {
		// odd count
		const position = (numbers.length + 1) / 2;
		return numbers[position];
	}
}

async function p2021day7_part1(input: string, ...params: any[]) {
	const numbers = parseInput(input);
	const median = getMedian(numbers);

	const maxValue = Math.max(...numbers);
	const minValue = Math.min(...numbers);

	let bestValue = Number.POSITIVE_INFINITY;

	let i: number;

	i = Math.floor(median);
	while (i > minValue) {
		const cost = numbers.reduce((total, value) => {
			return total + Math.abs(value - i);
		}, 0);
		bestValue = Math.min(bestValue, cost);
		i = i - 1;
	}

	i = Math.floor(median);
	while (i < maxValue) {
		const cost = numbers.reduce((total, value) => {
			return total + Math.abs(value - i);
		}, 0);
		bestValue = Math.min(bestValue, cost);
		i = i + 1;
	}

	return bestValue;

}

async function p2021day7_part2(input: string, ...params: any[]) {
	const numbers = parseInput(input);
	const median = getMedian(numbers);

	const maxValue = Math.max(...numbers);
	const minValue = Math.min(...numbers);

	let bestValue = Number.POSITIVE_INFINITY;

	let i: number;

	function calculateCost(numbers: number[], i: number) {
		return numbers.reduce((total, value) => total + (i * (i + 1) / 2), 0)
	}

	i = Math.floor(median);
	while (i > minValue) {
		bestValue = Math.min(bestValue, calculateCost(numbers, i));
		i = i - 1;
	}

	i = Math.floor(median);
	while (i < maxValue) {
		bestValue = Math.min(bestValue, calculateCost(numbers, i));
		i = i + 1;
	}

	return bestValue;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: '16,1,2,0,4,2,7,1,2,14',
			expected: '37'
		}
	];
	const part2tests: TestCase[] = [{
		input: '16,1,2,0,4,2,7,1,2,14',
		expected: '168'
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2021, part1Solution, part2Solution);

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
