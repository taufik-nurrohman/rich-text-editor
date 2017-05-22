/*!
 * =======================================================
 *  RICH TEXT EDITOR 1.1.3
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
        minHeight = 'minHeight',
        s = 'HTML',
        innerHTML = 'inner' + s,
        outerHTML = 'outer' + s,
        className = 'className',
        s = 'EventListener',
        addEventListener = 'add' + s,
        removeEventListener = 'remove' + s,
        s = 'Child',
        firstChild = 'first' + s,
        appendChild = 'append' + s,
        removeChild = 'remove' + s,
        parentNode = 'parentNode',
        children = 'children',
        childNodes = 'childNodes',
        insertBefore = 'insertBefore',
        nodeName = 'nodeName',
        s = 'Attribute',
        getAttribute = 'get' + s,
        setAttribute = 'set' + s,
        removeAttribute = 'remove' + s,
        replace = 'replace',
        value = 'value',
        length = 'length',
        indexOf = 'indexOf',
        substring = 'substring',
        push = 'push',
        preventDefault = 'preventDefault',
        click = 'click',
        focus = 'focus',
        blur = 'blur',
        select = 'select',
        keydown = 'keydown',
        paste = 'paste',
        error = 'error',
        test = 'test',
        contentEditable = 'contenteditable',
        readOnly = 'readonly',
        spellCheck = 'spellcheck',
        placeholder = 'placeholder',
        getSelection = 'getSelection',
        getRangeAt = 'getRangeAt',
        rangeCount = 'rangeCount',
        addRange = 'addRange',
        removeAllRanges = 'removeAllRanges',
        createRange = create + 'Range',
        s = 'Contents',
        cloneContents = 'clone' + s,
        deleteContents = 'delete' + s,
        selectNode = select + 'Node',
        selectNodeContents = selectNode + s,
        insertNode = 'insertNode',
        cloneRange = 'cloneRange',
        collapse = 'collapse',
        setStart = 'setStart',
        setEnd = 'setEnd',
        setStartBefore = setStart + 'Before',
        setStartAfter = setStart + 'After',
        setEndBefore = setEnd + 'Before',
        setEndAfter = setEnd + 'After',
        tru = true,
        fals = false,
        nul = null,
        div = 'div',
        s = 'Key',
        ctrlKey = 'ctrl' + s,
        shiftKey = 'shift' + s,
        altKey = 'alt' + s,
        keyCode = 'keyCode',
        delay = setTimeout,
        $s, $r;

    function el(x) {
        return doc[create + 'Element'](x);
    }

    function lc(s) {
        return s.toLowerCase();
    }

    function is_string(x) {
        return typeof x === "string";
    }

    function is_nude(x) {
        return x.nodeType === 3;
    }

    function is_undef(x) {
        return typeof x === "undefined";
    }

    function is_func(x) {
        return typeof x === "function";
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function text(s, t) {
        t = t || '[\\w-:]+';
        return s[replace](pattern('<\\/' + t + '>|<' + t + '(\\s[^<>]*?)?>', 'gi'), "")[replace](/ +/g, ' ')[replace](/^\s*|\s*$/g, "");
    }

    function join(x, s) {
        return x.join(s || "");
    }

    function ev_s(a, b, f) {
        return a[addEventListener](b, f, fals);
    }

    function ev_r(a, b, f) {
        return a[removeEventListener](b, f);
    }

    function selection_g(s) {
        var a = el(div),
            b = doc[create + 'DocumentFragment'](),
            c = [],
            d = [], e, f = "";
        if (is_string(s)) {
            a[innerHTML] = s;
            while (e = a[firstChild]) {
                d[push](lc(e[nodeName] || ""));
                c[push](b[appendChild](e));
            }
            return [c, b, d, s]; // [node(s), container, name(s), string]
        }
        for (d in s) {
            if (!(e = s[d])) continue;
            if (is_string(e)) {
                f += e;
                a[innerHTML] = e;
                e = a[firstChild];
            } else {
                f += e[outerHTML];
            }
            c[push](lc(e[nodeName] || ""));
            b[appendChild](e);
        }
        return [s, b, c, f]; // [node(s), container, name(s), string]
    }

    (function($) {

        // plugin version
        $.version = '1.1.3';

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
                tags: ['a|abbr|b|br|code|dfn|del|em|i|ins|kbd|mark|p|span|strong|u|var'],
                blocks: ['article|aside|blockquote|figure|figcaption|figure|h[1-6]|header|div|li|[ou]l|p|pre|section|table|tr|th'],
                attributes: ['class|data-[\\w-]+?|href|id|rel|style|target|title'],
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
            container = el(div),
            tool = el(div),
            view = el(div),
            dialog = el(div),
            BR = '<br>',
            X = win[NS].x,
            s = '(\\s[^<>]*?)?',
            BR_REGXP = '<br' + s + '\\s*\\/?>',
            P_OPEN_REGXP = '<p' + s + '>',
            P_CLOSE_REGXP = '<\\/p>',
            s = '\\s*',
            BR_ANY_REGXP = s + '(?:' + BR_REGXP + ')' + s,
            P_EDGE_REGXP = '^' + s + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*' + s + '|' + s + '(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + s + '$',
            P_SPLIT_REGXP = s + '(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + s + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*' + s,
            P_ANY_REGXP = s + '(?:' + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*|(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + ')' + s,
            P_EMPTY_REGXP = s + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*' + s + '(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + s,
            P_CONTAIN_REGXP = s + P_OPEN_REGXP + '(?:' + BR_ANY_REGXP + ')*(?:[\\s\\S]*?)(?:' + BR_ANY_REGXP + ')*' + P_CLOSE_REGXP + s,
            dialog_fn, t, i;

        $.is = {
            view: tru,
            source: fals,
            d: fals,
            e: function(t) {
                // get current focus node
                var s = $s_get()[focus + 'Node'];
                // no focus node, skip!
                if (!s) return nul;
                // if focus node is a text node…
                // e.g. `a|bc`
                if (is_nude(s)) {
                    s = s[parentNode]; // get the parent node of it if any
                }
                // if parent node is `$.view`…
                if (s === view) {
                    // check whether we are selecting a node
                    // e.g. `|<$t>abc</$t>|`
                    // then compare the node name of that node with `t`
                    if ((s = selection_v(1, 1, 0)) && lc(s)[indexOf]('</' + t + '>') !== -1) {
                        return selection_i(s, tru)[0]; // return the node
                    }
                } else {
                    // if parent node name is equal to `t`…
                    // e.g. `<$t>a|bc</$t>`
                    if (s[nodeName] && lc(s[nodeName]) === t) {
                        return s; // @ditto
                    }
                    // check if we have parent node that is not `$.view`
                    // then compare the node name of that parent with `t`
                    while (s && s !== view) {
                        if (s[nodeName] && lc(s[nodeName]) === t) {
                            return s; // @ditto
                        }
                        s = s[parentNode];
                    }
                }
                return nul; // default is `null`
            },
            focus: fals,
            blur: tru,
            error: fals
        };

        o = o || {};
        for (i in config) {
            if (!is_undef(o[i])) config[i] = o[i];
        }

        var $_is = $.is,
            c_enter = config.enter,
            c_x = config.x,
            c_update = config.update,
            c_class = config.classes[0],
            c_text = config.text || {},
            c_tags = join(config.tags, '|'),
            c_attributes = join(config.attributes, '|'),
            c_blocks = join(config.blocks, '|'),
            c_t = 0,
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
                    var a = text(selection_v(1, 1, 0)).split(/\s/)[0], b, c;
                    // toggle auto-link on URL-like text
                    if (/^[a-z\d]+:\/\/\S+$/[test](a)) {
                        if (selection_e('a')) {
                            selection_w('a', 0); // force unwrap!
                        } else {
                            selection_a(a);
                        }
                    } else {
                        if ($_is.d) {
                            $.d.x(1); // cancel
                        } else {
                            if (b = selection_e('a')) {
                                c = b[getAttribute]('href');
                            }
                            s = 'http://';
                            $.d(s, (c ? c[replace](/\/+$/, "") : s + lc(a)) || "", function(e, $, i) {
                                selection_a(i[value]);
                            });
                            delay(function() {
                                c && dialog[children][0][select](); // select all value if selection already wrapped by the `<a>`
                            }, 2);
                        }
                    }
                },
                x: function(e) {
                    if (!c_x) return;
                    var h = view.offsetHeight;
                    h && (target[style][minHeight] = h + 'px');
                    if (!c_t) {
                        $.$[1] = selection_s();
                        cls_s(container, 'source');
                        cls_r(container, 'view');
                        target[focus]();
                        selection_r($.$[0]);
                        c_t = 1;
                    } else {
                        $.$[0] = selection_s();
                        cls_s(container, 'view');
                        cls_r(container, 'source');
                        view[focus]();
                        selection_r($.$[1]);
                        c_t = 0;
                    }
                    $_is.view = !c_t;
                    $_is.source = !!c_t;
                    $.d.x(0, 1);
                    is_func(c_x) && c_x(e, $, c_t || 0);
                }
            };

        function $s_get() {
            $s = win[getSelection] && win[getSelection]() || {};
            return $s[rangeCount] && $s || nul;
        }

        function $r_get(r) {
            $s = $s_get();
            return $s && $s[getRangeAt](r || 0) || nul;
        }

        function selection_v(h, x, p) {
            if (h) {
                if ($s = $s_get()) {
                    var c = el(div), i, j;
                    for (i = 0, j = $s[rangeCount]; i < j; ++i) {
                        c[appendChild]($s[getRangeAt](i)[cloneContents]());
                    }
                    h = join(c[innerHTML].split(X));
                    h = (is_undef(x) || x) ? $.f(h) : h;
                    return (is_undef(p) || p) ? h : h[replace](pattern(P_SPLIT_REGXP, 'g'), '\n\n')[replace](pattern(P_ANY_REGXP, 'g'), "");
                }
                return "";
            }
            return $s_get() + "";
        }

        function selection_e(t, parent) {
            var s = selection_v(1, 0, 0),
                a = selection_g(s), b, c, i, j;
            if (a && a[0][length]) {
                $r = $r_get();
                $r[deleteContents]();
                $r[insertNode](a[1]);
            }
            a = a[0];
            // get specific node by its node name;
            // e.g. `selection_e('a')` to search for an `<a>` tag in the current selection
            // or at the closest parent of the current selection
            if (t) {
                // current selection may contains the node that we want
                for (i = 0, j = a[length]; i < j; ++i) {
                    b = a[i];
                    if (lc(b[nodeName]) === t) {
                        return b; // yep, found one!
                    }
                }
                // if node was not found in the current selection,
                // check whether we are inside that node;
                if (is_undef(parent) || parent) {
                    i = selection_s(); // first, save the current selection
                    // insert a placeholder text to the `$.view`
                    c = selection_i(X + s); // `c` is now a node
                    c = c && c[0] && c[0][parentNode]; // then, get the parent element of `c`
                    if (
                        // if it has parent and node name of `c` is equal to `t`…
                        // e.g. `<$t>dd[ccc]dddd</$t>`…
                        c && lc(c[nodeName]) === t
                        // make sure node is not `$.view`
                        && c !== view
                    ) {
                        // remove the placeholder text…
                        c[innerHTML] = join(c[innerHTML].split(X));
                        // restore the selection…
                        // if has selection, focus to that selection! (restore previous selection)
                        if (s && s !== c[innerHTML]) {
                            selection_r(i);
                        // else, focus to the parent node!
                        } else {
                            selection_m([c]);
                        }
                        // and return that parent!
                        return c;
                    }
                }
                return nul;
            }
            return a[length] ? a : nul;
        }

        function selection_c(i) {
            if ($r = $r_get()) {
                i = i === 1 ? fals : i === 0 ? tru : i;
                $r[collapse](i);
            }
            return $r;
        }

        function selection_i(s, select) {
            if ($_is[focus]) {
                var g = selection_g(s);
                if ($s = $s_get()) {
                    $r = $r_get();
                    $r[deleteContents]();
                    $r[insertNode](g[1]);
                    // reverse the direction
                    if (select === 0) {
                        selection_c(1);
                    } else if (select === 1) {
                        selection_i(s, tru); // hacky but works :(
                        selection_c(0);
                    }
                    $s[removeAllRanges]();
                    $s[addRange]($r);
                }
                return g[0];
            }
            return nul;
        }

        function selection_a(o) {
            try {
                var a = selection_e('a'),
                    b = text(selection_v(1, 1, 0), 'a'), c;
                // sanitize input
                o = text(o[replace](/^\s*javascript:/i, ""));
                var i = o[0],
                    j = win.location.hostname;
                // detect internal link…
                i = '/?&#'[indexOf](i) !== -1 || o[indexOf]('/') === -1; // check for relative path
                if (j && (o[indexOf]('//' + j) === 0 || o[indexOf]('://' + j) !== -1)) { // full path prefixed by URL protocol or `//`
                    i = 1;
                }
                // no text was selected, insert the value!
                if (!b) {
                    selection_i(o, tru);
                    b = o;
                }
                // no value
                if (!o) {
                    // selection is an `<a>`, unwrap!
                    if (a) {
                        b = a[innerHTML];
                        // remove the `<a>`
                        a[parentNode][removeChild](a);
                    }
                    // insert content of the `<a>`
                    a = selection_i(b, tru)[0];
                // has value set
                } else {
                    // selection is not an `<a>`
                    if (!a) {
                        // replace selection with an `<a>`
                        a = selection_i('<a href="' + o + '">' + b + '</a>', tru)[0];
                    } else {
                        // just put to the `href` attribute of `<a>`
                        a[setAttribute]('href', o);
                    }
                    if (i) {
                        // reset `rel="nofollow"` and `target="_blank"` attribute
                        // to the `<a>` with internal link URL
                        a[removeAttribute]('rel');
                        a[removeAttribute]('target');
                        // set `rel="nofollow"` and `target="_blank"` attribute
                        // to the `<a>` with external link URL
                    } else {
                        a[setAttribute]('rel', 'nofollow');
                        a[setAttribute]('target', '_blank');
                    }
                }
                return a; // return tne `<a>`
            } catch (e) {}
            return nul;
        }

        function selection_s() {
            var $r, $rr, $s;
            if ($r = $r_get()) {
                $rr = $r[cloneRange]();
                $rr[selectNodeContents](view);
                $rr[setEnd]($r.startContainer, $r.startOffset);
                $s = ($rr + "")[length];
                return [$s, $s + ($r + "")[length]];
            }
            return nul;
        }

        function selection_r(s) {
            if (!s) return;
            var $r = doc[createRange](), $s,
                ci = 0, cin,
                n = [view],
                i, j, f, x;
            $r[setStart](view, 0);
            $r[collapse](tru);
            while (!x && (j = n.pop())) {
                if (is_nude(j)) {
                    cin = ci + j[length];
                    if (!f && s[0] >= ci && s[0] <= cin) {
                        $r[setStart](j, s[0] - ci);
                        f = 1;
                    }
                    if (f && s[1] >= ci && s[1] <= cin) {
                        $r[setEnd](j, s[1] - ci);
                        x = 1;
                    }
                    ci = cin;
                } else {
                    i = j[childNodes][length];
                    while (i--) {
                        n[push](j[childNodes][i]);
                    }
                }
            }
            $s = win[getSelection]();
            $s[removeAllRanges]();
            $s[addRange]($r);
        }

        function selection_n() {
            return selection_g(selection_v(1, 1, 0))[0];
        }

        function selection_m(n, c) {
            c = is_undef(c) || !c;
            var fn = n[0],
                ln = n[n[length] - 1];
            $s = $s_get();
            $r = $r_get();
            if (n[length] === 1) {
                $r[c ? selectNodeContents : selectNode](fn);
            } else {
                $r[c ? setStartAfter : setStartBefore](fn);
                $r[c ? setEndBefore : setEndAfter](ln);
            }
            $s[removeAllRanges]();
            $s[addRange]($r);
            return n;
        }

        function selection_w(t, i, p) {
            if ($_is[focus]) {
                if (is_undef(i)) i = -1;
                var a = selection_e(t),
                    b = selection_v(1, 0, 0),
                    c = [], d, e, j, k;
                // if force unwrap or has wrapped by the `<$t>`
                if (i === 0 || (i === -1 && a)) {
                    if (a) {
                        // get the HTML content of `a`
                        d = a[innerHTML];
                        // remove the parent element from `$.view`
                        a[parentNode][removeChild](a);
                        // compare plain text version of text selection and node content
                        var bb = text(b, t),
                            dd = text(d, t);
                        if (
                            // if `dd` string contains `bb` string…
                            // e.g. `dd[bbb]dddd`…
                            dd[indexOf](bb) !== -1
                            // and `bb` string length is less than `dd` string length…
                            && bb[length] < dd[length]
                            // it means that we are selecting the `dd` string, but not the whole `dd` string;
                        ) {
                            // copy attribute(s)…
                            a = pattern('<' + t + '(\\s[^<>]*?)?>', 'i').exec(a[outerHTML]);
                            a = a && a[1] || "";
                            // then, do make the split version of the previous `<$t>abc</$t>` container…
                            // e.g. `<$t>a[b]c</$t>` → `<$t>a</$t>b<$t>c</$t>`
                            b = selection_g([
                                d[substring](0, d[indexOf](bb)), bb,
                                d[substring](d[indexOf](bb) + bb[length])
                            ])[0];
                            b[0] && selection_i('<' + t + a + '>' + (b[0][outerHTML] || b[0]) + '</' + t + '>', 0);
                            b[2] && selection_i('<' + t + a + '>' + (b[2][outerHTML] || b[2]) + '</' + t + '>', 1);
                            c = selection_i(b[1][outerHTML] || b[1], tru);
                        } else {
                            // else, unwrap!
                            c = selection_g(b);
                            d = el(div);
                            if (c && c[2] && (k = c[2][length])) {
                                for (j = 0; j < k; ++j) {
                                    if (c[2][j] === t) {
                                        // `<$t>abc</$t>` → `abc`
                                        d[innerHTML] += c[0][j][innerHTML];
                                    } else {
                                        d[appendChild](c[0][j]);
                                    }
                                }
                            }
                            c = selection_i(d[innerHTML], tru);
                        }
                    }
                // if force wrap or hasn’t wrapped by the `<$t>`
                } else if (i === 1 || (i === -1 && !a)) {
                    // first, prepare to split the tag between paragraph;
                    // e.g. `a<br><br>b` → `a</$t><br><br><$t>b`
                    b = b && b[replace](pattern('(\\n|' + BR_ANY_REGXP + '){2,}', 'gi'), '</' + t + '>' + BR + BR + '<' + t + '>');
                    // wrap!
                    c = selection_i('<' + t + '>' + (b || p || "") + '</' + t + '>', tru);
                }
                return c[0] || nul; // return the first node if any
            }
            return nul;
        }

        function focus_to(x, i) {
            if (focus in x) {
                x.selectionStart = x.selectionEnd = is_undef(i) ? x[value][length] : i;
                x[focus]();
            }
        }

        $.$ = [nul, nul]; // [source, view]
        $.$$ = function(i, j) {
            var o = [$s_get(), $r_get(j)];
            return is_undef(i) ? o : o[i];
        };
        $.d = function(p, v, f) {
            var d = dialog[children][0];
            d[placeholder] = p;
            d[value] = v;
            delay(function() {
                focus_to(d);
            }, 1);
            dialog_fn = f;
            return $.d.v(1), $;
        };
        $.d.x = function(r, x) {
            var i = dialog[children][0],
                v = i[value];
            if (v && !x) { // has value set, don’t hide!
                cls_s(container, error);
                $_is[error] = tru;
                $_is.d = tru;
                delay(function() {
                    $_is[focus] = fals;
                    $_is[blur] = tru;
                    i[focus](), i[select]();
                }, 1);
            } else {
                cls_r(container, 'd');
                cls_r(container, error);
                $_is.d = fals;
            }
            // force focus state
            $_is[focus] = tru;
            $_is[blur] = fals;
            r && ($[focus](), selection_r($.$[1]));
            return $;
        };
        $.d.v = function(s) {
            cls_s(container, 'd');
            cls_r(container, error);
            $_is[error] = fals;
            $_is.d = tru;
            $.$[1] = s ? selection_s() : nul;
            return $;
        };

        win[NS][instance][target.id || target.name || Object.keys(win[NS][instance])[length]] = $;

        function cls_s(e, s) {
            var c = e[className];
            if (pattern('(^|\\s)\\s*' + s + '\\s*(\\s|$)')[test](c)) {
                return e;
            }
            return (e[className] = text(c + ' ' + s)), e;
        }

        function cls_r(e, s) {
            var t = text(e[className][replace](pattern('(^|\\s)\\s*' + s + '\\s*(\\s|$)', 'g'), '$1$2'));
            return (t ? (e[className] = t) : e[removeAttribute]('class')), e;
        }

        function btn(t, c, s, f) {
            var a = cls_s(el('a'), c),
                b = s[1] || s[0];
            // shortcut for SVG icon by prefixing the icon value with `svg:`
            // `<svg width="16" height="16" viewBox="0 0 16 16"><path d="$b"></path></svg>`
            if (b[indexOf]('svg:') === 0) {
                b = svg_pref + b.slice(4) + svg_suf;
            }
            a[innerHTML] = '<span>' + b + '</span>';
            a.title = t;
            a.href = 'javascript:;';
            if (f) {
                function R(e) {
                    f.apply(this, [e, $, a]), copy(), view[focus](), (is_func(c_update) && c_update(e, $, view)), e[preventDefault]();
                }
                ev_s(a, "touchstart", R);
                ev_s(a, "mousedown", R);
            }
            return [a, f];
        }
        $.t = function(id, c_text, fn, i) {
            var a = btn(c_text[0] + (c_text[2] ? ' (' + c_text[2] + ')' : ""), c_class + '-t:' + id, c_text, fn);
            if (is_undef(i)) {
                i = nul;
            } else {
                if (i < 0) {
                    i = tool[children][length] + i;
                }
            }
            tool[insertBefore](a[0], tool[children][i] || nul);
            $.t[id] = a[1];
            return ($.t[id].e = a[0]);
        };
        for (i in tools) {
            $.t[i] = tools[i];
            tools[i] = btn(c_text[i][0] + (c_text[i][2] ? ' (' + c_text[i][2] + ')' : ""), c_class + '-t:' + i, c_text[i], tools[i]);
            $.t[i].e = tools[i][0];
        }
        $.f = function(s) {
            s = join(s[replace](/\r/g, "").split(X));
            // remove empty HTML tag(s)
            s = s[replace](/<([\w-:]+?)(?:\s[^<>]*?)?>\s*<\/([\w-:]+?)>/g, function($, a, b) {
                return a === b ? "" : $;
            });
            s = s[replace](/<code(\s[^<>]*?)?>([\s\S]*?)<\/code>/g, function($, a, b) {
                return '<code' + (a || "") + '>' + b[replace](/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')[replace](/ /g, '&nbsp;') + '</code>';
            });
            // convert XHTML tag(s) into HTML5 tag(s)
            s = s[replace](/<(\/?)([\w-:]+?)(\s[^<>]*?)?>/g, function($, a, b, c) {
                b = lc(b);
                // filter HTML tag(s)
                if (!pattern('^(' + c_tags + '|' + c_blocks + ')$')[test](b)) {
                    return "";
                }
                if (c = c || "") {
                    // filter HTML attribute(s)
                    c = c[replace](/\s+([\w-:]+?)(?:="((?:\\.|[^"])*?)"|$)/g, function($, a, b) {
                        if (!pattern('^(' + c_attributes + ')$')[test](a)) {
                            return "";
                        }
                        return $;
                    });
                }
                var heading = /^(h[1-6]|th)$/[test](b),
                    cap = /^((fig)?caption)$/[test](b),
                    d = a ? "" : c;
                if (b === 'b' || b === 'strong' || heading) {
                    return '<' + a + 'strong' + d + '>' + (heading && a ? BR + BR : "");
                } else if (b === 'i' || b === 'em' || cap) {
                    return '<' + a + 'em' + d + '>';
                } else if (pattern('^(' + c_tags + ')$')[test](b)) {
                    return '<' + a + b + d + '>';
                } else if (pattern('^(' + c_blocks + ')$')[test](b)) {
                    return BR + BR;
                }
                return "";
            });
            // convert line break to `<p>` and `<br>`
            s = s[replace](pattern(P_SPLIT_REGXP, 'gi'), '</p><p$1>')[replace](pattern(BR_ANY_REGXP, 'gi'), BR)[replace](/\n/g, BR)[replace](pattern('(?:' + BR_ANY_REGXP + '){3,}', 'gi'), BR + BR)[replace](pattern('^(?:' + BR_ANY_REGXP + ')+|(?:' + BR_ANY_REGXP + ')+$', 'gi'), "")[replace](pattern('(?:' + BR_ANY_REGXP + '){2,}', 'gi'), '</p><p>')[replace](pattern(P_EMPTY_REGXP, 'gi'), "");
            s = s && !pattern('^' + P_CONTAIN_REGXP + '$', 'gi')[test](s) ? '<p>' + s + '</p>' : s;
            // validate HTML markup natively using the browser behaviour
            s = selection_g(s);
            return s[3] || "";
        };
        function write() {
            view[innerHTML] = $.f(target[value])[replace](pattern(P_SPLIT_REGXP, 'gi'), BR + BR)[replace](pattern(P_ANY_REGXP, 'gi'), "");
        } write();
        function copy() {
            var v = $.f(view[innerHTML]);
            if (config.tidy) {
                v = v[replace](pattern(P_SPLIT_REGXP, 'gi'), '</p>\n\n<p$1>')[replace](pattern(BR_REGXP, 'gi'), BR + '\n');
            }
            target[value] = v;
        } copy();
        cls_s(container, c_class + ' view');
        target[setAttribute](spellCheck, fals);
        cls_s(tool, c_class + '-tool');
        cls_s(view, c_class + '-view');
        if (c_enter) {
            cls_s(container, 'expand');
        }
        view[setAttribute](contentEditable, tru);
        view[setAttribute](spellCheck, fals);
        view[setAttribute](placeholder, target[placeholder] || "");
        ev_s(view, focus, function() {
            $_is[focus] = tru;
            $_is[blur] = fals;
            cls_s(container, focus);
        });
        ev_s(view, blur, function() {
            $_is[focus] = fals;
            $_is[blur] = tru;
            copy();
            cls_r(container, focus);
        });
        ev_s(view, paste, function() {
            delay(function() {
                write();
                var v = view[innerHTML];
                view[innerHTML] = "", selection_i(v, 0);
            }, 1);
        });
        function kk(e) {
            return lc(e.key || String.fromCharCode(e[keyCode]));
        }
        ev_s(view, keydown, function(e) {
            var ctrl = e[ctrlKey],
                shift = e[shiftKey],
                k = e[keyCode],
                p = container,
                key = kk(e), form;
            if (ctrl && !shift && (key === 'b' || k === 66)) {
                tools.b[1](), e[preventDefault]();
            } else if (ctrl && !shift && (key === 'i' || k === 73)) {
                tools.i[1](), e[preventDefault]();
            } else if (ctrl && !shift && (key === 'u' || k === 85)) {
                tools.u[1](), e[preventDefault]();
            } else if (ctrl && !shift && (key === 'l' || k === 76)) {
                tools.a[1](), e[preventDefault]();
            } else if (ctrl && shift && (key === 'x' || k === 88) && c_x) {
                tools.x[1](), e[preventDefault]();
            } else if (!shift && (key === 'enter' || k === 13)) {
                // Press `enter` to insert a line break
                // Fix IE that will automatically inserts `<p>` instead of `<br>`
                if (c_enter) {
                    $s = $s_get();
                    $r = $r_get();
                    selection_i(BR, 0);
                    selection_i(X, 1);
                    e[preventDefault]();
                }
                // submit form on `enter` key in the `span[contenteditable]`
                if (!c_enter) {
                    while (p = p[parentNode]) {
                        if (lc(p[nodeName]) === 'form') {
                            form = p;
                            break;
                        }
                    }
                    form && (form.submit(), e[preventDefault]());
                } else if (is_func(c_enter)) {
                    c_enter(e, $, view);
                }
            }
            is_func(c_update) && c_update(e, $, view);
            delay(function() {
                var v = view[innerHTML][replace](pattern(X, 'g'), "");
                if (!v || v === BR) {
                    view[innerHTML] = "";
                }
                copy();
            }, 1);
        });
        var target_parent = target[parentNode],
            target_a = el('a');
        function fn_target_keydown(e) {
            var ctrl = e[ctrlKey],
                shift = e[shiftKey],
                k = e[keyCode],
                key = kk(e);
            if (ctrl && shift && (key === 'x' || k === 88) && c_x) {
                tools.x[1](), e[preventDefault]();
            } else if (!shift && (key === 'enter' || k === 13)) {
                is_func(c_enter) && c_enter(e, $, target);
            }
            is_func(c_update) && c_update(e, $, target);
            delay(function() {
                write(), selection_r($.$[1]);
            }, 1);
        }
        function editor_create() {
            if (container[parentNode]) {
                return $; // did create already, skip!
            }
            cls_s(target, c_class + '-source');
            ev_s(target, keydown, fn_target_keydown);
            t = config.tools;
            for (i in t) {
                i = t[i];
                if (tools[i]) {
                    if (i === 'x' && !c_x) {
                        continue; // disable the source view if `config.x = false`
                    }
                    tool[appendChild](tools[i][0]);
                }
            }
            container[appendChild](view);
            if (target_parent && lc(target_parent[nodeName]) === 'p') {
                target_parent[insertBefore](target_a, target);
                target_parent[parentNode][insertBefore](target, target_parent);
                target_parent[parentNode][removeChild](target_parent);
            }
            target[parentNode][insertBefore](container, target);
            container[appendChild](target);
            container[appendChild](tool);
            cls_s(dialog, c_class + '-d');
            dialog[innerHTML] = '<input type="text">';
            $.d.x();
            var dc = dialog[children][0];
            dc[setAttribute](spellCheck, fals);
            ev_s(dc, click, function() {
                $_is[error] = fals;
                cls_r(container, error);
            });
            ev_s(dc, keydown, function(e) {
                var t = this,
                    ctrl = e[ctrlKey],
                    shift = e[shiftKey],
                    k = e[keyCode],
                    key = kk(e);
                if (!ctrl && !shift && (key === 'enter' || k === 13)) {
                    $.d.x(1, 1);
                    dialog_fn && dialog_fn(e, $, t), (dialog_fn = 0, t[value] = ""), (is_func(c_update) && c_update(e, $, view)), e[preventDefault]();
                } else if (!shift && ((key === 'escape' || k === 27) || (!t[value][length] && (key === 'backspace' || k === 8)))) {
                    $.d.x(1, 1);
                    dialog_fn = 0, e[preventDefault]();
                }
            });
            container[appendChild](dialog);
            return $;
        } editor_create();
        function editor_destroy() {
            if (!container[parentNode]) {
                return $; // did destroy already, skip!
            }
            if (target_parent) {
                container[parentNode][insertBefore](target_parent, container);
                target_parent[insertBefore](target, target_a);
                target_parent[removeChild](target_a);
            }
            target[style][minHeight] = "";
            if (!target[getAttribute](style)) {
                target[removeAttribute](style);
            }
            cls_r(target, c_class + '-source');
            ev_r(target, keydown, fn_target_keydown);
            container[parentNode][removeChild](container);
            return $;
        }
        $.config = config;
        $.container = container;
        $.view = view;
        $.source = $.target = target;
        $.tool = tool;
        $.dialog = dialog;
        $.c = selection_c;
        $.e = selection_e;
        $.g = selection_g;
        $.i = selection_i;
        $.m = selection_m;
        $.n = selection_n;
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
            if ($_is.view) {
                var v = view[innerHTML];
                view[focus]();
                $.$[1] && selection_r($.$[1]);
                $_is[focus] = tru;
                $_is[blur] = fals;
                // focus start
                if (i === 0) {
                    view[innerHTML] = "";
                    selection_i(v, 1);
                // focus end
                } else if (i === 1) {
                    view[innerHTML] = "";
                    selection_i(v, 0);
                // select all
                } else if (i === tru) {
                    $r = doc[createRange]();
                    $r[selectNodeContents](view);
                    $s = $s_get();
                    $s[removeAllRanges]();
                    $s[addRange]($r);
                }
            } else if ($_is.source) {
                target[focus]();
                // focus start
                if (i === 0) {
                    focus_to(target, 0);
                // focus end
                } else if (i === 1) {
                    focus_to(target, target[value][length]);
                // select all
                } else if (i === tru) {
                    target[select]();
                }
            }
            return $;
        };
        // blur
        $[blur] = function() {
            if ($_is.view) {
                $_is[focus] = fals;
                $_is[blur] = tru;
                view[blur]();
            } else if ($_is.source) {
                target[blur]();
            }
            return $;
        };
        // set value
        $.set = function(v, i) {
            v = $.f(v);
            if ($_is.view || i === 1) {
                v = v[replace](pattern(P_EDGE_REGXP, 'gi'), "")[replace](pattern(P_SPLIT_REGXP, 'gi'), BR + BR);
            }
            if (is_undef(i)) {
                if ($_is.view) {
                    view[innerHTML] = v;
                    copy();
                } else if ($_is.source) {
                    target[value] = v;
                    write();
                } else if ($_is.d) {
                    dialog[children][0][value] = v;
                }
            } else if (i === 0) {
                target[value] = v;
                write();
            } else if (i === 1) {
                view[innerHTML] = v;
                copy();
            }
            return $;
        };
        // get value
        $.get = function(s, i) {
            if (is_undef(i)) {
                var v;
                if ($_is.source) {
                    v = target[value];
                } else if ($_is.d) {
                    v = dialog[children][0][value];
                } else /* if ($_is.view) */ {
                    v = target[value]; // default
                }
                return v ? v : s;
            } else if (i === 0) {
                return target[value] || s;
            } else if (i === 1) {
                return view[innerHTML] || s;
            }
        };
        $.disable = function() {
            view[removeAttribute](contentEditable);
            target[setAttribute](readOnly, tru);
            return $;
        };
        $.enable = function() {
            view[setAttribute](contentEditable, tru);
            target[removeAttribute](readOnly);
            return $s;
        };
        return $;
    });

})(window, document, 'RTE');