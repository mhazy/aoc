import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 10;

// solution path: /home/mark/development/personal/aoc2021/years/2021/10/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/10/data.txt
// problem url  : https://adventofcode.com/2021/day/10

function parseInput(input: string): string[] {
	return input.split('\n');
}

enum ChunkResultType {
	INCOMPLETE = 'incomplete',
	COMPLETE = 'complete',
	CORRUPT = 'corrupt'
}

type IncompleteChunk = {
	result: ChunkResultType.INCOMPLETE;
	chunk: string;
	close: string;
}

type CompleteChunk = {
	result: ChunkResultType.COMPLETE;
	chunk: string;
}

type CorruptChunk = {
	result: ChunkResultType.CORRUPT;
	character: string;
	chunk: string;
}

type ChunkResult = IncompleteChunk | CompleteChunk | CorruptChunk;

const OPENING_PAIRS: Record<string, string> = {
	'(': ')',
	'{': '}',
	'[': ']',
	'<': '>',
};

const CLOSING_PAIRS: Record<string, string> = {
	')': '(',
	'}': '{',
	']': '[',
	'>': '<',
}

function checkChunk(chunk: string): ChunkResult {
	// TODO: Try out a lexer?
	const separated = chunk.split('');

	const opened: string[] = [];
	let openCount = 0;
	const total = separated.length;
	for (let i = 0; i < total; i++) {
		const character = separated[i];
		if (OPENING_PAIRS[character]) {
			// Opening a sequence
			opened.push(character);
			openCount = openCount + 1;
		} else if (CLOSING_PAIRS[character]) {
			// Closing a sequence
			if (openCount > 0 && opened[openCount - 1] === CLOSING_PAIRS[character]) {
				openCount = openCount - 1;
				opened.pop();
			} else {
				return {
					result: ChunkResultType.CORRUPT,
					character: character,
					chunk
				}
			}
		}
	}

	if (openCount === 0) {
		return { result: ChunkResultType.COMPLETE, chunk };
	}

	return { result: ChunkResultType.INCOMPLETE, chunk, close: opened.reverse().map((char) => OPENING_PAIRS[char]).join('') };
}

async function p2021day10_part1(input: string, ...params: any[]) {
	const parsed = parseInput(input);

	const SCORES: Record<string, number> = {
		')': 3,
		']': 57,
		'}': 1197,
		'>': 25137
	}

	return parsed.map(checkChunk)
		.filter(isCorruptChunkResult)
		.reduce((total, chunk) => total + SCORES[chunk.character], 0);
}

function isIncompleteChunkResult(value: ChunkResult): value is IncompleteChunk {
	return value.result === ChunkResultType.INCOMPLETE;
}

function isCorruptChunkResult(value: ChunkResult): value is CorruptChunk {
	return value.result === ChunkResultType.CORRUPT;
}

function scoreIncompleteChunkResult(result: IncompleteChunk): number {
	const SCORES: Record<string, number> = {
		')': 1,
		']': 2,
		'}': 3,
		'>': 4
	}

	return result.close.split('').reduce((total, char) => {
		return (total * 5) + SCORES[char];
	}, 0);
}
async function p2021day10_part2(input: string, ...params: any[]) {
	const parsed = parseInput(input);

	const sortedResults = parsed
		.map(checkChunk)
		.filter(isIncompleteChunkResult)
		.map(scoreIncompleteChunkResult)
		.sort((a, b) => a - b);

	return sortedResults[Math.floor(sortedResults.length / 2)];
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`,
			expected: '26397'
		}
	];
	const part2tests: TestCase[] = [{
		input: `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`,
		expected: '288957'
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day10_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day10_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day10_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2021day10_part2(input));
	const part2After = performance.now();

	logSolution(10, 2021, part1Solution, part2Solution);

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
