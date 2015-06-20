var midiListeners = [];

window.addEventListener('load', function() {
  // patch up prefixes
  window.AudioContext=window.AudioContext||window.webkitAudioContext;

  context = new AudioContext();
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then( onSuccess, onError);
  } else {
    console.log("It looks like your browser does not support MIDI")
  }

  console.log("loaded midi bits");
} );

function setupInput() {
  var deviceDetected = false;
  var inputs = midiAccess.inputs.values();
  for (var input = inputs.next();
       input && !input.done;
       input = inputs.next()) {
    input.value.onmidimessage = MIDIEventHandler;
    deviceDetected = true;
  }
}

function onSuccess(midi) {
  console.log("MIDI ready!");
  midiAccess = midi;
  setupInput();
  midiAccess.onstatechange = setupInput;
}

function onError(err) {
  console.log("There was a problem initialising MIDI stuff");
}

function MIDIEventHandler(event) {
  // we don't need the message channel
  var message = event.data[0] & 0xf0;
  var note = event.data[1];
  var velocity = event.data[2];

  if (0x90 == message)  {
    if (0 != velocity) {
      console.log("velocity is " + velocity);
      console.log("note is " + note);

      noteOn(note);
      return;
    }
    // velocity of 0 is a note-off
    noteOff(note);
  }

  if (0x80 == message) {
    noteOff(note);
    return;
  }
}

function noteOn(noteNumber) {
  var conversion = midiMap[event.data[1]];
  if (conversion) {
    // notify listeners of press
    for (i = 0; i < midiListeners.length; i++) {
      // TODO: we need more information than just the 'note'
      midiListeners[i](conversion);
    }
  }
}

function noteOff(noteNumber) {
  // TODO: notify listeners
}

