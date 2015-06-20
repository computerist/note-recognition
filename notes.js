var midiMap = {};

var position_names = [
    ['C'],
    ['C#','Db'],
    ['D'],
    ['D#','Eb'],
    ['E'],
    ['F'],
    ['F#','Gb'],
    ['G'],
    ['G#','Ab'],
    ['A'],
    ['A#','Bb'],
    ['B']
];

for (midi_num = 21; midi_num <= 108; midi_num++) {
  var scale_pos = midi_num % 12;
  var octave = Math.floor(midi_num / 12) - 1;
  var note_names = position_names[scale_pos];
  // TODO: calculate frequency information
  midiMap[midi_num] = {'note':note_names[0],'octave':octave};
}
