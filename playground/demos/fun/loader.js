var circle = new Facade.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 100,
        fillStyle: '',
        strokeStyle: '#333E4B',
        lineWidth: 20,
        closePath: false,
        anchor: 'center'
    }),
    action = 'load',
    progress = 0;

stage.draw(function () {

    this.clear();

    if (action === 'load') {

        if (++progress >= 100) {

            action = 'unload';

        }

    } else if (action === 'unload') {

        if (--progress <= 0) {

            action = 'load';

        }

    }

    this.addToStage(circle, { opacity: 25 });
    this.addToStage(circle, { end: (progress / 100) * 360 });

    updatefps();

});
