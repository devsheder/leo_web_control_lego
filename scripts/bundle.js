/**/
window.onload = function () {
  // hauteur écran
  var windowHeight = parseInt(window.screen.height);
  // largeur écran
  var windowWidth = parseInt(window.screen.width);
  
  // nombre de colonnes fixé
  var nbColumns = 20;
  
  // largeur/hauteur du background de chaque élément
  var widthHeigthBg = Math.trunc(windowWidth / nbColumns);
  
  // nombre de lignes en fonction de largeur/hateur pour que chaque background soit carré
  var nbRows = Math.trunc(windowHeight / widthHeigthBg);
    
  // Création de la grille
  for (var i = 0; i < nbRows; i++) {
    // création de la div de la ligne
    var rowDiv = document.createElement("div");
    rowDiv.className = "row";
    rowDiv.style.height = widthHeigthBg+"px";
    
    for (var j = 0; j < nbColumns; j++) {
      var cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      cellDiv.style.height = widthHeigthBg+"px";
      cellDiv.style.width = widthHeigthBg+"px";
      cellDiv.style.backgroundSize = widthHeigthBg+"px " + widthHeigthBg+"px";
      rowDiv.appendChild(cellDiv);
    }
    
    document.body.appendChild(rowDiv);
  }
  
};
