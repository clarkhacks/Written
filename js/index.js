'use strict';

function pasteHtmlAtCaret(html) {
  var sel, range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // only relatively recently standardized and is not supported in
      // some browsers (IE9, for one)
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}

// Upload Image

function encodeImageFileAsURL(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    document.getElementById("docContent").focus();
    pasteHtmlAtCaret('<img src="' + reader.result + '" class="center"/>');
  };
  reader.readAsDataURL(file);
}

function insertHeader() {
  if (window.getSelection) {
    var selection = window.getSelection().getRangeAt(0);
    var selectedText = selection.extractContents();
    var header = document.createElement("h3");
    header.appendChild(selectedText);
    selection.insertNode(header);
  } else {
    document.getElementById("docContent").focus();
    pasteHtmlAtCaret("<h3>Header</h3>");
  }
}
function rightText() {
  document.execCommand("justifyRight");
}
function centerText() {
  document.execCommand("justifyCenter");
}
function leftText() {
  document.execCommand("justifyLeft");
}
function insertBold() {
  document.execCommand("bold");
}
function insertItalic() {
  document.execCommand("italic");
}
function insertCode() {
  document.getElementById("docContent").focus();
  pasteHtmlAtCaret("<pre><code>...</code></pre>");
}
function insertLink() {
  document.getElementById("docContent").focus();
  pasteHtmlAtCaret("<b>INSERTED</b>");
}
function insertImage() {
  document.getElementById("uploadImage").click();
}

(function() {
  if (localStorage.getItem("docExists") == JSON.stringify("true")) {
    load();
    saveData();
  } else {
    localStorage.setItem("docExists", JSON.stringify("true"));
    saveData();
  }
})();

function titleReplace() {
  document.title = document.getElementById("docTitle").textContent;
}

function load() {
  var docTitle = JSON.parse(localStorage.getItem("docTitle")),
      docContent = JSON.parse(localStorage.getItem("docContent"));
  document.getElementById("docTitle").innerHTML = docTitle;
  document.getElementById("docContent").innerHTML = docContent;
}
function saveData() {
  var docTitle = document.getElementById("docTitle").textContent,
      docContent = document.getElementById("docContent").innerHTML,
      docName = docTitle,
      full = [
        docTitle = docTitle,
        docContent = docContent
      ];
  localStorage.setItem("docTitle", JSON.stringify(docTitle));
  localStorage.setItem("docContent", JSON.stringify(docContent));
}
function deleteData() {
  localStorage.clear();
  window.location.href = window.location.href;
}