// Adapted from https://raw.githubusercontent.com/graphology/graphology/master/src/simple-path/index.js
//
//  - Added predicate to determine if node can be traversed based on the current path and visited nodes
import { UndirectedGraph } from "graphology";

class StackSet {
	set: Set<string>;
	stack: string[];
	size: number;

	constructor() {
		this.set = new Set();
		this.stack = [];
		this.size = 0;
	}

	has(value: string): boolean {
		return this.set.has(value);
	}

	push(value: string): void {
		this.stack.push(value);
		this.set.add(value);
		this.size++;
	}

	pop(): void {
		this.set.delete(this.stack.pop()!);
		this.size--;
	}

	path(value: string): string[] {
		return this.stack.concat(value);
	}

	static of(value: string): StackSet {
		const set = new StackSet();
		set.push(value);
		return set;
	}
}

/**
 * Function returning all the paths between source & target in the graph.
 *
 * Paths may only traverse through small rooms once, but may pass through big rooms as many times as possible.
 */
export type PathPredicate = (node: string, graph: UndirectedGraph<RoomAttributes>, visited: StackSet) => boolean;

export function allSimplePaths(
	graph: UndirectedGraph<RoomAttributes>,
	source: string,
	target: string,
	predicate: PathPredicate
) {
	if (!graph.hasNode(source)) {
		throw new Error(`could not find source node ${source} in graph.`);
	}

	if (!graph.hasNode(target)) {
		throw new Error(`could not find source node ${target} in graph.`);
	}

	const stack = [graph.outboundNeighbors(source)];
	const visited = StackSet.of(source);

	const paths: string[][] = [];

	while (stack.length !== 0) {
		const children = stack[stack.length - 1];
		const child = children.pop();

		if (!child) {
			stack.pop();
			visited.pop();
		} else {
			if (predicate(child, graph, visited)) {
				continue;
			}

			if (child === target) {
				paths.push(visited.path(child));
			}

			visited.push(child);

			if (!visited.has(target)) {
				stack.push(graph.outboundNeighbors(child));
			} else {
				visited.pop();
			}
		}
	}
	return paths;
}

export interface RoomAttributes {
	type: "big" | "small" | "start" | "end";
}
