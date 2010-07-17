var dice = [
    'PCHOAS', 'OATTOW', 'LRYTTE', 'VTHRWE', 'EGHWNE', 'SEOTIS', 'ANAEEG',
    'IDSYTT', 'MTOICU', 'AFPKFS', 'XLDERI', 'ENSIEU', 'YLDEVR', 'ZNRNHL',
    'NMIQHU', 'OBBAOJ'
];

var cells = [];


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
  var isValid = check(input.value.toUpperCase(), cells);
  if (isValid) {
    input.className = 'valid';
  } else {
    input.className = 'invalid';
  }
  // handle submission
  if (window.event && window.event.keyCode == 13 && isValid) {
    var word = document.createElement('div');
    word.appendChild(document.createTextNode(input.value));
    document.getElementById('words').appendChild(word);
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


window.onload = function () {
  var field = new Field();
};

