import './index.scss';
import {Sound} from 'audio';

window.onload = function() {
	// init audio context
	const context = new (window.AudioContext || window.webkitAudioContext)();

	const canvas = document.querySelector('.visualizer');
	window.sound = new Sound(context, canvas);
	window.sound.init();

	document.querySelector('.play').addEventListener('click',function(e){
		e.preventDefault();
		window.sound.play();
	},false);

	document.querySelector('.stop').addEventListener('click',function(e){
		e.preventDefault();
		window.sound.stop();
	},false);
	const $oscilatorType = document.querySelector('[name=oscillator-type]');
	$oscilatorType.value = window.sound.oscillator.type; // set default value of select to default value of Sound object
	$oscilatorType.addEventListener('change',function(e){
		window.sound.oscillator.type = e.target.value;
	},false);
};