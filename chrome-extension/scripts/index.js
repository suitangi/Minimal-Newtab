function checkMin(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function checkHour(i){
  i = i % 12;
  if(i == 0)
    i = 12;
  return i;
}
function militaryF(){
  window.military = !window.military;
  if(window.military)
    chrome.storage.local.set({military_switch: 'on'}, function() {});
  else
    chrome.storage.local.set({military_switch: 'off'}, function() {});
  startTime();
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    // add a zero in front of numbers<10
    m = checkMin(m);
    var pa = "";
    if(!window.military){
      if(h > 11)
        pa = " PM"
      else
        pa = " AM"
    }
    if(!window.military)
      h = checkHour(h);
    document.getElementById('time').innerHTML = h + ":" + m;
    document.getElementById("pa").innerHTML = pa;
    t = setTimeout(function () {
        startTime()
    }, 1000);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if(elmnt.id == "timeWrapper"){
    document.getElementById("time").onmousedown = dragMouseDown;
  }
  if(elmnt.id == "searchWrapper")
    document.getElementById("searchDiv").onmousedown = dragMouseDown;
  if(elmnt.id == "todoWrapper")
    document.getElementById("todoDiv").onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    if(!window.dragged)
      window.dragged = true;

  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    if(window.dragged){
      window.dragged = false;
      if(elmnt.id == "timeWrapper"){
        document.getElementById("time").cursor = "move";
        chrome.storage.local.set({time_top_data: elmnt.style.top}, function() {});
        chrome.storage.local.set({time_left_data: elmnt.style.left}, function() {});
        window.military = !window.military;
      }
      if(elmnt.id == "searchWrapper"){
        chrome.storage.local.set({search_top_data: elmnt.style.top}, function() {});
        chrome.storage.local.set({search_left_data: elmnt.style.left}, function() {});
      }
      if(elmnt.id == "todoWrapper"){
        chrome.storage.local.set({todo_top_data: elmnt.style.top}, function() {});
        chrome.storage.local.set({todo_left_data: elmnt.style.left}, function() {});
      }
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function updateSearch(){
  if(document.getElementById("searchSwitch").checked){
    document.getElementById("searchSwitch").checked = false;
    document.getElementById("searchWrapper").style.visibility = "hidden";
    chrome.storage.local.set({search_switch: "off"}, function() {});
  }
  else{
    document.getElementById("searchSwitch").checked = true;
    document.getElementById("searchWrapper").style.visibility = "visible";
    chrome.storage.local.set({search_switch: "on"}, function() {});
  }
}

function updateTime(){
  if(document.getElementById("timeSwitch").checked){
    document.getElementById("timeSwitch").checked = false;
    document.getElementById("timeWrapper").style.visibility = "hidden";
    chrome.storage.local.set({time_switch: "off"}, function() {});
  }
  else{
    document.getElementById("timeSwitch").checked = true;
    document.getElementById("timeWrapper").style.visibility = "visible";
    chrome.storage.local.set({time_switch: "on"}, function() {});
  }
}

function updateDark(){
  if(document.getElementById("darkSwitch").checked){
    document.getElementById("darkSwitch").checked = false;
    document.getElementById("backloader").style.filter = "none";
    chrome.storage.local.set({dark_switch: "off"}, function() {});
  }
  else{
    document.getElementById("darkSwitch").checked = true;
    document.getElementById("backloader").style.filter = "brightness(0.6)";
    chrome.storage.local.set({dark_switch: "on"}, function() {});
  }
}
function updateDesa(){
  if(document.getElementById("desaSwitch").checked){
    document.getElementById("desaSwitch").checked = false;
    document.getElementById("desaFilter").style.filter = "none";
    chrome.storage.local.set({desa_switch: "off"}, function() {});
  }
  else{
    document.getElementById("desaSwitch").checked = true;
    document.getElementById("desaFilter").style.filter = "saturate(0.6)";
    chrome.storage.local.set({desa_switch: "on"}, function() {});
  }
}

function updateTodo(){
  if(document.getElementById("todoSwitch").checked){
    document.getElementById("todoSwitch").checked = false;
    document.getElementById("todoWrapper").style.visibility = "hidden";
    chrome.storage.local.set({todo_switch: "off"}, function() {});
  }
  else{
    document.getElementById("todoSwitch").checked = true;
    document.getElementById("todoWrapper").style.visibility = "visible";
    chrome.storage.local.set({todo_switch: "on"}, function() {});
  }
}

function loadBackground(){
  var imn = Math.floor(Math.random() * window.vidlist.length);
  var vid = document.getElementById("backdrop");
  vid.src = window.vidlist[imn];
  vid.load();

}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue != '') {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  var close = document.getElementsByClassName("close");
  for (i = 0; i < close.length; i++) {
    close[i].addEventListener('click', function() {
      var div = this.parentElement;
      div.parentNode.removeChild(div);
      var lilist = document.getElementsByTagName("LI");
      var store = "";
      for (i = 0; i < lilist.length; i++){
        if(lilist[i].classList.contains('checked'))
          store += "☑" + lilist[i].innerText.trim();
        else
          store += lilist[i].innerText.trim();
      }
      console.log(store);
      chrome.storage.local.set({todo_data: store}, function() {});
    });
  }
  var lilist = document.getElementsByTagName("LI");
  var store = "";
  for (i = 0; i < lilist.length; i++){
    // if(i == lilist.length - 1)
      store += lilist[i].innerText.trim();
  }
  console.log(store);
  chrome.storage.local.set({todo_data: store}, function() {});
}

$(document).ready(function() {
  startTime();

  var url = chrome.extension.getURL("backgroundList.txt");
    fetch(url)
    .then(function(response) {
        return response.text();
    }).then(function(myText) {
      window.vidlist = myText.split(", ");
      console.log(window.vidlist);
      loadBackground();
    });
  document.addEventListener('contextmenu', event => event.preventDefault());
  window.military = false;
  var inputs = document.getElementsByTagName("input");
  // Make the DIV element draggable:
  dragElement(document.getElementById("timeWrapper"));
  dragElement(document.getElementById("searchWrapper"));
  dragElement(document.getElementById("todoWrapper"));
  chrome.storage.local.get({military_switch: 'off'}, function(data) {
          window.military = (data.military_switch == 'on');
          if(data.military_switch == 'on'){
            startTime();
          }
        });
  chrome.storage.local.get({time_top_data: ''}, function(data) {
        if(data.time_top_data != ''){
          document.getElementById("timeWrapper").style.top = data.time_top_data;
        }
  });
  chrome.storage.local.get({time_left_data: ''}, function(data) {
        if(data.time_left_data != ''){
          document.getElementById("timeWrapper").style.left = data.time_left_data;
        }
  });
  chrome.storage.local.get({search_top_data: ''}, function(data) {
        if(data.search_top_data != ''){
          document.getElementById("searchWrapper").style.top = data.search_top_data;
        }
  });
  chrome.storage.local.get({search_left_data: ''}, function(data) {
        if(data.search_left_data != ''){
          document.getElementById("searchWrapper").style.left = data.search_left_data;
        }
  });
  chrome.storage.local.get({search_switch: 'on'}, function(data) {
        if(data.search_switch == 'off'){
          document.getElementById("searchSwitch").checked = false;
          document.getElementById("searchWrapper").style.visibility = "hidden";
        }
  });
  chrome.storage.local.get({time_switch: 'on'}, function(data) {
        if(data.time_switch == 'off'){
          document.getElementById("timeSwitch").checked = false;
          document.getElementById("timeWrapper").style.visibility = "hidden";
        }
  });
  chrome.storage.local.get({dark_switch: 'on'}, function(data) {
        if(data.dark_switch == 'off'){
          document.getElementById("darkSwitch").checked = false;
          document.getElementById("backloader").style.filter = "none";
        }
  });
  chrome.storage.local.get({desa_switch: 'off'}, function(data) {
        if(data.desa_switch == 'on'){
          document.getElementById("desaSwitch").checked = true;
          document.getElementById("desaFilter").style.filter = "saturate(0.6)";
        }
  });

  // todo data loading
  chrome.storage.local.get({todo_top_data: ''}, function(data) {
        if(data.todo_top_data != ''){
          document.getElementById("todoWrapper").style.top = data.todo_top_data;
        }
  });
  chrome.storage.local.get({todo_left_data: ''}, function(data) {
        if(data.todo_left_data != ''){
          document.getElementById("todoWrapper").style.left = data.todo_left_data;
        }
  });
  chrome.storage.local.get({todo_data: ''}, function(data) {
        if(data.todo_data != ''){
          var arr = data.todo_data.split("×");
          for(i = 0; i < arr.length - 1; i++){
            var li = document.createElement("li");
            if(arr[i].indexOf("☑") != -1){
              var t = document.createTextNode(String(arr[i]).slice(1));
              li.appendChild(t);
              li.classList.toggle('checked');
            }
            else{
              var t = document.createTextNode(arr[i]);
              li.appendChild(t);
            }

            document.getElementById("myUL").appendChild(li);

            var span = document.createElement("SPAN");
            var txt = document.createTextNode("\u00D7");
            span.className = "close";
            span.appendChild(txt);
            li.appendChild(span);
            span.addEventListener('click', function() {
                var div = this.parentElement;
                div.parentNode.removeChild(div);
                var lilist = document.getElementsByTagName("LI");
                var store = "";
                for (i = 0; i < lilist.length; i++){
                  if(lilist[i].classList.contains('checked'))
                    store += "☑" + lilist[i].innerText.trim();
                  else
                    store += lilist[i].innerText.trim();
                }
                chrome.storage.local.set({todo_data: store}, function() {});
              });
          }
        }
  });
  chrome.storage.local.get({todo_switch: 'on'}, function(data) {
        if(data.todo_switch == 'off'){
          document.getElementById("todoSwitch").checked = false;
          document.getElementById("todoWrapper").style.visibility = "hidden";
        }
  });

  document.getElementById("searchSwitch").parentElement.addEventListener('click', function(){
    updateSearch();
  });
  document.getElementById("timeSwitch").parentElement.addEventListener('click', function(){
    updateTime();
  });
  document.getElementById("darkSwitch").parentElement.addEventListener('click', function(){
    updateDark();
  });
  document.getElementById("desaSwitch").parentElement.addEventListener('click', function(){
    updateDesa();
  });
  document.getElementById("todoSwitch").parentElement.addEventListener('click', function(){
    updateTodo();
  });
  for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = inputs[i].getAttribute('data-placeholder');
      inputs[i].addEventListener('focus', function() {
          if (this.value == this.getAttribute('data-placeholder')) {
              this.value = '';
          }
      });
      inputs[i].addEventListener('blur', function() {
          if (this.value == '') {
              this.value = this.getAttribute('data-placeholder');
          }
      });
  }
  var times = document.getElementById("time");
  times.addEventListener("click", function(){
      militaryF();
  });


  // Add a "checked" symbol when clicking on a list item
  var list = document.querySelector('ul');
  list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
      var lilist = document.getElementsByTagName("LI");
      var store = "";
      for (i = 0; i < lilist.length; i++){
        if(lilist[i].classList.contains('checked'))
          store += "☑" + lilist[i].innerText.trim();
        else
          store += lilist[i].innerText.trim();
      }
      chrome.storage.local.set({todo_data: store}, function() {});
    }
  }, false);

  $(".todoInput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        newElement();
    }
  });
});
