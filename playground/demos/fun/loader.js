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
    progress = 0;

stage.draw(function () {

    this.clear();

    if (progress < 100) {

        progress = progress + 1;

        if (progress >= 100) {

            setTimeout(function () {

                progress = 0;

            }, 1000);

        }

    }

    this.addToStage(circle, { opacity: 25 });
    this.addToStage(circle, { end: (progress / 100) * 360 });

    updatefps();

});
