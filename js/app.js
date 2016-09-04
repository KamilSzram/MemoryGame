var Menu = (function(){
    var init = function(){
        $("#easy").click(function(){
            setDifficulty("easy");
        });

        $("#medium").click(function(){
            setDifficulty("medium");
        });

        $("#hard").click(function(){
            setDifficulty("hard");
        });
    };

    var setDifficulty = function(difficulty){
        sessionStorage.setItem('difficulty', difficulty);
    };

    return{
        init: init
    };
})();


var Game = (function(){
    var images = ["img/cards/card.png", "img/cards/card1.png", "img/cards/card2.png", "img/cards/card3.png", "img/cards/card4.png", "img/cards/card5.png", "img/cards/card6.png","img/cards/card7.png", "img/cards/card8.png", "img/cards/card9.png", "img/cards/card10.png", "img/cards/card11.png","img/cards/card12.png"];
    var pairsToFind = 0;
    $img1 = null;
    $img2 = null;

    var init = function(){
        $(".button").hover(function(){
            $(this).css("background-color","#4CAF50");
        }, function(){
            $(this).css("background-color","#00C853");
        });
    };

    var createGame = function(){
        var difficulty = sessionStorage.getItem('difficulty');

        if(difficulty == "easy"){
            pairsToFind = 6;
            $pairs = images.slice(1, 7);
        }
        else if(difficulty == "medium"){
            pairsToFind = 9;
            $pairs = images.slice(1, 10);
        }
        else if(difficulty == "hard"){
            pairsToFind = 12;
            $pairs = images.slice(1, images.length);
        }
        $cardsArray = $.merge($pairs, $pairs);
        $cardsArray = shuffle($cardsArray);
        createBoard($cardsArray);
    };

    var shuffle = function(array){
        var counter = array.length;
        var temp = null;
        var random = null;

        while (0 !== counter) {
            random = Math.floor(Math.random() * counter);
            counter--;

            temp = array[counter];
            array[counter] = array[random];
            array[random] = temp;
        }
        return array;
    };

    var createBoard = function($cardsArray){
        var html = '';
        var numberOfLoops = $cardsArray.length/6;
        for(var i=0; i<numberOfLoops; i++) {
            html += '<div class = "row">';
            for (var j = 0; j < 6; j++) {
                html += '<div class="card"><img src="' + images[0] + '"/><img src="' + $cardsArray[(i*6) + j] + '" style="display:none"/></div>';
            }
            html += '</div>';
        }
        $(".wrapper").append(html);
        $(".card").on('click', flipCard);
    };

    var flipCard = function(){
        $(this).addClass("clicked").off("click");
        $(this).find('img').toggle();

        if($img1 === null){
            $img1 = $(this).find('img:eq(1)').attr('src');
        }
        else if($img1 !== null){
            $('.card').off("click");
            $img2 = $(this).find('img:eq(1)').attr('src');
            checkMatch($img1, $img2);
        }
    };

    var checkMatch = function(image1, image2){
        if(image1 === image2){
            addScore(10);
            pairsToFind--;
            $('.clicked').removeClass('card').addClass('card-checked');
            $( ".card-checked" ).removeClass( "clicked" );
            $('.card').on('click', flipCard);
            if(pairsToFind === 0){
                setTimeout( function(){
                    show_prompt();
                }, 1000 );
            }
        }
        else{
            addScore(-5);
            setTimeout( function(){
                toggleCards();
            }, 500 );
        }
        addMove();
        $img1 = null;
        $img2 = null;
    };

    var toggleCards = function(){
        $( ".clicked" ).find( "img" ).toggle();
        $( ".card" ).removeClass( "clicked" );
        setTimeout( function(){
            $('.card').on('click', flipCard);
        }, 500 );
    };

    var addScore = function(value){
        $("#score").text(parseInt($("#score").text(),10) + value);
    };

    var addMove = function(){
        $("#counter").text(parseInt($("#counter").text(),10) + 1);
    };

    var show_prompt = function() {
        name = prompt('Please enter your name');
        if (name !== null && name !== "") {
            saveScore();
        }
    };

    var saveScore = function() {
        var players = [];
        var level = [];
        var points = [];

        if (localStorage.getItem("players") !== null)
            players = JSON.parse(localStorage["players"]);
        if (localStorage.getItem("level") !== null)
            level = JSON.parse(localStorage["level"]);
        if (localStorage.getItem("points") !== null)
            points = JSON.parse(localStorage["points"]);

        var score = parseInt($("#score").text());

        players.push(name);
        level.push(sessionStorage.getItem('difficulty'));
        points.push(score);
        localStorage["players"] = JSON.stringify(players);
        localStorage["level"] = JSON.stringify(level);
        localStorage["points"] = JSON.stringify(points);
    };

    return{
        init: init,
        createGame: createGame
    };
})();
