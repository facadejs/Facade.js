var image = new Facade.Image('images/scott-pilgrim.png', {
    x: stage.width() / 2,
    y: stage.height() / 2,
    scale: 5,
    width: 36,
    frames: [0, 1, 2, 3, 4, 5, 6, 7],
    anchor: 'center'
});

stage.context.webkitImageSmoothingEnabled = false;

image.play();

stage.draw(function () {

    this.clear();

    this.addToStage(image);

    updatefps();

});
