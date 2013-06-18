var socket = io.connect("http://nodie.s_bash.c9.io");
var username;
socket.on('connectionsuccess',getUsername);
socket.on("messagereceived",displayMessage);
socket.on('userregistered',displayUsers);
socket.on('joined',addUserToChat);
socket.on('left',removeUserFromChat);

function getUsername() {
    var usrn = document.createElement("input");
    var usrb = document.createElement("input");
    var lgtb = document.getElementById('lgtb');
    var reg_box = document.getElementById("reg-box");
    usrn.type = "input";
    usrn.id = "usn-box";
    usrn.placeholder = "Enter a Name";
    usrb.type="button";
    usrb.value = "Join";
    usrb.onclick = sendUsername;
    reg_box.appendChild(usrn);
    reg_box.appendChild(usrb);
}

function sendUsername(user) {
    
    var usrn = document.getElementById("usn-box").value;
    username = usrn;
    socket.emit("registeruser",{"username":username});
    document.getElementById("reg-box").innerHTML = "";
}

function displayUsers(data) {
    var box = document.getElementById("usrs-box");
    for(k in data.users) {
        var litem = document.createElement("li");
        var nameString = data.users[k];
        var uline = document.createElement("span");
        var uline_end = document.createElement("span");
        uline.className = "t-over";
        uline.textContent = nameString.substring(0,2);
        litem.appendChild(uline);
        litem.className = "u-name";
        uline_end.textContent = nameString.substring(2,nameString.length);
        litem.appendChild(uline_end);
        box.appendChild(litem);
    }
    showChat();
    showLogout();
}

function addUserToChat(data) {
    var box = document.getElementById("usrs-box");
    var litem = document.createElement("li");
    var nameString = data.user;
    var uline = document.createElement("span");
    var uline_end = document.createElement("span");
    uline.className = "t-over";
    uline.textContent = nameString.substring(0,2);
    litem.appendChild(uline);
    litem.className = "u-name";
    uline_end.textContent = nameString.substring(2,nameString.length);
    litem.appendChild(uline_end); 
    box.appendChild(litem);
}

function showLogout() {
    var status_bar = document.getElementById("status-bar");
    var lgbt = document.createElement("input");
    lgbt.type="button";
    lgbt.value = "Logout";
    lgbt.onclick = logoutUser;
    status_bar.appendChild(lgbt);
}

function removeUserFromChat(data) {
    var box = document.getElementById("usrs-box");
    var list = box.childNodes;
    for( k in list) {
        if(list[k].textContent === data.user) {
            box.removeChild(list[k]);
        }
    }
}

function displayMessage(data) {
    var msgnode = document.getElementById("msg-node");
    var msg_container = document.createElement("li");
    var msg_item = document.createElement("span");
    var msg_sndr = document.createElement("span");
    msg_container.className = "msg-container";
    msg_item.className = "msg-element";
    msg_sndr.className = "msg-sndr-name";
    msg_item.textContent = data.message;
    msg_sndr.textContent = data.sender.substring(0,2);
    msg_container.appendChild(msg_sndr);
    msg_container.appendChild(msg_item);
    msgnode.appendChild(msg_container);
}

function sendMessage(e) {
    var msg = document.getElementById("msg-text").value;
    var msg_obj = {"sender":username,"message":msg};
    displayMessage({"message":msg,"sender":username});
    socket.emit("messagesent",msg_obj);
    document.getElementById("msg-text").value = "";
}

function showChat() {
    var chat_bar = document.createElement("div");
    var chat_input = document.createElement("input");
    var chat_button = document.createElement("input");
    var inp_node = document.getElementById("inp-node");
    chat_input.id = "msg-text";
    chat_input.type = "text";
    chat_input.placeholder = "Type a message";
    chat_input.className = "chat-message-input";
    chat_button.type = "button";
    chat_button.value = "Send";
    chat_button.onclick = sendMessage;
    chat_bar.appendChild(chat_input);
    chat_bar.appendChild(chat_button);
    inp_node.appendChild(chat_bar);
}

function logoutUser() {
    socket.emit("disconnecting",{"username":username});
    var body = document.getElementsByTagName('body');
    body[0].textContent = '';
    var gb_msg = document.createElement("div");
    gb_msg.className = 'goodbye-msg';
    gb_msg.textContent = "Bye Bye See You Again !";
    body[0].appendChild(gb_msg);
    socket.disconnect();
}