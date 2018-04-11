var connectedAlready = false;
window.User;

//SETUP SOCKETS
var socket = io('127.0.0.1');
//var socket = io('http://gibber.mybluemix.net/');
socket.on('connect', function(){
          if (!connectedAlready) connectFunction();
          });
socket.on('event', function(data){

          });
socket.on('disconnect', function(){
          disconnectFunction();
          });
socket.on('addUser', function(data){
          addUser(data);
          });
socket.on('getUsers', function(data) {
          getUsers(data);
          });
socket.on('message', function(data) {
          displayMessage(data);
          //log(data);
          });

//SOCKET FUNCTIONS
function connectFunction() {
    log("Socket connected!!!");
    popupMessage();
}
function disconnectFunction() {
    log("Socket disconnected!!!");
}


function addUser(data) {
    //log(data);
    if (!data) popupMessage("Username taken. ");
}
function getUsers(data) {
    $("#members").val('');
    for (i = 0; i < data.length; ++i) {
        span = '<span id="member_' + i + '" class="members"/><span>';
        $("#members").append(span);
        $("#member_" + i).text(data[i]);
    }
    log(data);
}
function sendMSG() {
    msg = getMSG();
    if (msg) {
        socket.emit('message', msg);
        log(msg);
    }
}

//FUNCTIONS
function whoisThis(data) {
    if (!data) data = '';
    whoIS = '';
    while ((whoIS == '') || (whoIS == null)) whoIS = $("#usernameIN").val();// prompt(data + "Username?");
    window.User = whoIS;
    return { username : whoIS };
}

function getMSG() {
    msgText = $("#message").val();
    $("#message").val('');
    msgJson = { sender : window.User, message : msgText };
    return (msgText) ? msgJson : false;
}
$.valHooks.textarea = {
get: function( elem ) {
    return elem.value.replace( /\r?\n/g, "\r\n" );
}
};


function displayMessage(data) {
    if (data == null) return false;
    msgText = data.message;
    msgUser = data.sender;
    msgNum = data.msgNum;
    msg = "<span id='msg_" + msgNum + "'class='msg'><strong>" + msgUser + ": </strong></span>";
    $("#messages").prepend(msg);
    $("#msg_" + msgNum).append(document.createTextNode(msgText));
}

function loginStart() {
    whoIS = $("#usernameIN").val();
    if ((whoIS == null) || (whoIS == '')) {
        $("#usernameIN").val('');
        return false;
    }
    socket.emit('addUser', whoisThis(whoIS));
    closepopupMessage(null, 'killAll');
}

//GENERAL
function log(data) {
    console.log(data);
}
$(document).ready(function(){
                  size();
                  $("#messageBtn").on("click", sendMSG);
                  $("#message").keydown(function(e) { if (e.which == 13) { e.preventDefault(); sendMSG();} });
                  });
$(window).on('resize',function(){size();});
function keyDownUsername (event){
    if (event.keyCode) kC = event.keyCode;
    if (kC == 13) loginStart();
    };

function size() {
    $("#messages").height($("#wrapper").height()-50);
    $("#message").width($("#messages").width()-66);
}



/*
 * Popups core taken from the work I did on universeprojects.com
 */
window.popupsNum = 0;
window.popupsOpen = 0;
window.popupsArray = new Array();

$(window).resize(function() {
                 if (window.popupsOpen != 0) expandpopupMessage();
                 });

function popupMessage(msg) {
    window.popupsNum++;
    window.popupOpen++;
    window.popupsArray[popupsNum-1] = "yes";
    if (!msg) msg = '';
    $("#popups").show();
    currentPopups = $("#popups").html();
    $("#popups").html(currentPopups + '<div id="popupWrapperBackground_' + popupsNum + '" class="popupWrapperBackground"><div id="popupWrapper_' + popupsNum + '" class="popupWrapper"><div id="popup_' + popupsNum + '" class="popup">' + msg + '<div class="popup_username"><input id="usernameIN" name="usernameIN" type="text" placeholder="Username..." onkeypress="keyDownUsername(event)"/></div><div class="popup_password"><input id="passwordIN" name="passwordIN" type="password" placeholder="Password: not yet needed" /></div><input type="button" value="Login" class="loginBtn" id="loginBtn" name="loginBtn" onClick="loginStart(' + popupsNum + ');" title="Okay" /></div></div></div></div>');
    expandpopupMessage();
}
function currentPopup() {
    popupLast = $(".popupWrapperBackground").last();
    popupLastID = popupLast.attr("id");
    popupLastIDNum = popupLastID.split("_");
    return popupLastIDNum[1];
}
function closepopupMessage(popupID, all) {
    if (all == "killAll") {
        $(".popupWrapperBackground").remove();
        $("#popups").hide();
        window.popupsOpen = 0;
    }
    else if (popupID >= 1) {
        $("#popupWrapperBackground_" + popupID).remove();
        window.popupsOpen = window.popupsOpen-1;
        window.popupsArray[popupID-1] = "no";
        if (window.popupsOpen <= 0) {
            $("#popups").hide();
        }
        else enterPopupClose();
    }
}
function expandpopupMessage() {
    var winHeight = window.innerHeight;
    var popupWrapperH = winHeight-125;
    var popupWrapperM = - popupWrapperH / 2;
    var popupTextH = popupWrapperH-100;
    $(".popupWrapper").css("height", popupWrapperH + "px");
    $(".popupWrapper").css("margin-top", popupWrapperM + "px");
    $(".popup_text").css("max-height", popupTextH + "px");
    var popupM = ( - popupWrapperM - ($("#popup_text_" + currentPopup()).height())-100);
    if ($("#popup_" + currentPopup()).height() < popupTextH) $("#popup_" + currentPopup()).css("margin-top", popupM + "px");
}
