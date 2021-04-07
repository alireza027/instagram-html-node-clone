$(document).ready(function () {
    // owl-carousel slider for main pictures
    $('.owl-carousel').owlCarousel({
        rtl: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 4,
                nav: true,
            },
            768: {
                items: 6,
                nav: true
            },
        }
    });
})