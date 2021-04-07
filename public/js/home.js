$(document).ready(function () {
    // header slider
    let leftButton = $('.story .buttons button').eq(0);
    let rightButton = $('.story .buttons button').eq(1);
    let itemsStory = $('.story .story-section').length;
    let a = 0;
    leftButton.click(function (e) {
        rightButton.css("display", "block");
        let b = 170 * (itemsStory - 6); //2200
        if (a > b) {
            $('.story .buttons button').eq(0).css("display", "none");
        } else {
            a += 150;
            let story = $('.story .story-container');
            story.css({
                transform: `translateX(${a}px)`
            });
        }
    });

    rightButton.click(function (e) {
        leftButton.css("display", "block");
        if (a <= 0) {
            $('.story .buttons button').eq(1).css("display", "none");
        } else {
            a -= 150;
            let story = $('.story .story-container');
            story.css({
                transform: `translateX(${a}px)`
            });
        }
    });

    // siper slider
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: false,
        speed: 500,
        effect: "coverflow"
    })



    // Bookmark
    var hearts = document.querySelectorAll('.heart img');
    var bookmarks = document.querySelectorAll(".bookmark img");


    bookmarks.forEach((bookmark) => {
        if (bookmark.getAttribute("data-black") == "true") {
            bookmark.removeAttribute('data-black');
            bookmark.setAttribute('data-black', "true");
            bookmark.setAttribute('src', "http://localhost:5000/img/font-awesome/bookmark-siah.svg");
        } else {
            bookmark.removeAttribute('data-black');
            bookmark.setAttribute('data-black', "false");
            bookmark.setAttribute('src', "http://localhost:5000/img/font-awesome/bookmark-sefid.svg");
        }

        bookmark.addEventListener('click', (e) => {
            if (bookmark.getAttribute("data-black") == "false") {
                bookmark.removeAttribute('data-black');
                bookmark.setAttribute('data-black', "true");
                bookmark.setAttribute('src', "http://localhost:5000/img/font-awesome/bookmark-siah.svg");
                let data_username = bookmark.parentElement.getAttribute('data-username');
                let data_id = bookmark.parentElement.getAttribute('data-id');
                $.ajax({
                    url: "PUT",
                    method: "PUT",
                    url: `/post-add-bookmark/${data_username}/${data_id}`,
                    success: function (data) {
                    }, error: function (err) {
                        console.log(err)
                    }
                })
            } else {
                bookmark.removeAttribute('data-black');
                bookmark.setAttribute('data-black', "false");
                bookmark.setAttribute('src', "http://localhost:5000/img/font-awesome/bookmark-sefid.svg");
                let data_username = bookmark.parentElement.getAttribute('data-username');
                let data_id = bookmark.parentElement.getAttribute('data-id');
                $.ajax({
                    url: "PUT",
                    method: "PUT",
                    url: `/post-remove-bookmark/${data_username}/${data_id}`,
                    success: function (data) {
                    }, error: function (err) {
                        console.log(err)
                    }
                })
            }
        })
    })

    // bookmark




    // like and dislike
    hearts.forEach((heart) => {
        if (heart.getAttribute('data-black') == "true") {
            heart.removeAttribute('src');
            heart.setAttribute('src', "http://localhost:5000/img/font-awesome/heart-siah.svg");
        } else {
            heart.removeAttribute('src');
            heart.setAttribute('src', "http://localhost:5000/img/font-awesome/heart-sefid.svg");
        }
        heart.addEventListener('click', (e) => {
            e.preventDefault();
            if (heart.getAttribute('data-black') == "false") {
                heart.parentElement.parentElement.parentElement.nextElementSibling.lastElementChild.innerHTML = parseInt(heart.parentElement.parentElement.parentElement.nextElementSibling.lastElementChild.innerHTML) + 1;
                heart.removeAttribute('data-black');
                heart.setAttribute('data-black', "true");
                heart.removeAttribute('src');
                heart.setAttribute('src', "http://localhost:5000/img/font-awesome/heart-siah.svg");
                let data_username = heart.parentElement.getAttribute('data-username');
                let data_id = heart.parentElement.getAttribute('data-id');
                $.ajax({
                    type: "PUT",
                    method: "PUT",
                    url: `/post-like/${data_username}/${data_id}`,
                    success: function (data) {
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            } else {
                heart.parentElement.parentElement.parentElement.nextElementSibling.lastElementChild.innerHTML = parseInt(heart.parentElement.parentElement.parentElement.nextElementSibling.lastElementChild.innerHTML) - 1;
                heart.removeAttribute('data-black');
                heart.setAttribute('data-black', "false");
                heart.removeAttribute('src');
                heart.setAttribute('src', "http://localhost:5000/img/font-awesome/heart-sefid.svg");
                let data_username = heart.parentElement.getAttribute('data-username');
                let data_id = heart.parentElement.getAttribute('data-id');
                $.ajax({
                    type: "PUT",
                    method: "PUT",
                    url: `/post-dislike/${data_username}/${data_id}`,
                    success: function (data) {
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            }
        })
    })



    // show thriple 
    let thriple_point = $('.body .body-header .thriple-point');
    let thriple_modal = $('.body .body-section .thriple-point-modal');
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
});