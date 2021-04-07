$('document').ready(function () {
    let data_toggle = $('.cpt').attr('data-toggle');
    $('.caption').html(data_toggle);


    $('.owl-carousel').owlCarousel({
        responsive: {
            0: {
                items: 1
            }
        }
    })
})