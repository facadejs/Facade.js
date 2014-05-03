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

stage.draw(function () {

    this.clear();

    rect.setOptions({ rotate: '+=1' });

    this.addToStage(rect);

    // debugBoundingBox(rect);

});
