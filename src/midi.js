export default function initMIDI(callbacks = {}) {
	navigator.requestMIDIAccess()
		.then(onMIDISuccess)
		.catch(err=> {
			console.log('Could not access your MIDI devices.', err);
		});

	function onMIDISuccess(midiAccess) {
		midiAccess.onstatechange = e=> {
			console.log('%c statechange: ', 'background: #222; color: #bada55', e.port.state);
		};
		console.log('MIDI enabled', midiAccess);
		for (let input of midiAccess.inputs.values()) {
			// console.log('%c inputs: ', 'background: #222; color: #bada55', input);
			input.onmidimessage = getMIDIMessage;
		}
		// for (let input of midiAccess.outputs.values()) {
		// 	console.log('%c outputs: ', 'background: #222; color: #bada55', input);
		// }

		// const inputs = midiAccess.inputs;
		// const outputs = midiAccess.outputs;
	}

	function getMIDIMessage(message) {
		// a velocity value might not be included with a noteOff command
		let [command, note, velocity = 0] = message.data;
		console.log('Command', command);

		switch (command) {
			case 144:	// note on
				if (velocity > 0) {
					(callbacks.noteOn || noteOn)({note, velocity});
				} else {  // note off
					(callbacks.noteOff || noteOff)({note});
				}
				break;
			case 128: // note off
				(callbacks.noteOff || noteOff)({note});
				break;
			case 176:
				(callbacks.potentiometer || potentiometer)({note, velocity});
				break;
			case 191:
				(callbacks.transportButtons || transportButtons)({note, velocity});
				break;
		}
	}

	function transportButtons({note, velocity}) {
		if (note === 116) {
			console.log('%c transportButton stop:', 'background: #222; color: #bada55', velocity);
		} else if (note === 117) {
			console.log('%c transportButton play:', 'background: #222; color: #bada55', velocity);
		}
	}

	function noteOn({note, velocity}) {
		console.log('%c noteOn:', 'background: #222; color: #bada55', note, velocity);
	}

	function noteOff({note}) {
		console.log('%c noteOff:', 'background: #222; color: #bada55', note);
	}

	function potentiometer({note, velocity}) {
		if (note === 1) {
			console.log('%c modWheel:', 'background: #222; color: #bada55', velocity);

		} else if (note === 8) {
			console.log('%c first slider:', 'background: #222; color: #bada55', velocity);
		} else if (note === 23) {
			console.log('%c first knob:', 'background: #222; color: #bada55', velocity);
		}
	}
}