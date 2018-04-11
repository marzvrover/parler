



Tokens used for cookies.
/ * Tokens * /
Key: Members
	Members: {"username": username, "password": password.hash, "tokens": tokens.array, "chats": chats.arrayOfIds, "id": member.id}

/ * Chatrooms * /
Key: Chatrooms
	Chatrooms: {"roomname": roomname, "roomPass": chatroomPassword, "id": chatroom.id}
		chatroomPassword = (0 if no password) || (1 if restricted no password) || (password over 5 char if password);