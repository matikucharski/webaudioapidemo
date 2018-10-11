export const MAX_FREQUENCY = 18000;
export const MIN_FREQUENCY = 80;

export function midiTofreq(midi, tuning = 440) {
	return midi === 0 || (midi > 0 && midi < 128) ? Math.pow(2, (midi - 69) / 12) * tuning : null;
}