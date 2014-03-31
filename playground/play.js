(function () {

    'use strict';

    var files = document.querySelector('.files'),
        code = document.querySelector('.ace'),
        stage = document.querySelector('.stage'),
        iframe = document.querySelector('.stage iframe'),
        editor = ace.edit(code),
        template = Handlebars.compile(document.querySelector('#template-file-list').innerHTML),
        live_script = null,
        change_timeout = null;

    function load_demos() {

        if (String(typeof demos) !== 'undefined') {

            files.innerHTML = template({ files: demos });

        }

    }

    function resize_iframe () {

        if (window.innerWidth >= 800) {

            iframe.setAttribute('width', (code.clientWidth + stage.clientWidth ) / 2);

            if (stage.clientHeight !== iframe.height) {

                iframe.setAttribute('height', 0);

                iframe.setAttribute('height', stage.clientHeight);

            }

        } else {

            iframe.setAttribute('width', window.innerWidth);
            iframe.setAttribute('height', window.innerHeight);

        }

    }

    function reload_live_script () {

        clearTimeout(change_timeout);

        change_timeout = setTimeout(function () {

            resize_iframe();

            live_script = document.createElement('script');

            live_script.appendChild(document.createTextNode(editor.getSession().getValue()));

            iframe.contentWindow.location.reload();

        }, 100);

    }

    editor.setOptions({
        highlightActiveLine: true,
        maxLines: 30,
        mode: 'ace/mode/javascript',
        showPrintMargin: false
    });

    editor.getSession().setUseWrapMode(true);

    editor.getSession().on('change', reload_live_script);

    iframe.addEventListener('load', function () {

        iframe.contentDocument.body.appendChild(live_script);

    });

    $('.files').on('click', 'a[href^="#"]', function () {

        editor.setValue(atob(this.getAttribute('data-content')), -1);

    });

    window.addEventListener('resize', function () {

        resize_iframe();
        reload_live_script();

    });

    document.addEventListener('DOMContentLoaded', function () {

        load_demos();

        if (window.location.hash && $('a[href="' + window.location.hash + '"]').length) {

            $('a[href="' + window.location.hash + '"]').click();

        } else {

            $('.files a').click();

        }

    });

}());
