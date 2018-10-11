import './index.scss';
import {Sound} from 'audio';
import initMIDI from 'midi';

import {MAX_FREQUENCY, midiTofreq, MIN_FREQUENCY} from './utils';

window.onload = function() {
	// init audio context
	const context = new (window.AudioContext || window.webkitAudioContext)();

	const $canvas = document.querySelector('.visualizer');
	const $oscilatorType = document.querySelector('[name=oscillator-type]');
	const $visualizerType = document.querySelector('[name=visualizer-type]');
	const $volume = document.querySelector('#volume');
	const $panning = document.querySelector('#panning');
	const $frequency = document.querySelector('#frequency');
	window.sound = new Sound(context, $canvas);
	window.sound.init();
	window.sound.visualize();

	// ********  set inputs to default initial values
	const initialLp = Math.log10(10*window.sound.gainNode.gain.value + 1);
	$volume.value = initialLp >= 1 ? 1 : initialLp;
	// $volume.value = window.sound.gainNode.gain.value;
	$frequency.value = window.sound.oscillator.frequency.value;
	$panning.value = window.sound.panNode.pan.value;
	$oscilatorType.value = window.sound.oscillator.type;
	$visualizerType.value = window.sound.visualizationSetting;
	let lastPlayedNote;

	// ************************** init MIDI here *******************************************************************
	initMIDI({
		potentiometer({note, velocity}) {
			if (note === 1) {
				const frequency = velocity * (MAX_FREQUENCY - MIN_FREQUENCY) / 127 + MIN_FREQUENCY;
				const normalizedValue = velocity / 127;
				const logValue = (Math.pow(10, normalizedValue)/10 - 0.1) * (MAX_FREQUENCY - MIN_FREQUENCY) + MIN_FREQUENCY;
				window.sound.oscillator.frequency.value = logValue;
				$frequency.value = logValue;
			} else if (note === 8) {
				const normalizedValue = velocity / 127;
				const logValue = normalizedValue <= 0 ? 0 : Math.pow(10, normalizedValue)/10 - 0.1;
				window.sound.gain = logValue;
				$volume.value = logValue;
				console.log('%c first slider:', 'background: #222; color: #bada55', velocity, normalizedValue);
			} else if (note === 23) {
				const frequency = velocity * (MAX_FREQUENCY - MIN_FREQUENCY) / 127 + MIN_FREQUENCY;
				const normalizedValue = velocity / 127;
				const logValue = (Math.pow(10, normalizedValue)/10 - 0.1) * (MAX_FREQUENCY - MIN_FREQUENCY) + MIN_FREQUENCY;
				window.sound.oscillator.frequency.value = logValue;
				$frequency.value = logValue;
			}
		},
		transportButtons({note, velocity}) {
			if (note === 116 && velocity > 0) {
				window.sound.stop();
			} else if (note === 117 && velocity > 0) {
				window.sound.play();
			}
		},
		pads({note, velocity}) {
			if (note === 36 && velocity > 0) {
				window.sound.oscillator.type = 'sine';
				window.sound.oscillator.type = 'sine';
			} else if (note === 37 && velocity > 0) {
				window.sound.oscillator.type = 'triangle';
				window.sound.oscillator.type = 'triangle';
			} else if (note === 38 && velocity > 0) {
				window.sound.oscillator.type = 'square';
				window.sound.oscillator.type = 'square';
			} else if (note === 39 && velocity > 0) {
				window.sound.oscillator.type = 'sawtooth';
				window.sound.oscillator.type = 'sawtooth';
			} else if (note === 40 && velocity > 0) {
				window.sound.visualizationSetting = 'amplitude';
				$visualizerType.value = 'amplitude';
				window.sound.stopVisualize();
				window.sound.visualize();
			} else if (note === 41 && velocity > 0) {
				window.sound.visualizationSetting = 'frequency';
				$visualizerType.value = 'frequency';
				window.sound.stopVisualize();
				window.sound.visualize();
			}
		},
		noteOn({note, velocity}) {
			window.sound.oscillator.frequency.exponentialRampToValueAtTime(midiTofreq(note), window.sound.context.currentTime + 0.1);
			const normalizedValue = velocity / 127;
			window.sound.gain = normalizedValue;
			lastPlayedNote = note;
		},
		noteOff({note}) {
			if (lastPlayedNote === note) {
				window.sound.gainNode.gain.exponentialRampToValueAtTime(0.0001, window.sound.context.currentTime + 0.005);
			}
		}
	});

	document.querySelector('.play').addEventListener('click', function(e){
		e.preventDefault();
		window.sound.play();
	}, false);

	document.querySelector('.stop').addEventListener('click', function(e){
		e.preventDefault();
		window.sound.stop();
	}, false);

	$volume.addEventListener('change', function(e){
		e.preventDefault();
		/*
		Math.pow(10, x) is inverse function of Math.log10(y)
		Human hearing is logarithmic so to compensate this we need to change volume exponentially to make changing volume smooth form 0 to 100% of loudness
		 */
		window.sound.gain = e.target.value <= 0 ? 0 : Math.pow(10, e.target.value)/10 - 0.1;
		// window.sound.gainNode.gain.setValueAtTime(e.target.value, window.sound.context.currentTime);
	}, false);

	$panning.addEventListener('change', function(e){
		e.preventDefault();
		window.sound.panNode.pan.setValueAtTime(e.target.value, window.sound.context.currentTime);
	}, false);

	// ctrl + click reset panner to default "middle" value
	$panning.addEventListener('click', function(e){
		e.preventDefault();
		if (e.ctrlKey) {
			e.target.value = 0;
			window.sound.panNode.pan.setValueAtTime(0, window.sound.context.currentTime);
		}
	}, false);

	$frequency.addEventListener('change', function(e){
		e.preventDefault();
		window.sound.oscillator.frequency.value = e.target.value;
	}, false);

	$oscilatorType.addEventListener('change',function(e){
		window.sound.oscillator.type = e.target.value;
	}, false);

	$visualizerType.addEventListener('change',function(e){
		window.sound.visualizationSetting = e.target.value;
		window.sound.stopVisualize();
		window.sound.visualize();
	}, false);
};