var rect = new Facade.Rect({
    x: stage.width() / 2,
    y: stage.height() / 2,
    width: 200,
    height: 200,
    lineWidth: 10,
    strokeStyle: '#333E4B',
    fillStyle: '#1C73A8',
    anchor: 'center'
});

var scale = 0;

stage.draw(function () {

    this.clear();

    scale = scale + 0.025;

    if (scale > 1) { scale = 0; }

    this.addToStage(rect, { scale: scale });

    updatefps();

});
