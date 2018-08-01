function scrollingNavbar() {
    var nav = $('.nav-bar');
    if (nav.offset().top <= 50 && !nav.hasClass("open-nav")) {
        nav.removeClass("nav-background");
    } else {
        nav.addClass("nav-background");
    }

    var animation_elements = $('.animate');

    var $window = $(window);
    var window_height = $window.height();
    var window_top_position = $window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);

    $.each(animation_elements, function () {

        var element = $(this);
        var element_height = element.outerHeight();
        var element_top_position = element.offset().top;

        var offset = 150;

        if (window_bottom_position - element_top_position >= offset) {

            if (element.hasClass("left")) {
                element.addClass("animate-to-left");

            } else {
                element.addClass("animate-to-top");
            }
            element.removeClass("animate");
        }
    });
}

function validateForm() {
    var user = {};
    user.name = $("#fullname");
    user.mail = $("#email");
    user.subject = $("#subject");
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
        alert("Pola nie mogą być puste, e-mail musi być poprawny");
        return false;
    } else {
        window.location.reload();
    }
}


$(function () {

   var nav = $('.nav-bar').removeClass("nav-background");

    scrollingNavbar();

    $("#nav-button").on("click", function () {
        if ($(this).attr("aria-expanded") === "false") {
            $(this).attr("aria-expanded", "true")
        } else {
            $(this).attr("aria-expanded", "false")
        }

        if (!nav.hasClass("nav-background")) {
            nav.addClass("nav-background");
        }

        nav.toggleClass("open-nav");
        $(this).toggleClass("open");

    });

    $('a.page-scroll').on('click', function (e) {
        e.preventDefault();
        var hash = $(this);

        $('html, body').stop().animate({
            scrollTop: $(hash.attr('href')).offset().top
        }, 1500);
    });
});

$(window).on("load", function () {

    $('#preloader').fadeOut();
    $('#home').addClass("visible-y");
    $(".logo").hide().delay(500).fadeIn(1500);

    if ($("#nav-menu").is(':visible')) {
        $("#nav-menu").hide().delay(500).fadeIn(1500);
    } else {
        $("#nav-button span").css({
                "opacity": 0,
                "transition": "none"
            }).delay(500)
            .animate({
                opacity: 1
            }, 1500, function () {
                $(this).css({
                    opacity: "",
                    "transition": ""
                });
            });
    }

    $(".header-info").hide().delay(500).fadeIn(1500);
});

$(window).on('scroll resize', scrollingNavbar);