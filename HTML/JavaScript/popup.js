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
