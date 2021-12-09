import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 8;

// solution path: /home/mark/development/personal/aoc2021/years/2021/08/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/08/data.txt
// problem url  : https://adventofcode.com/2021/day/8

interface Parsed {
    input: string[];
    output: string[];
}

function parseInput(input: string): Parsed[] {
    return input.split('\n').map((line) => {
        const firstSplit = line.split('|');
        const input = firstSplit[0].trim().split(' ').map((value) => value.split('').sort().join(''));
        const output = firstSplit[1].trim().split(' ').map((value) => value.split('').sort().join(''));
        if (!input || !output) {
            throw new Error('Unable to parse')
        }

        return { input, output }
    });
}

async function p2021day8_part1(input: string, ...params: any[]) {
    const parsed = parseInput(input);
    // 2, 3, 4, 7
    const known = new Set([2, 3, 4, 7]);

    const result = parsed.reduce((total, currentParsed) => {
        return total + currentParsed.output.reduce((outputTotal, outputValue) => {
            const len = outputValue.length;
            return outputTotal + (known.has(len) ? 1 : 0);
        }, 0)
    }, 0);
    return result;
}

function solveDigits(segments: string[]) {

}

/*
 *  aaaa
 * b    c
 * b    c
 *  dddd
 * e    f
 * e    f
 *  gggg
 */
const SORTED_UNSCRAMBLED_NUMBER_SEGMENTS = [
    'abcefg', // 0 (6)
    'cf',     // 1 (2) - Unique
    'acdeg',  // 2 (5)
    'acdfg',  // 3 (5)
    'bcdf',   // 4 (4) - Unique
    'abdfg',  // 5 (5)
    'abdefg', // 6 (6)
    'acf',    // 7 (3) - Unique
    'abcdefg',// 8 (7) - Unique
    'abcdfg'  // 9 (6)
];

function calculateLetterFrequency(numbers: string[]): Record<string, number> {
    const letterFrequency: Record<string, number> = {};
    numbers
        .join('')
        .split('')
        .forEach((letter) => {
            letterFrequency[letter] = (letterFrequency[letter] ?? 0) + 1;
        });

    return letterFrequency;
}

function encoder(letterFrequency: Record<string, number>, input: string): string {
    return input.split('').map((letter) => letterFrequency[letter]).sort().join('')
}

function createLetterFrequencyLookup(): string[] {
    const letterFrequency = calculateLetterFrequency(SORTED_UNSCRAMBLED_NUMBER_SEGMENTS);
    return SORTED_UNSCRAMBLED_NUMBER_SEGMENTS.map((number) => encoder(letterFrequency, number));
}

async function p2021day8_part2(input: string) {
    /**
     * - Generates an indexed array containing unique strings derived by the following:
     *    - Count the occurrence of segments used in each string
     *    - Replace letter segments with the number of counted occurrences
     *    - Sort resulting string
     *
     * - This works because:
     *   - Every input has all 10 numbers encoded
     *   - The encoded numbers all have unique strings (otherwise they'd be the same number)
     *   - The frequency of letters doesn't change with randomized letters
     */

    const indexedNumberOccurrences = createLetterFrequencyLookup();
    const lines = parseInput(input);

    const numericValues = lines.map((parsed) => {
        const letterFrequency = calculateLetterFrequency(parsed.input);
        const outputDigits = parsed.output.map((outputValue) => {
            const encodedOutput = encoder(letterFrequency, outputValue);
            if (indexedNumberOccurrences.indexOf(encodedOutput) === -1) {
                throw new Error('Failed to determine digit using frequencies');
            }
            return indexedNumberOccurrences.indexOf(encodedOutput);
        }).join('');
        return Number(outputDigits);
    });

    return numericValues.reduce((total, value) => total + value, 0);
}

async function run() {
    const part1tests: TestCase[] = [{
        input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
        expected: '26'
    }];
    const part2tests: TestCase[] = [{
        input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
        expected: '61229'
    }];

    // Run tests
    test.beginTests();
    await test.section(async () => {
        for (const testCase of part1tests) {
            test.logTestResult(testCase, String(await p2021day8_part1(testCase.input)));
        }
    });
    await test.section(async () => {
        for (const testCase of part2tests) {
            test.logTestResult(testCase, String(await p2021day8_part2(testCase.input)));
        }
    });
    test.endTests();

    // Get input and run program while measuring performance
    const input = await util.getInput(DAY, YEAR);

    const part1Before = performance.now();
    const part1Solution = String(await p2021day8_part1(input));
    const part1After = performance.now();

    const part2Before = performance.now()
    const part2Solution = String(await p2021day8_part2(input));
    const part2After = performance.now();

    logSolution(8, 2021, part1Solution, part2Solution);

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
