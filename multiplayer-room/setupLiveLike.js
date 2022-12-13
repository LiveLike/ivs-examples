(function (LiveLike) {
  function showApp() {
    // Hide the room inputs and show the app
    const appContainer = document.querySelector(".app.hidden");
    appContainer.classList.remove("hidden");
    const createRoomContainer = document.querySelector(".create-room");
    createRoomContainer.classList.add("hidden");
  }

  function loadChatElement(roomId) {
    // The roomId is used to set the "roomid" attribute on the livelike-chat element
    // This loads the chat room and messages.
    // Joining a room is not necessary for loading the livelike-chat element.
    const livelikeChat = document.querySelector("livelike-chat");
    livelikeChat.roomid = roomId;
  }

  function createMemberListItem(membership) {
    // Create and add list item of profile nickname for a room member
    const memberList = document.querySelector(".member-list");
    const member = document.createElement("div");
    member.innerHTML = membership.profile.nickname;
    member.classList.add("member");
    memberList.append(member);
  }

  function loadMembershipList(roomId){
    // Gets list of all members of current room, and then creates a list item element for each member
    LiveLike.getChatRoomMemberships({roomId}).then(memberships => {
      memberships.results.forEach(createMemberListItem);
    })
  }

  function joinChatRoom(roomId){
    // Current user joins room to become member.
    LiveLike.joinChatRoom({ roomId })
      .then((membership) => {
        // If current user is not already a member, a member list item is created
        createMemberListItem(membership);
        showApp();
      })
      // If user is already a member of the room, proceed to app.
      .catch(showApp);
  }

  function handleRoomLoad(roomId) {
    loadChatElement(roomId);
    loadMembershipList(roomId);
    joinChatRoom(roomId);
  }

  function handleRoomCreation() {
    // Used to create a new room
    const createRoomBtn = document.querySelector("#create-room");

    createRoomBtn.addEventListener("click", () => {
      // Get user created room name from input
      const roomName = document.querySelector("#room-name").value;
      // Create a new chatroom with the chosen name
      LiveLike.createChatRoom({ title: roomName }).then((room) => {
        // The createChatRoom method returns a room object with an "id" property.
        handleRoomLoad(room.id);
      });
    });
  }

  function handleJoinExistingRoom() {
    // Used to join an existing room
    const joinRoomBtn = document.querySelector("#join-room");

    joinRoomBtn.addEventListener("click", () => {
      // A valid Room Id must be entered in the input, and it is used to load to the chat and join the room.
      const roomId = document.querySelector("#room-id").value;
      handleRoomLoad(roomId);
    });
  }

  LiveLike.init({
    clientId: "EdJobYfKk4GMiv5qG3F3GlKNZRPO9gTa8wnVtVyS",
    endpoint: "https://cf-blast-qa.livelikecdn.com/api/v1/",
  }).then((profile) => {
    handleRoomCreation();
    handleJoinExistingRoom();
  });
})(window.LiveLike);

// 031399e3-f6e9-4897-b74c-2e58a95c659c
