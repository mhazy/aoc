import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 9;

// solution path: /home/mark/development/personal/aoc2021/years/2021/09/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/09/data.txt
// problem url  : https://adventofcode.com/2021/day/9
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
        return [
            this._top,
            this._bottom,
            this._left,
            this._right
        ].filter((position: MapPosition | null) => (position instanceof MapPosition)) as MapPosition[];
    }

    get isLowest(): boolean {
        return this.neighbours.every((position) => position.value > this.value);
    }
}

type Coordinate = { x: number, y: number };

class Map {
    private readonly _positions: MapPosition[];
    private readonly _width: number;

    constructor(positions: MapPosition[], width: number) {

        if ((positions.length % width) !== 0) {
            throw new Error('Amount of positions must be evenly divisible by width');
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
        if (
            x < 0 || x >= this._width || y < 0 || y >= (this._positions.length / this._width)
        ) {
            return -1;
        }

        return (this._width * y) + x;
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
                this._positions[i].top = this._positions[topIndex]
            }
            if (bottomIndex >= 0) {
                this._positions[i].bottom = this._positions[bottomIndex]
            }
            if (leftIndex >= 0) {
                this._positions[i].left = this._positions[leftIndex]
            }
            if (rightIndex >= 0) {
                this._positions[i].right = this._positions[rightIndex]
            }
        }
    }
}

function parseInput(input: string): number[][] {
    return input.split('\n').map((line) => line.split('').map(Number));
}

async function p2021day9_part1(input: string, ...params: any[]) {
    const parsed = parseInput(input);

    const grid = Map.from(parsed);

    let riskTotal = 0;
    grid.forEach((position) => {
       if (position.isLowest) {
           riskTotal = riskTotal + (position.value + 1);
       }
    });
    return riskTotal;
}

type FindNeighboursPredicate = (position: MapPosition) => boolean;

function findNeighbours(predicate: FindNeighboursPredicate, position: MapPosition): MapPosition[] {
    const toConsider: Set<MapPosition> = new Set([position]);
    const considered: Set<MapPosition> = new Set();
    const neighbours: Set<MapPosition> = new Set();

    while(toConsider.size > 0) {
        toConsider.forEach((currentPosition) => {
            toConsider.delete(currentPosition);

            // Make sure we don't look at this space again
            considered.add(currentPosition);
            if (predicate(currentPosition)) {
                neighbours.add(currentPosition);
                currentPosition.neighbours.forEach((currentNeighbour) => {
                    // We've already seen it, ignore it
                    if (considered.has(currentNeighbour)) {
                        return;
                    }

                    toConsider.add(currentNeighbour);
                });
            }
        });
    }

    return Array.from(neighbours.values());
}

async function p2021day9_part2(input: string, ...params: any[]) {
    const parsed = parseInput(input);
    const grid = Map.from(parsed);

    const lowestPoints: MapPosition[] = [];

    grid.forEach((position) => {
        if (position.isLowest) {
            lowestPoints.push(position);
        }
    });

    const checkPosition = (position: MapPosition): boolean => {
        return position.value < 9;
    }

    const basins: MapPosition[][] = [];

    lowestPoints.forEach((position) => {
        basins.push(findNeighbours(checkPosition, position));
    });

    if (basins.length < 3) {
        throw new Error("Did not find at least 3 basins");
    }

    return basins
        .sort((a, b) => b.length - a.length)
        .slice(0, 3)
        .reduce((total, basin) => total * basin.length, 1);
}

async function run() {
    const part1tests: TestCase[] = [{
        input: `2199943210
3987894921
9856789892
8767896789
9899965678`,
        expected: '15'
    }];
    const part2tests: TestCase[] = [{
        input: `2199943210
3987894921
9856789892
8767896789
9899965678`,
        expected: '1134'
    }];

    // Run tests
    test.beginTests();
    await test.section(async () => {
        for (const testCase of part1tests) {
            test.logTestResult(testCase, String(await p2021day9_part1(testCase.input, ...(testCase.extraArgs || []))));
        }
    });
    await test.section(async () => {
        for (const testCase of part2tests) {
            test.logTestResult(testCase, String(await p2021day9_part2(testCase.input, ...(testCase.extraArgs || []))));
        }
    });
    test.endTests();

    // Get input and run program while measuring performance
    const input = await util.getInput(DAY, YEAR);

    const part1Before = performance.now();
    const part1Solution = String(await p2021day9_part1(input));
    const part1After = performance.now();

    const part2Before = performance.now()
    const part2Solution = String(await p2021day9_part2(input));
    const part2After = performance.now();

    logSolution(9, 2021, part1Solution, part2Solution);

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
