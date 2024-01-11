//Widget constructor
function Widget(name, wrapper, dragger, toggle) {
  this.name = name;
  this.wrapperElement = wrapper;
  this.switchElement = toggle;
  this.draggerElement = dragger;
  window.newTab.widgets[name] = this;
  //make element draggable
  dragElement(this);
  //get widget data
  chrome.storage.local.get({
    [`${name}-location`]: ['', ''],
    [`${name}-onoff`]: true,
    widgetName: name
  }, function(data) {
    let widName = data.widgetName;
    let widObj = window.newTab.widgets[widName];
    widObj.location = data[`${widName}-location`];
    widObj.visible = data[`${widName}-onoff`];
    if (!widObj.visible) {
      widObj.switchElement.setAttribute('checked', 'false');
      widObj.wrapperElement.classList.add("exit");
      widObj.wrapperElement.classList.add("firstStart");
    } else {
      widObj.switchElement.setAttribute('checked', 'true');
      widObj.wrapperElement.classList.add("entrance");
    }

    if (widObj.location[0] != '') {
      widObj.wrapperElement.style.top = widObj.location[0];
    }
    if (widObj.location[1] != '') {
      widObj.wrapperElement.style.left = widObj.location[1];
    }
  });

  //to be overloaded
  this.closeDrag = function() {};

  //update visibility funciton
  this.updateVisibilty = function() {
    this.wrapperElement.classList.remove("firstStart");
    if (this.switchElement.getAttribute('checked') == 'true') {
      this.switchElement.setAttribute('checked', 'false');
      this.wrapperElement.classList.add("exit");
      this.wrapperElement.classList.remove("entrance");
      chrome.storage.local.set({
        [`${this.name}-onoff`]: false
      });
    } else {
      this.switchElement.setAttribute('checked', 'true');
      this.wrapperElement.classList.add("entrance");
      this.wrapperElement.classList.remove("exit");
      chrome.storage.local.set({
        [`${this.name}-onoff`]: true
      });
    }
  }

  //set the switch for visibilty
  this.switchElement.parentElement.addEventListener('click', function() {
    window.newTab.widgets[this.firstElementChild.getAttribute('widget-data')].updateVisibilty();
  });

}


//Widgets: sets the element to be draggable
function dragElement(widget) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  let dragElmnt = widget.draggerElement;
  let elmnt = widget.wrapperElement;
  dragElmnt.onmousedown = dragMouseDown;

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
    if (!window.newTab.dragged)
      window.newTab.dragged = true;

  }

  // stop moving when mouse button is released
  function closeDragElement() {
    //reset the dragged to be false
    if (window.newTab.dragged) {
      window.newTab.dragged = false;
      chrome.storage.local.set({
        [widget.name + '-location']: [elmnt.style.top, elmnt.style.left]
      });
      widget.closeDrag();
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
