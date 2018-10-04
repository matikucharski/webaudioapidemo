import './index.scss';
import {Sound} from 'audio';
import initMIDI from 'midi';

window.onload = function() {
	// init audio context
	const context = new (window.AudioContext || window.webkitAudioContext)();

	const $canvas = document.querySelector('.visualizer');
	const $oscilatorType = document.querySelector('[name=oscillator-type]');
	const $volume = document.querySelector('#volume');
	const $panning = document.querySelector('#panning');
	const $frequency = document.querySelector('#frequency');
	const $enableMIDIbutton = document.querySelector('#enable-midi');
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

	$enableMIDIbutton.addEventListener('click', function(e){
		e.preventDefault();
		initMIDI();
	}, false);

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
};