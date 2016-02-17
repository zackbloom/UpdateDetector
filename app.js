(function(){
    var options = INSTALL_OPTIONS;
    var gd, sd, count = 0, banner, show = false, created = false;
    var getPage = function() {
        $.get(window.location.href, function(d){gd = d;});
    };
    var createBanner = function() {
        var b = document.createElement('div');
        var t = document.createElement('p');
        b.appendChild(t);
        banner = $(b);
        banner.attr('id', 'ud-Banner');
        banner.css({'top':-options.banner.bh+'px'});
        document.body.appendChild(b);
        created = true;
    };
    var setup = function() {
        getPage();
        if (gd == '' || typeof gd === 'undefined') {
            retry();
            return;
        }
        count = 0;
        sd = gd;
        timer();
    };
    var retry = function() {
        if (count >= 3) return;
        count++;
        window.setTimeout(function() {
            setup();
        }, 5000);
    };
    var timer = function() {
        window.setTimeout(function() {
            getPage();
            if (gd == '' || typeof gd === 'undefined') {
                retryTimer();
                return;
            }
            count = 0;
            if (sd == '' || typeof sd === 'undefined') {
                sd = gd;
            }
            if (gd != sd) {
                show = true;
                update();
            }
            else {
                retryTimer(0);
            }
        }, options.time*1000);
    };
    var retryTimer = function(d) {
        if (count >= 3) return;
        count++;
        window.setTimeout(function() {
            timer();
        }, (d ? d : 5000));
    };
    var update = function() {
        if (options.reload && !options.banner.preview) {
            location.reload();
            return;
        }
        if (!created) createBanner();
        if (options.banner.theme == 'Custom...') {
            var col = options.banner.ct;
            col = 'rgba('+parseInt(col.slice(-6, -4), 16)+','+parseInt(col.slice(-4, -2), 16)+','+parseInt(col.slice(-2), 16)+','+(options.banner.t ? 0.5 : 1);
            banner.css({
                'background': col,
                'height': options.banner.bh+'px',
                'line-height': options.banner.bh+'px'
            });
            banner.children().css({
                'font-family': (options.banner.font == '' ? 'sans-serif' : options.banner.font),
                'font-size': options.banner.ts+'px',
                'color': options.banner.tc
            });
        }
        else {
            banner.css({
                'background':'',
                'height': options.banner.bh+'px',
                'line-height': options.banner.bh+'px'
            });
            banner.removeClass(banner.attr('class')).addClass('ud-' + options.banner.theme + (options.banner.t ? '-t' : ''));
            banner.children().css({
                'font-family': (options.banner.font == '' ? 'sans-serif' : options.banner.font),
                'font-size': options.banner.ts+'px',
                'color': ''
            });
        }
        banner.children().html((options.banner.text == '' ? 'This page has been updated. Reload to see new version.' : options.banner.text));
        $(banner).animate({'top': ((show || options.banner.preview) ? '0' : -options.banner.bh) + 'px'});
    };
    var setOptions = function(s) {
        options = s;
        update();
    };
    window.UpdateDetector = {
        setOptions: setOptions
    };
    if (window.jQuery) {
        if (options.banner.preview) {
            update();
        }
        else {
            setup();
        }
    }
    else {
        console.log('jQuery not detected, disabling UpdateDetector.');
    }
})()