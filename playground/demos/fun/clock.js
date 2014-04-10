var tick = new Facade.Line({
        x: stage.width() / 2,
        y: stage.height() / 2,
        anchor: 'top/left'
    }),
    clock_face = new Facade.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 150,
        fillStyle: '#fff',
        strokeStyle: '#000',
        strokeWidth: 10,
        anchor: 'center'
    }),
    clock_hand_anchor = new Facade.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 10,
        fillStyle: '#000',
        anchor: 'center'
    });

stage.draw(function () {

    var date = new Date(),
        current_second = date.getSeconds(),
        current_minute = date.getMinutes(),
        current_hour = date.getHours() % 12,
        r;

    this.clear();

    this.addToStage(clock_face);

    // Every Minutes
    for (r = 6; r < 360; r = r + 6) {
        this.addToStage(tick, {
            y1: -115,
            y2: -140,
            lineWidth: 3,
            rotate: r
        });
    }

    // Every Five Minutes
    for (r = 0; r < 360; r = r + 30) {
        this.addToStage(tick, {
            y1: -100,
            y2: -140,
            lineWidth: 6,
            rotate: r
        });
    }

    // Hour Hand
    this.addToStage(tick, {
        y2: -70,
        lineWidth: 8,
        rotate: (current_hour + current_minute / 60) * 30
    });

    // Minute Hand
    this.addToStage(tick, {
        y2: -90,
        lineWidth: 6,
        rotate: current_minute * 6
    });

    // Second Hand
    this.addToStage(tick, {
        y2: -160,
        lineWidth: 3,
        strokeStyle: '#f00',
        rotate: current_second * 6
    });

    this.addToStage(clock_hand_anchor);

    updatefps();

    // debugBoundingBox(clock_face);

});
