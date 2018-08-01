    function scrollingNavbar() {
        var nav = $('.navbar');
        if (nav.offset().top <= 50 && !nav.hasClass("navbar-mobile")) {
            nav.removeClass("nav-background");
        } else {
            nav.addClass("nav-background");
        }
    }

    $(function () { 
        var nav = $('.navbar').removeClass("nav-background");

        // Zaznaczanie wyboru sortowania obrazków w portfolio
        $('.portfolio-item').on('click', function () {
            $('.portfolio-item.active').removeClass('active');
            $(this).addClass('active');
            setTimeout(function(){
               Waypoint.refreshAll(); 
            },1000);
            
        });

        // Dodanie tła po rozwinięciu menu dla mobilnych urządzeń
        $('.navbar-toggler').on('click', function () {
            nav.toggleClass("navbar-mobile");
        });

        // Włączenie lightboxa do zdjęć z portfolio
        $(".lightbox-show").on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var title = $(this).find('.portfolio-item-title').html();
            var category = $('.portfolio-item.active a').html();
            var images = $('.filtr-item:not(.filteredOut)');
            var currentImage = $(this).closest('.filtr-item')[0];
            var index, imageFrame;

            $.each(images, function (key) {
                if (this == currentImage) {
                    index = key;
                }
            });

            var lightbox = `
            <div class="lightbox-wrapper">
                <div class="lightbox-overlay">
                    <div class="image-controls">
                        <button type="button" class="lightbox-button previous">Previous Image</button>
                        <span class="category-name">Category:</span>
                        <select class="lightbox-category">
                            <option value="all">All</option><option value="1">Branding</option><option value="2">Web</option>
                            <option value="3">Logo Design</option>
                            <option value="4">Photography</option>
                        </select>
                        <button type="button" class="lightbox-button next">Next Image</button>
                    </div>
                    <a class="lightbox-close"></a>
                </div>
                <img class="lightbox-image" src="` + this.href + `">
                <div class="lightbox-caption">` + title + `</div>
            </div>`;

            $("body").addClass("lightbox-active").append(lightbox);

            var categories = $('.lightbox-category option');

            $.each(categories, function () {
                if ($(this).html() == category) {
                    $(this).attr("selected", "selected");
                }
            });

            var allowAnimate = true;

            // Obsługa przycisków dp zmiany obrazków
            $(".lightbox-button").on("click", function () {

                if ($(this).hasClass("previous")) {
                    index--;
                    if (index < 0) {
                        currentImage = images[images.length - 1];
                        index = images.length - 1;
                    } else {
                        currentImage = images[index];
                    }
                } else {
                    index++;
                    if (index == images.length) {
                        currentImage = images[0];
                        index = 0;
                    } else {
                        currentImage = images[index];
                    }
                }

                title = $(currentImage).find('.portfolio-item-title').html();
                imageFrame = $(currentImage).find('.lightbox-show')[0];

                $('.lightbox-image').attr("src", imageFrame.href);
                $('.lightbox-caption').html(title);


                if (allowAnimate) {
                    $('.lightbox-image').addClass("animate-image");
                    allowAnimate = false;

                    setTimeout(function () {
                        $('.lightbox-image').removeClass("animate-image");
                        allowAnimate = true;
                    }, 1000);
                }

            });

            // Zmiana kategorii przeglądanych obrazków w lightboxie
            $('.lightbox-category').on("change", function () {
                var selectedIndex = this.options[this.selectedIndex].value;
                $(".portfolio-item[data-filter='" + selectedIndex + "']").trigger("click");
                $('.lightbox-wrapper').fadeOut(800);

                setTimeout(function () {
                    $('.lightbox-wrapper').remove();
                    $('.filtr-item:not(.filteredOut)').find(".lightbox-show").eq(0).trigger("click");
                }, 800);


            });

            // Obsługa zdarzenia kliknęcia w obrazek
            $(".lightbox-image").on("click", function () {
                $(".lightbox-button.next").trigger("click");

            });

            // Dotykowe zmienianie obrazków w lightboxie
            $(".lightbox-image").on("touchstart", function (event) {
                var tap = event.originalEvent.touches[0].pageX;
                $(this).one("touchmove", function (event) {
                    var move = event.originalEvent.touches[0].pageX;

                    if (Math.floor(tap - move) > 10) {
                        $(".lightbox-button.previous").trigger("click");
                    } else if (Math.floor(tap - move) < -10) {
                        $(".lightbox-button.next").trigger("click");
                    }
                });
                $(this).on("touchend", function () {
                    $(this).off("touchmove touchend");
                });
            });

            // Zamknięcie lightboxa
            $(".lightbox-close").on("click", function () {
                $("body").removeClass("lightbox-active");
                $('.lightbox-wrapper').remove();
            });

        }); // END OF LIGHTBOX

        // Walidacja formularzy
        $('form button[type=submit]').on('click', function () {
            var form = $(this).closest('form');
            var inputs = $(form).find('.form-control');
            var errors = false;

            $(".errors").remove();

            function showErrors(message) {
                var messageInfo = "";
                $(this).addClass('error-frame');
                errors = true;

                switch (message) {
                    case 1:
                        messageInfo = "Missing Email";
                        break;
                    case 2:
                        messageInfo = "Not a valid email";
                        break;
                    case 3:
                        messageInfo = "Missing input";
                        break;
                    case 4:
                        messageInfo = "Input too short";
                        break
                }

                $(this).after("<div class='errors'>" + messageInfo + "</div>");
            }

            var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            $.each(inputs, function () {
                $(this).removeClass('error-frame');

                if ($(this).hasClass('email')) {
                    if ($(this).val() === "") {
                        showErrors.call(this, 1);
                    } else if (!emailReg.test($(this).val())) {
                        showErrors.call(this, 2);
                    }
                } else {
                    if ($(this).val() === "") {
                        showErrors.call(this, 3);
                    } else if ($(this).val().length < 4) {
                        showErrors.call(this, 4);
                    }
                }
            });

            return !errors;
        });

        // Dotykowe zmienianie elementów karuzel
        $(".carousel").on("touchstart", function (event) {
            event.stopPropagation();
            $(this).find(".slider-control").removeClass("desktop");
            var tap = event.originalEvent.touches[0].pageX;

            $(this).one("touchmove", function (event) {
                var move = event.originalEvent.touches[0].pageX;
                if (Math.floor(tap - move) > 10) {
                    $(this).carousel('prev');
                } else if (Math.floor(tap - move) < -10) {
                    $(this).carousel('next');
                }
            });

            $(this).on("touchend", function () {
                $(this).off("touchmove touchend");
            });
        });

        $('body').scrollspy({
            target: '#nav-links'
        });

        // Funkcja przedstawiająca liczenie 
        function countNumbers(input, start, end, duration) {
            var obj = input;
            var range = end - start;
            var minTimer = 50;
            var stepTime = Math.abs(Math.floor(duration / range));
            stepTime = Math.max(stepTime, minTimer);
            var startTime = new Date().getTime();
            var endTime = startTime + duration;
            var timer;

            function run() {
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = Math.round(end - (remaining * range));
                obj.innerHTML = value;
                if (value == end) {
                    clearInterval(timer);
                }
            }
            timer = setInterval(run, stepTime);
            run();
        }

        // Waypoint dla animacji
        $('.animate').waypoint({
            element: document.querySelectorAll('.animate'),
            handler: function (direction) {
                function start_animate() {
                    $(this).removeClass("animate");
                    $(this).addClass("animated");
                }

                if (direction === "down") {
                    if ($(this.element).hasClass("footer-column")) {
                        var myInterval;
                        start_animate.call(this.element);
                        var toAnimate = document.querySelectorAll('.footer-column');
                        var count = 0;

                        myInterval = setInterval(function () {
                            count++;
                            start_animate.call(toAnimate[count]);
                            if (count > 3) {
                                clearInterval(myInterval);
                            }
                        }, 400);
                    } else {
                        start_animate.call(this.element);
                    }
                    this.destroy();
                }
            },
            offset: function () {
                return this.context.innerHeight() - 200
            }
        });

        // Waypoint dla odliczania liczb
        var waypoint_counter = new Waypoint({
            element: document.querySelectorAll('.facts-numbers'),
            handler: function (direction) {
                if (direction === "down") {
                    var obj = document.getElementsByClassName('facts-numbers');
                    countNumbers(obj[0], 0, 3200, 1500);
                    countNumbers(obj[1], 0, 120, 1500);
                    countNumbers(obj[2], 0, 360, 1500);
                    countNumbers(obj[3], 0, 42, 1500);
                }
            },
            offset: 'bottom-in-view'
        });

        // Google maps
        (function map_start() {
            // Usuwanie komunikatu odnośnie braku klucza api
            var target = document.head;
            var observer = new MutationObserver(function (mutations) {
                for (var i = 0; mutations[i]; ++i) {
                    if (mutations[i].addedNodes[0].nodeName == "SCRIPT" && mutations[i].addedNodes[0].src.match(/\/AuthenticationService.Authenticate?/g)) {
                        var str = mutations[i].addedNodes[0].src.match(/[?&]callback=.*[&$]/g);
                        if (str) {
                            if (str[0][str[0].length - 1] == '&') {
                                str = str[0].substring(10, str[0].length - 1);
                            } else {
                                str = str[0].substring(10);
                            }
                            var split = str.split(".");
                            var object = split[0];
                            var method = split[1];
                            window[object][method] = null;
                        }
                        observer.disconnect();
                    }
                }
            });
            var config = {
                attributes: true,
                childList: true,
                characterData: true
            }
            observer.observe(target, config);

            // Inicjalizacja mapy
            var coordinates = new google.maps.LatLng(40.758896, -73.985130);
            var map_options = {
                zoom: 13,
                center: coordinates,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };

            var map = new google.maps.Map(document.getElementById("location"), map_options);

            var marker = new google.maps.Marker({
                position: coordinates,
                icon: "images/google-marker.png",
                title: "That's our location!"
            });
            marker.setMap(map);
        })();

        // Przewijanie do linków w menu
        $('a.nav-link').on('click', function (e) {
            e.preventDefault();
            var hash = $(this);

            $('html, body').stop().animate({
                scrollTop: $(hash.attr('href')).offset().top + 1
            }, 1500);
        });

    });

    $(window).on("load", function () {

        $('#preloader').fadeOut();
        $('#home').addClass("visible-y");
        $(".banner-text").hide().fadeIn(2000);
        $(".slider-controls").hide().fadeIn(2000);
        $(".navbar").hide().fadeIn(2000);

        $('.carousel').carousel();

        var filterizd = $('.portfolio-container').filterizr();

        scrollingNavbar();
    });

    $(window).on('scroll resize', scrollingNavbar);
