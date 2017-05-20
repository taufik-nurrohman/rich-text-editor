/*!
 * =======================================================
 *  RICH TEXT EDITOR 1.0.7
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
        create = 'create',
        style = 'style',
        minh = 'minHeight',
        html = 'innerHTML',
        cla = 'className',
        event_s = 'addEventListener',
        event_r = 'removeEventListener',
        append = 'appendChild',
        remove = 'removeChild',
        parent = 'parentNode',
        child = 'children',
        childn = 'childNodes',
        first = 'firstChild',
        insert = 'insertBefore',
        node = 'nodeName',
        get = 'getAttribute',
        set = 'setAttribute',
        reset = 'removeAttribute',
        re = 'replace',
        rec = re + 'Child',
        val = 'value',
        len = 'length',
        pos = 'indexOf',
        chop = 'substring',
        stop = 'preventDefault',
        click = 'click',
        focus = 'focus',
        blur = 'blur',
        select = 'select',
        keydown = 'keydown',
        paste = 'paste',
        error = 'error',
        test = 'test',
        editable = 'contenteditable',
        readonly = 'readonly',
        spellcheck = 'spellcheck',
        placeholder = 'placeholder',
        $s, $r,
        $s_ = 'getSelection',
        $s_at = 'getRangeAt',
        $s_i = 'rangeCount',
        $s_set = 'addRange',
        $s_reset = 'removeAllRanges',
        $r_ = create + 'Range',
        $r_copy = 'cloneContents',
        $r_delete = 'deleteContents',
        $r_select_node = select + 'Node',
        $r_select_content = $r_select_node + 'Contents',
        $r_insert = 'insertNode',
        $r_clone = 'cloneRange',
        $r_collapse = 'collapse',
        $r_start = 'setStart',
        $r_end = 'setEnd',
        $r_start_0 = $r_start + 'Before',
        $r_start_1 = $r_start + 'After',
        $r_end_0 = $r_end + 'Before',
        $r_end_1 = $r_end + 'After',
        tru = true,
        fals = false,
        nul = null,
        CTRL = 'ctrlKey',
        SHIFT = 'shiftKey',
        ALT = 'altKey',
        KEYC = 'keyCode',
        delay = setTimeout;

    function el(x) {
        return doc[create + 'Element'](x);
    }

    function lc(s) {
        return s.toLowerCase();
    }

    function is_text(x) {
        return x.nodeType === 3;
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

    function ev_s(a, b, f) {
        return a[event_s](b, f, fals);
    }

    function ev_r(a, b, f) {
        return a[event_r](b, f);
    }

    function fragment(s) {
        var a = el('div'),
            b = doc[create + 'DocumentFragment'](), c, d;
        a[html] = s;
        while (c = a[first]) {
            d = b[append](c);
        }
        return [b[first], d, b]; // [first, last, container]
    }

    (function($) {

        // plugin version
        $.version = '1.0.7';

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
        $.x = '\u200b';

    })(win[NS] = function(target, o) {

        var $ = this,
            ctrl = '\u2318',
            shift = '\u21E7',
            // svg view box: 16 × 16
            svg_pref = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="',
            svg_suf = '"></path></svg>',
            config = {
                classes: ['rich-text-editor'],
                tags: ['a', 'abbr', 'b', 'br', 'code', 'dfn', 'del', 'em', 'i', 'ins', 'kbd', 'mark', 'p', 'span', 'strong', 'u', 'var'],
                attributes: ['class', 'data-[\\w-]+?', 'href', 'id', 'rel', 'style', 'target', 'title'],
                tools: ['b', 'i', 'u', 'x'],
                text: {
                    b: ['Bold', svg_pref + 'M9 10.344c0.563 0 1-0.438 1-1s-0.438-1-1-1h-2.344v2h2.344zM6.656 4.344v2h2c0.563 0 1-0.438 1-1s-0.438-1-1-1h-2zM10.406 7.188c0.875 0.406 1.438 1.281 1.438 2.281 0 1.406-1.063 2.531-2.469 2.531h-4.719v-9.344h4.188c1.5 0 2.656 1.188 2.656 2.688 0 0.688-0.438 1.406-1.094 1.844z' + svg_suf,  ctrl + '+B'],
                    i: ['Italic', svg_pref + 'M6.656 2.656h5.344v2h-1.875l-2.25 5.344h1.469v2h-5.344v-2h1.875l2.25-5.344h-1.469v-2z' + svg_suf, ctrl + '+I'],
                    u: ['Underline', svg_pref + 'M3.344 12.656h9.313v1.344h-9.313v-1.344zM8 11.344c-2.219 0-4-1.781-4-4v-5.344h1.656v5.344c0 1.281 1.063 2.313 2.344 2.313s2.344-1.031 2.344-2.313v-5.344h1.656v5.344c0 2.219-1.781 4-4 4z' + svg_suf, ctrl + '+U'],
                    a: ['Link', svg_pref + 'M11.344 4.656c1.844 0 3.313 1.5 3.313 3.344s-1.469 3.344-3.313 3.344h-2.688v-1.281h2.688c1.125 0 2.063-0.938 2.063-2.063s-0.938-2.063-2.063-2.063h-2.688v-1.281h2.688zM5.344 8.656v-1.313h5.313v1.313h-5.313zM2.594 8c0 1.125 0.938 2.063 2.063 2.063h2.688v1.281h-2.688c-1.844 0-3.313-1.5-3.313-3.344s1.469-3.344 3.313-3.344h2.688v1.281h-2.688c-1.125 0-2.063 0.938-2.063 2.063z' + svg_suf, ctrl + '+L'],
                    x: ['Source', svg_pref + 'M8 6.656c0.719 0 1.344 0.625 1.344 1.344s-0.625 1.344-1.344 1.344-1.344-0.625-1.344-1.344 0.625-1.344 1.344-1.344zM12 6.656c0.719 0 1.344 0.625 1.344 1.344s-0.625 1.344-1.344 1.344-1.344-0.625-1.344-1.344 0.625-1.344 1.344-1.344zM4 6.656c0.719 0 1.344 0.625 1.344 1.344s-0.625 1.344-1.344 1.344-1.344-0.625-1.344-1.344 0.625-1.344 1.344-1.344z' + svg_suf, ctrl + '+' + shift + '+X']
                },
                tidy: 1,
                enter: 1,
                x: 1,
                update: 0
            },
            container = el('div'),
            tool = el('div'),
            view = el('div'),
            dialog = el('div'),
            BR = '<br>',
            X = win[NS].x,
            BR_REGXP = '<br(\\s[^<>]*?)?\\s*\\/?>',
            P_OPEN_REGXP = '<p(\\s[^<>]*?)?>',
            P_CLOSE_REGXP = '<\\/p>',
            BR_ANY_REGXP = '\\s*(?:' + BR_REGXP + ')\\s*',
            P_EDGE_REGXP = '^\\s*' + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*\\s*|\\s*(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + '\\s*$',
            P_SPLIT_REGXP = '\\s*(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + '\\s*' + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*\\s*',
            P_ANY_REGXP = '\\s*(?:' + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*|(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + ')\\s*',
            P_EMPTY_REGXP = '\\s*' + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*\\s*(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + '\\s*',
            P_CONTAIN_REGXP = '\\s*' + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*(?:[\\s\\S]*?)(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + '\\s*',
            dialog_fn, t, i;

        function $s_get() {
            $s = win[$s_] && win[$s_]() || {};
            return $s[$s_i] && $s || nul;
        }

        function $r_get(r) {
            $s = $s_get();
            return $s && $s[$s_at](r || 0) || nul;
        }

        function selection_v(h, x, p) {
            if (h) {
                if ($s = $s_get()) {
                    var container = el('div'), i, j;
                    for (i = 0, j = $s[$s_i]; i < j; ++i) {
                        container[append]($s[$s_at](i)[$r_copy]());
                    }
                    h = container[html].split(X).join("");
                    h = (is_x(x) || x) ? $.f(h) : h;
                    return (is_x(p) || p) ? h : h[re](pattern(P_SPLIT_REGXP, 'g'), '\n\n')[re](pattern(P_ANY_REGXP, 'g'), "");
                }
                return "";
            }
            return $s_get() + "";
        }

        function selection_e(t) {
            $s = $s_get();
            var a = $s && $s[focus + 'Node'] || nul, b;
            if (!a) {
                return nul;
            }
            if (is_text(a)) {
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
                i = i === 1 ? fals : i === 0 ? tru : i;
                $r[$r_collapse](i);
            }
            return $;
        }

        function selection_i(s, select) {
            if ($.is[focus]) {
                var f, node, fn, ln;
                if ($s = $s_get()) {
                    $r = $r_get();
                    $r[$r_delete]();
                    f = fragment(s);
                    fn = f[0];
                    ln = f[1];
                    $r[$r_insert](f[2]);
                    if (ln) {
                        $r = $r[$r_clone]();
                        $r[$r_start_1](ln);
                        if (select === tru) {
                            $r[$r_start_0](fn);
                        } else {
                            // reverse the direction
                            if (select === 1) {
                                select = 0;
                                // TODO: keep the cursor visible after insert after
                                selection_i(s, tru); // this is hacky :(
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
            return nul;
        }

        function selection_a(o) {
            try {
                var a = selection_e('a'),
                    b = selection_v(1, 1, 0)[re](/<a(\s[^<>]*?)?>|<\/a>/g, ""), c;
                // check for internal link
                o = o[re](/^\s*javascript:/i, "");
                var i = o[0], j = win.location.hostname;
                i = '/?&#'[pos](i) !== -1 || o[pos]('/') === -1;
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
                    selection_i(b, tru);
                // has value set
                } else {
                    // selection is not an `<a>`
                    if (!a) {
                        // insert HTML to selection
                        c = selection_i('<a href="' + o + '">' + b + '</a>', tru);
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
                return selection_e('a');
            } catch (e) {}
            return nul;
        }

        function selection_s() {
            var $r, $rr, $s;
            if ($r = $r_get()) {
                $rr = $r[$r_clone]();
                $rr[$r_select_content](view);
                $rr[$r_end]($r.startContainer, $r.startOffset);
                $s = ($rr + "")[len];
                return [$s, $s + ($r + "")[len]];
            }
            return nul;
        }

        function selection_r(s) {
            if (!s) return;
            var $r = doc[$r_](), $s,
                ci = 0, cin,
                n = [view],
                i, j, f, x;
            $r[$r_start](view, 0);
            $r[$r_collapse](tru);
            while (!x && (j = n.pop())) {
                if (is_text(j)) {
                    cin = ci + j[len];
                    if (!f && s[0] >= ci && s[0] <= cin) {
                        $r[$r_start](j, s[0] - ci);
                        f = 1;
                    }
                    if (f && s[1] >= ci && s[1] <= cin) {
                        $r[$r_end](j, s[1] - ci);
                        x = 1;
                    }
                    ci = cin;
                } else {
                    i = j[childn][len];
                    while (i--) {
                        n.push(j[childn][i]);
                    }
                }
            }
            $s = win[$s_]();
            $s[$s_reset]();
            $s[$s_set]($r);
        }

        function selection_w(t, i, p) {
            if ($.is[focus]) {
                if (is_x(i)) i = -1;
                var current = pattern('<' + t + '(?:\\s[^<>]*?)?>|<\\/' + t + '>', 'g'),
                    a = selection_e(t),
                    b = selection_v(1, 1, 0)[re](current, ""),
                    c = nul, d;
                if (a !== view) {
                    if (i === 0 || (i === -1 && a)) {
                        if (a && (d = a[html])) {
                            a[parent][remove](a);
                            if (b && d[pos](b) !== -1) {
                                // `<$t>a[b]c</$t>` → `<$t>a</$t>b<$t>c</$t>`
                                selection_i('<' + t + '>' + d[chop](0, d[pos](b)) + '</' + t + '>', 0);
                                c = selection_i(b, 0);
                                selection_i('<' + t + '>' + d[chop](d[pos](b) + b[len]) + '</' + t + '>', 1);
                            } else {
                                // `<$t>[abc]</$t>` → `abc`
                                c = selection_i(b || d, tru);
                            }
                        }
                    } else if (i === 1 || (i === -1 && !a)) {
                        // `a<br><br>b` → `<$t>a</$t><br><br><$t>b</$t>`
                        b = b[re](pattern('(\\n|' + BR_ANY_REGXP + '){2,}', 'g'), '</' + t + '>' + BR + BR + '<' + t + '>');
                        // `a` → `<$t>a</$t>`
                        c = selection_i('<' + t + '>' + b + '</' + t + '>', tru);
                    }
                    if (c) {
                        $r = $r_get();
                        $r && $r[$r_select_content](c);
                        if (!b && p) {
                            selection_i(p, tru);
                        }
                    }
                }
                return c;
            }
            return nul;
        }

        function focus_to(x, i) {
            if (focus in x) {
                x.selectionStart = x.selectionEnd = is_x(i) ? x[val][len] : i;
                x[focus]();
            }
        }

        $.$ = [nul, nul]; // [source, view]
        $.$$ = function(i, j) {
            var o = [$s_get(), $r_get(j)];
            return is_x(i) ? o : o[i];
        };
        $.d = function(p, v, f) {
            var d = dialog[child][0];
            d[placeholder] = p;
            d[val] = v;
            delay(function() {
                focus_to(d);
            }, 1);
            dialog_fn = f;
            return $.d.v(1), $;
        };
        $.d.x = function(r, x) {
            var i = dialog[child][0],
                v = i[val];
            if (v && !x) { // has value set, don’t hide!
                cls_s(container, error);
                $.is[error] = tru;
                $.is.d = tru;
                delay(function() {
                    $.is[focus] = fals;
                    $.is[blur] = tru;
                    i[focus](), i[select]();
                }, 1);
            } else {
                cls_r(container, 'd');
                cls_r(container, error);
                $.is.d = fals;
            }
            // force focus state
            $.is[focus] = tru;
            $.is[blur] = fals;
            r && ($[focus](), selection_r($.$[1]));
            return $;
        };
        $.d.v = function(s) {
            cls_s(container, 'd');
            cls_r(container, error);
            $.is[error] = fals;
            $.is.d = tru;
            $.$[1] = s ? selection_s() : nul;
            return $;
        };

        win[NS][instance][target.id || target.name || Object.keys(win[NS][instance])[len]] = $;

        o = o || {};
        for (i in config) {
            if (!is_x(o[i])) config[i] = o[i];
        }

        $.is = {
            view: tru,
            source: fals,
            d: fals,
            e: function(s) {
                if (typeof s === "string") {
                    return selection_e(s) ? tru : fals;
                }
                return selection_e() === s;
            },
            focus: fals,
            blur: tru,
            error: fals
        };

        var c_enter = config.enter,
            c_x = config.x,
            c_update = config.update,
            cln = config.classes[0],
            text = config.text || {},
            tags = config.tags.join('|'),
            attributes = config.attributes.join('|'),
            blocks = 'a(rticle|side)|blockquote|(fig)?caption|figure|h([1-6]|eader)|div|li|[ou]l|p(re)?|section|t(able|[dh])',
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
                    var a = selection_v(1, 1, 0), b, c;
                    // toggle auto-link on URL-like text
                    if (/^[a-z\d]+:\/\/\S+$/[test](a)) {
                        if (selection_e('a')) {
                            selection_w('a', 0); // force unwrap
                        } else {
                            selection_a(a);
                        }
                    } else {
                        if ($.is.d) {
                            $.d.x(1); // cancel
                        } else {
                            if (b = selection_e('a')) {
                                c = b[get]('href');
                            }
                            $.d('http://', (c ? c[re](/\/+$/, "") : 'http://' + lc(a[re](/\s|<[^<>]+?>/g, ""))) || "", function(e, $, i) {
                                selection_a(i[val]);
                            });
                            delay(function() {
                                c && dialog[child][0][select](); // select all value if selection already wrapped by the `<a>`
                            }, 2);
                        }
                    }
                },
                x: function(e) {
                    if (!c_x) return;
                    var h = view.offsetHeight;
                    h && (target[style][minh] = h + 'px');
                    if (!_t) {
                        $.$[1] = selection_s();
                        cls_s(container, 'source');
                        cls_r(container, 'view');
                        target[focus]();
                        $.$[0] && selection_r($.$[0]);
                        _t = 1;
                    } else {
                        $.$[0] = selection_s();
                        cls_s(container, 'view');
                        cls_r(container, 'source');
                        view[focus]();
                        $.$[1] && selection_r($.$[1]);
                        _t = 0;
                    }
                    $.is.view = !_t;
                    $.is.source = !!_t;
                    $.d.x(0, 1);
                    is_fn(c_x) && c_x(e, $, _t || 0);
                }
            };

        function cls_s(e, s) {
            var c = e[cla];
            if (pattern('(^|\\s)\\s*' + s + '\\s*(\\s|$)')[test](c)) {
                return e;
            }
            return (e[cla] = c + ' ' + s), e;
        }

        function cls_r(e, s) {
            var t = e[cla][re](pattern('(^|\\s)\\s*' + s + '\\s*(\\s|$)', 'g'), '$1$2');
            return (t ? (e[cla] = t[re](/^\s*|\s*$/g, "")) : e[reset]('class')), e;
        }

        function btn(t, c, s, f) {
            var a = cls_s(el('a'), c),
                b = s[1] || s[0];
            if (b[pos]('svg:') === 0) {
                b = svg_pref + b.slice(4) + svg_suf;
            }
            a[html] = '<span>' + b + '</span>';
            a.title = t;
            a.href = 'javascript:;';
            if (f) {
                function R(e) {
                    f.apply(this, [e, $, a]), copy(), view[focus](), (is_fn(c_update) && c_update(e, $, view)), e[stop]();
                }
                ev_s(a, "touchstart", R);
                ev_s(a, "mousedown", R);
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
        $.f = function(text) {
            text = text[re](/\r/g, "").split(X).join("");
            // remove empty HTML tag(s)
            text = text[re](/<([\w-:]+?)(?:\s[^<>]*?)?>\s*<\/([\w-:]+?)>/g, function($, a, b) {
                return a === b ? "" : $;
            });
            text = text[re](/<code(?:\s[^<>]*?)?>([\s\S]*?)<\/code>/g, function(a, b) {
                return '<code>' + b[re](/(\t| {4})/g, '&nbsp;&nbsp;&nbsp;&nbsp;') + '</code>';
            });
            // convert XHTML tag(s) into HTML5 tag(s)
            text = text[re](/<(\/?)([\w-:]+?)(\s[^<>]*?)?>/g, function($, a, b, c) {
                b = lc(b);
                // filter HTML tag(s)
                if (!pattern('^(' + tags + '|' + blocks + ')$')[test](b)) {
                    return "";
                }
                if (c = c || "") {
                    // filter HTML attribute(s)
                    c = c[re](/\s+([\w-:]+?)(?:="((?:\\.|[^"])*?)"|$)/g, function($, a, b) {
                        if (!pattern('^(' + attributes + ')$')[test](a)) {
                            return "";
                        }
                        return $;
                    });
                }
                var heading = /^(h[1-6]|th)$/[test](b),
                    cap = /^((fig)?caption)$/[test](b),
                    d = a ? "" : c;
                if (pattern('^(' + tags + ')$')[test](b)) {
                    return '<' + a + b + d + '>';
                } else if (b === 'b' || b === 'strong' || heading) {
                    return '<' + a + 'strong' + d + '>' + (heading && a ? BR + BR : "");
                } else if (b === 'i' || b === 'em' || cap) {
                    return '<' + a + 'em' + d + '>';
                } else if (pattern('^(' + blocks + ')$')[test](b)) {
                    return BR + BR;
                }
                return "";
            });
            // convert line break to `<p>` and `<br>`
            text = text[re](pattern(P_SPLIT_REGXP, 'gi'), '</p><p$1>')[re](pattern(BR_ANY_REGXP, 'gi'), BR)[re](/\n/g, BR)[re](pattern('(?:' + BR_ANY_REGXP + '){3,}', 'gi'), BR + BR)[re](pattern('^(?:' + BR_ANY_REGXP + ')+|(?:' + BR_ANY_REGXP + ')+$', 'gi'), "")[re](pattern('(?:' + BR_ANY_REGXP + '){2,}', 'gi'), '</p><p>')[re](pattern(P_EMPTY_REGXP, 'gi'), "");
            text = text && !pattern('^' + P_CONTAIN_REGXP + '$', 'gi')[test](text) ? '<p>' + text + '</p>' : text;
            return text;
        };
        function write() {
            view[html] = $.f(target[val])[re](pattern(P_SPLIT_REGXP, 'gi'), BR + BR)[re](pattern(P_ANY_REGXP, 'gi'), "");
        } write();
        function copy() {
            var v = $.f(view[html]);
            if (config.tidy) {
                v = v[re](pattern(P_SPLIT_REGXP, 'gi'), '</p>\n\n<p$1>')[re](pattern(BR_REGXP, 'gi'), BR + '\n');
            }
            target[val] = v;
        } copy();
        cls_s(container, cln + ' view');
        target[set](spellcheck, fals);
        cls_s(tool, cln + '-tool');
        cls_s(view, cln + '-view');
        if (c_enter) {
            cls_s(container, 'expand');
        }
        view[set](editable, tru);
        view[set](spellcheck, fals);
        view[set](placeholder, target[placeholder] || "");
        ev_s(view, focus, function() {
            $.is[focus] = tru;
            $.is[blur] = fals;
            cls_s(container, focus);
        });
        ev_s(view, blur, function() {
            $.is[focus] = fals;
            $.is[blur] = tru;
            copy();
            cls_r(container, focus);
        });
        ev_s(view, paste, function() {
            delay(function() {
                write();
                var v = view[html];
                view[html] = "", selection_i(v, 0);
            }, 1);
        });
        function kk(e) {
            return lc(e.key || String.fromCharCode(e[KEYC]));
        }
        ev_s(view, keydown, function(e) {
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
            } else if (ctrl && shift && (key === 'x' || k === 88) && c_x) {
                tools.x[1](), e[stop]();
            } else if (!shift && (key === 'enter' || k === 13)) {
                // Press `enter` to insert a line break
                // Fix IE that will automatically inserts `<p>` instead of `<br>`
                if (c_enter) {
                    $s = $s_get();
                    $r = $r_get();
                    selection_i(BR, 0);
                    selection_i(X, 1);
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
                    form && (form.submit(), e[stop]());
                } else if (is_fn(c_enter)) {
                    c_enter(e, $, view);
                }
            }
            is_fn(c_update) && c_update(e, $, view);
            delay(function() {
                var v = view[html][re](pattern(X, 'g'), "");
                if (!v || v === BR) {
                    view[html] = "";
                }
                copy();
            }, 1);
        });
        var target_parent = target[parent],
            target_a = el('a');
        function fn_target_keydown(e) {
            var ctrl = e[CTRL],
                shift = e[SHIFT],
                k = e[KEYC],
                key = kk(e);
            if (ctrl && shift && (key === 'x' || k === 88) && c_x) {
                tools.x[1](), e[stop]();
            } else if (!shift && (key === 'enter' || k === 13)) {
                is_fn(c_enter) && c_enter(e, $, target);
            }
            is_fn(c_update) && c_update(e, $, target);
            delay(write, 1);
        }
        function editor_create() {
            if (container[parent]) {
                return $; // did create already, skip!
            }
            cls_s(target, cln + '-source');
            ev_s(target, keydown, fn_target_keydown);
            t = config.tools;
            for (i in t) {
                i = t[i];
                if (tools[i]) {
                    if (i === 'x' && !c_x) {
                        continue; // disable the source view if `config.x = false`
                    }
                    tool[append](tools[i][0]);
                }
            }
            container[append](view);
            if (target_parent && lc(target_parent[node]) === 'p') {
                target_parent[insert](target_a, target);
                target_parent[parent][insert](target, target_parent);
                target_parent[parent][remove](target_parent);
            }
            target[parent][insert](container, target);
            container[append](target);
            container[append](tool);
            cls_s(dialog, cln + '-d');
            dialog[html] = '<input type="text">';
            $.d.x();
            var dc = dialog[child][0];
            dc[set](spellcheck, fals);
            ev_s(dc, click, function() {
                $.is[error] = fals;
                cls_r(container, error);
            });
            ev_s(dc, keydown, function(e) {
                var t = this,
                    ctrl = e[CTRL],
                    shift = e[SHIFT],
                    k = e[KEYC],
                    key = kk(e);
                if (!ctrl && !shift && (key === 'enter' || k === 13)) {
                    $.d.x(1, 1);
                    dialog_fn && dialog_fn(e, $, t), (dialog_fn = 0, t[val] = ""), (is_fn(c_update) && c_update(e, $, view)), e[stop]();
                } else if (!shift && ((key === 'escape' || k === 27) || (!t[val][len] && (key === 'backspace' || k === 8)))) {
                    $.d.x(1, 1);
                    dialog_fn = 0, e[stop]();
                }
            });
            container[append](dialog);
            return $;
        } editor_create();
        function editor_destroy() {
            if (!container[parent]) {
                return $; // did destroy already, skip!
            }
            if (target_parent) {
                container[parent][insert](target_parent, container);
                target_parent[insert](target, target_a);
                target_parent[remove](target_a);
            }
            target[style][minh] = "";
            if (!target[get](style)) {
                target[reset](style);
            }
            cls_r(target, cln + '-source');
            ev_r(target, keydown, fn_target_keydown);
            container[parent][remove](container);
            return $;
        }
        $.container = container;
        $.view = view;
        $.target = $.source = target;
        $.tool = tool;
        $.dialog = dialog;
        $.config = config;
        $.c = selection_c;
        $.e = selection_e;
        $.i = selection_i;
        $.r = selection_r;
        $.s = selection_s;
        $.v = selection_v;
        $.w = selection_w;
        // create
        $[create] = editor_create;
        // destroy
        $.destroy = editor_destroy;
        // focus
        $[focus] = function(i) {
            if ($.is.view) {
                var v = view[html];
                view[focus]();
                $.$[1] && selection_r($.$[1]);
                $.is[focus] = tru;
                $.is[blur] = fals;
                // focus start
                if (i === 0) {
                    view[html] = "";
                    selection_i(v, 1);
                // focus end
                } else if (i === 1) {
                    view[html] = "";
                    selection_i(v, 0);
                // select all
                } else if (i === tru) {
                    $r = doc[$r_]();
                    $r[$r_select_content](view);
                    $s = $s_get();
                    $s[$s_reset]();
                    $s[$s_set]($r);
                }
            } else if ($.is.source) {
                target[focus]();
                // focus start
                if (i === 0) {
                    focus_to(target, 0);
                // focus end
                } else if (i === 1) {
                    focus_to(target, target[val][len]);
                // select all
                } else if (i === tru) {
                    target[select]();
                }
            }
            return $;
        };
        // blur
        $[blur] = function() {
            if ($.is.view) {
                $.is[focus] = fals;
                $.is[blur] = tru;
                view[blur]();
            } else if ($.is.source) {
                target[blur]();
            }
            return $;
        };
        // set value
        $.set = function(v, i) {
            v = $.f(v);
            if ($.is.view || i === 1) {
                v = v[re](pattern(P_EDGE_REGXP, 'gi'), "")[re](pattern(P_SPLIT_REGXP, 'gi'), BR + BR);
            }
            if (is_x(i)) {
                if ($.is.view) {
                    view[html] = v;
                    copy();
                } else if ($.is.source) {
                    target[val] = v;
                    write();
                } else if ($.is.d) {
                    dialog[child][0][val] = v;
                }
            } else if (i === 0) {
                target[val] = v;
                write();
            } else if (i === 1) {
                view[html] = v;
                copy();
            }
            return $;
        };
        // get value
        $.get = function(s, i) {
            if (is_x(i)) {
                var v;
                if ($.is.source) {
                    v = target[val];
                } else if ($.is.d) {
                    v = dialog[child][0][val];
                } else /* if ($.is.view) */ {
                    v = target[val]; // default
                }
                return v ? v : s;
            } else if (i === 0) {
                return target[val] || s;
            } else if (i === 1) {
                return view[html] || s;
            }
        };
        $.disable = function() {
            view[reset](editable);
            target[set](readonly, tru);
            return $;
        };
        $.enable = function() {
            view[set](editable, tru);
            target[reset](readonly);
            return $s;
        };
        return $;
    });

})(window, document, 'RTE');