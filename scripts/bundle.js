/**/
window.onload = function () {
  var windowHeight = parseInt(window.screen.height);
  var windowWidth = parseInt(window.screen.width);
  var nbColumns = 20;
  
  // on détermine la largeur du background de chaque élément
  var widthBg = Math.trunc(windowWidth / 20);
  
  // on détermine le nombre de ligne en fonction de largeur pour chaque background soit carré
  var nbRows = Math.trunc(windowHeight / widthBg);
  
  console.log(widthBg);
  console.log(nbRows);
};
