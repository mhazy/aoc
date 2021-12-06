interface NumberObj {
	seen: boolean;
	value: number;
}

export class Card {
	list: NumberObj[];
	byId: Record<string, NumberObj>;

	rows: NumberObj[][];
	columns: NumberObj[][];

	// Lookup table for column and row a number is in
	numberLocations: Record<string, NumberObj[][]>;

	constructor(numbers: number[]) {
		if (numbers.length !== 25) {
			throw new Error("Did not get 25 numbers for cards");
		}

		this.list = [];
		this.byId = {};
		this.numberLocations = {};

		const rows: NumberObj[][] = [];

		const columns: NumberObj[][] = [
			[],
			[],
			[],
			[],
			[],
		];

		let currentRow: NumberObj[] = [];

		for (let i = 0; i < 25; i++) {
			const slot = i % 5;
			const value = numbers[i];
			const numberObj: NumberObj = { seen: false, value };
			currentRow.push(numberObj);
			columns[slot].push(numberObj);

			this.list.push(numberObj);
			this.numberLocations[value] = [currentRow, columns[slot]];

			if (slot === 4) {
				rows.push(currentRow);
				currentRow = [];
			}

			this.byId[value] = numberObj;
		}

		this.rows = rows;
		this.columns = columns;
	}

	/**
	 * Mark value and return true if card has won
	 * @param value
	 */
	mark(value: number): boolean {
		if (this.byId[value] && this.numberLocations[value]) {
			this.byId[value].seen = true;
			return this.numberLocations[value].some(
				(locations) => locations.every(
					(number) => number.seen,
				),
			);
		}
		return false;
	}


	score(multiplier: number): number {
		return this.list.reduce((acc, card) => acc + (card.seen ? 0 : card.value), 0) * multiplier;
	}
}