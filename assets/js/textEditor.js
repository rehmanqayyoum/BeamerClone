var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var c=0;return function(){return c<a.length?{done:!1,value:a[c++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var c="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return c?c.call(a):$jscomp.arrayIterator(a)};var contentModified=!1,initEditor=function(a){rangy.init();"undefined"!==typeof a&&"undefined"!==typeof a.templatesToolbar&&a.templatesToolbar&&$('input[name="title"], input[name="actionName"], input[name="action"]').each(function(){$(this).parent().addClass("extendedInput");new InputTemplatesToolbar(this,{renderTemplatesButton:function(b){return $("<div>").addClass("templatesButton extensionButton tooltippable").attr("id","templatesButton"+b).attr("data-tooltip-title","Insert user data").append('<i class="material-icons">data_object</i>')},showTemplatesButton:function(b){},hideTemplatesButton:function(b){}})});initEmojiPicker($('input[name="title"], input[name="actionName"]'));var c={imageDragging:!1,targetBlank:!0,activeButtonClass:"activeButton",toolbar:{buttons:"bold italic underline anchor h2 h3 quote unorderedlist orderedlist alignLeft alignCenter alignRight alignJustify".split(" "),static:!0,updateOnEmptySelection:!0,relativeContainer:".featureForm .featureContent .toolbar"},anchor:{formSaveLabel:'<i class="material-icons">check</i>',formCloseLabel:'<i class="material-icons">close</i>'},anchorPreview:{hideDelay:500,previewValueSelector:"a",showWhenToolbarIsVisible:!0},paste:{forcePlainText:!1,cleanPastedHTML:!0,cleanTags:["meta","script"]}};"undefined"!==typeof a&&"undefined"!==typeof a.extensions&&(c.extensions=a.extensions);initToolbarButtons(c,a);editor=new MediumEditor(".featureForm .editable",c);numberOfLanguages=document.getElementById("numberOfLanguages").value;allLanguages=numberOfLanguages.split(";");for(c=0;c<allLanguages.length;c++){var d=document.getElementById("content"+allLanguages[c]).value;""===d.trim()||hasHtml(d)||(d=$("<div>").append($("<p>").append(d)).html());editor.setContent(d,c)}displayLanguageEditor(document.getElementById("defaultLanguage").value);var f=[];c={editor:editor,editorContainer:".featureForm",buttonsContainer:".toolbar",addons:{embeds:{placeholder:"Paste a link from Youtube, Loom, Wistia, Instagram or 100+ other apps and press Enter",parseOnPaste:!0,actions:{copyUrl:{name:"Copy URL",label:'<i class="material-icons">content_copy</i>',clicked:function(b){var e=b.attr("data-url");e&&copyText(e);var g=b.find('button[data-action="copyUrl"] i'),h=g.text();g.text("done");setTimeout(function(){g.text(h)},2E3)}},remove:{name:"Remove",label:'<i class="material-icons">close</i>',clicked:function(b){destroyTooltip(b.find(".tooltippable"));setTimeout(function(){b.addClass("medium-insert-embeds-selected");var e=$.Event("keydown");e.which=8;$(document).trigger(e)},5)}}},oembedProxy:function(b,e){b=escapeHtml(b);var g='<a href="'+b+'" class="oembed"></a>';e?$.proxy(this,"embed",g,b)():$.proxy(this,"embed",g)();$("a.oembed:not(.oembedded)").oembed(null,{includeHandle:!1,afterEmbed:function(){var h=$(this).closest(".medium-insert-embeds"),l=h.next();0!==l.length&&l.is("p")&&"<br>"===l.html()||(l=$("<p><br></p>"),h.after(l));setTimeout(function(){MediumEditor.selection.moveCursor(document,l[0])},1)},onProviderNotFound:function(){$("a.oembed:not(.oembedded)").each(function(){$(this).closest(".medium-insert-embeds").replaceWith($("<p>").text($(this).attr("href")))})},onError:function(){$("a.oembed:not(.oembedded)").each(function(){var h=$(".medium-insert-active"),l=$(this).closest(".medium-insert-embeds"),k=$(this).attr("href");if(0===h.length||l.is(h)){var m=$("<p>").text(k);l.replaceWith(m)}else m=h,h.html(h.html()+escapeHtml(k)),l.remove();setTimeout(function(){MediumEditor.selection.moveCursor(document,m[0].lastChild,m[0].lastChild.textContent.length)},1)})}},null,function(){$("a.oembed:not(.oembedded)").addClass("oembedded").siblings("iframe").each(function(){var h=$(this),l=$("<div>").addClass("oembed-responsive");if("undefined"!==typeof h.css("max-width")&&"undefined"!==typeof h.css("max-height")){var k=parseInt(h.css("max-width").replace("px",""));h=parseInt(h.css("max-height").replace("px",""));l.css("padding-bottom",Math.floor(h/k*100)+"%")}$(this).wrap(l)})})}},images:{parseOnPaste:!0,actions:{preview:{label:'<i class="material-icons">visibility</i>',clicked:function(b){b.closest("figure").find("img")[0].requestFullscreen()}},download:{label:'<i class="material-icons">download</i>',clicked:function(b){var e=b.closest("figure").find("img");b=document.createElement("a");e=$(e).attr("src");var g=e.substr(e.lastIndexOf(".")+1);b.href=e;b.download="feature_request_picture."+g;document.body.append(b);b.click();b.remove();window.URL.revokeObjectURL(e)}},expand:{label:'<i class="material-icons">fit_screen</i>',clicked:function(b){b.closest("figure").removeClass("resized").removeAttr("style")}},remove:{label:'<i class="material-icons">close</i>'}},fileUploadOptions:{url:a.insert.images.url,paramName:"pictureUploaded",maxFileSize:1E7,disableImageResize:!1,paste:function(b,e){},uploadAdd:function(b){pendingUploads++;f.push(setTimeout(function(){pendingUploads--;0>pendingUploads&&(pendingUploads=0);f.shift()},3E3))},uploadDone:function(b){pendingDownloads++;for(var e=[],g=0;g<b.files.length;g++)e.push(b.files[g].id);b=$(".languageTabsContainer .languageTab");var h=-1;for(g=0;g<b.length;g++)if($(b[g]).hasClass("active")){h=g;break}-1<h&&((b=pictureIds[allLanguages[g]])||(b=[]),pictureIds[allLanguages[g]]=b.concat(e))},always:function(){pendingUploads--;0>pendingUploads&&(pendingUploads=0);0<f.length&&clearTimeout(f.shift())},fail:function(b,e){"undefined"!==typeof e&&"undefined"!==typeof e.context&&0<e.context.length&&(b=$(e.context[0]),b.is("figure")&&b.closest(".medium-insert-images").remove())}},uploadCompleted:function(b){pendingDownloads--}}}};"undefined"!==typeof a&&"undefined"!==typeof a.contributorButton&&a.contributorButton&&(c.addons.Contributors=!0);"undefined"!==typeof a&&"undefined"!==typeof a.templatesToolbar&&a.templatesToolbar&&(c.addons.Templates=!0);"undefined"!==typeof a&&"undefined"!==typeof a.emojiButton&&a.emojiButton&&(c.addons.Emoji=!0);$(".featureForm .editable").mediumInsert(c);editor.subscribe("blur",function(b,e){contentModified=!0});$('input[name="title"]').on("blur",function(b,e){contentModified=!0});editor.subscribe("editableDrop",function(b,e){1>b.dataTransfer.files.length||$.data(e,"plugin_mediumInsertImages").add(b.dataTransfer.files);return!1});editor.subscribe("editableInput",function(b,e){initPictures();initEmbeds()});initToolbarTooltips();initPictures();initEmbeds();inputChecker();$('.featureForm:visible input[name="title"]').focus()},initToolbarButtons=function(a,c){a.extensions||(a.extensions={});var d=MediumEditor.extensions.button.extend({name:"align",contentDefault:'<i class="material-icons">format_align_left</i>',contentFA:'<i class="material-icons">format_align_left</i>',alignClass:"alignLeft",aria:"Align left",action:"alignLeft",init:function(){MediumEditor.extensions.button.prototype.init.call(this)},handleClick:function(b){b.preventDefault();b.stopPropagation();b=$(".medium-insert-images.medium-insert-active");if(0<b.length)this.align(b);else{b=MediumEditor.selection.getSelectedElements(this.document);for(var e=0;e<b.length;e++)this.align(b[e])}this.base.checkContentChanged()},align:function(b){var e=!1;this.getEditorElements().forEach(function(g){0<$(g).find(b).length&&(e=!0)},this);e&&$(this.getTopElement(b)).removeClass(function(g,h){return(h.match(/(^|\s)align\S+/g)||[]).join(" ")}).addClass(this.alignClass)},getTopElement:function(b){var e=!1;this.getEditorElements().forEach(function(g){$(b).parent().is(g)&&(e=!0)},this);return e?b:this.getTopElement($(b).parent()[0])}}),f=d.extend({name:"alignLeft",contentDefault:'<i class="material-icons">format_align_left</i>',contentFA:'<i class="material-icons">format_align_left</i>',alignClass:"alignLeft",aria:"Align left",action:"alignLeft"});a.extensions.alignLeft=new f;f=d.extend({name:"alignCenter",contentDefault:'<i class="material-icons">format_align_center</i>',contentFA:'<i class="material-icons">format_align_center</i>',alignClass:"alignCenter",aria:"Align center",action:"alignCenter"});a.extensions.alignCenter=new f;f=d.extend({name:"alignRight",contentDefault:'<i class="material-icons">format_align_right</i>',contentFA:'<i class="material-icons">format_align_right</i>',alignClass:"alignRight",aria:"Align right",action:"alignRight"});a.extensions.alignRight=new f;d=d.extend({name:"alignJustify",contentDefault:'<i class="material-icons">format_align_justify</i>',contentFA:'<i class="material-icons">format_align_justify</i>',alignClass:"alignJustify",aria:"Justify",action:"alignJustify"});a.extensions.alignJustify=new d;"undefined"!==typeof c&&"undefined"!==typeof c.codeButton&&c.codeButton&&(c=MediumEditor.extensions.button.extend({name:"code",tagNames:["pre"],contentDefault:'<i class="material-icons">code</i>',contentFA:'<i class="material-icons">code</i>',aria:"Code",action:"code",init:function(){MediumEditor.extensions.button.prototype.init.call(this)},handleClick:function(b){b.preventDefault();b.stopPropagation();var e=rangy.getSelection().getRangeAt(0);b=$(e.startContainer.parentElement);if(b.is("code")&&b.parent().is("pre")){e=b.parent();var g=1===e.next().length,h=1===e.prev().length,l=e.parent().is("p");if(g)var k=e.next()[0];else h?k=e.prev()[0]:l&&(k=e.parent()[0]);e.replaceWith(b.html());if("undefined"!==typeof k&&k){if(g)var m=k.previousSibling;else h?m=k.nextSibling:l&&(m=k.lastChild);MediumEditor.selection.moveCursor(document,m)}}else{var n="";k=$("<div>").append(e.toHtml());k.children().each(function(){""!==n&&(n+="<br>");n+=$(this).html()});""===n.trim()&&(n=k.text(),""===n.trim()&&(n="\n"));k=$("<pre>").append($("<code>").text(n))[0];e.deleteContents();e.insertNode(k);m=rangy.getSelection();m.selectAllChildren(k.childNodes[0].childNodes[0]);m.collapseToEnd()}this.base.checkContentChanged()},isAlreadyApplied:function(b){b=$(b);if(b.is("code")&&b.parent().is("pre"))return!0;b=b.closest("code");return 1===b.length&&b.parent().is("pre")?!0:!1}}),a.toolbar.buttons.splice(7,0,"code"),a.extensions||(a.extensions={}),a.extensions.code=new c)},initPictures=function(){$(".featureForm .editable .medium-insert-images figure:first-of-type").each(function(){initPicture($(this))})},destroyPictures=function(){$(".featureForm .editable .medium-insert-images figure:first-of-type").each(function(){destroyPicture($(this))})},initEmbeds=function(){$(".featureForm .editable .medium-insert-embeds figure:first-of-type").each(function(){initEmbed($(this))})},destroyEmbeds=function(){$(".featureForm .editable .medium-insert-embeds figure:first-of-type").each(function(){destroyEmbed($(this))})},initPicture=function(a){if(!0!==a.data("initialized")){a.data("initialized",!0);var c=a.closest(".editable");initResizable(a,c);initDraggable(a,c);initCaption(a)}},destroyPicture=function(a){!0===a.data("initialized")&&(a.data("initialized",!1),destroyResizable(a),destroyDraggable(a),destroyCaption(a))},initEmbed=function(a){if(!0!==a.data("initialized")){a.data("initialized",!0);var c=a.closest(".editable");initDraggable(a,c);initCaption(a)}},destroyEmbed=function(a){!0===a.data("initialized")&&(a.data("initialized",!1),destroyDraggable(a),destroyCaption(a))},initResizable=function(a,c){a.resizable({containment:c,minHeight:20,minWidth:20,distance:10,autoHide:!0,aspectRatio:!0,handles:"all",stop:function(d,f){a.addClass("resized").removeAttr("style").css({"max-width":f.size.width,"max-height":f.size.height})}})},destroyResizable=function(a){a.resizable("destroy")},initDraggable=function(a,c){var d=a.parent(),f,b;a.data("max-width",a.css("max-width"));a.data("max-height",a.css("max-height"));d.draggable({snap:".editable > p",cursor:"move",delay:500,containment:c,revert:!0,revertDuration:0,start:function(){a.data("max-width",a.css("max-width"));a.data("max-height",a.css("max-height"))},drag:function(e,g){g=(new Date).getTime();!(b&&50>g-b)&&(b=g,e=getTopDragoverElement(e.originalEvent.clientX,e.originalEvent.clientY,20,d,c))&&(f=e.element,c.find(".draggingOver").removeClass("draggingOver top bottom"),f.addClass("draggingOver "+e.side))},stop:function(e,g){a.data("max-width")&&a.data("max-height")&&(a.css("max-width",a.data("max-width")),a.css("max-height",a.data("max-height")));f&&0<f.length&&(f.hasClass("top")?d.insertBefore(f):f.hasClass("bottom")&&d.insertAfter(f));c.find(".draggingOver").removeClass("draggingOver top bottom")}})},destroyDraggable=function(a){a.parent().draggable("destroy").removeAttr("style")},initCaption=function(a){a.find("figcaption").attr("contenteditable",!0).unbind("click").click(function(){setEndOfContenteditable(this)}).unbind("keydown").keydown(function(c){if(13===("which"in c?c.which:c.keyCode))return c.preventDefault(),$(this).blur(),!1})},destroyCaption=function(a){a=a.find("figcaption");a.removeAttr("contenteditable");a.attr("class")||a.removeAttr("class")},getTopDragoverElement=function(a,c,d,f,b){if(a=getValidDragoverElementFromPoint(a,c,d,f,b))return c=a.parent(),c.is(b)?{element:a,side:"top"}:a.is(b)&&(f=a.children().not(f).last(),0<f.length)?{element:f,side:"bottom"}:0<c.length?getTopElement(c,b):{element:a,side:"top"}},getValidDragoverElementFromPoint=function(a,c,d,f,b){var e=$(document.elementFromPoint(a,c));if(isValidDragoverElement(e,f,b))return e;for(var g=yMinus=c,h=0;h<d;h++){g++;yMinus--;e=$(document.elementFromPoint(a,g));if(isValidDragoverElement(e,f,b))return e;e=$(document.elementFromPoint(a,yMinus));if(isValidDragoverElement(e,f,b))return e}if((a=b.children().not(f).last())&&a[0].getBoundingClientRect().top+a.outerHeight()<c)return b},isValidDragoverElement=function(a,c,d){return!!a&&!a.is(c)&&a.parent().is(d)},displayLanguageEditor=function(a){var c=$('.languageTab[data-language-name="'+a+'"]');if(!c.hasClass("active")){$(".languageTab").removeClass("active");c.addClass("active");$(".featureForm").hide().removeClass("active");$('.featureForm[data-language-name="'+a+'"]').show().addClass("active");c.attr("data-rtl")&&"true"==c.attr("data-rtl")?$("#featureForm .feature").hasClass("rtl")||$("#featureForm .feature").addClass("rtl"):$("#featureForm .feature").removeClass("rtl");displayCategories(a);var d=getLanguagesWithContent();if(0<d.size){c=d.has(a);d.delete(a);if(1===d.size){a={};var f=$jscomp.makeIterator(d);for(d=f.next();!d.done;a={$jscomp$loop$prop$item$4:a.$jscomp$loop$prop$item$4},d=f.next())a.$jscomp$loop$prop$item$4=d.value,$(".featureCopyTranslations").find(".copyTranslation").click(function(b){return function(){copyTranslationContent(b.$jscomp$loop$prop$item$4,$(this).closest(".featureForm"))}}(a)).removeClass("drop").find(".select").remove()}else for($(".featureCopyTranslations .copyTranslation").addClass("drop").unbind("click").click(function(){$(this).addClass("open")}),$(document).unbind("click.copyTranslationDrop").on("click.copyTranslationDrop",function(b){b=$(b.target);b.is(".featureCopyTranslations")||0!==b.closest(".featureCopyTranslations").length||$(".featureCopyTranslations .copyTranslation").removeClass("open")}),a=$(".featureCopyTranslations").find(".copyTranslation .select ul"),0===a.length?($(".featureCopyTranslations .copyTranslation").append($("<div>").addClass("select").append($("<ul>"))),a=$(".featureCopyTranslations").find(".copyTranslation .select ul")):a.find(".selectable").remove(),f=$jscomp.makeIterator(d),d=f.next();!d.done;d=f.next())d=d.value,d=$("<li>").addClass("selectable").attr("data-value",d).append($("<div>").addClass("selectableName").text(d)).click(function(){var b=$(this);copyTranslationContent(b.attr("data-value"),b.closest(".featureForm"))}),a.append(d);c?($(".featureCopyTranslations").removeClass("show"),$(".featureCopyTranslations").addClass("hide")):($(".featureCopyTranslations").removeClass("hide"),$(".featureCopyTranslations").addClass("show"))}else $(".featureCopyTranslations").removeClass("show"),$(".featureCopyTranslations").addClass("hide")}},displayCategories=function(a){try{var c=$("#"+a+"categoryTranslations")}catch(d){c=$(document.getElementById(a+"categoryTranslations"))}0<c.length&&c.find("span").each(function(){var d=$(this).attr("data-category");$(".categorySelector").find(".categorySelectorOption:not(.categoryOther)").filter(function(){return compareCategories($(this).attr("data-value"),d)}).find(".name").text($(this).text());$(".selectedCategories .category").filter(function(){return compareCategories($(this).attr("data-category"),d)}).find(".name").text($(this).text())})},getCurrentLanguage=function(){for(var a=null,c=$(".languageTabsContainer .languageTab"),d=-1,f=0;f<c.length;f++)if($(c[f]).hasClass("active")){d=f;break}-1<d&&(a=allLanguages[f]);return a},getEditorContent=function(){destroyPictures();destroyEmbeds();var a=editor.serialize();initPictures();initEmbeds();return a},initEmojiPicker=function(a){$(a).each(function(){a=$(this);var c=a.parent();c.addClass("extendedInput");a.emojiPicker({button:!1,recentCount:9,container:c});c=$("<div>").addClass("emojiButton extensionButton tooltippable").attr("data-tooltip-title","Insert emoji").append($('<i class="material-icons">insert_emoticon</i>')).data("input",a).click(function(d){d.preventDefault();$(this).data("input").emojiPicker("toggle");return!1});a.after(c)})},initToolbarTooltips=function(){$(".toolbar .medium-insert-buttons-addons button").each(function(){var a="",c=$(this);switch(c.attr("data-addon")){case "images":a="Insert image";break;case "embeds":a="Insert embedded content";break;case "Contributors":a="Insert contributor";break;case "Templates":a="Insert user data";break;case "Emoji":a="Insert emoji"}c.attr("data-tooltip-title",a).attr("data-tooltip-class","tooltipPlaceholder").attr("data-tooltip-container",".featureForm").attr("data-tooltip-placement","top").addClass("tooltippable")});initTooltippables()},copyText=function(a){a=$("<textarea>").css("opacity",0).text(a);$("body").append(a);try{a[0].focus(),a[0].select(),document.execCommand("copy")}catch(c){}a.remove()},escapeHtml=function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")},getLanguagesWithContent=function(a){var c=new Set,d=allLanguages;"undefined"!=typeof a&&(d=[a]);var f=$('input[name="title"]');for(a=0;a<f.length;a++)""!==$(f[a]).val().trim()&&c.add($(f[a]).closest(".featureForm").attr("id"));f=getEditorContent();for(a=0;a<d.length;a++){var b=f["contentArea"+d[a]].value;b=$("<div>").append(b);b.find("code").each(function(){var g=$(this);g.parent().is("pre")?""===g.text().trim()&&g.parent().remove():g.parent().html(g.html())});b.find("br").each(function(){0===$(this).closest("code").length&&$(this).remove()});b=b.html().replace(/(<p><\/p>|<p style=""><\/p>|<p class=""><\/p>|<p style="" class=""><\/p>|<p class="" style=""><\/p>)*/g,"");b=$(b);var e=$("<div>");b.find(".oembed").remove();e.append(b);""!==e.html().trim()&&c.add(d[a])}d=document.getElementsByClassName("actionName");f=document.getElementsByClassName("actionURL");for(a=0;a<d.length;a++)""===d[a].value.trim()&&""===f[a].value.trim()||c.add($(d[a]).closest(".featureForm").attr("id"));return c},copyTranslationContent=function(a,c){var d=$(c).attr("id"),f=$('.featureForm[id="'+a+'"]'),b=$(f).find('input[name="title"]').val();null==b&&""==b||$(c).find('input[name="title"]').val(b);a=getEditorContent()["contentArea"+a].value;d=allLanguages.indexOf(d);null==a&&""==a||editor.setContent(a,d);d=$(f).find('input[name="actionName"]').val();null==d&&""==d||$(c).find('input[name="actionName"]').val(d);f=$(f).find('input[name="action"]').val();null==f&&""==f||$(c).find('input[name="action"]').val(f);$(".featureCopyTranslations").removeClass("show").addClass("hide")},inputChecker=function(){var a;$('input[name="title"], div.editable, input[name="actionName"], input[name="action"]').on("keyup change blur",function(){if("undefined"!==typeof a){clearTimeout(a);var c=300}else c=100;a=setTimeout(function(){if(!$(".medium-insert-images.medium-insert-active figcaption").is(":focus")){var d=$(".featureForm.active").attr("id"),f=getLanguagesWithContent(d),b=$(".featureForm.active");0===f.size||f.has(d)?b.find(".featureCopyTranslations").removeClass("show").addClass("hide"):(b.find(".featureCopyTranslations").addClass("show").removeClass("hide"),b.find('.copyTranslation .selectable[data-value="'+d+'"]').remove())}a=void 0},c)})},setEndOfContenteditable=function(a){if(document.createRange){var c=document.createRange();c.selectNodeContents(a);c.collapse(!1);a=window.getSelection();a.removeAllRanges();a.addRange(c)}else document.selection&&(c=document.body.createTextRange(),c.moveToElementText(a),c.collapse(!1),c.select())};