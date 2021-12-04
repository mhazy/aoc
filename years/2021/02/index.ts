import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution } from "../../../util/log";
import { performance } from "perf_hooks";
import { parseInt } from "lodash";

const YEAR = 2021;
const DAY = 2;

// solution path: /home/mark/development/personal/aoc2021/years/2021/02/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/02/data.txt
// problem url  : https://adventofcode.com/2021/day/2

const DIRECTIONS = ["forward", "down", "up"];

interface Command {
	direction: "forward" | "down" | "up",
	amount: number
}

function parseInput(input: string): Command[] {
	const matcher = /^(forward|down|up) (\d+)$/;

	return input.split("\n").map((unparsedCommand: string) => {
		const result = matcher.exec(unparsedCommand);
		if (!result) {
			throw new Error("Could not parse " + unparsedCommand);
		}
		if (DIRECTIONS.indexOf(result[1]) !== -1) {
			return {
				direction: result[1] as Command["direction"],
				amount: parseInt(result[2]),
			};

		}
		throw new Error("Unrecognized command " + result[1]);
	});
}

async function p2021day2_part1(input: string, ...params: any[]) {
	const commands = parseInput(input);
	const state = { horizontal: 0, depth: 0 };
	commands.forEach((command) => {
		if (command.direction === "forward") {
			state.horizontal += command.amount;
		} else if (command.direction === "down") {
			state.depth += command.amount;
		} else if (command.direction === "up") {
			state.depth -= command.amount;
		} else {
			throw new Error("Unhandled command " + command.direction);
		}
	});

	return state.horizontal * state.depth;
}

async function p2021day2_part2(input: string, ...params: any[]) {
	const commands = parseInput(input);
	const state = { horizontal: 0, depth: 0, aim: 0 };
	commands.forEach((command) => {
		if (command.direction === "forward") {
			state.horizontal += command.amount;
			state.depth += (state.aim * command.amount);
		} else if (command.direction === "down") {
			state.aim += command.amount;
		} else if (command.direction === "up") {
			state.aim -= command.amount;
		} else {
			throw new Error("Unhandled command " + command.direction);
		}
	});

	return state.horizontal * state.depth;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`,
			expected: "150",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`,
			expected: "900",
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2021, part1Solution, part2Solution);

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
