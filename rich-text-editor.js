/*!
 * =======================================================
 *  SIMPLEST RICH TEXT EDITOR
 * =======================================================
 *
 *   Author: Taufik Nurrohman
 *   URL: https://github.com/tovic
 *   License: MIT
 *
 * -- USAGE: ---------------------------------------------
 *
 *   var e = new RTE(document.querySelector('textarea'));
 *
 * -------------------------------------------------------
 *
 */

(function(win, doc, NS) {

    var instance = '__instance__',
        create = 'createElement',
        html = 'innerHTML',
        cla = 'className',
        tlc = 'toLowerCase',
        event = 'addEventListener',
        append = 'appendChild',
        parent = 'parentNode',
        insert = 'insertBefore',
        get = 'getAttribute',
        set = 'setAttribute',
        re = 'replace',
        val = 'value',
        stop = 'preventDefault',
        focus = 'focus',
        test = 'test',
        delay = setTimeout;

    function command(i, j, o) {
        if (j && j[get]('contenteditable')) {
            try {
                doc.execCommand(i, o);
            } catch (e) {}
        }
    }

    function el(x) {
        return doc[create](x);
    }

    (function($) {

        // plugin version
        $.version = '1.0.0';

        // collect all instance(s)
        $[instance] = {};

        // plug to all instance(s)
        $.each = function(fn, t) {
            return delay(function() {
                var ins = $[instance], i;
                for (i in ins) {
                    fn(ins[i], i, ins);
                }
            }, t === 0 ? 0 : (t || 1)), $;
        };

    })(win[NS] = function(target, o) {
        var $ = this,
            config = {
                classes: ['rich-text-editor'],
                tags: ['a', 'abbr', 'b', 'br', 'code', 'del', 'em', 'i', 'ins', 'kbd', 'mark', 'p', 'span', 'strong', 'u'],
                text: {
                    b: 'Bold',
                    i: 'Italic',
                    u: 'Underline',
                    x: 'Source'
                },
                enter: 1
            },
            container = el('span'),
            tool = el('span'),
            content = el('span'), t, i;
        win[NS][instance][target.id || target.name || Object.keys(win[NS][instance]).length] = $;
        o = o || {};
        for (i in config) {
            if (typeof o[i] !== "undefined") config[i] = o[i];
        }
        var cln = config.classes[0],
            text = config.text || {},
            tags = config.tags.join('|'),
            blocks = 'blockquote|(fig)?caption|figure|h[1-6]|div|li|[ou]l|pre|t(able|[dh])',
            ctrl = '\u2318',
            shift = '\u21E7',
            B = btn(text.b + ' (' + ctrl + '+B)', cln + '-b', function() {
                command('bold', content);
            }),
            I = btn(text.i + ' (' + ctrl + '+I)', cln + '-i', function() {
                command('italic', content);
            }),
            U = btn(text.u + ' (' + ctrl + '+U)', cln + '-u', function() {
                command('underline', content);
            }),
            X = btn(text.x + ' (' + ctrl + '+' + shift + '+U)', cln + '-x', function() {
                if (!t) {
                    container[cla] += ' source';
                    target[focus]();
                    t = 1;
                } else {
                    container[cla] = container[cla][re](/\s+source$/, "");
                    content[focus]();
                    t = 0;
                }
            });
        function pattern(a, b) {
            return new RegExp(a, b);
        }
        function convert(text) {
            text = text[re](/\r/g, "");
            text = text[re](/<code(?:\s[^<>]*?)?>([\s\S]*?)<\/code>/g, function(a, b) {
                return '<code>' + b[re](/\n/g, '<br>')[re](/(\t| {4})/g, '&nbsp;&nbsp;&nbsp;&nbsp;') + '</code>';
            });
            text = text[re](/<(\/?)([\w-]+?)(\s[^<>]*?)?>/g, function($, a, b, c) {
                b = b[tlc]();
                if (!pattern('^(' + tags + '|' + blocks + ')$')[test](b)) {
                    return "";
                }
                c = c || "";
                var heading = /^(h[1-6]|th)$/[test](b),
                    caption = /^((fig)?caption)$/[test](b);
                if (b === 'br' || b === 'p') {
                    return '<' + a + b + '>';
                } else if (b === 'b' || b === 'strong' || heading) {
                    return '<' + a + 'strong>' + (heading && a ? '<br><br>' : "");
                } else if (b === 'i' || b === 'em') {
                    return '<' + a + 'em>';
                } else if (pattern('^(' + tags + ')$')[test](b)) {
                    if (/\bfont-weight:\s*bold\b/[test](c)) {
                        return '<' + a + 'strong>';
                    } else if (/\bfont-style:\s*italic\b/[test](c)) {
                        return '<' + a + 'em>';
                    } else if (/\btext-decoration:\s*underline\b/[test](c)) {
                        return '<' + a + 'u>';
                    }
                    return '<' + a + b + c + '>';
                } else if (pattern('^(' + blocks + ')$')[test](b)) {
                    return '<br>';
                }
                return "";
            });
            text = text[re](/<\/p>\s*<p>/g, '</p><p>')[re](/\s*<br\s*\/?>\s*/g, '<br>')[re](/\n/g, '<br>')[re](/(?:<br>){3,}/g, '<br><br>')[re](/^(?:(?:<br>)+)|(?:(?:<br>)+)$/g, "")[re](/<br><br>/g, '</p><p>')[re](/<p><\/p>/g, "");
            text = text ? '<p>' + text + '</p>' : "";
            return text;
        }
        function write() {
            content[html] = convert(target[val])[re](/<\/p>\s*<p>/g, '<br><br>')[re](/<\/?p>/g, "");
        } write();
        function copy() {
            target[val] = convert(content[html])[re](/<\/p><p>/g, '</p>\n<p>');
        } copy();
        function btn(t, c, f) {
            var a = el('a');
            a[cla] = c;
            a[html] = '<span></span>';
            a.title = t;
            a.href = 'javascript:;';
            function R(e) {
                f.apply(this, [e]), copy(), content[focus](), e[stop]();
            }
            a[event]("touchstart", R, false);
            a[event]("mousedown", R, false);
            return [a, f];
        }
        container[cla] = cln;
        target[cla] = cln + '-source';
        target[set]('spellcheck', false);
        tool[cla] = cln + '-tool';
        content[cla] = cln + '-content';
        if (config.enter) {
            content[cla] += ' expand';
        }
        content[set]('contenteditable', true);
        content[set]('spellcheck', false);
        content[set]('placeholder', target.placeholder || "");
        content[event]("paste", function() {
            delay(write, 1);
        }, false);
        function kk(e) {
            return (e.key || String.fromCharCode(e.keyCode))[tlc]();
        }
        content[event]("keydown", function(e) {
            var ctrl = e.ctrlKey,
                shift = e.shiftKey,
                k = e.keyCode,
                p = container,
                key = kk(e), form;
            if (ctrl && (key === 'b' || !shift && k === 66)) {
                B[1](), e[stop]();
            } else if (ctrl && (key === 'i' || !shift && k === 73)) {
                I[1](), e[stop]();
            } else if (ctrl && shift && (key === 'u' || k === 85)) {
                X[1](), e[stop]();
            } else if (ctrl && (key === 'u' || !shift && k === 85)) {
                U[1](), e[stop]();
            // submit form on `enter` key in the `span[contenteditable]`
            } else if (!config.enter && (key === 'enter' || !shift && k === 13)) {
                while (p = p[parent]) {
                    if (p.nodeName[tlc]() === 'form') {
                        form = p;
                        break;
                    }
                }
                form && form.submit();
            }
            delay(copy, 1);
        }, false);
        target[event]("keydown", function(e) {
            var ctrl = e.ctrlKey,
                shift = e.shiftKey,
                k = e.keyCode,
                key = kk(e);
            if (ctrl && shift && (key === 'u' || k === 85)) {
                X[1](), e[stop]();
            }
            delay(write, 1);
        }, false);
        tool[append](B[0]);
        tool[append](I[0]);
        tool[append](U[0]);
        tool[append](X[0]);
        container[append](content);
        target[parent][insert](container, target);
        container[append](target);
        container[append](tool);
    });

})(window, document, 'RTE');