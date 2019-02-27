$(document).ready(function() {
  startTime();
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
});


function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    // add a zero in front of numbers<10
    m = checkTime(m);
    document.getElementById('time').innerHTML = h%12 + ":" + m;
    t = setTimeout(function () {
        startTime()
    }, 500);
}
