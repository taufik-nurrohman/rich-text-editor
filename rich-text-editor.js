/*!
 * =======================================================
 *  SIMPLEST RICH TEXT EDITOR 1.0.4
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
        reset = 'removeAttribute',
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
        $s, $r,
        $s_ = 'getSelection',
        $s_at = 'getRangeAt',
        $s_i = 'rangeCount',
        $s_set = 'addRange',
        $s_reset = 'removeAllRanges',
        $r_copy = 'cloneContents',
        $r_delete = 'deleteContents',
        $r_select_node = 'selectNode',
        $r_select_content = 'selectNodeContents',
        $r_insert = 'insertNode',
        $r_clone = 'cloneRange',
        $r_collapse = 'collapse',
        $r_start_0 = 'setStartBefore',
        $r_start_1 = 'setStartAfter',
        $r_end_0 = 'setEndBefore',
        $r_end_1 = 'setEndAfter',
        nul = null,
        CTRL = 'ctrlKey',
        SHIFT = 'shiftKey',
        ALT = 'altKey',
        KEYC = 'keyCode',
        delay = setTimeout;

    function el(x) {
        return doc[create](x);
    }

    function lc(s) {
        return s.toLowerCase();
    }

    function is_x(x) {
        return typeof x === "undefined";
    }

    function is_fn(x) {
        return typeof x === "function";
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    (function($) {

        // plugin version
        $.version = '1.0.4';

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

        // placeholder character
        $.x = '\u200c';

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
            X = doc.createTextNode(win[NS].x),
            dialog_fn, t, i;

        function placeholder_set(i) {
            // reverse the direction
            if (i === 1) {
                i = 0;
            } else if (i === 0) {
                i = 1;
            }
            $r_get()[$r_insert](X), selection_c(i);
        }

        function placeholder_reset() {
            X[parent] && X[parent][remove](X);
        }

        function $s_get() {
            $s = win[$s_] && win[$s_]() || {};
            return $s[$s_i] && $s || nul;
        }

        function $r_get(r) {
            $s = $s_get();
            return $s && $s[$s_at](r || 0) || nul;
        }

        function selection_v(h, x) {
            if (h) {
                if ($s = $s_get()) {
                    var container = el('div'), i, j;
                    for (i = 0, j = $s[$s_i]; i < j; ++i) {
                        container[append]($s[$s_at](i)[$r_copy]());
                    }
                    h = container[html];
                    return is_x(x) || x ? selection_f(h) : h;
                }
                return "";
            }
            return $s_get() + "";
        }

        function selection_e(t) {
            $s = $s_get();
            var a = $s.focusNode, b;
            if (!a) {
                return nul;
            }
            if (a.nodeType === 3) {
                if (a[parent] !== view) {
                    a = a[parent];
                }
            }
            b = lc(a[node]);
            if (t) {
                return b === t ? a : nul;
            }
            return a;
        }

        function selection_c(i) {
            if ($r = $r_get()) {
                i = i === 1 ? false : i === 0 ? true : i;
                $r[$r_collapse](i);
            }
            return $;
        }

        function selection_i(s, select) {
            var f, node, fn, ln,
                container = el('div');
            if ($s = $s_get()) {
                $r = $r_get();
                $r[$r_delete]();
                container[html] = s;
                f = doc.createDocumentFragment();
                while ((node = container[first]) ) {
                    ln = f[append](node);
                }
                fn = f[first];
                $r[$r_insert](f);
                if (ln) {
                    $r = $r[$r_clone]();
                    $r[$r_start_1](ln);
                    if (select === true) {
                        $r[$r_start_0](fn);
                    } else {
                        // reverse the direction
                        if (select === 1) {
                            select = 0;
                        } else if (select === 0) {
                            select = 1;
                        }
                        selection_c(select);
                    }
                    $s[$s_reset]();
                    $s[$s_set]($r);
                }
            }
            return fn;
        }

        function link(j, o) {
            if (j && j[get](editable)) {
                try {
                    var a = selection_e('a'),
                        b = selection_v(1)[re](/^<p>|<\/p>$|<a(\s[^<>]*?)?>|<\/a>/g, ""), c;
                    // check for internal link
                    o = o[re](/^\s*javascript:/i, "");
                    var i = o[0], j = win.location.hostname;
                    i = i === '/' || i === '?' || i === '&' || o[pos]('/') === -1;
                    if (j && (o[pos]('//' + j) === 0 || o[pos]('://' + j) !== -1)) {
                        i = 1;
                    }
                    // no value
                    if (!o) {
                        // selection is an `<a>`
                        if (a) {
                            b = a[html];
                            // remove the `<a>`
                            a[parent][remove](a);
                        }
                        // insert the selection HTML
                        selection_i(b, true);
                    // has value set
                    } else {
                        // selection is not an `<a>`
                        if (!a) {
                            // insert HTML to selection
                            c = selection_i('<a href="' + o + '">' + b + '</a>', true);
                            // select content of `<a>`
                            $r_get()[$r_select_content](c);
                        } else {
                            // just put to the `href` attribute of `<a>`
                            a[set]('href', o);
                        }
                        if (a = selection_e('a')) {
                            // automatic `rel="nofollow"` and `target="_blank"` attribute
                            // to the `<a>` with external link URL
                            if (i) {
                                a[reset]('rel');
                                a[reset]('target');
                            } else {
                                a[set]('rel', 'nofollow');
                                a[set]('target', 'blank');
                            }
                        }
                    }
                } catch (e) {}
            }
        }

        function selection_s() {
            $s = $s_get();
            if ($s || selection_v() === "") {
                return $r_get()[$r_clone]() || nul;
            }
            return nul;
        }

        function selection_r(r) {
            if (r) {
                if ($s = $s_get()) {
                    $s[$s_reset]();
                    $s[$s_set](r);
                }
            }
            return $;
        }

        function selection_w(t, i, p) {
            if (is_x(i)) {
                i = -1;
            }
            var a = selection_e(t),
                b = selection_v(1)[re](pattern('^<p>|<\\/p>$|<' + t + '(?:\\s[^<>]*?)?>|<\\/' + t + '>', 'g'), ""), c, d;
            if (a !== view) {
                if (i === 0 || (i === -1 && a)) {
                    d = a[html];
                    a[parent][remove](a);
                    c = selection_i(b || d, true);
                } else if (i === 1 || (i === -1 && !a)) {
                    c = selection_i('<' + t + '>' + b + '</' + t + '>', true);
                }
                if (c) {
                    $r_get()[$r_select_content](c);
                    if (!b && p) {
                        selection_i(p, true);
                    }
                }
            }
            return c;
        }

        function focus_end(x) {
            x.selectionStart = x.selectionEnd = x[val][len];
            x[focus]();
        }

        $.$ = [nul, nul];
        $.$$ = function(i, j) {
            $r = [$s_get(), $r_get(j)];
            return is_x(i) ? $r : $r[i];
        };
        $.d = function(p, v, f) {
            $.$[0] = selection_s();
            var d = dialog[child][0];
            d[placeholder] = p;
            d[val] = v;
            delay(function() {
                focus_end(d);
            }, 1);
            dialog_fn = f;
            return $.d.v(1), $;
        };
        $.d.x = function(r) {
            dialog.style.display = 'none';
            $.is.d = false;
            r && selection_r($.$[0]);
            return $;
        };
        $.d.v = function(s) {
            dialog.style.display = 'block';
            $.is.d = true;
            s && ($.$[0] = selection_s());
            return $;
        };
        win[NS][instance][target.id || target.name || Object.keys(win[NS][instance])[len]] = $;
        o = o || {};
        for (i in config) {
            if (!is_x(o[i])) config[i] = o[i];
        }
        $.is = {
            view: true,
            source: false,
            d: false,
            e: function(s) {
                if (typeof s === "string") {
                    return selection_e(s) ? true : false;
                }
                return selection_e() === s;
            }
        };
        var c_enter = config.enter,
            c_x = config.x,
            c_update = config.update,
            cln = config.classes[0],
            text = config.text || {},
            tags = config.tags.join('|'),
            blocks = 'blockquote|(fig)?caption|figure|h[1-6]|div|li|[ou]l|p(re)?|t(able|[dh])',
            _t = 0,
            tools = {
                b: function() {
                    selection_w('strong');
                },
                i: function() {
                    selection_w('em');
                },
                u: function() {
                    selection_w('u');
                },
                a: function(e) {
                    var a = selection_v(), b, c;
                    if (/^[a-z\d]+:\/\/\S+$/[test](a)) {
                        link(view, a);
                    } else {
                        if (b = selection_e('a')) {
                            c = b[get]('href');
                        }
                        $.d('http://', (c ? c[re](/\/+$/, "") : 'http://' + lc(a[re](/\s/g, ""))) || "", function(e, $, t) {
                            link(view, t[val]);
                        });
                    }
                },
                x: function(e) {
                    var h = view.offsetHeight;
                    h && (target.style.minHeight = h + 'px');
                    if (!_t) {
                        $.$[0] = selection_s();
                        container[cla] += ' source';
                        focus_end(target);
                        selection_r($.$[1]);
                        _t = 1;
                    } else {
                        $.$[1] = selection_s();
                        container[cla] = container[cla][re](/\s+source$/, "");
                        view[focus]();
                        selection_r($.$[0]);
                        _t = 0;
                    }
                    $.is.view = !_t;
                    $.is.source = !!_t;
                    $.d.x();
                    is_fn(c_x) && c_x(e, $, _t || 0);
                }
            };
        function btn(t, c, s, f) {
            var a = el('a');
            a[cla] = c;
            a[html] = '<span>' + (s[1] || s[0]) + '</span>';
            a.title = t;
            a.href = 'javascript:;';
            if (f) {
                function R(e) {
                    f.apply(this, [e, $, a]), copy(), view[focus](), (is_fn(c_update) && c_update(e, $, view)), e[stop]();
                }
                a[event]("touchstart", R, false);
                a[event]("mousedown", R, false);
            }
            return [a, f];
        }
        $.t = function(id, text, fn, i) {
            var a = btn(text[0] + (text[2] ? ' (' + text[2] + ')' : ""), cln + '-t:' + id, text, fn);
            if (is_x(i)) {
                i = nul;
            } else {
                if (i < 0) {
                    i = tool[child][len] + i;
                }
            }
            tool[insert](a[0], tool[child][i] || nul);
            return a[0];
        };
        for (i in tools) {
            $.t[i] = tools[i];
            tools[i] = btn(text[i][0] + (text[i][2] ? ' (' + text[i][2] + ')' : ""), cln + '-t:' + i, text[i], tools[i]);
            $.t[i].e = tools[i][0];
        }
        function selection_f(text) {
            text = text[re](/\r/g, "");
            // remove empty HTML tag(s)
            text = text[re](/<([\w-]+?)(?:\s[^<>]*?)?>\s*<\/([\w-]+?)>/g, function($, a, b) {
                return a === b ? "" : $;
            });
            text = text[re](/<code(?:\s[^<>]*?)?>([\s\S]*?)<\/code>/g, function(a, b) {
                return '<code>' + b[re](/\n/g, BR)[re](/(\t| {4})/g, '&nbsp;&nbsp;&nbsp;&nbsp;') + '</code>';
            });
            // convert XHTML tag(s) into HTML5 tag(s)
            text = text[re](/<(\/?)([\w-]+?)(\s[^<>]*?)?>/g, function($, a, b, c) {
                b = lc(b);
                if (!pattern('^(' + tags + '|' + blocks + ')$')[test](b)) {
                    return "";
                }
                c = c || "";
                var heading = /^(h[1-6]|th)$/[test](b),
                    caption = /^((fig)?caption)$/[test](b),
                    d = a ? "" : c;
                if (b === 'br' || b === 'p') {
                    return '<' + a + b + '>';
                } else if (b === 'b' || b === 'strong' || heading) {
                    return '<' + a + 'strong' + d + '>' + (heading && a ? BR + BR : "");
                } else if (b === 'i' || b === 'em') {
                    return '<' + a + 'em' + d + '>';
                } else if (pattern('^(' + tags + ')$')[test](b)) {
                    return '<' + a + b + d + '>';
                } else if (pattern('^(' + blocks + ')$')[test](b)) {
                    return BR + BR;
                }
                return "";
            });
            // convert line break to `<p>` and `<br>`
            text = text[re](/<\/p>\s*<p>/g, '</p><p>')[re](/\s*<br\s*\/?>\s*/g, BR)[re](/\n/g, BR)[re](pattern('(?:' + BR + '){3,}', 'g'), BR + BR)[re](pattern('^(?:(?:' + BR + ')+)|(?:(?:' + BR + ')+)$'), "")[re](pattern(BR + BR, 'g'), '</p><p>')[re](/<p><\/p>/g, "");
            text = text && !/^\s*<p>([\s\S]*?)<\/p>\s*$/i[test](text) ? '<p>' + text + '</p>' : text;
            return text;
        }
        function write() {
            view[html] = selection_f(target[val])[re](/<\/p>\s*<p>/g, BR + BR)[re](/<\/?p>/g, "");
        } write();
        function copy() {
            target[val] = selection_f(view[html])[re](/<\/p><p>/g, '</p>\n<p>');
        } copy();
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
            delay(function() {
                write();
                var v = view[html];
                view[html] = "", selection_i(v, 0);
            }, 1);
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
                if (c_enter) {
                    placeholder_set(1);
                    selection_i(BR, 0);
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
            } else if (!shift && (key === 'backspace' || k === 8)) {
                placeholder_reset();
            }
            is_fn(c_update) && c_update(e, $, view);
            delay(copy, 1);
        }, false);
        view[event]("blur", function() {
            placeholder_reset(), copy();
        });
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
        var dc = dialog[child][0];
        dc[set](spellcheck, false);
        dc[event]("keydown", function(e) {
            var t = this,
                ctrl = e[CTRL],
                shift = e[SHIFT],
                k = e[KEYC],
                key = kk(e);
            if (!ctrl && !shift && (key === 'enter' || k === 13)) {
                $.d.x(1);
                view[focus]();
                dialog_fn && dialog_fn(e, $, t), (dialog_fn = 0), (is_fn(c_update) && c_update(e, $, view)), e[stop]();
            } else if (!shift && ((key === 'escape' || k === 27) || (!t[val][len] && (key === 'backspace' || k === 8)))) {
                $.d.x(1);
                view[focus]();
                dialog_fn = 0, e[stop]();
            }
        }, false);
        container[append](dialog);
        $.container = container;
        $.view = view;
        $.target = $.source = target;
        $.tool = tool;
        $.dialog = dialog;
        $.config = config;
        $.c = selection_c;
        $.e = selection_e;
        $.f = selection_f;
        $.i = selection_i;
        $.r = selection_r;
        $.s = selection_s;
        $.v = selection_v;
        $.w = selection_w;
        $.x = function(x, y) {
            if (!is_x(x)) {
                placeholder_set(x);
            } else {
                placeholder_reset();
            }
        }
        return $;
    });

})(window, document, 'RTE');