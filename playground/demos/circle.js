var circle = new Facade.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 100,
    lineWidth: 10,
    strokeStyle: '#333E4B',
    fillStyle: '#1C73A8',
    anchor: 'center'
});

stage.draw(function () {

    this.clear();

    this.addToStage(circle);

});
