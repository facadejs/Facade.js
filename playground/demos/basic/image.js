var image = new Facade.Image('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA7CAMAAAAkXtjkAAAAJ1BMVEUAAAAAAADXg1//3LJxXVeljIWUWEkvWD8xr2XnloX////V7vP+6Np8C7rrAAAAAXRSTlMAQObYZgAAAaxJREFUeNql0tGWgzAIBFCnChbt/3/vTgIpRePTjs0xTe7BSLuUIFPWC9GXR/WBASEGnLAkGRQApHlSFPN8isJnaj6/taD8PjMVcYVRjhfnMWOoEulLe384gLbXhV6QOgKjoFQOkoqYbg5nvPihKocC0M1xIKO1UzAzJMqSFUH5CcQp7wRtZGAGXoEsEFPRirVvMljXrm+IG6txAG2q7X5HCrBayQV5a9QV5gjxGIRipsYM0YrHOkRYQ40sFbkxeNRsokBDBGbf97gxqMiIYu/9dsHJ+/rjqoaJzBQjTcEJvG45F0TkhH1Rb4MBqopayszgCN5yBTFweUFT/CKDcIJbG7An4v45UCqaOHcis0B5rgX9xXdYRdVFK0NBgDSJops7IsvdRHZPimI2kY1xOFXYNjlP2XjRzh8GkWbgiBWfzChxUnM2M98Dyck0fkMUYbB1NUMhFiZKXRHGaeI9/XkzlKsQR/g/8lbJiQkqaksUazfEpMoGBKpKgGsrSynPV4GRnlIqMhp8HAJPoqpwtIikyVLwOHLHerc/szBUyNTeEYyHLE8ZJutPVdb/A780E6xeZvJVAAAAAElFTkSuQmCC',{
    x: stage.width() / 2,
    y: stage.height() / 2,
    scale: 5,
    anchor: 'center'
});

stage.context.webkitImageSmoothingEnabled = false;

stage.draw(function () {

    this.clear();

    this.addToStage(image);

});
