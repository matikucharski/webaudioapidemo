import './index.scss';
import {Sound} from 'audio';

window.onload = function() {
	// init audio context
	const context = new (window.AudioContext || window.webkitAudioContext)();

	const $canvas = document.querySelector('.visualizer');
	const $oscilatorType = document.querySelector('[name=oscillator-type]');
	const $volume = document.querySelector('#volume');
	const $panning = document.querySelector('#panning');
	const $frequency = document.querySelector('#frequency');
	window.sound = new Sound(context, $canvas);
	window.sound.init();
	window.sound.visualize();

	// ********  set inputs to default initial values
	$volume.value = window.sound.gainNode.gain.value;
	$frequency.value = window.sound.oscillator.frequency.value;
	$panning.value = window.sound.panNode.pan.value;
	$oscilatorType.value = window.sound.oscillator.type;

	document.querySelector('.play').addEventListener('click',function(e){
		e.preventDefault();
		window.sound.play();
	},false);

	document.querySelector('.stop').addEventListener('click',function(e){
		e.preventDefault();
		window.sound.stop();
	},false);

	$volume.addEventListener('change',function(e){
		e.preventDefault();
		window.sound.gainNode.gain.value = e.target.value;
	},false);

	$panning.addEventListener('change',function(e){
		e.preventDefault();
		window.sound.panNode.pan.value = e.target.value;
	},false);

	$frequency.addEventListener('change',function(e){
		e.preventDefault();
		window.sound.oscillator.frequency.value = e.target.value;
	},false);
	$oscilatorType.addEventListener('change',function(e){
		window.sound.oscillator.type = e.target.value;
	},false);
};