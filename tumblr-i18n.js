// Tumblr i18n, v0.1
// Copyright (c) 2014 Henry Kehlmann (madhenry).
// Distributed under MIT license
// http://github.com/madhenry
(function($) {

	var root = this
		, ti18n = {}
		, langs_separators = []
		, localized_posts_exist = false
		, activeLang = null;

	var o = {
		selector: '.post',
		defaultLang: 'en',
		use_i18next: true,
		translations: null,
		ns: 'theme',
		langs: {},
		debug: false,
		createSelect: true
	};

	// Export the ti18n object for **CommonJS**. 
    // If we're not in CommonJS, add `ti18n` to the
    // global object or to jquery.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ti18n;
    } else {
        if ($) {
            $.ti18n = $.ti18n || ti18n;
        }
        root.ti18n = root.ti18n || ti18n;
    }

	function setLangs( langs ) {
		o.langs = langs;
		langs_separators = [];
		$.each(o.langs, function(i, val) {
			langs_separators.push(val);
		});
	}

	function debug() {
		if( o.debug )
		console.log.apply(console, arguments);
	}

	function init( options, cb ) {
		if( typeof options == 'function' ) {
			cb = options;
			options = {};
		}
		options = options || {};
		$.extend(o, options);
		// First set up the language and find all possible language groups with regex to hide
		$(o.selector).each(function() {
			var el = this;
			debug('Trying to find languages in post', el);
			$.each(o.langs, function(i, val) {
				var regex = val + ":([\\s\\S]*?)(?=" + langs_separators.join(':|') + ":|<\\/.+?>|<span data-lang=.+>|$)";
				
				debug('Trying to find '+i+' with: ', regex);

				regex = new RegExp(regex, 'g');
				if( $(el).html().match(regex) ) {
					debug('Found: ', $(el).html().match(regex));
					var html = $(el).html().replace(regex, '<span data-lang="' + i + '">$&</span>');
					html = html.replace(new RegExp(val+':', 'g'), '');
					$(el).html(html);
					localized_posts_exist = true;
				}
			});
		});

		setLangs(o.langs);

		if( o.use_i18next ) {
			var i18next_options = { ns: o.ns, fallbackLng: o.defaultLang };

			if( o.translations && typeof o.translations == 'object' ) 
				i18next_options.resStore = o.translations;
			else if( typeof o.translations == 'string' ) 
				i18next_options.resGetPath = o.translations;

			$.i18n.init(i18next_options, function() {
				$('body').i18n();
				changeLang( $.i18n.lng() );
				if( cb ) cb();
			});
		} else {
			if( cb ) cb();
		}

		if( o.createSelect )
			createLanguageSelect();
		
	}

	// Changes the language for i18n and ti18n
	function changeLang( lang ) {
		$('span[data-lang]').hide();
		$('span[data-lang="'+ lang +'"]').show();
		activeLang = lang;
		if( o.use_i18next )
		$.i18n.setLng(lang, function(t) {
			$('body').i18n();
		});
	}

	// Generates language selection html and appends it to body + returns the el
	function createLanguageSelect() {
		var template = $('<div class="language-select"><ul></ul></div>');

		$.each(o.langs, function(i, val) {
			template.find('ul').append($('<li data-lang="' + i + '"><a href="#' + i + '">' + val + '</a></li>'));
		});

		template.css({
			'z-index': '2'
		});

		template.on('click', 'li > a', function(e) {
			e.preventDefault();
			template.find('li.active').removeClass('active');
			$(this).parent().addClass('active');
			changeLang( $(this).parent().data('lang') );
			template.trigger('langChange', activeLang);
		});

		template.find('li[data-lang="'+ activeLang +'"]').addClass('active');

		if( o.use_i18next || localized_posts_exist )
			$('body').prepend(template);
		else
			debug('Not creating language selection because no localized posts found')

		return template;
	}

	// Public methods
	ti18n.init = init;
	ti18n.changeLang = changeLang;
	ti18n.createLanguageSelect = createLanguageSelect;
	ti18n.setLangs = setLangs;

	ti18n.getLangs = function() {
		return o.langs;
	};

	ti18n.lng = function() {
		return activeLang;
	}

})( jQuery || $ );
