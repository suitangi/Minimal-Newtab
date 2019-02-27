
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
  console.log("hi");
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
    }, 500);
}

$(document).ready(function() {
  startTime();
  window.military = false;
  var inputs = document.getElementsByTagName("input");

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
});
