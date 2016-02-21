/*  
This file is part of Bordercontrol, an extension for Google Chrome.

Bordercontrol is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Bordercontrol is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.

// Saves options to chrome.storage.sync.
function save_options() {
  var table = document.getElementById("table");
  var rows =  table.getElementsByTagName("tr");

  var storage = {entries:[]};
  for (i = 0; i<rows.length; i++) {
    var row = rows[i];

    if (['rowTemplate', 'table-header'].indexOf(row.id) >= 0){
      continue;
    }
    var cells = row.getElementsByTagName("td");
    var storageRow = {
      pattern: cells[0].getElementsByTagName("input")[0].value,
      color: cells[1].getElementsByTagName("input")[0].value,
      thickness:cells[2].getElementsByTagName("input")[0].value};

      if(storageRow.pattern.trim()){
        storage.entries.push(storageRow);
      }
  }

  chrome.storage.sync.set(storage, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value storage with empty entries array
  chrome.storage.sync.get({
    entries:[]
  }, function(items) {
    importOptions(items);
  });
}

function importOptions(optionObject){
  var entries = optionObject.entries;
  var table = document.getElementById("table");

  for (i=0; i<entries.length; i++){
    var row = createEmptyRow();
    var cells = row.getElementsByTagName("td");

    cells[0].getElementsByTagName("input")[0].value = optionObject.entries[i].pattern;
    cells[1].getElementsByTagName("input")[0].value = optionObject.entries[i].color;
    cells[2].getElementsByTagName("input")[0].value = optionObject.entries[i].thickness;

    table.getElementsByTagName("tbody")[0].appendChild(row);
  }
}

function addEmptyRow(){
  var row = createEmptyRow();
  var table = document.getElementById("table");
  table.getElementsByTagName("tbody")[0].appendChild(row);
}

function createEmptyRow(){
  var template = document.getElementById("rowTemplate");
  var row =  template.cloneNode(true);
  // Attach event listener to remove button
  var button = row.getElementsByClassName('removeRowButton')[0];
  button.addEventListener('click', removeNodeClicked);
  row.id = null;
  return row;
}

// Helper function to retrieve the closest ancestor that has the specified tag
function findAncestorWithTag (startElement, tag) {
    while ( (startElement = startElement.parentElement)
            && startElement.tagName != tag.toUpperCase());
    return startElement;
}

function removeNodeClicked(evnt){
  // Retrieve event first - need to know which row
  evnt = evnt || window.event;
  var target = evnt.target || evnt.srcElement;
  if(target){
    // Find the actual row
    var row = findAncestorWithTag(target, 'tr');
    if (row){
      row.parentNode.removeChild(row);
    }
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('addRowButton').addEventListener('click', addEmptyRow);
