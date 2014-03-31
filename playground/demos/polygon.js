var polygon = new Facade.Polygon({
    x: stage.width() / 2,
    y: stage.height() / 2,
    points: [
        [87.1, -0.4],
        [259.2, 69.8],
        [234.2, 167.3],
        [60.6, 217.3],
        [-0.5, 112.6]
    ],
    lineWidth: 10,
    strokeStyle: '#333E4B',
    fillStyle: '#1C73A8',
    anchor: 'center'
});

stage.draw(function () {

    this.clear();

    this.addToStage(polygon);

});
