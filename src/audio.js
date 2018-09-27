export class Sound {

	constructor(context, canvas) {
		this.context = context;

		this.canvas = canvas;
		this.canvasCtx = canvas && canvas.getContext('2d');
		this.drawVisual; // for requestAnimationFrame
		this.visualizationSetting = 'sinewave';
	}

	init() {
		// create oscillator node - for generating sound
		this.oscillator = this.context.createOscillator();
		// create gain node for changing volume
		this.gainNode = this.context.createGain();
		// create analyzer node
		this.analyser = this.context.createAnalyser();

		this.analyser.minDecibels = -90;
		this.analyser.maxDecibels = -10;
		this.analyser.smoothingTimeConstant = 0.85;

		this.oscillator.type = 'sine';
		this.oscillator.frequency.value = 440;

		// connect sound source to gain to allow changing volume
		this.oscillator.connect(this.analyser);
		this.analyser.connect(this.gainNode);
		// connect volume (final node) to output
		this.gainNode.connect(this.context.destination);
	}

	play() {
		this.init();

		this.gainNode.gain.setValueAtTime(0.5, this.context.currentTime);

		this.oscillator.start();
	}

	stop() {
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
		this.oscillator.stop(this.context.currentTime + 1);
	}

	visualize() {
		const WIDTH = this.canvas.width;
		const HEIGHT = this.canvas.height;

		if (this.visualizationSetting === 'sinewave') {
			this.analyser.fftSize = 2048;
			const bufferLength = this.analyser.fftSize;
			const dataArray = new Uint8Array(bufferLength);

			this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

			const draw = ()=>{

				this.drawVisual = requestAnimationFrame(draw);

				this.analyser.getByteTimeDomainData(dataArray);

				this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
				this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

				this.canvasCtx.lineWidth = 2;
				this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

				this.canvasCtx.beginPath();

				const sliceWidth = WIDTH * 1.0 / bufferLength;
				let x = 0;

				for (let i = 0; i < bufferLength; i++) {

					const v = dataArray[i] / 128.0;
					const y = v * HEIGHT/2;

					if(i === 0) {
						this.canvasCtx.moveTo(x, y);
					} else {
						this.canvasCtx.lineTo(x, y);
					}

					x += sliceWidth;
				}

				this.canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
				this.canvasCtx.stroke();
			};

			draw();

		} else if (this.visualizationSetting === 'frequencybars') {
			this.analyser.fftSize = 256;
			const bufferLengthAlt = this.analyser.frequencyBinCount;
			const dataArrayAlt = new Uint8Array(bufferLengthAlt);

			this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

			const drawAlt = ()=>{
				this.drawVisual = requestAnimationFrame(drawAlt);

				this.analyser.getByteFrequencyData(dataArrayAlt);

				this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
				this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

				const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
				let barHeight;
				let x = 0;

				for (let i = 0; i < bufferLengthAlt; i++) {
					barHeight = dataArrayAlt[i];

					this.canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
					this.canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

					x += barWidth + 1;
				}
			};

			drawAlt();

		} else {
			this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
			this.canvasCtx.fillStyle = 'red';
			this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
		}

	}

}