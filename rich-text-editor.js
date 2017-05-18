/*!
 * =======================================================
 *  SIMPLEST RICH TEXT EDITOR 1.0.3
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
        event = 'addEventListener',
        append = 'appendChild',
        remove = 'removeChild',
        parent = 'parentNode',
        child = 'children',
        first = 'firstChild',
        insert = 'insertBefore',
        node = 'nodeName',
        get = 'getAttribute',
        set = 'setAttribute',
        re = 'replace',
        rec = 'replaceChild',
        val = 'value',
        len = 'length',
        pos = 'indexOf',
        stop = 'preventDefault',
        focus = 'focus',
        select = 'select',
        test = 'test',
        editable = 'contenteditable',
        spellcheck = 'spellcheck',
        placeholder = 'placeholder',
        selection = 'getSelection',
        exec = 'execCommand',
        nul = null,
        CTRL = 'ctrlKey',
        SHIFT = 'shiftKey',
        ALT = 'altKey',
        KEYC = 'keyCode',
        delay = setTimeout, sel;

    function el(x) {
        return doc[create](x);
    }

    function lc(s) {
        return s.toLowerCase();
    }

    function is_fn(x) {
        return typeof x === "function";
    }

    (function($) {

        // plugin version
        $.version = '1.0.3';

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
            ctrl = '\u2318',
            shift = '\u21E7',
            config = {
                classes: ['rich-text-editor'],
                tags: ['a', 'abbr', 'b', 'br', 'code', 'del', 'em', 'i', 'ins', 'kbd', 'mark', 'p', 'span', 'strong', 'u'],
                tools: ['b', 'i', 'u', 'x'],
                text: {
                    b: ['Bold', '&#x0042;',  ctrl + '+B'],
                    i: ['Italic', '&#x0049;', ctrl + '+I'],
                    u: ['Underline', '&#x0055;', ctrl + '+U'],
                    a: ['Link', '&#x2693;', ctrl + '+L'],
                    x: ['Source', '&#x22EF;', ctrl + '+' + shift + '+X']
                },
                enter: 1,
                x: 0,
                update: 0
            },
            container = el('span'),
            tool = el('span'),
            view = el('span'),
            dialog = el('span'),
            BR = '<br>',
            dialog_fn, t, i;

        function get_$() {
            sel = win[selection] && win[selection]() || {};
            return sel.rangeCount && sel || nul;
        }

        function get_$$(r) {
            sel = get_$();
            return sel && sel.getRangeAt(r || 0) || nul;
        }

        function get_selection(h) {
            if (h) {
                // TODO (get selection HTML)
            }
            return get_$() + "";
        }

        function get_selection_tag(t) {
            var a = get_$$().commonAncestorContainer[parent],
                b = lc(a[node]), c, d;
            if (t) {
                a = a !== view && b === t ? a : nul;
                if (!a && (a = get_$$()) && (a = a[child])) {
                    for (c = 0, d = a[len]; c < d; ++c) {
                        if (lc(a[c][node] || "") === t) {
                            return a[c];
                        }
                    }
                    return nul;
                }
                return a;
            }
            return b;
        }

        function command(i, j, o) {
            if (j && j[get](editable)) {
                try {
                    doc[exec](i, false, o);
                } catch (e) {}
            }
        }

        function link(j, o) {
            if (j && j[get](editable)) {
                try {
                    var a = get_selection_tag('a'), b;
                    if (!o) {
                        a && (a.href = '#');
                        doc[exec]('unlink', false, false);
                        if (a && a[parent]) {
                            b = el('div');
                            b[html] = a[html];
                            a[parent][rec](b[first], a);
                        }
                    } else {
                        /*
                        o = o[re](/^\s*javascript:/i, "");
                        // check for external link
                        var i = o[0], j = win.location.hostname;
                        i = i === '/' || i === '?' || i === '&' || o[pos]('/') === -1;
                        if (j && (o[pos]('//' + j) === 0 || o[pos]('://' + j) !== -1)) {
                            i = 1;
                        }
                        */
                        doc[exec]('createLink', false, o);
                        /*
                        a = get_$().anchorNode.nextElementSibling;
                        if (!i && a && a.href) {
                            a.rel = 'nofollow';
                            a.target = '_blank';
                        }
                        */
                    }
                } catch (e) {}
            }
        }

        function save_selection() {
            sel = get_$();
            if (sel || get_selection() === "") {
                return get_$$().cloneRange() || nul;
            }
            return nul;
        }

        function restore_selection(range) {
            if (range) {
                if (sel = get_$()) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }

        function focus_end(x) {
            x.selectionStart = x.selectionEnd = x[val][len];
            x[focus]();
        }

        $.$ = [nul, nul];
        $.s = save_selection;
        $.r = restore_selection;
        $.d = function(p, v, f) {
            $.$[0] = save_selection();
            var d = dialog[child][0];
            d[placeholder] = p;
            d[val] = v;
            delay(function() {
                focus_end(d);
            }, 1);
            dialog_fn = f;
            return $.d.v(), $;
        };
        $.d.x = function() {
            dialog.style.display = 'none';
            return $;
        };
        $.d.v = function() {
            dialog.style.display = 'block';
            return $;
        };
        win[NS][instance][target.id || target.name || Object.keys(win[NS][instance])[len]] = $;
        o = o || {};
        for (i in config) {
            if (typeof o[i] !== "undefined") config[i] = o[i];
        }
        var c_enter = config.enter,
            c_x = config.x,
            c_update = config.update,
            cln = config.classes[0],
            text = config.text || {},
            tags = config.tags.join('|'),
            blocks = 'blockquote|(fig)?caption|figure|h[1-6]|div|li|[ou]l|pre|t(able|[dh])',
            _t = 0,
            tools = {
                b: function() {
                    command('bold', view);
                },
                i: function() {
                    command('italic', view);
                },
                u: function() {
                    command('underline', view);
                },
                a: function(e) {
                    var a = get_selection(), b;
                    if (/^[a-z\d]+:\/\/\S+$/[test](a)) {
                        link(view, a);
                    } else {
                        b = get_selection_tag('a');
                        $.d('http://', (b ? b.href[re](/\/+$/, "") : 'http://' + lc(a[re](/\s/g, ""))) || "", function(e, $, t) {
                            link(view, t[val]);
                        });
                    }
                },
                x: function(e) {
                    var h = view.offsetHeight;
                    h && (target.style.minHeight = h + 'px');
                    if (!_t) {
                        $.$[0] = save_selection();
                        container[cla] += ' source';
                        focus_end(target);
                        restore_selection($.$[1]);
                        _t = 1;
                    } else {
                        $.$[1] = save_selection();
                        container[cla] = container[cla][re](/\s+source$/, "");
                        view[focus]();
                        restore_selection($.$[0]);
                        _t = 0;
                    }
                    $.d.x();
                    is_fn(c_x) && c_x(e, $, _t || 0);
                }
            };
        for (i in tools) {
            tools[i] = btn(text[i][0] + (text[i][2] ? ' (' + text[i][2] + ')' : ""), cln + '-' + i, text[i], tools[i]);
        }
        function pattern(a, b) {
            return new RegExp(a, b);
        }
        function convert(text) {
            text = text[re](/\r/g, "");
            text = text[re](/<code(?:\s[^<>]*?)?>([\s\S]*?)<\/code>/g, function(a, b) {
                return '<code>' + b[re](/\n/g, BR)[re](/(\t| {4})/g, '&nbsp;&nbsp;&nbsp;&nbsp;') + '</code>';
            });
            text = text[re](/<(\/?)([\w-]+?)(\s[^<>]*?)?>/g, function($, a, b, c) {
                b = lc(b);
                if (!pattern('^(' + tags + '|' + blocks + ')$')[test](b)) {
                    return "";
                }
                c = c || "";
                var heading = /^(h[1-6]|th)$/[test](b),
                    caption = /^((fig)?caption)$/[test](b);
                if (b === 'br' || b === 'p') {
                    return '<' + a + b + '>';
                } else if (b === 'b' || b === 'strong' || heading) {
                    return '<' + a + 'strong>' + (heading && a ? BR + BR : "");
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
                    return !a ? BR : "";
                }
                return "";
            });
            text = text[re](/<\/p>\s*<p>/g, '</p><p>')[re](/\s*<br\s*\/?>\s*/g, BR)[re](/\n/g, BR)[re](pattern('(?:' + BR + '){3,}', 'g'), BR + BR)[re](pattern('^(?:(?:' + BR + ')+)|(?:(?:' + BR + ')+)$'), "")[re](pattern(BR + BR, 'g'), '</p><p>')[re](/<p><\/p>/g, "");
            text = text && !/^\s*<p>([\s\S]*?)<\/p>\s*$/i[test](text) ? '<p>' + text + '</p>' : text;
            return text;
        }
        function write() {
            view[html] = convert(target[val])[re](/<\/p>\s*<p>/g, BR + BR)[re](/<\/?p>/g, "");
        } write();
        function copy() {
            target[val] = convert(view[html])[re](/<\/p><p>/g, '</p>\n<p>');
        } copy();
        function btn(t, c, s, f) {
            var a = el('a');
            a[cla] = c;
            a[html] = '<span>' + (s[1] || s[0]) + '</span>';
            a.title = t;
            a.href = 'javascript:;';
            function R(e) {
                f.apply(this, [e]), copy(), view[focus](), (is_fn(c_update) && c_update(e, $, view)), e[stop]();
            }
            a[event]("touchstart", R, false);
            a[event]("mousedown", R, false);
            return [a, f];
        }
        container[cla] = cln;
        target[cla] = cln + '-source';
        target[set](spellcheck, false);
        tool[cla] = cln + '-tool';
        view[cla] = cln + '-view';
        if (c_enter) {
            container[cla] += ' expand';
        }
        view[set](editable, true);
        view[set](spellcheck, false);
        view[set](placeholder, target[placeholder] || "");
        view[event]("paste", function() {
            delay(write, 1);
        }, false);
        function kk(e) {
            return lc(e.key || String.fromCharCode(e[KEYC]));
        }
        view[event]("keydown", function(e) {
            var ctrl = e[CTRL],
                shift = e[SHIFT],
                k = e[KEYC],
                p = container,
                key = kk(e), form;
            if (ctrl && !shift && (key === 'b' || k === 66)) {
                tools.b[1](), e[stop]();
            } else if (ctrl && !shift && (key === 'i' || k === 73)) {
                tools.i[1](), e[stop]();
            } else if (ctrl && !shift && (key === 'u' || k === 85)) {
                tools.u[1](), e[stop]();
            } else if (ctrl && !shift && (key === 'l' || k === 76)) {
                tools.a[1](), e[stop]();
            } else if (ctrl && shift && (key === 'x' || k === 88)) {
                tools.x[1](), e[stop]();
            } else if (!shift && (key === 'enter' || k === 13)) {
                // Press `enter` to insert a line break
                // Fix IE that will automatically inserts `<p>` instead of `<br>`
                var s = get_$(),
                    r = get_$$(),
                    br = el('br');
                if (c_enter && r) {
                    r.deleteContents();
                    r.insertNode(br);
                    r.setStartAfter(br);
                    r.setEndAfter(br); 
                    s.removeAllRanges();
                    s.addRange(r);
                    e[stop]();
                }
                // submit form on `enter` key in the `span[contenteditable]`
                if (!c_enter) {
                    while (p = p[parent]) {
                        if (lc(p[node]) === 'form') {
                            form = p;
                            break;
                        }
                    }
                    form && form.submit();
                } else if (is_fn(c_enter)) {
                    c_enter(e, $, view);
                }
            }
            is_fn(c_update) && c_update(e, $, view);
            delay(copy, 1);
        }, false);
        target[event]("keydown", function(e) {
            var ctrl = e[CTRL],
                shift = e[SHIFT],
                k = e[KEYC],
                key = kk(e);
            if (ctrl && shift && (key === 'x' || k === 88)) {
                tools.x[1](), e[stop]();
            } else if (!shift && (key === 'enter' || k === 13)) {
                is_fn(c_enter) && c_enter(e, $, target);
            }
            is_fn(c_update) && c_update(e, $, target);
            delay(write, 1);
        }, false);
        t = config.tools;
        for (i in t) {
            if (tools[t[i]]) {
                tool[append](tools[t[i]][0]);
            }
        }
        container[append](view);
        target[parent][insert](container, target);
        container[append](target);
        container[append](tool);
        dialog[cla] = cln + '-dialog';
        dialog[html] = '<input type="text">';
        $.d.x();
        dialog[child][0][set](spellcheck, false);
        dialog[child][0][event]("keydown", function(e) {
            var t = this,
                ctrl = e[CTRL],
                shift = e[SHIFT],
                k = e[KEYC],
                key = kk(e);
            if (!ctrl && !shift && (key === 'enter' || k === 13)) {
                $.d.x();
                view[focus]();
                restore_selection($.$[0]);
                dialog_fn && (dialog_fn(e, $, t), dialog_fn = 0, e[stop]());
            } else if (!shift && ((key === 'escape' || k === 27) || (!t[val][len] && (key === 'backspace' || k === 8)))) {
                $.d.x();
                view[focus]();
                restore_selection($.$[0]);
                e[stop]();
            }
        }, false);
        container[append](dialog);
        $.container = container;
        $.tool = tool;
        $.view = view;
        $.target = $.source = target;
        $.dialog = dialog;
        return $;
    });

})(window, document, 'RTE');