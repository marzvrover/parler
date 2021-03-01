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
    log("Socket connected");
    popupMessage();
}
function disconnectFunction() {
    log("Socket disconnected");
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
    $("#message").keydown(function(e) { if (e.which == 13) { e.preventDefault(); sendMSG(); } });
  });
$(window).on('resize',function(){size();});
function keyDownUsername (event) {
  if (event.keyCode) kC = event.keyCode;
  if (kC == 13) loginStart();
}

function size() {
    $("#messages").height($("#wrapper").height()-50);
    $("#message").width($("#messages").width()-66);
}
