const now = (): number => parseFloat(performance.now().toFixed(2));

export function calcDuration(start: number, end: number): number {
	return parseFloat((end - start).toFixed(2));
}

export default now;
