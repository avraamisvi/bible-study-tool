var EventInstrumentItemDelete      = "InstrumentItemDelete-";
var EventInstrumentItemChangeColor = "InstrumentItemChangeColor-";
var EventTrackLineDelete = "TrackLineDelete-";

function dispachCustomEvent(name, data) {
  var event = new CustomEvent(name, {"detail": data});
  document.dispatchEvent(event);
}
