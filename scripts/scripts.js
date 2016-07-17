jQuery(window).load(function () {
    var slider = {
        $object: null,
        $slider: null,

        movePos: 0,
        moveSize: 0,
        clickLeft: 0,

        mouseDown: false,

        init: function(selector) {
            slider.$object = $(selector);
            slider.$slider = slider.$object.find(".slider");

            slider.$object.bind("touchstart", slider.onTouchStart);
            slider.$object.bind("touchmove", slider.onTouchMove);
            slider.$object.bind("touchend", slider.onTouchEnd);
            slider.$object.bind("mousedown", slider.onMouseDown);
            $(document).bind("mousemove", slider.onMouseMove);
            $(document).bind("mouseup", slider.onMouseUp);

            slider.modal.init();
        },

        slideMoveStart: function(pos) {
            slider.movePos = pos;
            slider.moveSize = 0;
        },

        slideMove: function(pos) {
            var dist = pos - slider.movePos;
            var left = slider.$slider.position().left + dist;

            left = Math.max(left, -(slider.$slider.width() - slider.$object.width()));
            left = Math.min(left, 0);

            slider.$slider.css("left", left + "px");

            slider.moveSize += dist;
            slider.movePos = pos;
        },

        sliderClickCheck: function(element) {
            if (Math.abs(slider.moveSize) > 2) {
                return;
            }

            if (!$(element).hasClass("item")) {
                return;
            }

            var index = $(element).index();

            slider.modal.show(index);
        },

        onTouchStart: function(event) {
            event.preventDefault();

            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

            slider.slideMoveStart(touch.pageX);
        },

        onTouchMove: function(event) {
            event.preventDefault();

            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

            slider.slideMove(touch.pageX);
        },

        onTouchEnd: function(event) {
            event.preventDefault();

            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            var element = document.elementFromPoint(touch.pageX, touch.pageY);

            slider.sliderClickCheck(element);
        },

        onMouseDown: function(event) {
            event.preventDefault();

            slider.mouseDown = true;
            slider.slideMoveStart(event.pageX);
        },

        onMouseMove: function(event) {
            if (!slider.mouseDown) {
                return;
            }

            event.preventDefault();

            slider.slideMove(event.pageX);
        },

        onMouseUp: function(event) {
            if (!slider.mouseDown) {
                return;
            }

            event.preventDefault();

            slider.mouseDown = false;

            slider.sliderClickCheck(event.toElement);
        },

        modal: {
            $modal: null,
            $container: null,
            $btnClose: null,
            $btnPrev: null,
            $btnNext: null,
            $nav: null,
            count: 0,
            index: 0,

            init: function() {
                slider.modal.$modal  = $(".share-modal");
                slider.modal.$container = slider.modal.$modal.find(".share-modal-container");
                slider.modal.$btnClose = slider.modal.$modal.find(".btn-close");
                slider.modal.$btnPrev = slider.modal.$modal.find(".btn-prev");
                slider.modal.$btnNext = slider.modal.$modal.find(".btn-next");
                slider.modal.$nav = slider.modal.$modal.find(".share-modal-nav");

                slider.modal.count = slider.modal.$container.find(".item").length;

                for (var i = 0; i < slider.modal.count; i++) {
                    $("<div>")
                        .addClass("item")
                        .appendTo(slider.modal.$nav);
                }

                slider.modal.$btnClose.click(slider.modal.onClickClose);
                slider.modal.$btnPrev.click(slider.modal.onClickPrev);
                slider.modal.$btnNext.click(slider.modal.onClickNext);
                slider.modal.$nav.on("click", ".item", slider.modal.onClickNav);
                $(document).keyup(slider.modal.onKeyUp);
                slider.modal.$modal.swipe({
                    swipeLeft: slider.modal.onClickNext,
                    swipeRight: slider.modal.onClickPrev,
                });
            },

            isVisible: function() {
                return $("body").hasClass("share-modal-show");
            },

            show: function(index) {
                slider.modal.select(index);

                $("body").addClass("share-modal-show");
            },

            hide: function() {
                $("body").removeClass("share-modal-show");
            },

            select: function(index) {
                index = Math.max(index, 0);
                index = Math.min(index, slider.modal.count - 1);

                slider.modal.index = index;

                slider.modal.$modal.find(".item").removeClass("select");
                slider.modal.$modal.find(".item:nth-child(" + (slider.modal.index + 1) + ")").addClass("select");

                slider.modal.$btnPrev.css("display", slider.modal.index > 0 ? "block" : "none");
                slider.modal.$btnNext.css("display", slider.modal.index < slider.modal.count - 1 ? "block" : "none");
            },

            onClickClose: function() {
                slider.modal.hide();
            },

            onClickPrev: function() {
                slider.modal.select(slider.modal.index - 1);
            },

            onClickNext: function() {
                slider.modal.select(slider.modal.index + 1);
            },

            onClickNav: function() {
                slider.modal.select($(this).index());
            },

            onKeyUp: function(event) {
                if (!slider.modal.isVisible()) {
                    return;
                }

                switch (event.keyCode) {
                    case 27: slider.modal.onClickClose(); break;
                    case 37: slider.modal.onClickPrev(); break;
                    case 39: slider.modal.onClickNext(); break;
                }
            }
        }
    };

    slider.init(".share-event-img");


    var appUrl = "yakhamovniki://?event_id=11639";
    var uagent = navigator.userAgent.toLowerCase();
    var iOS    = /ipad|iphone|ipod|iwatch/.test(uagent) && !window.MSStream;
    var safari = !!uagent.match(/version\/[\d\.]+.*safari/);

    if (iOS && !safari) {
        document.location = appUrl;
    }
    $('.share-event-img .btn-next').click(function () {
        slider.clickLeft = slider.clickLeft - 120;
        if (slider.clickLeft < -267) slider.clickLeft = -267;

        var left = slider.clickLeft;

        left = Math.max(left, -(slider.$slider.width() - slider.$object.width()));
        left = Math.min(left, 0);

        slider.$slider.animate({"left": left + "px"});
    });
    $('.share-event-img .btn-prev').click(function () {
        slider.clickLeft = slider.clickLeft + 120;
        if (slider.clickLeft > 0) slider.clickLeft = 0;
        var left = slider.clickLeft;

        left = Math.max(left, -(slider.$slider.width() - slider.$object.width()));
        left = Math.min(left, 0);

        slider.$slider.animate({"left": left + "px"});
    });

    $( window ).resize(function() {
        var wHeight = $(this).height();
        console.log(wHeight);
    });

});