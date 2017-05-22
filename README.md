Rich Text Editor
================

> A rich text editor that is designed to accept limited set of inline HTML tags only.

This rich text editor works best on any form that are accessible in the public such as comment form in a blog, chat form in a social media and question or answer form in a forum.

![Rich Text Editor](https://cloud.githubusercontent.com/assets/1669261/26141683/48b2ec6a-3b07-11e7-9173-5a1f002c5441.gif)

[Demo](http://tovic.github.io/rich-text-editor "View Demo")

Usage
-----

~~~ .html
<!DOCTYPE html>
<html dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Demo</title>
    <link href="rich-text-editor.min.css" rel="stylesheet">
  </head>
  <body>
    <textarea></textarea>
    <script src="rich-text-editor.min.js"></script>
    <script>
    var editor = new RTE(document.querySelector('textarea'));
    </script>
  </body>
</html>
~~~

Options
-------

~~~ .js
var editor = new RTE(target, config);
~~~

Variable | Description
-------- | -----------
`target` | The text area element.
`config` | The configuration data. See below!

~~~ .js
config = {
    classes: ['rich-text-editor'],
    tools: ['b', 'i', 'u', 'a', 'x'], // visible tool(s)
    tags: [ // allowed HTML tag(s)
        'a',
        'abbr',
        'b',
        'br',
        'code',
        'dfn',
        'del',
        'em',
        'i',
        'ins',
        'kbd',
        'mark',
        'p',
        'span',
        'strong',
        'u',
        'var'
    ],
    attributes: [ // allowed HTML attribute(s)
        'class',
        'data-[\\w-]+?',
        'href',
        'id',
        'rel',
        'style',
        'target',
        'title'
    ],
    text: {
        b: ['Bold', 'B', '⌘+B'],
        i: ['Italic', 'I', '⌘+I'],
        u: ['Underline', 'U', '⌘+U'],
        a: ['Link', 'A', '⌘+L'],
        x: ['Source', '&#x22ef;', '⌘+⇧+X']
    },
    tidy: true, // tidy HTML output?
    enter: true, // set to `false` to automatically submit the closest form on enter key press
    x: function(e, $, node) {}, // on mode change (view/source); set to `false` to disable the source view
    update: function(e, $, node) {} // on view/source update
};
~~~

> **Note:** All block tags are not allowed except `<p>` tags without attributes.

Methods
-------

### Interactions

~~~ .js
editor.focus();
editor.focus(0); // focus start
editor.focus(1); // focus end
editor.focus(true); // select all
editor.blur();
editor.enable();
editor.disable();
~~~

### Properties

~~~ .js
editor.$; // selection storage [source, view]
editor.config; // editor configuration
editor.container; // editor container
editor.view; // editor view
editor.source; // editor source
editor.tool; // editor tool
editor.dialog; // editor dialog
~~~

### Set Value

~~~ .js
editor.set('Lorem ipsum dolor sit amet.');
~~~

### Get Value

~~~ .js
console.log(editor.get());
~~~

### Save Selection

~~~ .js
var s = editor.s();
~~~

### Restore Selection

~~~ .js
editor.r(s);
~~~

### Get Selection

~~~ .js
editor.v(); // as plain text
editor.v(true); // as HTML
editor.v(true, false); // as original selected HTML value in `editor.view`
editor.v(true, true, false); // as HTML and remove the wrapping `<p>` tag
~~~

### Wrap Selection with HTML Element

~~~ .js
editor.w('strong'); // toggle wrap/unwrap `<strong>` tag
editor.w('strong', 1); // force wrap `<strong>` tag
editor.w('strong', 0); // force unwrap `<strong>` tag
editor.w('strong', -1, 'text goes here…'); // insert `text goes here…` text if no text was selected
~~~

Wrap selection with HTML element and add attributes on that element:

~~~ .js
var e = editor.w('a');
e.href = 'http://example.com';
e.rel = 'nofollow';
e.target = '_blank';
~~~

### Collapse Selection

~~~ .js
editor.c(0); // collapse to the start of the selection
editor.c(1); // collapse to the end of the selection
~~~

### Insert HTML at Caret/Selection

~~~ .js
editor.i('<img arc="file.png">', true); // select the inserted HTML
editor.i('<img arc="file.png">', 0); // put caret after the inserted HTML (insert before caret)
editor.i('<img arc="file.png">', 1); // put caret before the inserted HTML (insert after caret)
~~~

### Get Selected HTML Node

~~~ .js
editor.e(); // return list of nodes in the current selection
editor.e('a'); // check if the selected text is an `<a>` tag
~~~

### Sanitize HTML

~~~ .js
editor.f('foo bar <b>baz</b> <span>qux</span>');
~~~

### Get Selection as Node

~~~ .js
console.log(editor.n());
~~~

### Create Selection Range

Create selection range from _A_ node to _B_ node.

~~~ .js
var p = editor.view.querySelectorAll('p');
editor.m([p[0], p.pop()]);
~~~

### Tool State

~~~ .js
if (editor.is.e('strong')) {
    // caret was selecting a `<strong>` tag or is placed in a `<strong>` tag
}
~~~

### Tool

#### Create

~~~ .js
// id: the tool ID
// text: array of [title, content, description]
// fn: the function that will be triggered on click
// i: tool index from the current tool list (if not defined, tool will be put at the end of the list)
//
// editor.t(id, text, fn, i);
~~~

Create a bold button:

~~~ .js
editor.t('b', ['Bold', '<b>B</b>', 'Ctrl+B'], function(e, $, node) { … });
~~~

### Dialog

#### Create

~~~ .js
// fn(e, $, input);
editor.d(placeholder, value, fn);
~~~

#### Show

~~~ .js
editor.d.v();
~~~

~~~ .js
editor.d.v(true); // save previous selection
~~~

#### Hide

~~~ .js
editor.d.x();
~~~

~~~ .js
editor.d.x(true); // restore previous selection
~~~

~~~ .js
editor.d.x(true, true); // ignore the error, exit anyway
~~~

### State

Check whether these elements are visible at the time:

~~~ .js
editor.is.view; // the rich text editor view
editor.is.source; // the HTML source view
editor.is.d; // the dialog view
~~~

~~~ .js
editor.is.focus; // check if cursor is active in the view
editor.is.blur; // check if cursor is not active in the view
editor.is.error; // check if there was an error
~~~