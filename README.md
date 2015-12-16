tumblr-i18n v.0.1
=================

Tumblr blog front-end localization plugin.
First release and mostly untested but will be handy if you need to localize your tumblr blog!

See the example blog with a localized post: http://thumbelina.blooob.me/private/73501233004/tumblr_mzho0062G11t524q1#

Requirements
------------

* jQuery ( or maybe even Zepto instead )
* To be able to localize all strings in a theme you need the great and free i18next.js library ( you can localize posts without it )

How it works
------------

You can localize posts by using predefined keywords to separate language based content.
For example you can write posts like this:

```
ENG:
This is the english version.

EST:
This is the estonian version.
```
This post's content will look the same when viewed through tumblr's default app BUT on your real blog page it will look like this (depending on what language is active):

```
This is the english version.
```

You can use these keywords everywhere - post titles, content etc

There's also a possibility to translate all strings that appear inside the theme's HTML code by using i18next plugin's jquery data attributes.

For example a link that you want to localize:

```html
<a href="#" data-i18n="nav.ask">Ask us anything</a>
```

You can define those translations through js objects or external json files

Usage
-----

```js
var default_options = {
    selector: '.post',
		defaultLang: 'en',
		langs: {}, // Object of languages and predefined keywords { 'en': 'ENG', 'et': 'EST' }
		debug: false, // Outputs debug messages to console
		createSelect: true, // Appends div.language-select for easy language selection to body
		
		// i18next plugin specific options ( used to add translations using data-i18n="" attributes )
		use_i18next: true, // set to false if you don't need i18next functionality
		translations: null, // i18next resGetPath attribute (string) to load external json files or a js object containing all translations
		ns: 'theme' // i18next default namespace 
};
```

```js
ti18n.init( options [, cb ] );
```

```js
var resources = {
  et: {
    theme: {
      nav: {
        ask: 'Küsi meilt ükskõik mida'
      }
    }
  },
  en: {
    theme: {
      nav: {
        ask: 'Ask us anything'
      }
    }
  }
};

$(function() {
            
  ti18n.init({
    selector: '.post', // element selector to scan for regex translated content
    langs: {
      'et': 'EST',
      'en': 'ENG'
    },
    defaultLang: 'et',
    translations: resources
  }, function( activeLang ) {
    console.log( 'This is the automatically active language key:', activeLang );
  });
            
});
```

* Other methods: *

* ti18n.changeLang( langKey ) - changes the active language, updates language selector and texts on page
* ti18n.createLanguageSelect() - appends a language selector to body
* ti18n.setLangs({}) - change the available languages, options.langs on runtime
* ti18n.getLangs()
* ti18n.lng() - get the current active language key

You might also need some basic language selector CSS for starters, use this LESS code:

```LESS
.language-select {
  position: fixed;
  top: 7px;
  left: 54px;
  background-color: rgba(255, 255, 255, 0.57);

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      float: left;

      &.active a {
        color: #FF6124;
      }

      a {
        padding: 7px 8px;
        display: block;
        text-decoration: none;
        color: #3F3F3F;
        font-weight: bold;
        &:hover {
          color: #FF6124;
          background: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
}
```

License
----

MIT
