import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution } from "../../../util/log";
import { performance } from "perf_hooks";
import Graph, { UndirectedGraph } from "graphology";
import { allSimplePaths, PathPredicate, RoomAttributes } from "./paths";

const YEAR = 2021;
const DAY = 12;

// solution path: /home/mark/development/personal/aoc2021/years/2021/12/index.ts
// data path    : /home/mark/development/personal/aoc2021/years/2021/12/data.txt
// problem url  : https://adventofcode.com/2021/day/12

function parseInput(input: string): UndirectedGraph<RoomAttributes> {
	const graph = new Graph<RoomAttributes>({ type: "undirected" });

	graph.addNode("start", { type: "start" });
	graph.addNode("end", { type: "end" });

	function getRoomType(room: string): "big" | "small" {
		return room.toLowerCase() === room ? "small" : "big";
	}

	input.split("\n").forEach(line => {
		const [start, end] = line.split("-");
		if (!graph.hasNode(start)) {
			graph.addNode(start, { type: getRoomType(start) });
		}
		if (!graph.hasNode(end)) {
			graph.addNode(end, { type: getRoomType(end) });
		}
		graph.addUndirectedEdge(start, end);
	});

	return graph;
}

async function p2021day12_part1(input: string, ...params: any[]) {
	const graph = parseInput(input);
	const paths = allSimplePaths(graph, "start", "end", (node, innerGraph, visited) => {
		const type = innerGraph.getNodeAttribute(node, "type");
		return visited.has(node) && type !== "big";
	});
	return paths.length;
}

function createPredicate(specialNode: string): PathPredicate {
	return (node, innerGraph, visited) => {
		const type = innerGraph.getNodeAttribute(node, "type");
		if (visited.has(node)) {
			if (type === "start" || type === "end") {
				// Can't go back through start/end
				return true;
			} else if (type === "small") {
				const totalInStack = visited.stack.reduce((total, value) => total + (value === node ? 1 : 0), 0);

				// Can go through regular nodes once, special node twice
				if (node !== specialNode || totalInStack > 1) {
					return true;
				}
			}
		}

		// Can traverse through the node
		return false;
	};
}

async function p2021day12_part2(input: string, ...params: any[]) {
	const graph = parseInput(input);

	const paths = graph
		.filterNodes((node, nodeAttributes) => nodeAttributes.type === "small")
		.map(node => allSimplePaths(graph, "start", "end", createPredicate(node)))
		.flat()
		.map(path => path.join("->"));

	const uniquePaths = new Set<string>(paths);

	return uniquePaths.size;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`,
			expected: "10",
		},
		{
			input: `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
			expected: "19",
		},
		{
			input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`,
			expected: "226",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`,
			expected: "36",
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day12_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day12_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day12_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day12_part2(input));
	const part2After = performance.now();

	logSolution(12, 2021, part1Solution, part2Solution);

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
