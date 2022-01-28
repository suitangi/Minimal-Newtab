//Helper: html string to node
function createHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.firstChild;
}

//Helper: for setting the cursor to the end of the editable content
function setEndOfContenteditable(contentEditableElement) {
  var range, selection;
  range = document.createRange(); //Create a range (a range is a like the selection but invisible)
  range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
  range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
  selection = window.getSelection(); //get the selection object (allows you to change selection)
  selection.removeAllRanges(); //remove any selections already made
  try {
    selection.addRange(range); //make the range you have just created the visible selection
  } catch (error) {
    console.error(error);
  }
}

//Helper: insert an element after aanother
function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

//Time: formats the minute
function checkMin(i) {
  return i < 10 ? '0' + i : i;
}

//Time: formats the hour for standard (12hr) time
function checkHour(i) {
  i = i % 12;
  return i == 0 ? 12 : i;
}

//Time: starts the time
function startTime() {

  //clear the timer
  if (window.nextMinute)
    clearTimeout(window.nextMinute);

  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
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
  document.getElementById('time').innerHTML = h + ":" + checkMin(m);
  document.getElementById("pa").innerHTML = pa;

  today = new Date();
  let s = today.getSeconds();
  let ms = today.getMilliseconds();
  let nextM = (60 - s) * 1000 + (1000 - ms);

  //calls changeMinute setting the timeout for when next minute occurs
  window.nextMinute = setTimeout(function() {
    changeMinutes(h, m + 1);
  }, nextM);
}

//Time: updates minutes
function changeMinutes(h, m) {
  if (m % 10 == 0) {
    //sync time (pretty much every 10 minutes)
    startTime();
  } else {
    //change minutes display
    document.getElementById('time').innerHTML = h + ":" + checkMin(m);

    //calls self every minute to update the time
    window.nextMinute = setTimeout(function() {
      changeMinutes(h, m + 1);
    }, 60000);
  }
}

//Widgets: sets the element to be draggable (customized for time, search bar, todo list)
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
  if (elmnt.id == "infoWrapper")
    document.getElementById("info").onmousedown = dragMouseDown;

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
          time_top_data: elmnt.style.top,
          time_left_data: elmnt.style.left
        }, function() {});
        window.military = !window.military;
      }
      if (elmnt.id == "searchWrapper") {
        chrome.storage.local.set({
          search_top_data: elmnt.style.top,
          search_left_data: elmnt.style.left
        }, function() {});
      }
      if (elmnt.id == "todoWrapper") {
        chrome.storage.local.set({
          todo_top_data: elmnt.style.top,
          todo_left_data: elmnt.style.left
        }, function() {});
      }
      if (elmnt.id == "infoWrapper") {
        window.infoMode -= 1;
        chrome.storage.local.set({
          info_top_data: elmnt.style.top,
          info_left_data: elmnt.style.left
        }, function() {});
      }
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//Time: toggles military time (24hr)
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

//Search: toggles the visibility of the search bar
function updateSearch() {

  let searchWrapper = document.getElementById("searchWrapper");
  let searchSwitch = document.getElementById("searchSwitch");

  searchWrapper.classList.remove("firstStart");
  if (searchSwitch.checked) {
    searchSwitch.checked = false;
    searchWrapper.classList.add("exit");
    searchWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      search_switch: "off"
    }, function() {});
  } else {
    searchSwitch.checked = true;
    searchWrapper.classList.add("entrance");
    searchWrapper.classList.remove("exit");
    chrome.storage.local.set({
      search_switch: "on"
    }, function() {});
  }
}

//Search bar: chaanges the search engine
function changeSearch() {
  chrome.storage.local.get({
    search_engine: 0
  }, function(data) {
    let index = data.search_engine + 1;
    if (index == window.searchEngines.length)
      index = 0;
    let searchInput = $('#searchInput');
    searchInput.parent().attr('action', window.searchEngines[index].action);
    console.log(window.searchEngines[index].action);
    let val = (searchInput.val() == searchInput.attr('data-placeholder') ? "" : searchInput.val());
    searchInput.attr('data-placeholder', window.searchEngines[index].placeholder);
    searchInput.val(val);
    searchInput.focus();
    searchInput.blur();
    chrome.storage.local.set({
      search_engine: index
    }, function() {});
  });
}

//Time: toggles the visibility of the time display
function updateTime() {

  let timeWrapper = document.getElementById("timeWrapper");
  let timeSwitch = document.getElementById("timeSwitch");

  timeWrapper.classList.remove("firstStart");
  if (timeSwitch.checked) {
    timeSwitch.checked = false;
    timeWrapper.classList.add("exit");
    timeWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      time_switch: "off"
    }, function() {});
  } else {
    timeSwitch.checked = true;
    timeWrapper.classList.add("entrance");
    timeWrapper.classList.remove("exit");
    chrome.storage.local.set({
      time_switch: "on"
    }, function() {});
  }
}

//Time: toggles the visibility of the info display
function updateinfo() {

  let infoWrapper = document.getElementById("infoWrapper");
  let infoSwitch = document.getElementById("infoSwitch");

  infoWrapper.classList.remove("firstStart");
  if (infoSwitch.checked) {
    infoSwitch.checked = false;
    infoWrapper.classList.add("exit");
    infoWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      info_switch: "off"
    }, function() {});
  } else {
    infoSwitch.checked = true;
    infoWrapper.classList.add("entrance");
    infoWrapper.classList.remove("exit");
    chrome.storage.local.set({
      info_switch: "on"
    }, function() {});
  }
}

//Time: toggles the favorites source of backgrounds
function updateFav() {

  let favSwitch = document.getElementById("favSwitch");
  if (favSwitch.checked) {
    favSwitch.checked = false;
    chrome.storage.local.set({
      fav_switch: "off"
    }, function() {});
  } else {
    chrome.storage.local.get({
      fav_list: []
    }, function(data) {
      //don't let user turn on fav images if they have no fav backgronds
      if (data.fav_list.length == 0) {
        document.getElementById("menu").classList.add("delay");
        $.alert({
          title: 'No Favorites',
          content: 'You don\'t have any favorite backgrounds. To add backgrounds to favorites, scroll down the menu and click the heart when you see a background you like.',
          type: 'red',
          boxWidth: '25%',
          backgroundDismiss: true,
          useBootstrap: false,
          typeAnimated: true,
          buttons: {
            Okay: function() {
              setTimeout(function() {
                document.getElementById("menu").classList.remove("delay")
              }, 250);
            }
          }
        });
      } else {
        favSwitch.checked = true;
        chrome.storage.local.set({
          fav_switch: "on"
        }, function() {});
      }
    });
  }
}

//Todo: toggles the visibility of the todo list
function updateTodo() {

  let todoWrapper = document.getElementById("todoWrapper");
  let todoSwitch = document.getElementById("todoSwitch");

  todoWrapper.classList.remove("firstStart");
  if (todoSwitch.checked) {
    todoSwitch.checked = false;
    todoWrapper.classList.add("exit");
    todoWrapper.classList.remove("entrance");
    chrome.storage.local.set({
      todo_switch: "off"
    }, function() {});
  } else {
    todoSwitch.checked = true;
    todoWrapper.classList.add("entrance");
    todoWrapper.classList.remove("exit");
    chrome.storage.local.set({
      todo_switch: "on"
    }, function() {});
  }
}

//Filters: Updates the filter Effects
function updateFilter() {
  // console.log(document.getElementById("darkSlider").value);
  let darkVal = document.getElementById("darkSlider").value;
  let satuVal = document.getElementById("satuSlider").value;
  let conVal = document.getElementById("conSlider").value;
  let blurVal = document.getElementById("blurSlider").value;
  document.getElementById("backloader").style = "filter: brightness(" + darkVal / 100 + ") " +
    "saturate(" + satuVal / 100 + ") " +
    "contrast(" + conVal / 100 + ") " +
    "blur(" + blurVal / 10 + "px);";
  let arr = [darkVal, satuVal, conVal, blurVal];
  chrome.storage.local.set({
    filter: arr
  }, function() {});
}

//Todo: saves the Todo list to the chrome storage
function saveTodo() {
  let lilist = document.getElementById("myUL").getElementsByTagName("LI");
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

//Todo: Set the list li element listeners
function setLiListeners(li) {
  li.onclick = function() {
    if (document.activeElement == null || !document.activeElement.classList.contains('listText')) {
      $(this).find('.listText').focus();
      setEndOfContenteditable(this.firstChild);
    } else {
      $(this).find('.listText').focus();
    }
    // let li = document.getElementById("myUL").getElementsByTagName("li");
    // for (i = 0; i < li.length; i++) {
    //   if (li[i].innerText == "\u00D7") {
    //     let node = createHTML("<br>");
    //     li[i].insertBefore(node, li[i].firstChild);
    //   }
    // }
    $(this).parent().sortable("disable");
  }
  li.onmousedown = function(evt) {
    if (evt.button === 2) {
      evt.preventDefault();
      window.getSelection().empty();
    }
  }
  li.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
    this.classList.toggle('checked');
    window.getSelection().empty();
    saveTodo();
  });
  li.addEventListener('keyup', (evt) => {
    if (evt.keyCode === 8) {
      if (li.innerText == "\u00D7") {
        evt.preventDefault();
        let node = createHTML("<br>");
        li.firstChild.appendChild(node);
      }
    }
  });
  li.addEventListener('keydown', (evt) => {
    if (evt.which === 13) {
      let li = document.activeElement.parentElement;
      let newLi = newListItem("", false);
      insertAfter(newLi, li);
      document.getElementById("todoInput").style = "display: none;";
      saveTodo();
      li.nextElementSibling.firstChild.focus();
      evt.preventDefault();
    } else if (evt.keyCode === 8) {
      let li = document.activeElement.parentElement;
      if (li.innerText.trim() == "\u00D7") {
        evt.preventDefault();
        let previous = li.previousElementSibling.firstChild;
        if (previous != null) {
          previous.focus();
          setEndOfContenteditable(previous);
        }
        li.parentNode.removeChild(li);
        if (document.getElementById("myUL").getElementsByTagName("li").length == 0)
          document.getElementById("todoInput").style = "";
        saveTodo();
      }
    } else if (evt.keyCode === 38) {
      let previous = li.previousElementSibling.firstChild;
      if (previous != null) {
        previous.focus();
      }
    } else if (evt.keyCode === 40) {
      let next = li.nextElementSibling.firstChild;
      if (next != null) {
        next.focus();
      }
    }
  });
  li.firstChild.addEventListener("blur", function() {
    $(this).parent().parent().sortable("enable");
  }, false);
  li.firstChild.addEventListener("input", function() {
    saveTodo();
  });
}

//Todo: new list item, returns the list item created
function newListItem(text, check) {
  let li = document.createElement("li");
  if (check) {
    li.classList.toggle('checked');
  }
  let t;
  if (text != "") {
    t = document.createTextNode(text);
  } else {
    t = document.createElement("br");
  }
  let txtSpan = document.createElement("span");
  txtSpan.appendChild(t);
  li.appendChild(txtSpan);
  txtSpan.setAttribute("contenteditable", "true");
  txtSpan.setAttribute("spellcheck", "false")
  txtSpan.classList.add('listText');
  document.getElementById("myUL").appendChild(li);
  setLiListeners(li);
  //the spaan is the close button
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  //setting the close click event listener
  span.addEventListener('click', function() {
    let li = this.parentElement;
    if (li.parentElement != null) //click sometimes triggers twice, first one deletes, second one needs to fizzle
      li.parentElement.removeChild(li);
    if (document.getElementById("myUL").getElementsByTagName("li").length == 0)
      document.getElementById("todoInput").style = "";
    saveTodo();
  });
  return li;
}

// adds a background to favorites
function addFav(bg) {
  chrome.storage.local.get({
    fav_list: []
  }, function(data) {
    let list = data.fav_list;
    list.push(bg);
    chrome.storage.local.set({
      fav_list: list
    }, function() {})
  });
}

// remove a background from favorites
function removeFav(bg) {
  chrome.storage.local.get({
    fav_list: []
  }, function(data) {
    let list = data.fav_list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].link == bg.link) {
        list.splice(i, 1);
        i--;
      }
    }
    chrome.storage.local.set({
      fav_list: list
    }, function() {})
  });
}

// add a backgorund to the blacklist
function addBlack(bg) {
  chrome.storage.local.get({
    black_list: []
  }, function(data) {
    let list = data.black_list;
    list.push(bg.link);
    chrome.storage.local.set({
      black_list: list
    }, function() {})
  });
}


// shows the report background dialog
function reportBk() {
  document.getElementById("menu").classList.add("delay");
  $.confirm({
    title: false,
    content: window.report_embed.replace("\\back", encodeURI(JSON.stringify(window.back))),
    boxWidth: '640px',
    useBootstrap: false,
    escapeKey: 'Close',
    buttons: {
      Close: function() {
        setTimeout(function() {
          document.getElementById("menu").classList.remove("delay")
        }, 250);
      }
    }
  });
}

// loads the background information
function loadInfo() {
  if (window.infoDisplay != null) {
    let infoChosen = window.infoDisplay[window.infoMode];
    let infoText = "";
    for (i = 0; i < infoChosen.length; i++) {

      //set the font size
      let size = "font-size: ";
      if (infoChosen[i].size == null) {
        size = "";
      } else if (infoChosen[i].size == "small") {
        size += "calc(8px + .6vw)";
      } else if (infoChosen[i].size == "large") {
        size += "calc(24px + .6vw)";
      } else {
        size += "calc(16px + .6vw)";
      }

      infoText += '<span style="' + size + '; white-space: nowrap;"' + '>' + window.back[infoChosen[i].name] + '</span><br>';
    }
    document.getElementById('info').innerHTML = infoText;
    let infoX = document.getElementById("infoWrapper").offsetLeft;
    let ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (infoX > 3 * ww / 4) {
      $('#info').css('text-align', 'right');
      $('#info').css('transform', 'translate(-100%, 0%)');
    } else if (infoX > ww / 4) {
      $('#info').css('text-align', 'center');
      $('#info').css('transform', 'translate(-50%, 0%)');
    } else {
      $('#info').css('text-align', 'left');
      $('#info').css('transform', 'translate(0%, 0%)');
    }
  } else {
    $('#infoMenuItem').css("display", "none");
    $('#infoWrapper').css("display", "none");
  }
}

//change the background info panel up/down
function updateInfoMode() {
  window.infoMode += 1;
  if (window.infoMode == window.infoDisplay.length) {
    window.infoMode = 0;
  }
  chrome.storage.local.set({
    info_mode: window.infoMode
  }, function() {
    loadInfo();
  });
}

//loads a random background (currently in video form)
function loadBackground(backJson) {
  console.log("Loaded background.json:");
  console.log(backJson.sources);
  window.backlist = [];

  //loads the background info panel data
  window.infoDisplay = backJson.info;
  if (backJson.info_title) {
    infoTitle = backJson.info_title;
    $('#infoMenuText').text(infoTitle);
    $('#infoMenuItem').attr('data', "Toggles the " + infoTitle);
  }

  //loads the support link
  if (backJson.support_link) {
    window.support_link = backJson.support_link;
  } else {
    window.support_link = "https://suitangi.github.io/Minimal-Newtab/";
  }

  //loads the support link
  if (backJson.report_embed) {
    window.report_embed = backJson.report_embed;
  } else {
    window.report_embed = "";
  }

  let vid = document.getElementById("backdropvid");
  let img = document.getElementById("backdropimg");
  if (backJson.type == "video") {
    vid.style = "";
    img.style = "display: none;"
  } else if (backJson.type == "image") {
    img.style = "";
    vid.style = "display: none;"
  }

  backList = backJson.sources;
  let index = 0;
  bkMenu = document.getElementById("backgroundMenu");

  //functional prograamming (recursive but there shouldn't be many calls)
  function loadSource(backList) {
    //end case
    if (index == backList.length) {

      chrome.storage.local.get({
          lastShown: '',
          fav_list: [],
          fav_switch: 'off',
          black_list: []
        },
        function(data) {
          //if none of the sources are selected, use the defualt provided and give warning alert
          if (window.backlist.length == 0 && (data.fav_switch == 'off' || (data.fav_switch == 'on' && data.fav_list.length == 0))) {
            if (backJson.default != null) {
              window.back = backJson.default;
              vid = document.getElementById("backdropvid");
              img = document.getElementById("backdropimg");

              //console logging
              console.log("Favorites:");
              console.log(data.fav_list);
              let str = window.back.link;
              console.log("Defaulted backgorund:");
              console.log(str);

              let fext = str.substring(str.length - 3).toLowerCase();
              if (fext == 'jpg' || fext == 'png' || fext == 'bmp') { //the file type is image
                img.src = str;
                img.style = "";
                img.onload = function() {
                  img.style.opacity = 100;
                  $('#progress-line').css("opacity", "0");
                  //to counteract a bug that makes the background start from Bottom
                  window.scrollTo(0, 0);
                }
                vid.style = "display: none;"
              } else { //file type is video
                img.style = "display: none;"
                vid.style = "";
                vid.oncanplay = function() {
                  vid.style.opacity = 100;
                  $('#progress-line').css("opacity", "0");
                  //to counteract a bug that makes the background start from Bottom
                  window.scrollTo(0, 0);

                };
                //fetch the full video to try to force caching (reduce bandwidth)
                const videoRequest = fetch(str)
                  .then(response => response.blob());
                videoRequest.then(blob => {
                  vid.src = window.URL.createObjectURL(blob);
                });
                vid.load();
              }
              loadInfo();
            }
            $.alert({
              title: 'No Background sources selected',
              content: 'A default background was loaded. Please select a source in the left hand menu, and then refresh the page.',
              type: 'blue',
              boxWidth: '25%',
              backgroundDismiss: true,
              useBootstrap: false,
              typeAnimated: true,
              buttons: {
                Dismiss: function() {
                  chrome.storage.local.set({
                    fav_switch: "off"
                  }, function() {});
                }
              }
            });
          } else { //loading ended: choose a random background

            //adds the favorite list to the list of possible
            if (data.fav_switch == 'on') {
              window.backlist.push(...data.fav_list);
            }

            //if not the specific case that user only wants one faved background
            if (!(data.fav_list.length == 1 && window.backlist.length == 1 && data.fav_list[0].link == data.lastShown)) {
              //then remove the last shown and blacklisted backgrounds from the list
              for (var i = 0; i < window.backlist.length; i++) {
                for (var j = 0; j < data.black_list.length; j++) {
                  if (window.backlist[i] != null && window.backlist[i].link == data.black_list[j]) {
                    window.backlist.splice(i, 1);
                    i--;
                  }
                }
              }
            }

            // problematic user removed all source-selected backgrounds
            if (window.backlist.length == 0) {
              if (backJson.default != null) {
                window.back = backJson.default;
                vid = document.getElementById("backdropvid");
                img = document.getElementById("backdropimg");

                //console logging
                console.log("Favorites:");
                console.log(data.fav_list);
                let str = window.back.link;
                console.log("Defaulted backgorund:");
                console.log(str);
                let fext = str.substring(str.length - 3).toLowerCase();
                if (fext == 'jpg' || fext == 'png' || fext == 'bmp') { //the file type is image
                  img.src = str;
                  img.style = "";
                  img.onload = function() {
                    img.style.opacity = 100;
                    $('#progress-line').css("opacity", "0");
                    //to counteract a bug that makes the background start from Bottom
                    window.scrollTo(0, 0);

                  }
                  vid.style = "display: none;"
                } else { //file type is video
                  img.style = "display: none;"
                  vid.style = "";
                  vid.oncanplay = function() {
                    vid.style.opacity = 100;
                    $('#progress-line').css("opacity", "0");
                    //to counteract a bug that makes the background start from Bottom
                    window.scrollTo(0, 0);

                  };

                  //fetch the full video to try to force caching (reduce bandwidth)
                  const videoRequest = fetch(str)
                    .then(response => response.blob());
                  videoRequest.then(blob => {
                    vid.src = window.URL.createObjectURL(blob);
                  });
                  vid.load();
                }
              }
              $.alert({
                title: 'Too many backgrounds removed',
                content: 'A default background was loaded. You have removed all backgrounds in the sources you selected, you can reset your removed backgrounds or select more background sources.',
                type: 'red',
                boxWidth: '25%',
                backgroundDismiss: true,
                useBootstrap: false,
                typeAnimated: true,
                buttons: {
                  ok: {
                    text: "Reset my removed backgrounds",
                    btnClass: 'btn-red',
                    keys: ['enter'],
                    action: function() {
                      chrome.storage.local.set({
                        black_list: []
                      }, function() {
                        location.reload();
                      });
                    }
                  },
                  cancel: function() {}
                }
              });
              loadInfo();
            } else {
              // remove the last shown if there is more than one
              for (var i = 0; i < window.backlist.length; i++) {
                if (window.backlist[i] != null && window.backlist.length != 1 && window.backlist[i].link == data.lastShown) {
                  window.backlist.splice(i, 1);
                  i--;
                }
              }

              //get the random image number
              let imn = Math.floor(Math.random() * window.backlist.length);
              vid = document.getElementById("backdropvid");
              img = document.getElementById("backdropimg");

              console.log("Favorites:");
              console.log(data.fav_list);
              console.log("Removed:");
              console.log(data.black_list);
              window.back = window.backlist[imn]
              let str = window.back.link;
              console.log("Selected backgorund:");
              console.log(str);
              let fext = str.substring(str.length - 3).toLowerCase();
              if (fext == 'jpg' || fext == 'png' || fext == 'bmp') { //the file type is image
                img.style = "";
                img.onload = function() {
                  img.style.opacity = 100;
                  $('#progress-line').css("opacity", "0");
                  //to counteract a bug that makes the background start from Bottom
                  window.scrollTo(0, 0);

                }
                img.src = str;
                vid.style = "display: none;"
              } else { //file type is video
                img.style = "display: none;"
                vid.style = "";
                vid.oncanplay = function() {
                  vid.style.opacity = 100;
                  $('#progress-line').css("opacity", "0");
                  //to counteract a bug that makes the background start from Bottom
                  window.scrollTo(0, 0);
                };
                //fetch the full video to try to force caching (reduce bandwidth)
                const videoRequest = fetch(str)
                  .then(response => response.blob());
                videoRequest.then(blob => {
                  vid.src = window.URL.createObjectURL(blob);
                });
                vid.load();
              }
              //save the last shown in chrome
              chrome.storage.local.set({
                lastShown: window.backlist[imn].link
              }, function() {});

              //setting the fav switch and like buttons (due to async, they have to be here)
              if (data.fav_switch == 'on' && data.fav_list.length > 0) {
                document.getElementById("favSwitch").checked = true;
              }

              //if the current image is in favorites, make the heart button filled
              for (var i = 0; i < data.fav_list.length; i++) {
                if (data.fav_list[i].link == window.back.link) {
                  $('.like-button').toggleClass('is-active');
                  break;
                }
              }

              //load the background info after the background has been chosen
              loadInfo();
            }
          }
        });
      return;
    } else {
      let name = backList[index].name;

      //build the json object to store data
      obj = {};
      key = name.split(' ').join('-');
      obj[key] = 'on';

      //descriptors shouldn't be more than 34 characters
      let descriptor = "Backgrounds from " + name;
      if (backList[index].description != null) {
        descriptor = backList[index].description;
      }

      //create the backgroundMenu switch and add it to background menu
      var itemNode = createHTML("<div class=\"menuItem\" data=\"" + descriptor + "\"></div>");
      var textNode = createHTML("<div class=\"menuText\">" + name + "</div>");
      var divNode = createHTML("<div class=\"sliderWrapper\"> <label class=\"switch\"> <input type=\"checkbox\" ID=\"" + key + "\" checked> <span class=\"slider round\"></span> </label> </div>");
      itemNode.appendChild(textNode);
      itemNode.appendChild(divNode);
      bkMenu.insertBefore(itemNode, document.getElementById("favoriteSlider"));

      //adding the onClick for the swtiches
      document.getElementById(key).parentElement.onclick = function() {
        checkElement = this.firstElementChild;
        obj = {};
        key = checkElement.id;
        if (checkElement.checked) {
          checkElement.checked = false;
          obj[key] = "off";
          chrome.storage.local.set(obj, function() {});
        } else {
          checkElement.checked = true;
          obj[key] = "on";
          chrome.storage.local.set(obj, function() {});
        }
      }

      //add source to each element of the list
      let toPushList = backList[index].list
      for (i = 0; i < toPushList.length; i++) {
        toPushList[i]["source"] = name;
      }

      //storing and getting data from chrome to see whether it was on or off
      chrome.storage.local.get(obj, function(data) {
        if (data[key] == 'off') {
          document.getElementById(key).checked = false;
        } else {
          window.backlist.push(...toPushList);
        }
        index += 1;
        loadSource(backList);
      });
    }
  }

  loadSource(backList);
}

$(document).ready(function() {

  //Print console warning
  console.log("%c--- Danger Zone ---", "color: red; font-size: 25px");
  console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or \"hack\", it is likely a scam.", "font-size: 16px;");
  console.log("%cIf you ARE a developer, feel free to check this project out here:", "font-size: 16px;");
  console.log("%chttps://suitangi.github.io/Minimal-Newtab/", "font-size: 16px;");

  // $('#progress-line').css("display", "flex");

  //if Chrome is online
  if (window.navigator.onLine) {
    //loads the backgorund json
    const jsonUrl = chrome.runtime.getURL('resources/background.json');
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => loadBackground(json));
  } else {
    //send an error alert for no internet connection
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

  //set the search engine list
  window.searchEngines = [{
      "action": "https://www.google.com/search",
      "placeholder": "Google Search"
    },
    {
      "action": "https://www.bing.com/search",
      "placeholder": "Bing Search"
    },
    {
      "action": "https://search.yahoo.com/search",
      "placeholder": "Yahoo Search"
    },
    {
      "action": "https://duckduckgo.com/",
      "placeholder": "Duckduckgo"
    }
  ];

  //add the bookmarks
  chrome.bookmarks.getTree(function(bkList) {
    window.bookmarklist = bkList[0].children[1].children;

    if (window.bookmarklist.length == 0) {
      document.getElementById("bookmarks").style = "display: none;"
    } else {
      let bkHtml = "";

      //builds the bookmark html
      function recurBkList(bklist) {
        let node = bklist[0]
        while (node != null) {
          if (node.url == null) {
            // console.log(i);
            bkHtml += "<li class=\"bkItem\"><div class=\"folderName\">⮞ " + node.title + "</div><ol class=\"bkFolder\" style=\"list-style-type:none; display:none;\">";
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
        folderList[i].onclick = function() {
          this.nextElementSibling.classList.toggle("hidden");
          $(this).next().slideToggle("fast");
          this.innerText = this.innerText.replace("⮟", ">");
          this.innerText = this.innerText.replace("⮞", "⮟");
          this.innerText = this.innerText.replace(">", "⮞");
        };
      }
    }
  });

  //add onclick for like and delete buttons
  $('.like-button').click(function() {
    if ($(this).hasClass('is-active')) {
      removeFav(window.back);
    } else {
      addFav(window.back);
    }
    $(this).toggleClass('is-active');
  })

  $('.delete-button').click(function() {
    if (!$(this).hasClass('is-active')) {
      document.getElementById("menu").classList.add("delay");
      $.confirm({
        title: 'Are you sure?',
        content: 'This will remove the background. You can\'t undo this action unless you reset the extension with the reset button in the menu.',
        boxWidth: '25%',
        useBootstrap: false,
        type: 'blue',
        escapeKey: 'cancel',
        buttons: {
          ok: {
            text: "Remove this background",
            btnClass: 'btn-blue',
            keys: ['enter'],
            action: function() {
              addBlack(window.back);
              $('.delete-button').addClass('is-active');
              window.scrollTo(0, 0);
              setTimeout(function() {
                document.getElementById("menu").classList.remove("delay")
              }, 250);
            }
          },
          cancel: function() {
            window.scrollTo(0, 0);
            setTimeout(function() {
              document.getElementById("menu").classList.remove("delay")
            }, 250);
          }
        }
      });
    }
  })

  //add onclick for aboutButton
  document.getElementById("aboutButton").onclick = function() {
    document.getElementById("menu").classList.add("delay");
    let manifest = chrome.runtime.getManifest();
    $.confirm({
      title: 'About',
      content: manifest.name + ' ' + manifest.version + '<br>' + manifest.description,
      type: 'blue',
      boxWidth: '25%',
      backgroundDismiss: true,
      useBootstrap: false,
      typeAnimated: true,
      buttons: {
        support: {
          text: "FAQ",
          btnClass: 'btn-blue',
          action: function() {
            window.location.href = window.support_link;
          }
        },
        ok: {
          text: "Report Problem",
          btnClass: 'btn-red',
          action: function() {
            reportBk();
          }
        },
        Close: function() {
          window.scrollTo(0, 0);
          setTimeout(function() {
            document.getElementById("menu").classList.remove("delay")
          }, 250);
        }
      }
    });
  };

  //add onclick for resetButton
  document.getElementById("resetButton").onclick = function() {
    document.getElementById("menu").classList.add("delay");
    $.confirm({
      title: 'Are you sure you want to reset your data?',
      content: '<span style="font-size: 16px;">Choose what data you would like to reset: </span><br>' +
        '<br><label class="reset-container""> Widgets Location' +
        '<input type="checkbox" id="reset-input-loc" checked="checked">' +
        '<span class="reset-checkmark"></span></label>' +
        '<br><label class="reset-container"> Widgets Preferences/Data' +
        '<input type="checkbox" id="reset-input-pref" checked="checked">' +
        '<span class="reset-checkmark"></span></label>' +
        '<br><label class="reset-container"> Favorite Backgrounds' +
        '<input type="checkbox" id="reset-input-fav" checked="checked">' +
        '<span class="reset-checkmark"></span></label>' +
        '<br><label class="reset-container"> Removed Backgrounds' +
        '<input type="checkbox" id="reset-input-rem" checked="checked">' +
        '<span class="reset-checkmark"></span></label>' +
        '<br>This action cannot be undone!',
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
            if (this.$content.find('#reset-input-loc').is(":checked")) {
              chrome.storage.local.set({
                  time_top_data: '',
                  time_left_data: '',
                  info_top_data: '',
                  info_left_data: '',
                  todo_top_data: '',
                  todo_left_data: '',
                  search_top_data: '',
                  search_left_data: '',
                },
                function() {});
            }
            if (this.$content.find('#reset-input-pref').is(":checked")) {
              chrome.storage.local.set({
                  military_switch: 'off',
                  time_switch: 'on',
                  info_mode: 0,
                  info_switch: 'on',
                  search_switch: 'on',
                  todo_switch: 'on',
                  todo_data: ''
                },
                function() {});
            }
            if (this.$content.find('#reset-input-fav').is(":checked")) {
              chrome.storage.local.set({
                  fav_switch: 'off',
                  fav_list: []
                },
                function() {});
            }
            if (this.$content.find('#reset-input-rem').is(":checked")) {
              chrome.storage.local.set({
                  black_list: []
                },
                function() {});
            }
            location.reload();
          }
        },
        cancel: function() {
          window.scrollTo(0, 0);
          setTimeout(function() {
            document.getElementById("menu").classList.remove("delay")
          }, 250);
        }
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
  dragElement(document.getElementById('infoWrapper'));

  //data/settings loading from chrome
  //getting the clock settings
  chrome.storage.local.get({
    time_switch: 'on',
    time_top_data: '',
    time_left_data: '',
    military_switch: 'off'
  }, function(data) {
    if (data.time_switch == 'off') {
      document.getElementById("timeSwitch").checked = false;
      document.getElementById("timeWrapper").classList.add("exit");
      document.getElementById("timeWrapper").classList.add("firstStart");
    } else {
      document.getElementById("timeSwitch").checked = true;
      document.getElementById("timeWrapper").classList.add("entrance");
    }
    if (data.time_top_data != '') {
      document.getElementById("timeWrapper").style.top = data.time_top_data;
    }
    if (data.time_left_data != '') {
      document.getElementById("timeWrapper").style.left = data.time_left_data;
    }
    window.military = (data.military_switch == 'on');

    startTime(); //start the time
  });

  //getting the info settings
  chrome.storage.local.get({
    info_switch: 'on',
    info_top_data: '',
    info_left_data: '',
    info_mode: 0,
  }, function(data) {
    if (data.info_switch == 'off') {
      document.getElementById("infoSwitch").checked = false;
      document.getElementById("infoWrapper").classList.add("exit");
      document.getElementById("infoWrapper").classList.add("firstStart");
    } else {
      document.getElementById("infoSwitch").checked = true;
      document.getElementById("infoWrapper").classList.add("entrance");
    }
    if (data.info_top_data != '') {
      document.getElementById("infoWrapper").style.top = data.info_top_data;
    }
    if (data.info_left_data != '') {
      document.getElementById("infoWrapper").style.left = data.info_left_data;
    }
    window.infoMode = data.info_mode;
  });

  //getting the searchbar settings
  chrome.storage.local.get({
    search_switch: 'on',
    search_top_data: '',
    search_left_data: '',
    search_engine: 0
  }, function(data) {
    if (data.search_switch == 'off') {
      document.getElementById("searchSwitch").checked = false;
      document.getElementById("searchWrapper").classList.add("exit");
      document.getElementById("searchWrapper").classList.add("firstStart");
    } else {
      document.getElementById("searchSwitch").checked = true;
      document.getElementById("searchWrapper").classList.add("entrance");
    }
    if (data.search_top_data != '') {
      document.getElementById("searchWrapper").style.top = data.search_top_data;
    }
    if (data.search_left_data != '') {
      document.getElementById("searchWrapper").style.left = data.search_left_data;
    }

    let searchInput = $('#searchInput');
    searchInput.parent().attr('action', window.searchEngines[data.search_engine].action);
    searchInput.attr('data-placeholder', window.searchEngines[data.search_engine].placeholder);
    searchInput.val(window.searchEngines[data.search_engine].placeholder);
  });


  //load the background filters
  chrome.storage.local.get({
    filter: [35, 90, 100, 0]
  }, function(data) {
    document.getElementById("darkSlider").value = data.filter[0];
    document.getElementById("satuSlider").value = data.filter[1];
    document.getElementById("conSlider").value = data.filter[2];
    document.getElementById("blurSlider").value = data.filter[3];
    updateFilter();
  });

  // todo list data loading (and parsing list data)
  chrome.storage.local.get({
    todo_switch: 'on',
    todo_top_data: '',
    todo_left_data: '',
    todo_data: ''
  }, function(data) {
    if (data.todo_switch == 'off') {
      document.getElementById("todoSwitch").checked = false;
      document.getElementById("todoWrapper").classList.add("exit");
      document.getElementById("todoWrapper").classList.add("firstStart");
    } else {
      document.getElementById("todoSwitch").checked = true;
      document.getElementById("todoWrapper").classList.add("entrance");
    }
    if (data.todo_top_data != '') {
      document.getElementById("todoWrapper").style.top = data.todo_top_data;
    }
    if (data.todo_left_data != '') {
      document.getElementById("todoWrapper").style.left = data.todo_left_data;
    }
    // console.log("Todo list data loading:" + data.todo_data); //DEBUG
    if (data.todo_data != '') {
      let arr = data.todo_data.split("×");
      for (i = 0; i < arr.length - 1; i++) {
        let li;
        if (arr[i].indexOf("☑") != -1) {
          li = newListItem(String(arr[i]).slice(1), true);
        } else {
          li = newListItem(arr[i], false);
        }
        document.getElementById("myUL").appendChild(li);
      }
    } else {
      document.getElementById("todoInput").style = "";
    }
  });

  //setting the switches click event listeners
  document.getElementById("searchSwitch").parentElement.addEventListener('click', function() {
    updateSearch();
  });
  document.getElementById("searchChange").addEventListener("click", function() {
    changeSearch();
  });
  document.getElementById("timeSwitch").parentElement.addEventListener('click', function() {
    updateTime();
  });
  document.getElementById("infoSwitch").parentElement.addEventListener('click', function() {
    updateinfo();
  });
  document.getElementById("info").addEventListener("click", function() {
    updateInfoMode();
  });
  document.getElementById("favSwitch").parentElement.addEventListener('click', function() {
    updateFav();
  });
  document.getElementById("todoSwitch").parentElement.addEventListener('click', function() {
    updateTodo();
  });
  document.getElementById("time").addEventListener("click", function() {
    updateMilitary();
  });
  document.getElementById("darkSlider").addEventListener("input", function() {
    updateFilter();
  });
  document.getElementById("satuSlider").addEventListener("input", function() {
    updateFilter();
  });
  document.getElementById("conSlider").addEventListener("input", function() {
    updateFilter();
  });
  document.getElementById("blurSlider").addEventListener("input", function() {
    updateFilter();
  });

  // makes the list sortable
  $("#myUL").sortable({
    start: function() {
      document.activeElement.blur();
      document.getElementById("myUL").style = "cursor: -webkit-grabbing !important; cursor: grabbing !important;";
    },
    update: function() {
      saveTodo();
    },
    stop: function() {
      document.getElementById("myUL").style = "";
    }
  });

  //sets the placeholders for the inputs that have it
  let inputs = [];
  inputs.push(document.getElementById("todoInput"));
  inputs.push(document.getElementById("searchInput"));
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

  //when you press enter it pushes to the todo list
  $(".todoInput").on('keyup', function(e) {
    if (e.keyCode == 13) {
      let inputValue = document.getElementById("todoInput").value.trim();
      if (inputValue != '') {
        let li = newListItem(inputValue, false);
        document.getElementById("todoInput").value = "";
        document.getElementById("todoInput").style = "display: none;";
        document.getElementById("myUL").appendChild(li);
        setEndOfContenteditable(li);
        li.focus();
        saveTodo();
      }
    }
  });
});
