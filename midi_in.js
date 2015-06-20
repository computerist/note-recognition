// TODO: do this in a way that sucks less
var noteMap = {
  36 : {'note' : 'c', 'octave' : 2},
  38 : {'note' : 'd', 'octave' : 2},
  40 : {'note' : 'e', 'octave' : 2},
  41 : {'note' : 'f', 'octave' : 2},
  43 : {'note' : 'g', 'octave' : 2},
  45 : {'note' : 'a', 'octave' : 2},
  47 : {'note' : 'b', 'octave' : 2},
  48 : {'note' : 'c', 'octave' : 3},
  50 : {'note' : 'd', 'octave' : 3},
  52 : {'note' : 'e', 'octave' : 3},
  53 : {'note' : 'f', 'octave' : 3},
  55 : {'note' : 'g', 'octave' : 3},
  57 : {'note' : 'a', 'octave' : 3},
  59 : {'note' : 'b', 'octave' : 3},
  60 : {'note' : 'c', 'octave' : 4},
  62 : {'note' : 'd', 'octave' : 4},
  64 : {'note' : 'e', 'octave' : 4},
  65 : {'note' : 'f', 'octave' : 4},
  67 : {'note' : 'g', 'octave' : 4},
  69 : {'note' : 'a', 'octave' : 4},
  71 : {'note' : 'b', 'octave' : 4},
  72 : {'note' : 'c', 'octave' : 5},
  74 : {'note' : 'd', 'octave' : 5},
  76 : {'note' : 'e', 'octave' : 5},
  77 : {'note' : 'f', 'octave' : 5},
  79 : {'note' : 'g', 'octave' : 5},
  81 : {'note' : 'a', 'octave' : 5},
  83 : {'note' : 'b', 'octave' : 5},
}

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
  midiAccess.onstatechange = hookUpMIDIInput;
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
  var conversion = noteMap[event.data[1]];
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

