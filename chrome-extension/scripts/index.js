//formats the minute
function checkMin(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

//formats the hour for standard (12hr) time
function checkHour(i) {
  i = i % 12;
  if (i == 0)
    i = 12;
  return i;
}

//starts the time
function startTime() {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  // add a zero in front of numbers<10
  m = checkMin(m);
  let pa = "";

  //sets PM and AM if not in military
  if (!window.military) {
    if (h > 11)
      pa = " PM"
    else
      pa = " AM"
  }
  if (!window.military)
    h = checkHour(h);

  // display the time
  document.getElementById('time').innerHTML = h + ":" + m;
  document.getElementById("pa").innerHTML = pa;

  //calls self every 1.2 seconds to update the time
  t = setTimeout(function() {
    startTime()
  }, 1200);
}

//sets the element to be draggable (customized for time, search bar, todo list)
function dragElement(elmnt) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  //depends on which element it is, different place to click
  if (elmnt.id == "timeWrapper")
    document.getElementById("time").onmousedown = dragMouseDown;
  if (elmnt.id == "searchWrapper")
    document.getElementById("searchDiv").onmousedown = dragMouseDown;
  if (elmnt.id == "todoWrapper")
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

  //when element is dragged
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
    //sets window.dragged to be true to see if an element was moved
    if (!window.dragged)
      window.dragged = true;

  }

  // stop moving when mouse button is released
  function closeDragElement() {
    //reset the dragged to be false
    if (window.dragged) {
      window.dragged = false;

      //saves the current location for the elements
      if (elmnt.id == "timeWrapper") {
        chrome.storage.local.set({
          time_top_data: elmnt.style.top
        }, function() {});
        chrome.storage.local.set({
          time_left_data: elmnt.style.left
        }, function() {});
        window.military = !window.military;
      }
      if (elmnt.id == "searchWrapper") {
        chrome.storage.local.set({
          search_top_data: elmnt.style.top
        }, function() {});
        chrome.storage.local.set({
          search_left_data: elmnt.style.left
        }, function() {});
      }
      if (elmnt.id == "todoWrapper") {
        chrome.storage.local.set({
          todo_top_data: elmnt.style.top
        }, function() {});
        chrome.storage.local.set({
          todo_left_data: elmnt.style.left
        }, function() {});
      }
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//toggles military time (24hr)
function updateMilitary() {
  window.military = !window.military;
  if (window.military)
    chrome.storage.local.set({
      military_switch: 'on'
    }, function() {});
  else
    chrome.storage.local.set({
      military_switch: 'off'
    }, function() {});
  startTime();
}

//toggles the visibility of the search bar
function updateSearch() {
  document.getElementById("searchWrapper").classList.remove("firstStart");
  if (document.getElementById("searchSwitch").checked) {
    document.getElementById("searchSwitch").checked = false;
    document.getElementById("searchWrapper").classList.add("exit");
    document.getElementById("searchWrapper").classList.remove("entrance");
    chrome.storage.local.set({
      search_switch: "off"
    }, function() {});
  } else {
    document.getElementById("searchSwitch").checked = true;
    document.getElementById("searchWrapper").classList.add("entrance");
    document.getElementById("searchWrapper").classList.remove("exit");
    chrome.storage.local.set({
      search_switch: "on"
    }, function() {});
  }
}

//toggles the visibility of the time display
function updateTime() {
  document.getElementById("timeWrapper").classList.remove("firstStart");
  if (document.getElementById("timeSwitch").checked) {
    document.getElementById("timeSwitch").checked = false;
    document.getElementById("timeWrapper").classList.add("exit");
    document.getElementById("timeWrapper").classList.remove("entrance");
    chrome.storage.local.set({
      time_switch: "off"
    }, function() {});
  } else {
    document.getElementById("timeSwitch").checked = true;
    document.getElementById("timeWrapper").classList.add("entrance");
    document.getElementById("timeWrapper").classList.remove("exit");
    chrome.storage.local.set({
      time_switch: "on"
    }, function() {});
  }
}

//toggles the darken filter of the background
function updateDark() {
  if (document.getElementById("darkSwitch").checked) {
    document.getElementById("darkSwitch").checked = false;
    document.getElementById("backloader").style.filter = "none";
    chrome.storage.local.set({
      dark_switch: "off"
    }, function() {});
  } else {
    document.getElementById("darkSwitch").checked = true;
    document.getElementById("backloader").style.filter = "brightness(0.65)";
    chrome.storage.local.set({
      dark_switch: "on"
    }, function() {});
  }
}

//toggles the desaturate filter of the background
function updateDesa() {
  if (document.getElementById("desaSwitch").checked) {
    document.getElementById("desaSwitch").checked = false;
    document.getElementById("desaFilter").style.filter = "none";
    chrome.storage.local.set({
      desa_switch: "off"
    }, function() {});
  } else {
    document.getElementById("desaSwitch").checked = true;
    document.getElementById("desaFilter").style.filter = "saturate(0.5)";
    chrome.storage.local.set({
      desa_switch: "on"
    }, function() {});
  }
}

//toggles the visibility of the todo list
function updateTodo() {
  document.getElementById("todoWrapper").classList.remove("firstStart");
  if (document.getElementById("todoSwitch").checked) {
    document.getElementById("todoSwitch").checked = false;
    document.getElementById("todoWrapper").classList.add("exit");
    document.getElementById("todoWrapper").classList.remove("entrance");
    chrome.storage.local.set({
      todo_switch: "off"
    }, function() {});
  } else {
    document.getElementById("todoSwitch").checked = true;
    chrome.storage.local.set({
      todo_switch: "on"
    }, function() {});
    document.getElementById("todoWrapper").classList.add("entrance");
    document.getElementById("todoWrapper").classList.remove("exit");
  }
}

//Todo list: Create a new list item when clicking on the "Add" button
function newElement() {
  let li = document.createElement("li");
  let inputValue = document.getElementById("myInput").value;
  let t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue != '') {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  let close = document.getElementsByClassName("close");
  for (i = 0; i < close.length; i++) {
    close[i].addEventListener('click', function() {
      let div = this.parentElement;
      div.parentNode.removeChild(div);
      let lilist = document.getElementsByTagName("LI");
      let store = "";
      for (i = 0; i < lilist.length; i++) {
        if (lilist[i].classList.contains('checked'))
          store += "☑" + lilist[i].innerText.trim();
        else
          store += lilist[i].innerText.trim();
      }
      console.log(store);
      chrome.storage.local.set({
        todo_data: store
      }, function() {});
    });
  }
  let lilist = document.getElementsByTagName("LI");
  let store = "";
  for (i = 0; i < lilist.length; i++) {
    // if(i == lilist.length - 1)
    store += lilist[i].innerText.trim();
  }
  console.log(store);
  chrome.storage.local.set({
    todo_data: store
  }, function() {});
}

//loads a random background (currently in video form)
function loadBackground() {
  let imn = Math.floor(Math.random() * window.vidlist.length);
  let vid = document.getElementById("backdrop");
  vid.src = window.vidlist[imn];
  vid.load();

}

$(document).ready(function() {

  //loads the list of backgrounds and loads a single one in
  if (window.navigator.onLine) { //if Chrome is online
    let url = chrome.extension.getURL("resources/kimiList.txt");
    fetch(url)
      .then(function(response) {
        return response.text();
      }).then(function(myText) {
        window.vidlist = myText.split(", ");
        console.log(window.vidlist);
        loadBackground();
      });
  } else {
    $.alert({
      title: 'Error',
      content: 'No internet access. Please check your connection and try again.',
      type: 'red',
      boxWidth: '25%',
      backgroundDismiss: true,
      useBootstrap: false,
      typeAnimated: true,
      buttons: {
        Dismiss: function() {}
      }
    });
  }
  startTime(); //start the time

  //add the bookmarks
  chrome.bookmarks.getTree(function(bkList) {
    window.bookmarklist = bkList[0].children[1].children;

    if(window.bookmarklist.length == 0){
      document.getElementById("bookmarks").style = "display: none;"
    }
    else{
      let bkHtml = "";

      //builds the bookmark html
      function recurBkList(bklist) {
        let node = bklist[0]
        while (node != null) {
          if (node.url == null) {
            // console.log(i);
            bkHtml += "<li class=\"bkItem\"><div class=\"folderName\">⮞ " + node.title + "</div><ol class=\"bkFolder hide\" style=\"list-style-type:none;\">";
            if (node.children.length > 0) {
              recurBkList(node.children);
            }
            bkHtml += "</ol></li>";
          } else {
            bkHtml += "<li class=\"bkItem\"><a href=\"" + node.url + "\" title=\"" + node.url + "\">" + node.title + "</a></li>";
          }
          node = bklist[node.index + 1];
        }
      }

      recurBkList(window.bookmarklist);
      document.getElementById("bkList").innerHTML = bkHtml;

      folderList = document.getElementsByClassName("folderName");
      for (i = 0; i < folderList.length; i++) {
        folderList[i].onclick = function(){
          this.nextElementSibling.classList.toggle("hide");
          this.innerText = this.innerText.replace("⮟", ">");
          this.innerText = this.innerText.replace("⮞", "⮟");
          this.innerText = this.innerText.replace(">", "⮞");
        };
      }
    }
  });

  //add onclick for resetButton
  document.getElementById("resetButton").onclick = function() {
    $.confirm({
      title: '',
      content: 'Are you sure you want to reset? Doing so will reset all data including saved widgets locations and preferences. It will not delete your bookmarks.',
      boxWidth: '25%',
      useBootstrap: false,
      type: 'blue',
      escapeKey: 'cancel',
      buttons: {
        ok: {
          text: "I understand, reset",
          btnClass: 'btn-blue',
          keys: ['enter'],
          action: function() {
            chrome.storage.local.clear(function() {
              location.reload();
            });
          }
        },
        cancel: function() {}
      }
    });
  };

  //prevent right click context menu
  document.addEventListener('contextmenu', event => event.preventDefault());

  window.military = false; //set default time and initialize variable

  // Make the elements draggable:
  dragElement(document.getElementById("timeWrapper"));
  dragElement(document.getElementById("searchWrapper"));
  dragElement(document.getElementById("todoWrapper"));

  //data/settings loading from chrome
  chrome.storage.local.get({
    military_switch: 'off'
  }, function(data) {
    window.military = (data.military_switch == 'on');
    if (data.military_switch == 'on') {
      startTime();
    }
  });
  chrome.storage.local.get({
    time_top_data: ''
  }, function(data) {
    if (data.time_top_data != '') {
      document.getElementById("timeWrapper").style.top = data.time_top_data;
      console.log(data.time_top_data);
    }
  });
  chrome.storage.local.get({
    time_left_data: ''
  }, function(data) {
    if (data.time_left_data != '') {
      document.getElementById("timeWrapper").style.left = data.time_left_data;
    }
  });
  chrome.storage.local.get({
    search_top_data: ''
  }, function(data) {
    if (data.search_top_data != '') {
      document.getElementById("searchWrapper").style.top = data.search_top_data;
    }
  });
  chrome.storage.local.get({
    search_left_data: ''
  }, function(data) {
    if (data.search_left_data != '') {
      document.getElementById("searchWrapper").style.left = data.search_left_data;
    }
  });
  chrome.storage.local.get({
    search_switch: 'on'
  }, function(data) {
    if (data.search_switch == 'off') {
      document.getElementById("searchSwitch").checked = false;
      document.getElementById("searchWrapper").classList.add("exit");
      document.getElementById("searchWrapper").classList.add("firstStart");
    } else {
      document.getElementById("searchSwitch").checked = true;
      document.getElementById("searchWrapper").classList.add("entrance");
    }
  });
  chrome.storage.local.get({
    time_switch: 'on'
  }, function(data) {
    if (data.time_switch == 'off') {
      document.getElementById("timeSwitch").checked = false;
      document.getElementById("timeWrapper").classList.add("exit");
      document.getElementById("timeWrapper").classList.add("firstStart");
    } else {
      document.getElementById("timeSwitch").checked = true;
      document.getElementById("timeWrapper").classList.add("entrance");
    }
  });
  chrome.storage.local.get({
    dark_switch: 'on'
  }, function(data) {
    if (data.dark_switch == 'off') {
      document.getElementById("darkSwitch").checked = false;
      document.getElementById("backloader").style.filter = "none";
    }
  });
  chrome.storage.local.get({
    desa_switch: 'off'
  }, function(data) {
    if (data.desa_switch == 'on') {
      document.getElementById("desaSwitch").checked = true;
      document.getElementById("desaFilter").style.filter = "saturate(0.6)";
    }
  });

  // todo data loading
  chrome.storage.local.get({
    todo_top_data: ''
  }, function(data) {
    if (data.todo_top_data != '') {
      document.getElementById("todoWrapper").style.top = data.todo_top_data;
    }
  });
  chrome.storage.local.get({
    todo_left_data: ''
  }, function(data) {
    if (data.todo_left_data != '') {
      document.getElementById("todoWrapper").style.left = data.todo_left_data;
    }
  });
  chrome.storage.local.get({
    todo_data: ''
  }, function(data) {
    if (data.todo_data != '') {
      let arr = data.todo_data.split("×");
      for (i = 0; i < arr.length - 1; i++) {
        let li = document.createElement("li");
        if (arr[i].indexOf("☑") != -1) {
          let t = document.createTextNode(String(arr[i]).slice(1));
          li.appendChild(t);
          li.classList.toggle('checked');
        } else {
          let t = document.createTextNode(arr[i]);
          li.appendChild(t);
        }

        document.getElementById("myUL").appendChild(li);

        let span = document.createElement("SPAN");
        let txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);
        span.addEventListener('click', function() {
          let div = this.parentElement;
          div.parentNode.removeChild(div);
          let lilist = document.getElementsByTagName("LI");
          let store = "";
          for (i = 0; i < lilist.length; i++) {
            if (lilist[i].classList.contains('checked'))
              store += "☑" + lilist[i].innerText.trim();
            else
              store += lilist[i].innerText.trim();
          }
          chrome.storage.local.set({
            todo_data: store
          }, function() {});
        });
      }
    }
  });
  chrome.storage.local.get({
    todo_switch: 'on'
  }, function(data) {
    if (data.todo_switch == 'off') {
      document.getElementById("todoSwitch").checked = false;
      document.getElementById("todoWrapper").classList.add("exit");
      document.getElementById("todoWrapper").classList.add("firstStart");
    } else {
      document.getElementById("todoSwitch").checked = true;
      document.getElementById("todoWrapper").classList.add("entrance");
    }
  });

  //setting the switches click event listeners
  document.getElementById("searchSwitch").parentElement.addEventListener('click', function() {
    updateSearch();
  });
  document.getElementById("timeSwitch").parentElement.addEventListener('click', function() {
    updateTime();
  });
  document.getElementById("darkSwitch").parentElement.addEventListener('click', function() {
    updateDark();
  });
  document.getElementById("desaSwitch").parentElement.addEventListener('click', function() {
    updateDesa();
  });
  document.getElementById("todoSwitch").parentElement.addEventListener('click', function() {
    updateTodo();
  });
  document.getElementById("time").addEventListener("click", function() {
    updateMilitary();
  });

  //sets the to do list inputs
  let inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
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

  //setting the click event to cross off items on the todo list
  let list = document.querySelector('ul');
  list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
      let lilist = document.getElementsByTagName("LI");
      let store = "";
      for (i = 0; i < lilist.length; i++) {
        if (lilist[i].classList.contains('checked'))
          store += "☑" + lilist[i].innerText.trim();
        else
          store += lilist[i].innerText.trim();
      }
      chrome.storage.local.set({
        todo_data: store
      }, function() {});
    }
  }, false);

  //when you press enter it pushes to the todo list
  $(".todoInput").on('keyup', function(e) {
    if (e.keyCode == 13) {
      newElement();
    }
  });
});
