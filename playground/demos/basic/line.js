var line = new Facade.Line({
    x: stage.width() / 2,
    y: stage.height() / 2,
    x2: 200,
    lineWidth: 10,
    strokeStyle: '#333E4B',
    anchor: 'center'
});

stage.draw(function () {

    this.clear();

    this.addToStage(line);

    // debugBoundingBox(line);

});
