var seconds = 180;
var cells = [];
var dice = [
    'PCHOAS', 'OATTOW', 'LRYTTE', 'VTHRWE', 'EGHWNE', 'SEOTIS', 'ANAEEG',
    'IDSYTT', 'MTOICU', 'AFPKFS', 'XLDERI', 'ENSIEU', 'YLDEVR', 'ZNRNHL',
    'NMIQHU', 'OBBAOJ'
];


function Field() {
  this.range = 4;
  this.table = document.getElementById('field');
  // handle letters
  for (var row = 0; row < this.range; row++) {
    for (var col = 0; col < this.range; col++) {
      var die = dice.pop(Math.floor(Math.random()*dice.length));
      var side = die[Math.floor(Math.random()*6)];
      this.putLetter(row, col, side);
    }
  }
  // handle neighbors
  for (var row = 0; row < this.range; row++) {
    for (var col = 0; col < this.range; col++) {
      var cell = this.table.rows[row].cells[col];
      cell.neighbors = [];
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


Field.prototype.getLetter = function (row, col) {
  return this.table.rows[row].cells[col].innerHTML;
};


Field.prototype.putLetter = function (row, col, letter) {
  this.table.rows[row].cells[col].innerHTML = letter;
};


function handleInput(input) {
  // unselect all cells
  for (var i = 0; i < cells.length; i++) {
    cells[i].className = null;
  }
  // validate
  var isValid = check(input.value.toUpperCase(), cells) && input.value.length >= 3;
  if (isValid) {
    input.className = 'valid';
  } else {
    input.className = 'invalid';
  }
  // handle submission
  if (window.event && window.event.keyCode == 13 && isValid) {
    var word = document.createTextNode(input.value);
    var button = document.createElement('button');
    button.innerHTML = '&times;';
    button.onclick = function () {
      var child = this.parentNode.parentNode;
      child.parentNode.removeChild(child);
    };
    var words = document.getElementById('words');
    var row = 1;
    words.insertRow(row);
    words.rows[row].insertCell(0);
    words.rows[row].insertCell(1);
    words.rows[row].cells[0].appendChild(word);
    words.rows[row].cells[1].appendChild(button);
    input.value = '';
  }
}


function check(word, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].innerHTML == word[0] && list[i].className != 'selected') {
      list[i].className = 'selected';
      if (word.length == 1) {
        list[i].className = 'infocus';
        return true;
      } else if (check(word.slice(1), list[i].neighbors)) {
        return true;
      } else {
        list[i].className = null;
      }
    }
  }
  return false;
}


function displayTime() {
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  var time = document.getElementById('time');
  time.innerHTML = mins + (secs < 10 ? ':0' : ':') + secs;
}


function gameOver() {
  document.getElementById('input').disabled = true;
  var words = document.getElementById('words');
  for (var i = 1; i < words.rows.length; i++) {
    var word = words.rows[i].cells[0].innerHTML.toLowerCase();
    var score = 0
    if (dict.indexOf(word) >= 0) {
      score = word.length;
    }
    words.rows[i].cells[1].innerHTML = score;
  }
}


window.onload = function () {
  var field = new Field();
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

