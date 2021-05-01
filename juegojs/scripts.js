function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage = new Image(); // nave mia
    var enemiespic1 = new Image(); // nave bad 1
    var enemiespic2 = new Image(); // nave bad 2
    
    backgroundImage.src = 'imagen/background-pic.jpg'; // fondo del canvas
    naveImage.src = 'imagen/spaceship-pic.png'; //nave aliada

    // bad aliens
    enemiespic1.src = 'imagen/enemigo1.png';
    enemiespic2.src = 'imagen/enemigo2.png';

    var cW = ctx.canvas.width; // 700px el ancho
    var cH = ctx.canvas.height; // 600px 

    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    var enemies = [
        // first  enemies team
                    new enemyTemplate({id: '1', x: 100, y: -20, w: 50, h: 30}),
                    new enemyTemplate({id: '2', x: 225, y: -20, w: 50, h: 30}),
                    new enemyTemplate({id: '3', x: 350, y: -20, w: 80, h: 30}),
                    new enemyTemplate({id: '4', x: 100, y: -70, w: 80, h: 30}),
                    new enemyTemplate({id: '5', x: 225, y: -70, w: 50, h: 30}),
                    new enemyTemplate({id: '6', x: 350, y: -70, w: 50, h: 30}),
                    new enemyTemplate({id: '7', x: 475, y: -70, w: 50, h: 30}),
                    new enemyTemplate({id: '8', x: 600, y: -70, w: 80, h: 30}),
                    new enemyTemplate({id: '9', x: 475, y: -20, w: 50, h: 30}),
                    new enemyTemplate({id: '10', x: 600, y: -20, w: 50, h: 30 }),
        // second  enemies team
                    new enemyTemplate({id: '11', x: 100, y: -220, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '12', x: 225, y: -220, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '13', x: 350, y: -220, w: 80, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '14', x: 100, y: -270, w: 80, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '15', x: 225, y: -270, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '16', x: 350, y: -270, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '17', x: 475, y: -270, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '18', x: 600, y: -270, w: 80, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '19', x: 475, y: -200, w: 50, h:30, image: enemiespic2}),
                    new enemyTemplate({id: '20', x: 600, y: -200, w: 50, h:30, image: enemiespic2})
                ];
    var renderEnemies = function(enemyList) {
        for(var i=0; i<enemyList.length; i++){ // para que dibuje todas las naves enemigas
           // console.log(enemyList[i]); con esto probamos si funcionaba
           ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            //detected hit enemies
           //launcher.hitDetectLowerLevel(enemyList[i]);
        
           //    Detecta colision de ambas naves
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
     }

    function Launcher(){
        // ubicacion de disparos
        this.y = 500,
        this.x = cW*.5-25,
        this.w = 100,
        this.h = 100,
        this.direccion,
        this.bg = 'red', //color del misil
        this.misiles = [];

        // cuando se gane o pierde que muestre el mensaje
        this.gameStatus = {
            over: false,
            message: '',
            fillStyle: 'white',
            font: "Italic bold 34px Calibri, sans-serif",
        }
        // Movimiento de nuestra nave
        this.render = function(){
            if(this.direccion === "left"){
                this.x -= 5;
            }else if(this.direccion === "right"){
                this.x += 5;
            } else if(this.direccion === "downArrow"){
                this.y += 5; 
            }else if(this.direccion === "upArrow"){
                this.y -= 5; 
            }
            
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 0, 0); 
            //fondo del canvas linea 94
            ctx.drawImage(naveImage, this.x, this.y, 100, 90);
            // Nuestra nave linea 96

            for( var i= 0; i<this.misiles.length; i++ ){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h);
                // Direccionamiento de los misiles linea 101
                this.hitDetect(this.misiles[i], i);
                if(m.y <= 0){
                    this.misiles.splice(i, 1);
                    // para que no se vallan los misiles fuera del cuadro
                }
            }
            if(enemies.length ===0){
                clearInterval(animateInterval);
                // Se para el juego linea 109
                ctx.font = this.gameStatus.font;
                ctx.fillText("NOOSOTROS GANAMOS ", cW * .5 -80, 50 );
            }
        }
        // Colision de misiles 
        this.hitDetect = function(m, mi) {
            for( var i=0; i<enemies.length; i++){
                var e = enemies[i];
                if(m.x+m.w >= e.x && m.x <= e.x+e.w && m.y >= e.y && m.y <= e.y + e.h){
                    this.misiles.splice(this.misiles[mi], 1);
                    //  Se eliminaron los misiles linea 120
                    enemies.splice(i, 1);
                    // Se elimina la nave bad linea 122
                    document.querySelector(".barra").innerHTML = "Enemigos destruidos " +e.id + " ";
                }
            }
        }

        this.hitDetectLowerLevel = function(enemy){
            if(enemy.y > 550){
                this,this.gameStatus.over = true;
                this.gameStatus.message = "Los aliens pasaron la barrera! ";
            }

            if((enemy.y < this.y + 25 && enemy.y > this.y -25) && 
                (enemy.x < this.x + 45 && enemy.x > this.x -45)  ){
                    this.gameStatus.over = true;
                    this.gameStatus.message = " Te mataron los aliens";
            }

            if(this.gameStatus.over === true){
                clearInterval(animateInterval);
                // Se termino el juego linea de arriba
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;
                // Se muestra el mensaje al usuario
                ctx.fillText(this.gameStatus.message, cW* .5 - 140, 50)
                // texto X y Y
            }
        }
    }

    var launcher = new Launcher(); 
    // este objeto sirve cuando choque con la nuestra (nave) y asi que pare el juego
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }

    var animateInterval = setInterval(animate, 6);

    var left_btn = document.getElementById("left_btn");
    var right_btn = document.getElementById("right_btn");
    var fire_btn = document.getElementById("fire_btn");
    var reset_btn = document.getElementById("reset_btn");

     //movimientos desde el teclado
     document.addEventListener("keydown",function(event){
        if(event.keyCode == 37){ 
            //posicion para la izquiera con el teclado
            launcher.direccion = "left";
            if(launcher.x < cW*.2-130){
                launcher.x += 0;
                launcher.direccion = "";
            }
        }
     });

     document.addEventListener("keyup",function(event){
        if(event.keyCode == 37){ 
            launcher.x += 0;
            launcher.direccion = "";
        }
     });

     document.addEventListener("keydown",function(event){
        if(event.keyCode == 39){  
            // posiscion para la derecha del teclado
            launcher.direccion = "right";
            if(launcher.x > cW-110){
                launcher.x -= 0;
                launcher.direccion = "";
            }
        }
     });

     document.addEventListener("keyup",function(event){
        if(event.keyCode == 39){ 
            launcher.x -= 0;
            launcher.direccion ="";
        }
     });

     document.addEventListener("keydown",function(event){
        if(event.keyCode == 38){ 
            // para arriba con el teclado
            launcher.direccion = "upArrow";
            if(launcher.y < cH*.2-80){
                launcher.y += 0;
                launcher.direccion = "";
            }
        }
     });

     document.addEventListener("keyup",function(event){
        if(event.keyCode == 38){ 
            launcher.y += 0;
            launcher.direccion ="";
        }
     });

     document.addEventListener("keydown",function(event){
        if(event.keyCode == 40){ 
            // para abajo con el teclado
            launcher.direccion = "downArrow";
            if(launcher.y > cH - 110){
                launcher.y -= 0;
                launcher.direccion = "";
            }
        }
     });

     document.addEventListener("keyup",function(event){
        if(event.keyCode == 40){ 
            launcher.y -= 0;
            launcher.direccion ="";
        }
     });

     document.addEventListener("keydown",function(event){
        if(event.keyCode == 32){ 
            launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h:10});
        }
     });
    //movimientos con el mouse la naves! >D

    left_btn.addEventListener("mousedown", function(event){
        launcher.direccion = "left";
    });

    left_btn.addEventListener("mouseup", function(event){
        launcher.direccion = ""; //esto sirve para que no se desplaze la nave fuera del cuadro
    });

    right_btn.addEventListener("mousedown", function(event){
        launcher.direccion = "right";
    });

    right_btn.addEventListener("mouseup", function(event){
        launcher.direccion = ""; //esto sirve para que no se desplaze la nave fuera del cuadro
    });

    fire_btn.addEventListener("mousedown", function(event){
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h:10})
    });

    reset_btn.addEventListener("mousedown", function(event){
        location.reload();
    });
}

    window.addEventListener('load', function(event) {
        initCanvas();
})