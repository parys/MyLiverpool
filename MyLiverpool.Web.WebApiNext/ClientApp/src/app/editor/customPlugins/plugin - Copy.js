(function () {
    var customEmoticons = (function () {
	    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
        
	    var emoArray = [
		    ["good", "sad", "tease", "lol"],
		    ["angel", "bravo", "wink", "yahoo"],
		    ["yes", "no", "ok", "hi"],
		    ["goal", "thankyou", "omg", "goodpost"],
		    ["ynwa", "sarcasm", "diablo", "wall"],
		    ["liverpool", "new_russian", "thumbup", "thumbdown"],
		    ["help", "fool", "friends", "drinks"],
		    ["cool", "punish", "rtfm", "crazy"],
		    ["popcorn", "shout", "blush", "dance"],
		    ["stop", "writer", "wacko", "unknw"]
        ];

        var insertEmoticon = function (editor, ch) {
	        console.warn(1234444);
		    editor.insertContent(ch);
	    };

        var getEmojis = function() {
	        var matches = [];
	        for (var i = 0; i < list.length; i++) {
		        for (var j = 0; j < list.length; j++) {
			        matches.push({
				        value: emoArray[i][j]
			        });
		        }
	        }
        }

        var patternName = 'pattern';
        var open = function (editor, database) {
            var initialState = {
                pattern: '',
                results: getEmojis
            };

            function getHtml() {
	            var emoticonsHtml;

	            emoticonsHtml = '<table role="list" class="mce-grid">';

	            tinymce.util.tools.each(customEmoticons, function (row) {
		            emoticonsHtml += '<tr>';

		            tinymce.util.tools.each(row, function (icon) {
			            var emoticonUrl = url + '/img/' + icon + '.gif';

			            emoticonsHtml += '<td><a href="#" data-mce-url="' + emoticonUrl + '" data-mce-alt="' + icon + '" tabindex="-1" ' +
				            'role="option" aria-label="' + icon + '"><img src="' +
				            emoticonUrl + '" style="max-width: 55px; height: auto;" role="presentation" /></a></td>';
		            });

		            emoticonsHtml += '</tr>';
	            });

	            emoticonsHtml += '</table>';

	            return emoticonsHtml;
            }
            var getInitialState = function () {
                var body = {
                    type: 'panel',
                    panel: {
	                    role: 'application',
	                    autohide: true,
	                    html: getHtml,
	                    onclick: function (e) {
		                    var linkElm = editor.dom.getParent(e.target, 'a');

		                    if (linkElm) {
			                    editor.insertContent(
				                    '<img style=\'max-width:70px;\' src="' +
				                    linkElm.getAttribute('data-mce-url') +
				                    '" alt="' + linkElm.getAttribute('data-mce-alt') +
				                    '" />'
			                    );

			                    this.hide();
		                    }
	                    }
                    }
                    //tabs: map(database.listCategories(), function () {
                    //    return {
                    //        title: "סלאיכû",
                    //        items: [
                    //            resultsField
                    //        ]
                    //    };
                    //})
                };
                return {
                    title: 'Emoticons',
                    size: 'normal',
                    body: body,
                    initialData: initialState,
                    
                    onAction: function (dialogApi, actionData) {
                        if (actionData.name === 'results') {
                            insertEmoticon(editor, actionData.value);
                            dialogApi.close();
                        }
                    },
                    buttons: [{
                        type: 'cancel',
                        text: 'Close',
                        primary: true
                    }]
                };
            };
            var dialogApi = editor.windowManager.open(getInitialState());
            dialogApi.focus(patternName);
        };
var Dialog = { open: open };



        var register = function (editor) {
	        var onAction = function() {
		        return Dialog.open(editor);
            };

	        editor.ui.registry.addButton('customEmoticons',
		        {
			        //icon: 'horizontal-rule',
			        type: 'panelbutton',
			        image: '/src/plugins/customEmoticons/img/good.gif',
			        tooltip: '\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u043C\u0430\u0439\u043B',
			        onAction: onAction
		        });

        };
var Buttons = { register: register };


        global.add('customEmoticons', function (editor) {
	Buttons.register(editor);
});
function Plugin() {
}

return Plugin;
}());
})();
