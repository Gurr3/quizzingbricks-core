

var BOARD_HEIGHT = 8
var BOARD_WIDTH  = 8
var last_marked_element =null;

var TOKEN = {
    EMPTY  : {value: 0, string: "Empty",    userId: 0 },
    RED    : {value: 1, string: "Red",      userId: -1 },
    YELLOW : {value: 2, string: "Yellow",   userId: -1 },
    BLUE   : {value: 3, string: "Blue",     userId: -1 },
    GREEN  : {value: 4, string: "Green",    userId: -1 }
}





var selected_token=TOKEN.RED;

/*function selectToken(token){
    document.getElementById('player_color').innerHTML = token.string;
    selected_token = token;
    
    $.post($SCRIPT_ROOT + '/choose_color', { token : token.string },
    function(data) {
    $("#resultColor").text(data.result);
    });
  }*/



function test_userId(token){ 
    alert(token.userId)
    //get_token_by_id(token.userId);
}


function assign_colors(friends, userId,gameId) {
    selected_token.userId = userId
    var length = friends.length,
    element = null;
    teststring = ""
    for (var i = 0; i < length; i++) {
        element = friends[i];
        teststring = teststring + element + " i: "+ i + "\n";
        if (i==0) { TOKEN.YELLOW.userId = element }
        if (i==1) { TOKEN.BLUE.userId   = element }
        if (i==2) { TOKEN.GREEN.userId  = element }
    }
    drawBoard(gameId);                                   //since it should be done onload but after assign_colors.
//alert(teststring);
}



function create_token(token, isConfirmed) {

    token_img = document.createElement("img");
    token_img.setAttribute("height", "64");
    token_img.setAttribute("width", "64");
    token_img.setAttribute("src", "/static/img/BoardCell_" + token.string + ".png");
    if (! isConfirmed){
        token_img.style.opacity="0.4";
    }
    
    return token_img        
}

var board = new Array(BOARD_HEIGHT)
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(BOARD_WIDTH)
}

function updateStatus(players){
    console.log("token: "+TOKEN.RED.userId);
    var length = players.length
    element= null;
    for (var i = 0; i < length; i++) {
        element = players[i];
        if(element.state == 0 ){
            $("#status_id_"+element.userId).text("State: Placing Tile      ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 1 ){
            $("#status_id_"+element.userId).text("State: Placed Tile       ");
            $("#score_id_"+element.userId).text("Score: "+element.score);

        }
        if(element.state == 2 ){
            $("#status_id_"+element.userId).text("State: Answering Question");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 3 ){
            $("#status_id_"+element.userId).text("State: Answered Question ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 4 ){    //loss
            $("#status_id_"+element.userId).text("State: Lost Game ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 5 ){    //win
            $("#status_id_"+element.userId).text("State: Won Game");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }


        if(element.state == 1 && element.userId == TOKEN.RED.userId){  //if out state is  1 (Placed Tile) we should show the get Question div again
            console.log("showing question_button");
            $('#question_button').show();
        }
    }
}

function updateStatus_single(player){
    
        console.log("token: "+TOKEN.RED.userId);
    
        element = player;
        if(element.state == 0 ){
            $("#status_id_"+element.userId).text("State: Placing Tile      ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 1 ){
            $("#status_id_"+element.userId).text("State: Placed Tile       ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 2 ){
            $("#status_id_"+element.userId).text("State: Answering Question");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 3 ){
            $("#status_id_"+element.userId).text("State: Answered Question ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }

        if(element.state == 4 ){    //loss
            $("#status_id_"+element.userId).text("State: You Lost ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }
        if(element.state == 5 ){    //win
            $("#status_id_"+element.userId).text("State: You Won ");
            $("#score_id_"+element.userId).text("Score: "+element.score);
        }

        if((element.state == 1) && element.userId == TOKEN.RED.userId){  //if out state is  1 (Placed Tile) we should show the get Question div again
            console.log("showing question_button");
            $('#question_button').show();
        }
    
}




function drawBoardHelper(data){
    playerPos = data.board
    for (var y =0; y<BOARD_HEIGHT; y++ ){
        for (var x=0; x<BOARD_WIDTH; x++){
            board_element = document.getElementById("square_"+ x+"_"+y);
            index = y*BOARD_HEIGHT +x;



            if(TOKEN.RED.userId == playerPos[index]){
                board_element.innerHTML = ""
                board_element.appendChild(create_token(TOKEN.RED,true));
            }
            else if(TOKEN.YELLOW.userId == playerPos[index]){
                board_element.innerHTML = ""
                board_element.appendChild(create_token(TOKEN.YELLOW,true));
                //board_element.innerHTML = create_token(TOKEN.YELLOW).toString();
            }
            else if(TOKEN.BLUE.userId == playerPos[index]){
                board_element.innerHTML = ""
                board_element.appendChild(create_token(TOKEN.BLUE,true));
                //board_element.innerHTML = create_token(TOKEN.BLUE);
            }
            else if(TOKEN.GREEN.userId == playerPos[index]){
                board_element.innerHTML = ""
                board_element.appendChild(create_token(TOKEN.GREEN,true));
                //board_element.innerHTML = create_token(TOKEN.GREEN);
            }
            else if(board_element==last_marked_element){

            }
            else{
                board_element.innerHTML = ""
            }
        }
    }
}

function drawBoard(gameId){
    //playerPos = [] 
    $.post($SCRIPT_ROOT + '/game_info', {gameId: gameId},
    function(data) {
        updateStatus(data.players);
        drawBoardHelper(data)
       // $("#drawResult").text(playerPos[1]);

   //playerPos = data.board
   //$('#result').text(playerPos[1]);
  });
  //  board_element = document.getElementById("square_"+ 2+"_"+2);
  //  board_element.appendChild(create_token(TOKEN.RED));
  //  $('#result').text(playerPos[1]);
  // TODO: fetch playerPos for the board placements from the data object returned from Jquery call above
    //playerPos = [1,2,0,1,2]
    

}

function getQuestion(gameId){
        $.post($SCRIPT_ROOT + '/get_question', {gameId: gameId},
        function(data) {
            if (data.isQuestion){
                 $("#modalQuestion").text(data.question);
                 $("#question_alt_1").text(data.alternatives[0]);
                 $("#question_alt_2").text(data.alternatives[1]);
                 $("#question_alt_3").text(data.alternatives[2]);
                 $("#question_alt_4").text(data.alternatives[3]);
                 $('#myModal').modal('show')
            }

  }); 
}

function submitAnswer(gameId, answer){
    $('#question_button').hide();
    $.post($SCRIPT_ROOT + '/submit_answer', {gameId: gameId, answer: answer},
    function(data) {
        if(data.isCorrect){
            $("#answer").text("Your last answer was correct");
            last_marked_element=null;
        }
        else{
            $("#answer").text("Your last answer was incorrect");
            if(last_marked_element!=null){
                last_marked_element.innerHTML= ""
            }
            
        }
        console.log("submitting answer**************************************")
        $('#myModal').modal('hide');
        
       // drawBoard(gameId);  
  }); 
}


function addTokens(gameId,x,y) {            //Send  gameId, x and y coordinates to run_web
 /*   player_color    = document.getElementById('player_color').innerHTML;
    board_element   = document.getElementById("square_" + x + "_" + y);    
    
    if (board[x][y] == null && selected_token != null) {
        board[x][y] = selected_token;

        board_element.appendChild(create_token(selected_token));*/
        
        $.post($SCRIPT_ROOT + '/make_move', {gameId: gameId, x: x, y: y },
        function(data) {
        $("#result").text(data.result);
        if(data.result=="Move sent"){

            board_element = document.getElementById("square_"+ x+"_"+y);
            board_element.appendChild(create_token(TOKEN.RED,false));
            last_marked_element=board_element
            //drawBoard(gameId);
        }
      });
        
  //  }
}

var QuizzingBricks = QuizzingBricks || {};

QuizzingBricks.Player = function(json) {
    this.json = json;
    this.name = json.email;
    this.score = json.score;
    this.status = json.status;
}

QuizzingBricks.GameBoard = function(server_url, game_id) {
    // "fields"
    this.server_url = server_url;
    this.game_id = game_id;

    this._setup_websocket_listener = function() {
        if (window.WebSocket == undefined) {
            console.log("Websockets is not available in your browser");
        }
        var ws = new WebSocket("ws://" + this.server_url + "/game_board/" + this.game_id + "/events/");
        ws.onmessage = this._onReceiveEvent;
        ws.onerror = this._onSocketError;
        ws.onclose = this._onSocketClose;
    }


    this._onReceiveEvent = function(event) {
        // event = {"type": x, "payload": {} }
        console.log(event.data);

        var data = JSON.parse(event.data);
        console.log("test before statement");
        console.log(data.type);
         console.log("whatever");

        if (data.type === "board_change") {
            console.log("test in if");
            // TODO: draw-modified-Board();
            drawBoardHelper(data.payload)
            console.log(data.payload.players);
            updateStatus(data.payload.players)
        } else if (data.type === "player_change") {
            console.log("test in else if");
            console.log(data.payload.player);
            // TODO: updateStatus();
            updateStatus_single(data.payload.player)
        }
    }

    this._onSocketError = function(error) {
        console.log(error);
    }

    this._onSocketClose = function(e) {
        console.log("socket closed");
    }

    this.init = function() {
        // setup eventlisteners
        this._setup_websocket_listener();
    }
};
