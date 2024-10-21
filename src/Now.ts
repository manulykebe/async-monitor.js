const now = (): number => parseFloat(performance.now().toFixed(0));

export function calcDuration(start: number, end: number): number {
	return parseFloat((end - start).toFixed(0));
}

export default now;
