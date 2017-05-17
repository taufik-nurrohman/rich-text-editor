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
    tags: [ // allowed HTML tag(s)
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
        b: ['Bold', '&#x0042;'],
        i: ['Italic', '&#x0049;'],
        u: ['Underline', '&#x0055;'],
        a: ['Link', '&#x2693;'],
        x: ['Source', '&#x22EF;']
    },
    enter: true // change to `false` to automatically submit the closest form on enter key press
};
~~~