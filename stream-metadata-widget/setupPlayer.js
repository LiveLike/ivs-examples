/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const alertMetaData = {
  tagName: "custom-alert",
  widgetPayload: {
    kind: "alert",
    id: "25ececc8-9389-4c5e-af53-7135dc20a4ec",
    widgetid: "25ececc8-9389-4c5e-af53-7135dc20a4ec",
    image_url:
      "https://cf-blast-storage-qa.livelikecdn.com/assets/244b7cb9-599b-43a5-84ad-74c96c2bd0f7.png",
    link_label: "Check out our sponsor",
    link_url: "https://example.com",
  },
};

const widgets = [
  { widgetId: "3e17e5df-dfbd-4d59-9f1e-80c7cff4d200", widgetKind: "text-quiz" },
  {
    widgetId: "36c4c4ec-cf0d-42cd-834e-6cb90594d3da",
    widgetKind: "cheer-meter",
  },
  { widgetId: "25ececc8-9389-4c5e-af53-7135dc20a4ec", widgetKind: "alert" },
];
// Playback configuration
// Replace this with your own Amazon IVS Playback URL
const playbackUrl =
  "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8";

// App
const videoPlayer = document.getElementById("video-player");
const waitMessage = document.getElementById("waiting");

(function (IVSPlayer) {
  const PlayerEventType = IVSPlayer.PlayerEventType;

  // Initialize player
  const player = IVSPlayer.create();
  player.attachHTMLVideoElement(videoPlayer);

  let widgetCounter = 0;
  let widgetAttached = false;
  document.addEventListener("widgetattached", () => {
    widgetAttached = true;
  });
  document.addEventListener("widgetdetached", () => {
    widgetAttached = false;
  });

  player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, function (cue) {
    // Video feed contains metadata, this event listener callback will fire every time a "cue" occurs.
    // This metadata can contain any arbitrary text data. Stringified JSON is useful to hold
    // multiple pieces of data that can then be used to instantiate widgets.
    const metadataText = cue.text;
    const parsedMetaData = JSON.parse(metadataText);

    function attachWidget() {
      if (widgetAttached) {
        setTimeout(attachWidget, 3000);
      } else {
        if (widgetCounter <= widgets.length - 1) {
          if (widgets[widgetCounter].widgetKind === "alert") {
            displayWidgetFromData(alertMetaData);
          } else {
            displayWidgetFromId(widgets[widgetCounter]);
          }
          widgetCounter++;
        }
      }
    }
    attachWidget()
  });

  // Setup stream and play
  player.setAutoplay(true);
  player.load(playbackUrl);

  // Setvolume
  player.setVolume(0.1);

  waitMessage.style.display = "";
})(window.IVSPlayer);
