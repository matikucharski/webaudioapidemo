export default function initMIDI() {
	navigator.requestMIDIAccess()
		.then(onMIDISuccess)
		.catch(err=> {
			console.log('Could not access your MIDI devices.', err);
		});

	function onMIDISuccess(midiAccess) {
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
}

function getMIDIMessage(message) {
	// a velocity value might not be included with a noteOff command
	let [command, note, velocity = 0] = message.data;
	console.log('Command', command);

	switch (command) {
	case 144:	// note on
		if (velocity > 0) {
			noteOn({note, velocity});
		} else {  // note off
			noteOff({note});
		}
		break;
	case 128: // note off
		noteOff({note});
		break;
	}
}

function noteOn({note, velocity}) {
	console.log('%c noteOn:', 'background: #222; color: #bada55', note, velocity);
}

function noteOff({note}) {
	console.log('%c noteOff:', 'background: #222; color: #bada55', note);
}