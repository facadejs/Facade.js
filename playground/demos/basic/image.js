var image = new Facade.Image('images/scott-pilgrim.png', {
    x: stage.width() / 2,
    y: stage.height() / 2,
    width: 36,
    scale: 5,
    anchor: 'center'
});

stage.context.webkitImageSmoothingEnabled = false;

stage.draw(function () {

    this.clear();

    this.addToStage(image);

    // debugBoundingBox(image);

});
