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

var rotate = 0;

stage.draw(function () {

    this.clear();

    this.addToStage(rect, { rotate: ++rotate });

    // debugBoundingBox(rect);

});
