// if() { 
//     window.alert("infoText")
// };

// function myFunction() {
//     var popup = document.getElementById("PopupInfo");
//     popup.classList.toggle("show");
//   }

//   window.onbeforeunload = function() {
//     return "...Here you get some infos...";
//   };
  
//   window.onkeydown = function(event) {
//     if (event.keyCode === 116) {
//       window.location.reload();
//     }
//   };

function myPopup() {
    var element = document.getElementById("popup");
    element.classList.toggle("isVisible");
    element.classList.toggle("isNotVisible")
    var element = document.getElementById("diagramBody");
    element.classList.toggle("diagramIsVisible");
    element.classList.toggle("isNotVisible")
  }

  function myPopup4Help() {
    var element = document.getElementById("helpPopup");
    element.classList.toggle("isVisible");
    element.classList.toggle("isNotVisible")
    var element = document.getElementById("diagramBody");
    element.classList.toggle("diagramIsVisible");
    element.classList.toggle("isNotVisible")
  }
function myPopup4SQL() {
    var element = document.getElementById("sqlPopup");
    element.classList.toggle("isVisible");
    element.classList.toggle("isNotVisible")
    var element = document.getElementById("diagramBody");
    element.classList.toggle("diagramIsVisible");
    element.classList.toggle("isNotVisible")
}