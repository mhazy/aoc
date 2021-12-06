import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution } from "../../../util/log";
import { performance } from "perf_hooks";
import { Card } from "./card";

const YEAR = 2021;
const DAY = 4;

// solution path: /home/mark/development/personal/aoc2021/years/2021/04/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/04/data.txt
// problem url  : https://adventofcode.com/2021/day/4


function parseInput(input: string): { picks: number[], cards: Card[] } {
	const lines = input.split("\n\n");
	const picks = lines[0].split(",").map(Number);

	const remainingLines = lines.length;
	let currentLine = 1;

	const cards: Card[] = [];

	while (currentLine < remainingLines) {
		const line = lines[currentLine];
		const numbers: number[] = line.split(/\s+/).filter((value) => value.length > 0).map(Number);
		cards.push(new Card(numbers));
		currentLine = currentLine + 1;
	}

	return { picks, cards };
}


function p2021day4_part1(input: string) {
	const { picks, cards } = parseInput(input);

	const totalPicks = picks.length;
	const totalCards = cards.length;

	for (let pickIndex = 0; pickIndex < totalPicks; pickIndex++) {
		for (let cardIndex = 0; cardIndex < totalCards; cardIndex++) {
			if (cards[cardIndex].mark(picks[pickIndex])) {
				return cards[cardIndex].score(picks[pickIndex]);
			}
		}

	}

	throw new Error("Failed to find winning board");
}

function p2021day4_part2(input: string) {
	const { picks, cards } = parseInput(input);

	const totalPicks = picks.length;

	const remainingCards = new Set<Card>(cards);
	const winningScores: number[] = [];

	for (let pickIndex = 0; pickIndex < totalPicks; pickIndex++) {
		const currentPick = picks[pickIndex];
		remainingCards.forEach((card) => {
			if (card.mark(currentPick)) {
				remainingCards.delete(card);
				winningScores.push(card.score(currentPick));
			}
		});
	}

	if (winningScores.length === 0) {
		throw new Error("Failed to determine last winning score");
	}

	return winningScores.pop();
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
			expected: "4512",
		},
	];

	const part2tests: TestCase[] = [
		{
			input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
			expected: "1924",
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(p2021day4_part1(testCase.input)));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(p2021day4_part2(testCase.input)));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(p2021day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(p2021day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2021, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()

	.then(
		() => {
			process.exit();
		},
	)
	.catch(error => {
		throw error;
	});
