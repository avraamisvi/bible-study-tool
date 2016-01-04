var csoundServer;

/*
  Connects with the kcsound server.
*/
function connect() {
  csoundServer = new WebSocket("ws://localhost:8887");
}

/*
  Sendo current composition to the server
*/
function playComposition() {
	orc = " sr = 44100 \n" +
  " ksmps = 32 \n" +
  " nchnls = 2 \n" +
  " 0dbfs = 1 \n" +
  " instr 1 \n" +
  " aout vco2 0.5, 440 \n" +
  " outs aout, aout \n" +
  " endin \n";

  sco = "i1 0 60 \n";

  csoundServer.send(JSON.stringify({
    type: "PLAY",
    composition: {
    orchestra: orc,
  	score: sco,
  	compiledId: -1
  }}));
}


function enableResizeContainers() {
  interact('#content2-panel2')
  .resizable({
    edges: { left: false, right: false, bottom: false, top: true }
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    //target.textContent = event.rect.width + '×' + event.rect.height;
  });
}
