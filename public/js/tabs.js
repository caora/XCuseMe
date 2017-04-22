"use strict";
(function () {
    var $buttons, $tabs;

    function openTab(target) {
        for(var i=0; i<$buttons.length; i++) {
            var $button = $($buttons[i]);
            var $tab = $($tabs[i]);
            if($buttons[i] === target) {
                if(!$button.hasClass("active")) {
                    $button.addClass("highlight");
                    $tab.addClass("active");
                }
            } else if ($button.hasClass("active")) {
                $button.removeClass("active");
                $tab.removeClass("active");
            }
        }
    }

    function initButtons() {
        $('.tab-button').on("click", function(e) {
            openTab(e.target);
        });
    }

    function init() {
        $buttons = $(".tab-button");
        $tabs = $(".tab-content");
        initButtons();
    }

    init();
})();
