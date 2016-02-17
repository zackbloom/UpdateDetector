(function(){
    if (!document.documentElement.addEventListener){
        return;
    }

    var options = INSTALL_OPTIONS;
    var isPreview = INSTALL_ID == 'preview';

    var styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    var prevPageContent, errorCount = 0, banner, show = false;
    var getPage = function(cb) {
        var xhr = new XMLHttpRequest;
        xhr.open('GET', window.location.href, true);
        xhr.addEventListener('load', function(){
            cb(false, xhr.responseText);
        });
        xhr.addEventListener('error', function(err){
            cb(true, err);
        });
        xhr.send();
    };

    var createBanner = function() {
        banner = document.createElement('ud-banner');
        var text = document.createElement('ud-banner-content');

        banner.appendChild(text);
        banner.style.top = -options.banner.bannerHeight + 'px';
        document.body.appendChild(banner);

        banner.addEventListener('click', function(){
            document.location.reload();
        });
    };

    var check = function() {
        getPage(function(err, body){
            if (err){
                errorCount++;
                console.error("Error testing for updates", err);
            } else {
                errorCount = 0;

                if (body !== prevPageContent){
                    show = true;
                    update();
                }

                prevPageContent = body;
            }

            if (errorCount < 3){
                window.setTimeout(check, options.time * 1000);
            }
        });
    }

    var setup = function() {
        window.setTimeout(check, options.time * 1000);
    }

    var update = function() {
        if (options.reload && !isPreview) {
            location.reload();
            return;
        }

        if (!banner)
            createBanner();

        banner.className = 'ud-banner';

        var bgColor = ''
        var textColor = ''
        if (options.banner.theme == 'custom') {
            var col = options.banner.backgroundColor;
            bgColor = 'rgba('+parseInt(col.slice(-6, -4), 16)+','+parseInt(col.slice(-4, -2), 16)+','+parseInt(col.slice(-2), 16)+','+(options.banner.transparent ? 0.8 : 1)+')';
            textColor = options.banner.textColor;
        } else {
            banner.className += ' ud-' + options.banner.theme + (options.banner.transparent ? '-t' : '');
        }

        styleEl.innerHTML = 'ud-banner {' +
            'background-color: ' + bgColor + ';' +
            'height: ' + options.banner.height + 'px;' +
        '}' +
        'ud-banner-content {' +
            'font-family: ' + (options.banner.font == '' ? 'sans-serif' : options.banner.font) + ';' +
            'font-size: ' + options.banner.textSize + 'px;' +
            'color: ' + textColor + ';' +
            'line-height: ' + options.banner.height + 'px;' +
        '}';

        banner.querySelector('ud-banner-content').innerHTML = options.banner.text || 'This page has been updated. Reload to see new version.';
        if ((show || isPreview) && !options.reload)
            banner.style.top = 0;
        else
            banner.style.top = -options.banner.height + 'px';
    };

    var setOptions = function(s) {
        options = s;
        update();
    };

    window.UpdateDetector = {
        setOptions: setOptions
    };

    if (isPreview) {
        update();
    }

    setup();
})()
