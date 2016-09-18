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

var Highscores = (function(){
    var results = [];

    var load = function(){
        if (localStorage.getItem("results") !== null)
            results = JSON.parse(localStorage.getItem("results"));

        var html = '';
        for(var i = 0; i<results.length; i++){
            html += '<tr><td>' + (i+1) + '</td><td>' + results[i].name + '</td><td>' + results[i].difficulty + '</td><td>' + results[i].points + '</td></tr>'
        }
        $('.table tbody').append(html);
    };

    var save = function(name, points) {
        var newResult = {
            name : name,
            difficulty : sessionStorage.getItem('difficulty'),
            points : points
        };

        if (localStorage.getItem("results") !== null)
            results = JSON.parse(localStorage["results"]);

        results.push(newResult);
        results.sort(function(a,b){return b.points - a.points});
        localStorage["results"] = JSON.stringify(results);
    };

    return{
        load: load,
        save: save
    };
})();


var Game = (function(){
    var images = ["img/cards/card.png", "img/cards/card1.png", "img/cards/card2.png", "img/cards/card3.png", "img/cards/card4.png", "img/cards/card5.png", "img/cards/card6.png","img/cards/card7.png", "img/cards/card8.png", "img/cards/card9.png", "img/cards/card10.png", "img/cards/card11.png","img/cards/card12.png"];
    var pairsToFind = 0;
    $img1 = null;
    $img2 = null;
    var isFirstCheck = true;

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
            if(!isFirstCheck)
                addScore(-5);
            else
                isFirstCheck = false;

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
            var points = $("#score").text();
            Highscores.save(name, points);
        }
    };


    return{
        init: init,
        createGame: createGame
    };
})();
