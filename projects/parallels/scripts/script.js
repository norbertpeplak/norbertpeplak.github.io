$(function () {

    Slider.init();
    Portfolio.init();
    Lightbox.init();
    
    $("#search-button").on("click", toggleSearch);

    // rozwijanie menu za pomocą hamburgera
    $("#nav-button").on("click", function () {
        if ($(this).attr("aria-expanded") === "false") {
            $(this).attr("aria-expanded", "true")
        } else {
            $(this).attr("aria-expanded", "false")
        }

        $('#navigation').toggleClass("open-nav");
        $(this).toggleClass("open");
        ScrollingNavbar.onScroll();

    });

    $('a.page-scroll').on('click', function (e) {
        e.preventDefault();
        var hash = $(this);
        ScrollingNavbar.scroll_moving = true;

        $('html, body').stop().animate({
            scrollTop: $(hash.attr('href')).offset().top
        }, 1500, function () {
            ScrollingNavbar.scroll_moving = false;
            ScrollingNavbar.previous_position = $(window).scrollTop();
        });
    });

    // Walidacja formularza
    function validateForm() {
        var user = {};
        user.name = $("#fullname");
        user.mail = $("#email");
        user.message = $("#message");

        var emailregexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        var valid = true;

        for (var i in user) {

            if (!user[i].val()) {

                user[i].addClass('invalid');
                valid = false;
            } else {
                user[i].removeClass('invalid');
            }
        }

        if (!emailregexp.test(user.mail.val())) {
            user.mail.addClass('invalid');
            valid = false;
        }

        if (!valid) {
            alert("Fields cannot be empty");
            return false;
        } else {
            window.location.reload();
        }
    }

});

$(window).on("load", function () {
    $('#preloader').fadeOut();
    $('#home').addClass("visible-y");
    $(".masthead").fadeIn(2000);

    ScrollingNavbar.onScroll();
});

$(window).scroll(ScrollingNavbar.onScroll);
