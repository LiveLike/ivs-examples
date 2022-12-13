function displayWidgetFromId(parsedMetaData) {
  const livelikeWidgets = document.querySelector("livelike-widgets");

  livelikeWidgets.createWidgetElement({
    id: parsedMetaData.widgetId,
    kind: parsedMetaData.widgetKind,
  });
}

function displayWidgetFromData(parsedMetaData) {
  const livelikeWidgets = document.querySelector("livelike-widgets");

  const tag = parsedMetaData.tagName || "livelike-" + parsedMetaData.kind;
  const widget = document.createElement(tag);
  widget.widgetPayload = {...parsedMetaData.widgetPayload};
  Object.assign(widget, parsedMetaData.widgetPayload);

  livelikeWidgets
    .attach(widget)
    .then(() => widget.interactive({ timeout: 10000 }))
    .then(() => widget.results({ timeout: 3000 }))
    .then(widget.detach);
}

