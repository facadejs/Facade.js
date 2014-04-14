var text = new Facade.Text('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', {
    x: stage.width() / 2,
    y: stage.height() / 2,
    width: 300,
    fontSize: 30,
    anchor: 'center',
    textAlignment: 'center'
});

stage.draw(function () {

    this.clear();

    this.addToStage(text);

    // debugBoundingBox(text);

});
