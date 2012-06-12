/*!
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
/*
 * GC Web Usability theme scripting
 */
/*global jQuery: false, pe: false*/
(function ($) {
	var wet_boew_theme, _wet_boew_theme;
	/**
	* wet_boew_theme object
	* @namespace wet_boew_theme
	* @version 1.3
	*/
	wet_boew_theme = (typeof window.wet_boew_theme !== "undefined" && window.wet_boew_theme !== null) ? window.wet_boew_theme : {
		fn: {}
	};
	_wet_boew_theme = {
		theme: 'theme-gcwu-fegc',
		psnb: $('#wb-head #gcwu-psnb'),
		search: $('#wb-head #gcwu-srchbx'),
		bcrumb: $('#wb-head #gcwu-bc'),
		title: $('#wb-head #gcwu-title'),
		sft: $('#wb-foot #gcwu-sft'),
		footer: $('#wb-foot footer'),
		gcft: $('#wb-foot #gcwu-gcft'),
		wmms: $('#gcwu-wmms'),
		init: function () {
			pe.theme = wet_boew_theme.theme;
			$('html').addClass(wet_boew_theme.theme);
			if (wet_boew_theme.psnb.length > 0 && wet_boew_theme.search.length === 0) {
				wet_boew_theme.psnb.css('width', '100%');
			}
		},
		themename: function () {
			return wet_boew_theme.theme;
		},
		buildmenu: function (section, hlevel, theme) {
			var menu = $('<div data-role="controlgroup"></div>'), menuitems, next, subsection, hlink;
			menuitems = section.find('> div, > ul, h' + hlevel);
			if (menuitems.first().is('ul')) {
				menu.append($('<ul data-role="listview" data-theme="' + theme + '"></ul>').append(menuitems.first().children('li')));
			} else {
				menuitems.each(function (index) {
					// If the menu item is a heading
					if ($(this).is('h' + hlevel)) {
						subsection = $('<div data-role="collapsible"><h' + hlevel + '>' + $(this).text() + '</h' + hlevel + '></div>');
						next = $(this).next();
						hlink = $(this).children('a');
						if (next.is('ul')) {
							next.prepend('<li><a href="' + hlink.attr('href') + '">' + hlink.html() + ' - ' + pe.dic.get('%home') + '</a></li>');
							// If a nested list is detected
							next.find('li ul').each(function (index) {
								hlink = $(this).prev('a');
								// Make the nested list into a collapsible section
								$(this).attr('data-role', 'listview').attr('data-theme', theme).wrap('<div data-role="collapsible"></div>');
								$(this).parent().prepend('<h' + (hlevel + 1 + index) + '>' + hlink.html() + '</h' + (hlevel + 1 + index) + '>');
								$(this).prepend('<li><a href="' + hlink.attr('href') + '">' + hlink.html() + ' - ' + pe.dic.get('%home') + '</a></li>');
								hlink.remove();
							});
							subsection.append($('<ul data-role="listview" data-theme="' + theme + '"></ul>').append(next.children('li')));
							subsection.find('ul').wrap('<div data-role="controlgroup"></div>');
						} else {
							// If the section contains sub-sections
							subsection.append(wet_boew_theme.buildmenu($(this).parent(), hlevel + 1, theme));
							subsection.find('div[data-role="collapsible-set"]').eq(0).prepend($(this).children('a').attr('href', hlink.attr('href')).html(hlink.html() + ' - ' + pe.dic.get('%home')).attr('data-role', 'button').attr('data-theme', theme).attr('data-icon', 'arrow-r').attr('data-iconpos', 'right'));
						}
						menu.append(subsection);
					} else if ($(this).is('div')) { // If the menu item is a div
						menu.append($(this).children('a').attr('data-role', 'button').attr('data-theme', theme).attr('data-icon', 'arrow-r').attr('data-iconpos', 'right'));
					}
				});
				menu.children().wrapAll('<div data-role="collapsible-set" data-theme="' + theme + '"></div>');
			}
			return menu;
		},
		mobileview: function () {
			var mb_dialogue, mb_header, s_dialogue, _list, links, footer1, ul, lang_links, lang_nav, collapsible;
			if (pe.menubar.length > 0) {
				// @TODO: optimize the dom manipulation routines - there is alot of DOM additions that should be keep as a document frag and replaced with .innerHTML as the end. // jsperf - 342% increase
				// lets transform the menu to a dialog box
				mb_dialogue = '<div data-role="page" id="jqmobile-wet-boew-menubar"><div data-role="header">';
				mb_header = wet_boew_theme.psnb.children(':header');
				mb_dialogue += "<h1>" + mb_header.html() + '</h1></div>';
				mb_dialogue += '<div data-role="content" data-inset="true"><nav role="navigation">';

				if (wet_boew_theme.bcrumb.length > 0) {
					mb_dialogue += '<section><div id="jqm-mb-location-text">' + wet_boew_theme.bcrumb.html() + '</div></section>';
					wet_boew_theme.bcrumb.remove();
				} else {
					mb_dialogue += '<div id="jqm-mb-location-text"></div>';
				}

				if (pe.secnav.length > 0) {
					mb_dialogue += $('<section><h2>' + pe.secnav.find('h2').eq(0).html() + '</h2></section>').append(wet_boew_theme.buildmenu(pe.secnav.find('.wb-sec-def'), 3, "c")).html();
					pe.secnav.remove();
				}

				mb_dialogue += '<section><h2>' + mb_header.html() + '</h2>';
				mb_dialogue += '<div data-role=\"collapsible-set\" data-theme=\"a\">';

				pe.menubar.find('ul.mb-menu').clone().each(function () {
					$(this).find('div[class^=span]').each(function () {
						$(this).replaceWith($(this).html());
					});
					$(this).find('.mb-sm').each(function () {
						$(this).html('<div data-role=\"collapsible-set\" data-theme=\"a\">' + $(this).html() + '</div)');
					});
					$(this).children().children('div:first-child,h2,h3,h4,section').each(function () {
						var $this = $(this);
						if ($this.is('section')) {
							$this = $this.children('h2,h3,h4').eq(0);
						}
						if ($this.is('div')) {
							mb_dialogue += $this.children('a').attr('data-role', 'button').attr('data-icon', 'arrow-r').attr('data-iconpos', 'right').attr('data-corners', 'false').attr('data-theme', 'a').addClass('top-level' + ($this.parent().is("li:first-child") ? " ui-corner-top" : (($this.parent().is("li:last-child") ? " ui-corner-bottom" : "")))).parent().html();
						} else {
							$this.parent().find("ul").attr("data-role", "listview");
							$this.parent().find(".mb-sm div > a,.mb-sm h2,.mb-sm h3,.mb-sm h4").each(function () {
								var $this_sub = $(this), $this_sub_parent = $this_sub.parent(), hlink;
								if ($this_sub_parent.is('div')) {
									$this_sub.attr('data-role', 'button').attr('data-icon', 'arrow-r').attr('data-iconpos', 'right').attr('data-corners', 'false').attr('data-theme', 'a').addClass('top-level' + ($this.parent().is("li:first-child") ? " ui-corner-top" : (($this.parent().is("li:last-child") ? " ui-corner-bottom" : ""))));
								} else if ($this_sub_parent.is('section')) {
									hlink = $this_sub.children('a');
									$this_sub.next('ul').prepend('<li><a href="' + hlink.attr('href') + '">' + hlink.html() + ' - ' + pe.dic.get('%home') + '</a></li>');
									$this_sub_parent.wrap("<div data-role=\"collapsible\">");
									$this_sub.html($this_sub.text());
									$this_sub_parent.parent().html($this_sub_parent.html());
								}
							});
							$this.html($this.text());
							mb_dialogue += "<div data-role=\"collapsible\">" + $this.parent().html() + "</div>";
						}
					});
				});
				mb_dialogue += '</section></nav></div>';

				mb_dialogue += '</div></div>';
				pe.pagecontainer().append(mb_dialogue);
				mb_header.wrapInner('<a href="#jqmobile-wet-boew-menubar" data-rel="dialog"></a>');
				_list = $('<ul></ul>').hide().append('<li><a data-rel="dialog" data-theme="b"  data-icon="grid" href="' + mb_header.find('a').attr('href') + '">' + mb_header.find('a').text() + "</a></li>");

				if (wet_boew_theme.search.length > 0) {
					// :: Search box transform lets transform the search box to a dialogue box
					s_dialogue = $('<div data-role="page" id="jqmobile-wet-boew-search"></div>');
					s_dialogue.append($('<div data-role="header"><h1>' + wet_boew_theme.search.find(':header').text() + '</h1></div>')).append($('<div data-role="content"></div>').append(wet_boew_theme.search.find('form').clone()));
					pe.pagecontainer().append(s_dialogue);
					wet_boew_theme.search.find(':header').wrapInner('<a href="#jqmobile-wet-boew-search" data-rel="dialog"></a>');
					_list.append('<li><a data-rel="dialog" data-theme="b" data-icon="search" href="' + wet_boew_theme.search.find(':header a').attr('href') + '">' + wet_boew_theme.search.find(':header a').text() + "</a></li>");
				}

				wet_boew_theme.title.after($('<div data-role="navbar" data-iconpos="right"></div>').append(_list));
			}

			lang_links = $('body #gcwu-lang');
			if (lang_links.length > 0) {
				links = lang_links.find('a').attr("data-theme", "a");
				lang_nav = $('<div data-role="navbar"><ul></ul></div>');
				ul = lang_nav.children();
				links.each(function () {
					ul.append($('<li/>').append(this));
				});
				lang_links.find('#gcwu-ef-lang').replaceWith(lang_nav.children().end());
				lang_links.find('#gcwu-other-lang').remove();
			}

			if (wet_boew_theme.sft.length > 0) {
				// transform the footer into mobile nav bar
				links = wet_boew_theme.sft.find('#gcwu-sft-in #gcwu-tctr a, #gcwu-sft-in .gcwu-col-head a').attr("data-theme", "b");
				footer1 = $('<div data-role="navbar"><ul></ul></div>');
				ul = footer1.children();
				links.each(function () {
					ul.append($('<li/>').append(this));
				});
				wet_boew_theme.sft.children('#gcwu-sft-in').replaceWith(footer1.children().end());
				wet_boew_theme.gcft.parent().remove();
			} else if (pe.footer.find('#gcwu-tc').length > 0) {
				// transform the footer into mobile nav bar
				links = pe.footer.find('#gcwu-tc a').attr("data-theme", "b");
				footer1 = $('<div data-role="navbar"><ul></ul></div>');
				ul = footer1.children();
				links.each(function () {
					ul.append($('<li/>').append(this));
				});
				pe.footer.find('#gcwu-tc').replaceWith(footer1.children().end());
			}
			wet_boew_theme.footer.append(wet_boew_theme.wmms.detach());

			// jquery mobile has loaded
			$(document).on("mobileinit", function () {
				if (pe.menubar.length > 0) {
					wet_boew_theme.psnb.parent().remove();
					if (wet_boew_theme.search.length > 0) {
						wet_boew_theme.search.parent().remove();
					}
					_list.show();
				}
			});
			// preprocessing before mobile page is enhanced
			$(document).on("pageinit", function () {
				collapsible = $('#jqmobile-wet-boew-menubar .ui-collapsible');
				collapsible.filter(function () {
					return $(this).prev().length > 0;
				}).find('a').removeClass('ui-corner-top');
				collapsible.filter(function () {
					return $(this).next().length > 0;
				}).find('a').removeClass('ui-corner-bottom');
			});
			return;
		}
	};
	/* window binding */
	window.wet_boew_theme = $.extend(true, wet_boew_theme, _wet_boew_theme);
	return window.wet_boew_theme;
}
(jQuery));