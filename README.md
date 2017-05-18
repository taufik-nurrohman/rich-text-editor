Rich Text Editor
================

> Simple rich text editor.

A rich text editor that only accept limited set of HTML tags. Best to be attached to the public access editor such as comment form or question/answer forms in a forum.

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
    tags: [ // allowed inline HTML tag(s)
        'a',
        'abbr',
        'b',
        'br',
        'code',
        'del',
        'em',
        'i',
        'ins',
        'kbd',
        'mark',
        'p',
        'span',
        'strong',
        'u'
    ],
    text: {
        b: ['Bold', '&#x0042;', '⌘+B'],
        i: ['Italic', '&#x0049;', '⌘+I'],
        u: ['Underline', '&#x0055;', '⌘+U'],
        a: ['Link', '&#x2693;', '⌘+L'],
        x: ['Source', '&#x22EF;', '⌘+⇧+X']
    },
    enter: true, // change to `false` to automatically submit the closest form on enter key press
    x: function(e, $, node) {}, // on change editor mode (view or source)
    update: function(e, $, node) {} // on view/source update
};
~~~

**Note:** All block tags are not allowed except `<p>`.

Methods
-------

### Properties

~~~ .js
editor.$; // selection storage [view, source]
editor.container; // editor container
editor.view; // editor view
editor.source; // editor source
editor.tool; // editor tool
editor.dialog; // editor dialog
editor.config; // editor configuration
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
editor.v(true, false); // as original selected HTML value in `editor.view` (every browser has their own result)
~~~

### Get Selected HTML Node

~~~ .js
editor.e('a'); // check if the selected text is an link
~~~

### Sanitize HTML

~~~ .js
editor.f('foo bar <b>baz</b> <span>qux</span>');
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

#### Hide

~~~ .js
editor.d.x();
~~~

~~~ .js
editor.d.x(true); // restore previous selection
~~~

### State

Check whether these elements are visible at the time:

~~~ .js
editor.is.view; // the rich text editor view
editor.is.source; // the HTML source view
editor.is.d; // the dialog view
~~~