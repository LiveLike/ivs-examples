# LiveLike and AWS IVS Integration Sample

This repository contains an example of integrating the LiveLike SDK and Amazon IVS in an application.

## Requirements

1. A LiveLike account
2. A LiveLike Application that can be created through the [LiveLike Producer Suite](https://cf-blast.livelikecdn.com/).
3. A [LiveLike Client ID](https://docs.aws.amazon.com/ivs/latest/userguide/getting-started.html).
4. An AWS Account to use [AWS IVS](https://docs.aws.amazon.com/ivs/latest/userguide/getting-started.html).
5. A stream url to load video.

## Getting Started

### LiveLike

To set up LiveLike, first import the SDK by including the script tag.

```html
<script src="https://unpkg.com/@livelike/engagementsdk@2.19.0/livelike.umd.dev.js"></script>
```

Next, initialize the LiveLike SDK using the LiveLike Client ID.

```html
<script>
  LiveLike.init({ clientId: "<CLIENT ID>" }).then((profile) => {
    // This will generate a new profile
    console.log("LiveLike is connected!");
  });
</script>
```

More Information about setting up the LiveLike SDK, and installing LiveLike with NPM can be found [here](https://docs.livelike.com/docs/getting-started-with-the-web-sdk)

### Amazon IVS

To set up Amazon IVS, the script tag is added.

```html
<script src="https://player.live-video.net/1.8.0/amazon-ivs-player.min.js"></script>
```

The stream playback URL is used to initialize the Amazon IVS Player with a video element.

```html
<video id="video-player" playsinline></video>
<script>
  const player = IVSPlayer.create();
  const videoPlayer = document.querySelector("#video-player");
  player.attachHTMLVideoElement(videoPlayer);
  player.load(PLAYBACK_URL);
  player.play();
</script>
```

More information about setting up AWS IVS can be found [here](https://docs.aws.amazon.com/ivs/latest/userguide/player-web.html)

## Video Metadata Widgets

### About

In this sample, a video stream containing metadata plays. The metadata must be included in the stream at the time of video encoding. Then the metadata `cue` is fired at predetermined intervals while the stream plays. This `cue` can be listened to with an event listener.

The `cue` event can contain a `text` property, which is a string, and can be stringified JSON. This can be utilized to add any arbitrary data to be encoded in the video stream. This stringified JSON can then be parsed when the `cue` is fired, allowing us to make changes in our application, such as showing some UI.

The sample uses mock metadata to show the functionality, but includes an example stream with working metadata cues. You can include your own stream containing metadata to further test and make changes to this sample.

### Steps

First, the steps for getting started with the LiveLike SDK above must be followed.

Next, we will place a `livelike-widgets` element on our page. This must contain the `programid` property, which can be found by following [these steps](https://docs.livelike.com/docs/retrieving-important-keys#retrieving-program-id).

```html
<livelike-widgets programid="<Program ID>"></livelike-widgets>
```

Next, we are going to create two functions. The first function, `displayWidgetFromId` will display a LiveLike widget that has been published. We will be displaying a `Text Quiz` widget. A widget can be published either through the [LiveLike Producer Suite](https://docs.livelike.com/docs/widgets), or it can be published through the [LiveLike API](https://docs.livelike.com/reference#widgets-basics).

Once a widget has been published, the widget's `id` property will be available, either through the Producer Suite or through the API response that is received after publishing the widget. This widget `id` will be used to display the widget.

The `displayWidgetFromId` will call the `createWidgetElement` method that is present on the `livelike-widgets` element. By passing a widget's `id` and `kind`, the widget UI will be displayed on the page.

```js
function displayWidgetFromId(parsedMetaData) {
  const livelikeWidgets = document.querySelector("livelike-widgets");
  livelikeWidgets.createWidgetElement({
    id: parsedMetaData.widgetId,
    kind: parsedMetaData.widgetKind,
  });
}
```

The second function is `displayWidgetFromData`. Our mock metadata contains a `question` and `choices` properties, which will be used to instantiate the widget UI.

First, since we want to display a `Text Quiz` widget, we will create the HTML element `livelike-text-quiz`. The widgetPayload object with the correct `kind` property is added to the widget HTML element, along with the `question` and `choices` properties.

Then we attach the widget to the `livelike-widgets` element using the `attach` method, and further define the behavior of the widget. In the below example the widget will be expected to:

1. Be interactive for 10 seconds, and allow answers.
2. Lock the widget for 3 seconds and display the results of the answers.
3. Remove the widget from the page.

```js
function displayWidgetFromData(parsedMetaData) {
  const livelikeWidgets = document.querySelector("livelike-widgets");

  const quiz = document.createElement("livelike-text-quiz");
  quiz.widgetPayload = { kind: "quiz" };
  quiz.question = parsedMetaData.question;
  quiz.choices = parsedMetaData.choices;

  livelikeWidgets
    .attach(quiz)
    .then(() => quiz.interactive({ timeout: 10000 }))
    .then(() => quiz.results({ timeout: 3000 }))
    .then(quiz.detach);
}
```

Next, we will set up the IVSPlayer to trigger the above functions based on stream metadata. The steps for getting started with the IVSPlayer above must be followed.

Once the player has been created, an event listener is added to our `player`, listening to the `PlayerEventType.TEXT_METADATA_CUE` event. The callback will provide the `cue`.

To get the data from the cue, the `text` property from our `cue` event can be parsed.

For sample purposes, we will use mock data for instantiating the widgets.

In the first example, the metadata contains a widget `id` and `kind` of a widget that we have already published. This is passed to the `displayWidgetFromId` function, which will then display the widget after loading the widget data.

In the second example, we are displaying a widget from data that we are defining. No widget needs to be published to display the widget UI using this method. The `question` and `choices` properties from the mock metadata are passed to the `displayWidgetFromData` function, which directly creates and displays our widget HTML Element.

```js
player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, function (cue) {
  //
  const parsedMetaData = JSON.parse(cue.text);

  // Mock data to display a widget from parsed data containing an existing widget id and kind.
  const mockParsedMetaData = {
    widgetId: "3e17e5df-dfbd-4d59-9f1e-80c7cff4d200",
    widgetKind: "text-quiz",
  };
  displayWidgetFromId(mockParsedMetaData.widgetId);

  // Mock data to display a widget created from data
  const mockParsedMetaData = {
    question: "Example Quiz Question",
    choices: [
      { description: "Choice 1", is_correct: true },
      { description: "Choice 1", is_correct: false },
    ],
  };
  displayWidgetFromData(mockParsedMetaData);
});
```

## Multi Video Player Room

### About

In this sample, we are using the "Multiple Players" example in the [Amazon IVS Web Sample repo](https://github.com/aws-samples/amazon-ivs-basic-web-sample).

LiveLike room functionality is added to allow for creating and joining rooms, as well as sending and receiving chat messages.

### Steps

First, we place our `livelike-chat` element on the page. This is LiveLike's pre-built chat room experience. It requires a `roomid` attribute to initialize, and that will be added later.

```html
<livelike-chat></livelike-chat>
```

After setting up the IVSPlayer the LiveLike SDK must be initialized. We can only call our LiveLike functions after `LiveLike.init()` runs to ensure the LiveLike SDK has been fully initialized.

```js
LiveLike.init({
  clientId: "EdJobYfKk4GMiv5qG3F3GlKNZRPO9gTa8wnVtVyS",
  endpoint: "https://cf-blast-qa.livelikecdn.com/api/v1/",
}).then((profile) => {
  handleRoomCreation();
  handleJoinExistingRoom();
});
```

Next, we'll create the `handleRoomCreation` and `handleJoinExistingRoom` function.

In the `handleRoomCreation` function, we take the user's input for the room name, and pass that to the `LiveLike.createChatRoom` function. This will resolve a `room` object, containing a room `id` that we will use to initialize and join our chat room.

In the `handleJoinExistingRoom`, instead of creating a chat room, we take the user's input for the `id` of a chat room that has already been created.

```js
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
```

Our `handleRoomLoad` function can now be created, passing in our room `id`, calling multiple functions.

The first is `loadChatElement`. This adds the `roomid` attribute to the `livelike-chat` element, initializing the element and loading the chat room and chat messages.

The next is `loadMembershipList`, which will create a list of all of the members that have joined a room, if there are any.

The last is `joinChatRoom`, which calls `LiveLike.joinChatRoom` to add the current user as a member to the room.

Both `loadMembershipList` and `joinChatRoom` will call `createMemberListItem`, which creates the member list on the page.

The `livelike-chat` element does not require joining the room to function. Simply adding the `roomid` attribute to the element will automatically load all of the room's messages and allow the user to send and receive new messages.

```js
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

function loadMembershipList(roomId) {
  // Gets list of all members of current room, and then creates a list item element for each member
  LiveLike.getChatRoomMemberships({ roomId }).then((memberships) => {
    memberships.results.forEach(createMemberListItem);
  });
}

function joinChatRoom(roomId) {
  // Current user joins room to become member.
  LiveLike.joinChatRoom({ roomId })
    .then((membership) => {
      // If current user is not already a member, a member list item is created
      createMemberListItem(membership);
    })
}

function handleRoomLoad(roomId) {
  loadChatElement(roomId);
  loadMembershipList(roomId);
  joinChatRoom(roomId);
}
```
