$(document).ready(function () {
    // show thriple 
    let thriple_point = $('.header-top .thriple-point');
    thriple_point.click(function (e) {
        e.preventDefault();
        if ($(this).attr("data-tog") == "false") {
            $(this).attr('data-tog', "");
            $(this).next('div .thriple-point-modal').eq(0).show(700).slideDown(700);
        } else {
            $(this).attr('data-tog', 'false');
            $(this).next('div .thriple-point-modal').eq(0).hide(700).slideUp(700);
        }
    })

    let bio = $("#span_data_bio").attr('data-bio');
    $('#bio').html(bio);
})
