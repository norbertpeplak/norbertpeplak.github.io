var Variables = {
    updated_projects: 0,
    current_projects: 0,
    image_set: 0
}

// Funkcja dodająca dotykowe zmienianie elemenów
jQuery.fn.extend({
    addTouch: function (triggerPrev, triggerNext) {
        $(this).on("touchstart", function (event) {
            var tap = event.originalEvent.touches[0].pageX;
            $(this).one("touchmove", function (event) {
                var move = event.originalEvent.touches[0].pageX;

                if (Math.floor(tap - move) > 10) {
                    $(triggerPrev).trigger("click");
                } else if (Math.floor(tap - move) < -10) {
                    $(triggerNext).trigger("click");
                }
            });
            $(this).on("touchend", function () {
                $(this).off("touchmove touchend");
            });
        });
    }
});

// Naciśnięcie przycisku szukania
var toggleSearch = function () {
    $("#search-button").off("click");
    $("#search").val("");

    $("#search-form").fadeToggle(800, function () {
        $("#search-button").on("click", toggleSearch);
    });

    if ($(window).width() > 768) {
        var links = $('#navigation li:not(.search-item)');
        if (links.css('visibility') === 'hidden')
            links.css('visibility', 'visible');
        else
            links.css('visibility', 'hidden');
    }

}
var ScrollingNavbar = {
    previous_position: 0,
    direction: 0,
    scroll_moving: 0,
    nav: $('#navigation'),

    onScroll: function () {

        if (ScrollingNavbar.nav.offset().top <= 50 && !ScrollingNavbar.nav.hasClass("open-nav")) {
            ScrollingNavbar.nav.removeClass("navbar-moved");
        } else {
            ScrollingNavbar.nav.addClass("navbar-moved");
        }

        // Obsługa nawigacji - pojawianie i znikanie
        if (!ScrollingNavbar.scroll_moving) {
            var window_top_position = $(window).scrollTop();
            // On scroll down
            if (ScrollingNavbar.previous_position < window_top_position) {
                // On scroll down - wykonaj instrukcje tylko raz w danym kierunku
                if (ScrollingNavbar.direction !== "up") {
                    $('#navigation').css('position', 'absolute').removeClass("open-nav");
                    $("#nav-button").removeClass("open");
                    ScrollingNavbar.direction = "up";
                }
                // On scroll up
            } else {
                if (ScrollingNavbar.direction !== "down") {
                    $('#navigation').css('position', 'fixed').fadeIn(500).removeClass("open-nav");
                    $("#nav-button").removeClass("open");
                    ScrollingNavbar.direction = "down";
                }
            }
            ScrollingNavbar.previous_position = window_top_position;
        }
    }
}

var Slider = {
    variables: {
        backgrounds: ['url(images/banner.jpg)', 'url(images/banner2.jpg)', 'url(images/banner3.jpg)'],
        current: 0,
        timer: 0
    },
    init: function () {
        this.changeBackground();
        this.bindUI_changeBackground();
        $(".masthead").addTouch(".btn-slide.prev", ".btn-slide.next");
    },
    changeBackground: function () {
        $('.banner-text').css("display","none");
        $('.banner-text').eq(Slider.variables.current).css("display","block");
        
        $(".masthead").css({
            'opacity': 0,
            'background': Slider.variables.backgrounds[Slider.variables.current] + " 50% 80% /cover no-repeat fixed"
        }).stop().animate({
            opacity: 1
        }, 2000);

        Slider.variables.timer = setTimeout(function () {
            Slider.variables.current++;
            if (Slider.variables.current === 3) {
                Slider.variables.current = 0;
            }
            Slider.changeBackground();
        }, 5000);

    },
    bindUI_changeBackground: function () {
        $(".btn-slide").on("click", function () {
            clearTimeout(Slider.variables.timer);

            if ($(this).hasClass("prev")) {

                Slider.variables.current--;
                if (Slider.variables.current < 0) {
                    Slider.variables.current = 2;
                }
                Slider.changeBackground();
            } else {
                Slider.variables.current++;

                if (Slider.variables.current === 3) {
                    Slider.variables.current = 0;
                }
                Slider.changeBackground();
            }
        });
    }
}

var Portfolio = {
    init: function () {
        Portfolio.getData(true);
        Portfolio.bindUIActions();
    },
    getData: function (async) {
        if (async) {
            async = true;
        } else {
            async = false;
        }
        Variables.current_projects = [];
        Variables.updated_projects = 0;

        var portfolio_active = $(".portfolio-item.active").data("group");

        $.ajax({
            async: async,
            url: 'data/data.json',
            method: 'GET',
            success: function (data) {

                for (var i = 0; i < data.length; i++) {
                    if (data[i].type == portfolio_active) {
                        Variables.current_projects.push(data[i]);
                    }
                }
            }
        });
    },
    bindUIActions: function () {

        changeFilter = function () {

            $('.portfolio-nav').on("click", ".portfolio-item:not(.active)", function (e) {
                e.stopPropagation();
                $('.portfolio-item.active').removeClass('active');
                $(this).addClass('active');
                Variables.image_set = 0;

                Portfolio.getData();
                $('.portfolio-item-inner').fadeOut(1000);

                setTimeout(function () {
                    $('.portfolio-item-inner').remove();
                    Portfolio.addImages(Variables.image_set);
                }, 1000);
            });

        }
        showMoreImages = function () {
            $('#portfolio .container').on("click", ".btn-load", function () {
                Variables.image_set++;
                Portfolio.addImages(Variables.image_set);
            });

        }
        changeFilter();
        showMoreImages();
    },
    addImages: function (set) {
        var start, show_projects, button_load = $('.btn-load');

        if (set < 1) {
            start = 0;
            if (Variables.current_projects.length > 8) {
                show_projects = 8;
                $('.portfolio-items').after("<a class='btn-load'><span class='load-more'>Load more</span></a>")

            } else {
                show_projects = Variables.current_projects.length;
                button_load.remove();
            }
        } else {
            start = set * 8;
            if (Variables.current_projects.length > set * 16) {
                show_projects = set * 16;
            } else {
                show_projects = Variables.current_projects.length;
                button_load.remove();
            }

        }

        for (var i = start; i < show_projects; i++) {
            var portfolio_item = `
            <div class='portfolio-item-inner' style='display:none'>
                <div class='item-overlay'>
                    <h3 class='project-title'>
                    <a class='lightbox-show'>` + Variables.current_projects[i].title + `</a>
                    </h3>
                    <span class='project-type'>` + Variables.current_projects[i].type + `</span>
                    <div class='feedback group'>
                        <div class='project-comments'>
                            <img src='images/portfolio-tooltip-chat.png' alt='Comments'>
                            <a href='#' title='Comments'><span class='comments-number'>` + Variables.current_projects[i].feedback.comments + `</span></a>
                        </div>
                        <div class='project-likes'>
                            <img src='images/portfolio-tooltip-heart.png' alt='Likes'><a href='#' title='Likes'><span class='likes-number'>` + Variables.current_projects[i].feedback.likes + `</span></a>
                        </div>
                    </div>
                </div>

                <img id='picture-` + Variables.current_projects[i].id + `' class='portfolio-image' src='images/` + Variables.current_projects[i].image + `.jpg' alt='` + Variables.current_projects[i].title + `'>
            </div>`;

            $('.portfolio-items').append(portfolio_item);
        }

        $('.portfolio-item-inner').fadeIn(1000).css("display", "inline-block");
    }
}


var Lightbox = {
    number: 0,
    picture: "",
    elements: {
        picture: "#lightbox-active-picture",
        buttons: ".lightbox-btn",
        overlay: ".lightbox-overlay"
    },
    init: function () {
        $('.portfolio-items').on("click", ".lightbox-show", function () {

            Lightbox.getImageData.call(this);
            Lightbox.createDom();

            $.each(Lightbox.elements, Lightbox.bindUIActions);
            Lightbox.closeShortcut();
            $(Lightbox.elements.picture).addTouch(".lightbox-btn.prev", ".lightbox-btn.next");
        });

        jQuery.fn.extend({
            setImage: function (object) {
                $(this).fadeOut(500, function () {
                    $(this).attr("src", "images/" + object.image + ".jpg");
                    $(this).attr("alt",  object.title);
                    $(this).attr("title",  object.title);
                    $(this).parent().siblings(".lightbox-counter").text(object.order + " of " + object.max);
                    $(this).fadeIn(500);

                    if (object.order > 8 + (Variables.image_set * 8)) {
                        $('.btn-load').trigger("click");
                    }
                });
            }
        });

    },
    getImageData: function () {
        var picture = $(this).closest('.item-overlay').siblings('.portfolio-image');
        picture.src = picture.attr("src");
        picture.alt = picture.attr("alt");
        picture.id = picture.attr("id").split("-")[1];


        for (var i = 0; i < Variables.current_projects.length; i++) {
            if (Variables.updated_projects === 0) {
                Variables.current_projects[i].max = Variables.current_projects.length;
                Variables.current_projects[i].order = i + 1;
            }
            if (picture.id == Variables.current_projects[i].id) {
                Lightbox.number = i;
            }
        }

        Variables.updated_projects = 1;
        Lightbox.picture = picture;
    },
    createDom: function () {
        var lightbox = `
        <div class='lightbox-overlay'>
            <p class='lightbox-counter'>` + (Lightbox.number + 1) + ` of ` + Variables.current_projects.length + `</p>
            <div id='lightbox-frame' class='lightbox-picture'>
                <img id='lightbox-active-picture' src='` + Lightbox.picture.src + `' alt='` + Lightbox.picture.alt + `' title='` + Lightbox.picture.alt + `'> 
            </div>
        <a class='lightbox-btn prev'><span class='arrow prev-arrow'></span></a>
        <a class='lightbox-btn next'><span class='arrow next-arrow'></span></a>
        </div>`;

        $("body").addClass("lightbox-active").append(lightbox);

        $(Lightbox.elements.picture).css("display", "none").fadeIn(1000).css("display", "block");
    },
    bindUIActions: function (obj) {
        var element = $(this + '');
        $(element).on("click", function (e) {
            e.stopPropagation();
            if (obj === "picture") {
                Lightbox.nextImage();
            } else if (obj === "buttons") {
                Lightbox.changeImage(this);
            } else if (obj === "overlay") {
                Lightbox.close.call(this);
            }
        });
    },
    nextImage: function () {
        Lightbox.number++;

        if (Lightbox.number === Variables.current_projects.length) {
            Lightbox.number = 0;
        }

        $(Lightbox.elements.picture).setImage(Variables.current_projects[Lightbox.number]);
    },
    changeImage: function (button) {
        if ($(button).hasClass("prev")) {
            Lightbox.number--;

            if (Lightbox.number === -1) {
                Lightbox.number = Variables.current_projects.length - 1;
            }

            $(Lightbox.elements.picture).setImage(Variables.current_projects[Lightbox.number]);

        } else {
            Lightbox.number++;

            if (Lightbox.number === Variables.current_projects.length) {
                Lightbox.number = 0;
            }
            $(Lightbox.elements.picture).setImage(Variables.current_projects[Lightbox.number]);
        }
    },
    close: function () {
        $("body").removeClass("lightbox-active");
        $(this).remove();
    },
    closeShortcut: function () {
        $(document).keydown(function (e) {
            if (e.which == 27) { // ESCAPE
                $(document).off('keydown');
                $('.lightbox-overlay').trigger("click");
            }
        });
    }
};
