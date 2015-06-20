var stave;
var game;

var clefs = {
  treble : {
    name : "treble",
    letters :['c','d','e','f','g','a','b'],
    octaves : [4,5]
  },
  bass : {
    name : "bass",
    letters :['c','d','e','f','g','a','b'],
    octaves : [2,3]
  }
}

function Note(letter, octave, clef){
  this.letter = letter;
  this.octave = octave;
  this.clef = clef;
}

Note.prototype.toString = function() {
  return this.letter + "/" + this.octave;
}

function Game() {
  this.settingsVisible = true;
  this.clefs = [clefs.treble];
  var keyPressed = function (evt) {
    //console.log(evt);
    this.checkKey(evt);
  };
  document.addEventListener('keypress', keyPressed.bind(this), false);

  var valueChanged = function(evt) {
    console.log(evt.target.name + " " + evt.target.value);
    var value = evt.target.value;
    switch (value) {
    case "treble":
      this.clefs = [clefs.treble];
      break;
    case "mixed":
      this.clefs = [clefs.treble, clefs.bass];
      break;
    case "bass":
      this.clefs = [clefs.bass];
      break;
    }
    this.play();
  }

  var elements = ["treble", "bass", "mixed"];
  for (elementIdx in elements){
    var elementName = elements[elementIdx];
    var element = document.getElementById(elementName);
    element.addEventListener('change', valueChanged.bind(this), false);
  }

  var show_settings = document.getElementById("show_settings");
  show_settings.addEventListener("click",function(){
    var settings = document.getElementById("settings");
    this.settingsVisible = !this.settingsVisible;
    settings.style.display = this.settingsVisible ? 'inline' : 'none';
    show_settings.textContent = this.settingsVisible ? "[-]" : "[+]";
  }.bind(this), false);
}

Game.prototype.randomNote = function() {
  var clef = this.clefs[Math.floor(Math.random() * this.clefs.length)];
  var letters = clef.letters;
  var octaves = clef.octaves;
  var noteName = letters[Math.floor(Math.random() * letters.length)];
  var octave = octaves[Math.floor(Math.random() * octaves.length)];
  var note = new Note(noteName, octave, clef);
  console.log("making random note - note is "+note.toString());
  return note;
}

Game.prototype.checkMidi = function(conversion) {
  if (this.currentNote.letter == conversion.note &&
      this.currentNote.octave == conversion.octave) {
    this.showMessage('yay');
    this.play();
  } else {
    this.showMessage('boo!');
  }
}

Game.prototype.checkKey = function(evt) {
  console.log("Key pressed!");
  console.log(evt.key);


  var keynum;

  if (window.event) {
    keynum = evt.keyCode;
  } else {
    if (evt.which) {
      keynum = evt.which;
    }
  }
  var key = String.fromCharCode(keynum);

  if(key.toLowerCase() == this.currentNote.letter) {
    this.showMessage('yay!');
    this.play();
  } else {
    this.showMessage('boo!');
  }
};

Game.prototype.showMessage = function(message) {
  var div = document.getElementById('message');
  div.textContent = message;
  setTimeout(function(){div.textContent = ''},1000);
};

Game.prototype.drawStaff = function() {
  console.log("Draw staff for "+this.currentNote);
  this.canvas = document.getElementById("stave-canvas");

  var renderer = new Vex.Flow.Renderer(this.canvas,
      Vex.Flow.Renderer.Backends.CANVAS);

  this.ctx = renderer.getContext();
  stave = new Vex.Flow.Stave(10, 0, 130);
  stave.addClef(this.currentNote.clef.name).setContext(this.ctx).draw();

  var notes = [
    new Vex.Flow.StaveNote({clef:this.currentNote.clef.name, keys: [this.currentNote.toString()], duration: "1" }),
  ];

  // Helper function to justify and draw a 4/4 voice
  Vex.Flow.Formatter.FormatAndDraw(this.ctx, stave, notes);
};

Game.prototype.play = function() {
  if(this.ctx) {
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
  }
  this.currentNote = this.randomNote();
  this.drawStaff();
}

window.addEventListener('load', function() {
  game = new Game();
  game.play();
  midiListeners[midiListeners.length] = game.checkMidi.bind(game);
}, false);
