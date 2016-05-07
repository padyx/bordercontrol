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

You should have received a copy of the GNU General Public License
along with Bordercontrol.  If not, see <http://www.gnu.org/licenses/>.
*/

var currentUrl;

// Reads storage and decorates the page
function urlChanged() {
  var location = document.location.href;

  // Use default value storage with empty entries array
  chrome.storage.sync.get({
    entries:[]
  }, function(items) {
    updateDecoration(items, location);
  });
}

function updateDecoration(optionObject, location){
  var entries = optionObject.entries;

  for (i=0; i<entries.length; i++){
    var e = entries[i];
    var pattern = e.pattern;
    var color = e.color;
    var thickness = e.thickness;

    var matches = false;
    matches = matches || location.startsWith(pattern);
    try {
     var regex = new RegExp(pattern);
     matches = matches || regex.test(location);
    } catch(e) {}
    if (matches) {
      decorate(color, thickness);
      return;
    }
  }

}

function decorate(color, thickness){
  var container = document.createElement("div");
  var idAttr = document.createAttribute("id");
  idAttr.value=chrome.runtime.id;
  container.setAttributeNode(idAttr);
  var styleAttr = document.createAttribute("style");

  styleAttr.value="position:fixed; z-index:2147483647; pointer-events:none; top:0; left:0; right:0; bottom:0; "
      +"border: "+thickness+"px "+color+" solid;";
  container.setAttributeNode(styleAttr);

  if (document.body.children.length > 0){
    document.body.insertBefore(container, document.body.children[0])
  } else {
  document.body.appendChild(container);
  }
}

urlChanged()
