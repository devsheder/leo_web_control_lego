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
      cellDiv.className = "cell_default";
      cellDiv.style.height = widthHeigthBg+"px";
      cellDiv.style.width = widthHeigthBg+"px";
      cellDiv.style.backgroundSize = widthHeigthBg+"px " + widthHeigthBg+"px";
      
      var toDraw = leoDraw.filter(function (element) {
        var isInX = j >= element.x_start && j <= element.x_end;
        var isInY = i >= element.y_start && i <= element.y_end;
        return isInX && isInY;
      });
      
      if (toDraw && toDraw.length > 0) {
        cellDiv.className = toDraw[0].className;
      }
      
      rowDiv.appendChild(cellDiv);
    }
    
    document.body.appendChild(rowDiv);
  }
  
};

var leoDraw = [
  {
    x_start:4,
    x_end:4,
    y_start:4,
    y_end:8,
    className:"cell_selected"
  }
]
