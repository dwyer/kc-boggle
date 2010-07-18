var seconds = 180;
var words = [];
var cells = [];
var dice = [
    'PCHOAS', 'OATTOW', 'LRYTTE', 'VTHRWE', 'EGHWNE', 'SEOTIS', 'ANAEEG',
    'IDSYTT', 'MTOICU', 'AFPKFS', 'XLDERI', 'ENSIEU', 'YLDEVR', 'ZNRNHL',
    'NMIQHU', 'OBBAOJ'
];


/**
 * Shuffles the contents of an Array.
 */
Array.prototype.shuffle = function () {
  for (var rnd, tmp, i = this.length; i; rnd = parseInt(Math.random() * i),
      tmp = this[--i], this[i] = this[rnd], this[rnd] = tmp);
};


/**
 * Constructs a Field object.
 */
function Field() {
  this.range = 4;
  this.table = document.getElementById('field');
  // handle letters
  dice.shuffle();
  for (var die = 0; die < dice.length; die++) {
    this.putLetter(Math.floor(die / 4), die % 4,
        dice[die][Math.floor(Math.random() * 6)]);
  }
  // handle neighbors
  for (var row = 0; row < this.range; row++) {
    for (var col = 0; col < this.range; col++) {
      var cell = this.table.rows[row].cells[col];
      cell.neighbors = [];
      cell.focus = function () {
        this.className = 'infocus';
      };
      cell.selected = function (opt_bool) {
        if (typeof opt_bool == 'boolean') this.className = opt_bool ? 'selected' : null;
        return this.className == 'selected';
      };
      for (var i = -1; i <= 1; i++) {
        if (row + i >= 0 && row + i < this.range) {
          for (var j = -1; j <= 1; j++) {
            if (col + j >= 0 && col + j < this.range) {
              if (i != 0 || j != 0) {
                cell.neighbors.push(this.table.rows[row + i].cells[col + j]);
              }
            }
          }
        }
      }
      cells.push(cell);
    }
  }
}


/**
 * Get the letter contained at (row, col) of the Field.
 */
Field.prototype.getLetter = function (row, col) {
  return this.table.rows[row].cells[col].innerHTML;
};


/**
 * Insert a letter at (row, col) of the Field.
 */
Field.prototype.putLetter = function (row, col, letter) {
  this.table.rows[row].cells[col].innerHTML = letter;
};


/**
 * Handles word input and submission.
 */
function handleInput(input) {
  var word = input.value.toLowerCase();
  var isValid = !!word && validateWord(word);
  input.className = isValid ? 'valid' : 'invalid';
  // handle submission
  if (window.event && window.event.keyCode == 13 && isValid) {
    submitWord(word);
    input.value = '';
  }
}


/**
 * Checks to make sure the word is valid and not a duplicate.
 */
function validateWord(word) {
  // deselect all cells before validating letters
  for (var i = 0; i < cells.length; i++) {
    cells[i].className = null;
  }
  return validateLetters(word, cells) && validateSize(word) && words.indexOf(word) == -1;
}


/**
 * Checks to make sure the word makes legal use of the letters provided.
 */
function validateLetters(word, array) {
  for (var i = 0; i < array.length; i++) {
    var cell = array[i];
    if (cell.innerHTML == word[0].toUpperCase() && !cell.selected()) {
      cell.selected(true);
      if (word.length == 1) {
        cell.focus();
        return true;
      } else if (validateLetters(word.slice(1), cell.neighbors)) {
        return true;
      } else {
        cell.selected(false);
      }
    }
  }
  return false;
}


/**
 * Checks to make sure the word is between three and eight characters long.
 * The eight character limited is provided by the included dictionary.
 */
function validateSize(word) {
  return word.length >= 3 && word.length <= 8;
}


/**
 * Submit word.
 */
function submitWord(word) {
  var table = document.getElementById('words');
  var row = table.insertRow(1);
  row.insertCell(0);
  row.insertCell(1);
  row.cells[0].appendChild(document.createTextNode(word));
  row.cells[1].appendChild(createDeleteButton(row));
  words.push(word);
}


/**
 * Create button to delete the given object.
 */
function createDeleteButton(object) {
  var button = document.createElement('button');
  button.innerHTML = '&times;';
  button.onclick = function () {
    object.parentNode.removeChild(object);
  };
  return button;
}


/**
 * Display time left to play.
 */
function displayTime() {
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  var time = document.getElementById('time');
  time.innerHTML = mins + (secs < 10 ? ':0' : ':') + secs;
}


/**
 * Check word against dictionary and determine its worth.
 */
function getScore(word) {
  var score = 0;
  var len = word.length;
  if (len == 3 || len == 4) {
    score = 1;
  } else if (len == 5) {
    score = 2;
  } else if (len == 6) {
    score = 3;
  } else if (len == 7) {
    score = 5;
  } else if (len >= 8) {
    score = 11;
  }
  if (dict.indexOf(word) == -1) {
    score = -score;
  }
  return score;
}


/**
 * Disable user input and determine final score.
 */
function gameOver() {
  document.getElementById('input').disabled = true;
  var words = document.getElementById('words');
  var score = 0;
  for (var i = 1; i < words.rows.length; i++) {
    var word = words.rows[i].cells[0].innerHTML.toLowerCase();
    var points = getScore(word);
    score += points;
    words.rows[i].cells[1].innerHTML = points;
  }
  document.getElementById('score').innerHTML = score;
}


/**
 * Initialize game at load time.
 */
window.onload = function () {
  var field = new Field();
  document.getElementById('input').focus();
  displayTime();
  var id = window.setInterval(function () {
    seconds--;
    displayTime();
    if (seconds == 0) {
      clearInterval(id);
      gameOver();
    }
  }, 1000);
};
