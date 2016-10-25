$(function(){

    var oPopinHtml = $(".popin");
    var drawNavigation = false;
    var drawConnection = false;
    var isWebBTActivated = navigator.bluetooth;

    oPopinHtml.on("click", function(e) {
        // On ne cache pas la popin dans le cas où
        // l'utilisateur n'a pas activé l'interface bluetooth
        if (isWebBTActivated) {
            oPopinHtml.hide();
            if (drawNavigation) {
                drawNavigation = false;
                draw(navigation);
            } else if (drawConnection) {
		drawConnection = false;
                draw(connection);
	    }	    
        }
    });

    function _showMessage(message) {
        $(".popin .message").html(message);
        oPopinHtml.show();
    }

    if (!isWebBTActivated) {
        isActivateWebBT = true;
        _showMessage("Interface Web Bluetooth indisponible. Veuillez l'activer :<p><a class='link' target=\"_blank\" href=\"chrome://flags/#enable-web-bluetooth\">chrome://flags/#enable-web-bluetooth</a></p>", true);
    }

    var deviceLeo = null;
    var characteristicServiceLeo = null;
    var uuidService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    var uuidCharacteristicService = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

    var bytesWithHeader = [
	   0xBA, // Static header
       0xBA, // Static header
       0xAA, // Static header
       0xAA // Static header
     ];

     // commande couleur LED
     var cUpdateColor = 0x03;
     // commande direction
     var cDirection = 0x02;

  /*

   Shapes
   Objet plat acceptant 4 clés ;
   - classes : { normal : "class1 class2" : hover : "class3 class4" }
   - cells : Tableau des cellules concernées : [ [x1,y1], [x2,y2], ...]. Dans la grille le point [0,0] est au centre de l'écran
   - onTouchStart : function(){ ... }
   - onTouchEnd : function(){ ... }

   */

    // Ecran 1 : connection

    // Bouton connexion BT
    var bluetooth = {
        classes : {
            normal : "grey upper",
            hover : "blue upper"
        },
        cells : [
            [-5,-1],[-4,-1],[-4,1],[-3,1],[-3,2],[-2,2],[-2,3],
            [-5,8],[-4,8],[-4,7],[-3,7],[-3,6],[-2,6],[-2,5],
            [-1,-3], [-1,-2], [-1,-1], [-1,1], [-1,2], [-1,3], [-1,4], [-1,5], [-1,6], [-1,7], [-1,8], [-1,9], [-1,10],
            [1,-3], [1,-2], [1,-1], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7], [1,8], [1,9], [1,10],
            [2,-2],[2,-1],[3,-1],[3,1],[4,1],[4,2],[5,2],[4,3],[3,3],[3,4],[2,4],[3,5],[4,5],[4,6],[5,6],[4,7],[3,7],[3,8],[2,8],[2,9],
        ],
        onTouchStart : function(){},
        onTouchEnd : function(){
            if (navigator.bluetooth) {
                // Demande connexion BT
                navigator.bluetooth.requestDevice({
                    "filters": [{
                        "name": "LEO"
                    }],
                    optionalServices:[uuidService]
                }).then(device => {
                    deviceLeo = device;
                    // Connexion OK : récupération du service BT
                    deviceLeo.gatt.connect().then(server => {
                        return server.getPrimaryService(uuidService);
                    }, error => {
                        _showMessage("Erreur lors de la connexion à Léo : " + error);
                    }).then(service => {
                        return service.getCharacteristic(uuidCharacteristicService).then(characteristic => {
                            characteristicServiceLeo = characteristic;
                            _showMessage("Vous êtes maintenant connecté à Léo... à vous de jouer !");
                            drawNavigation = true;
                        });
                    }, error => {
                        _showMessage("Erreur lors de la connexion à Léo : " + error);
                    });
                }, error => {
                    _showMessage("Erreur lors de la connexion à Léo : " + error);
                });
            }
        }
    };

    // Titre LEO
    var led = {
        classes : {
            normal : "blue upper",
            hover : "blue upper"
        },
        cells : [
            [-7,-11], [-7,-10], [-7,-9], [-7,-8], [-7,-7],[-6,-7],[-5,-7],[-4,-7],
            [2,-11], [1,-11], [-1,-11], [-2,-11], [-2,-10],[-1,-9],[1,-9],[-2,-8],[-2,-7],[-1,-7],[1,-7],[2,-7],
            [4,-11], [5,-11], [6,-11], [7,-10], [7,-9],[7,-8],[7,-7],[6,-7],[5,-7],[4,-7],[4,-8],[4,-9],[4,-10]
        ]
    };

    // Ecran 2
    var topleft = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [-5,-10], [-6,-10], [-7,-10], [-7,-9], [-7,-8]],
        onTouchStart : function(){  },
        onTouchEnd : function(){  }
    };

    var topright = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [5,-10], [6,-10], [7,-10], [7,-9], [7,-8]]
    };

    var bottomleft = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [-7,2], [-7,3], [-7,4], [-6,4], [-5,4]]
    };

    var bottomright = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [ [7,2], [7,3], [7,4], [6,4], [5,4]]
    };

    var top = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [-1,-11], [1,-11],
            [-2,-10],[-1,-10], [1,-10],[2,-10],
            [-3,-9], [-2,-9],[-1,-9], [1,-9],[2,-9],[3,-9],
            [-4,-8],[-3,-8], [-2,-8],[-1,-8], [1,-8],[2,-8],[3,-8],[4,-8]
        ],
        onTouchStart : function(){
            _callWrite(cUpdateColor, [255,0,0]);
            _callWrite(cDirection, [1]);
        },
        onTouchEnd : function(){
            _callWrite(cUpdateColor, [0,0,0]);
            _callWrite(cDirection, [0]);
        }
    };

    var bottom = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [-1,5], [1,5],
            [-2,4],[-1,4], [1,4],[2,4],
            [-3,3], [-2,3],[-1,3], [1,3],[2,3],[3,3],
            [-4,2],[-3,2], [-2,2],[-1,2], [1,2],[2,2],[3,2],[4,2]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [2]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };

    var left = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [-8,-4], [-8,-3],
            [-7,-5],[-7,-4], [-7,-3],[-7,-2],
            [-6,-6],[-6,-5],[-6,-4], [-6,-3],[-6,-2],[-6,-1],
            [-5,-7],[-5,-6],[-5,-5],[-5,-4], [-5,-3],[-5,-2],[-5,-1],[-5,1]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [3]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };

    var right = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [8,-4], [8,-3],
            [7,-5],[7,-4], [7,-3],[7,-2],
            [6,-6],[6,-5],[6,-4], [6,-3],[6,-2],[6,-1],
            [5,-7],[5,-6],[5,-5],[5,-4], [5,-3],[5,-2],[5,-1],[5,1]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [4]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };

    var g = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [3,-6],[2,-6],[1,-6], [-1,-6],[-2,-6],[-3,-6],
            [-3,-5],[-3,-4],[-3,-3], [-3,-2],[-3,-1],
            [-2,-1],[-1,-1],[1,-1], [2,-1],[3,-1],
            [3,-2],[3,-3],[3,-4],
            [2,-4],[1,-4],[-1,-4],
            [-1,-3]
        ],
        onTouchStart : function(){
            _callWrite(cDirection, [5]);
        },
        onTouchEnd : function(){
            _callWrite(cDirection, [0]);
        }
    };

    var deco = {
        classes : { normal : "grey upper", hover : "blue upper" },
        cells : [
            [1,9],[-1,9],[1,10], [-1,10],
            [-2,8],[2,8],[-2,11],[2,11]
        ],
        onTouchEnd : function(){
            _disconnect();
        }
    };



  /*

   Drawings
   Objet plat acceptant 2 clés

   - size : taille minimale de la grille : { width : Number, height : Number }
   - shapes : Tableau de shapes, voir au dessu

   */

    var connection = {
        size : { width : 18, height : 26 },
        shapes : [bluetooth, led]
    };

    var navigation = {
        size : { width : 18, height : 26 },
        shapes : [topleft, topright, bottomleft, bottomright, top, bottom, left, right, g, deco]
    };


  /*

   draw(draw)
   Fonction qui dessins un drawing

   */

    function draw(drawing){

        var oGridHtml = $(".grid");
        oGridHtml.empty() ;

        var screen = {
            width : $(document).width(),
            height : $(document).height()
        } ;

        var sizeX = screen.width / drawing.size.width ;
        sizeX = sizeX > 40 ? 40 : Math.floor(sizeX) ;
        var sizeY = screen.height / drawing.size.height ;
        sizeY = sizeY > 40 ? 40 : Math.floor(sizeY) ;

        if(sizeX < sizeY) sizeY = sizeX;
        if(sizeY < sizeX) sizeX = sizeY;

        var size = sizeX ;

        var grid = {
            nbOfCellsX : Math.ceil(Math.ceil(screen.width / size) / 2) * 2 ,
            nbOfCellsY : Math.ceil(Math.ceil(screen.height / size) / 2) * 2 ,
        };

        grid.minX = grid.nbOfCellsX / -2 ;
        grid.maxX = grid.nbOfCellsX / 2 + 1 ;
        grid.minY = grid.nbOfCellsY / -2 ;
        grid.maxY = grid.nbOfCellsY / 2 + 1 ;
        grid.width = grid.nbOfCellsX * size ;
        grid.height = grid.nbOfCellsY * size ;

        oGridHtml.width(grid.width) ;
        oGridHtml.height(grid.height) ;

        for(var y = grid.minY ; y < grid.maxY ; y++){
            if(y === 0) continue ;
            for(var x = grid.minX ; x < grid.maxX ; x++){
                if(x === 0) continue ;
                var element = $('<div class="lego darkgrey" x="' + x + '" y="' + y + '"></div>') ;
                element.width(size).height(size) ;
                oGridHtml.append(element) ;
            }
        }

        _.each(drawing.shapes, function(shape){
            var selector = _.map(shape.cells, function(cell){ return('[x="'+ cell[0] +'"][y="'+ cell[1] +'"]') ; }).join(",") ;
            var elements = $(selector) ;
            elements
                .addClass(shape.classes.normal)
                .on("touchstart", function(){
                    elements.removeClass(shape.classes.normal).addClass(shape.classes.hover) ;
                    if(_.isFunction(shape.onTouchStart)) shape.onTouchStart() ;
                })
                .on("touchend", function(){
                    elements.removeClass(shape.classes.hover).addClass(shape.classes.normal) ;
                    if(_.isFunction(shape.onTouchEnd)) shape.onTouchEnd() ;
                })
        });

    }

    /**
     * Appel caractéristique write du service BT
     * @param message à envoyer
     * @private
     */
    function _callWrite(cCommande, valuesArray) {
        if(characteristicServiceLeo) {
            characteristicServiceLeo.writeValue(_dataToSend(bytesWithHeader, cCommande, valuesArray)).then(value => {
            }, error => {
                _showMessage("Erreur lors de l'envoi de la commande à LEO : " + error + ". Veuillez vous reconnecter.");
                _disconnect();
            });
        }
    }

    function _disconnect() {
        if (deviceLeo) {
            deviceLeo.gatt.disconnect();
            _showMessage("Déconnexion OK !");
        }
        drawConnection = true;
    }

    function _dataToSend(headerBytes, commandByte, byteValue) {
        var buf = new ArrayBuffer(headerBytes.length + 1 + byteValue.length);
        var bufView = new Uint8Array(buf);
        var idx = 0;

        for (let i = 0; i < headerBytes.length; i+=1) {
          bufView[idx++] = headerBytes[i];
        }

        bufView[idx++] = commandByte;

        // Gestion de l'inversion par paire des bytes
        for (let i = 0; i < byteValue.length; i+=1) {
          bufView[idx++] = byteValue[i];
        }
        return buf;
    }

    jQuery(window).on('resize', _.debounce(function(){ draw(toShow) ; }, 1000));


    // Point d'entrée

    draw(connection);

});
