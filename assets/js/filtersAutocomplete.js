var _autocompleteSearch;var _lastActiveInput;function initFiltersAutocomplete(input,valueInput,appendTo){if(typeof valueInput==='undefined'||!valueInput){valueInput=input;}
var isNps=input.attr('data-nps')==='true';input.autocomplete({minLength:0,delay:100,autoFocus:true,appendTo:appendTo,source:function(req,res){autocompleteSource(req,res,isNps);},select:function(event,ui){event.preventDefault();if(ui.item.value==='CREATE_SEGMENT'){showSegmentCreation();}else if(ui.item.value==='<span></span>'){input.blur();}else{addFilter(ui.item.label,ui.item.value,ui.item.segment);}
return false;},focus:function(event,ui){event.preventDefault();return false;},position:{my:'top',at:'bottom',of:appendTo}}).focus(function(){input.data('uiAutocomplete').search(valueInput.val());_lastActiveInput=input;input.closest('.selectedFilterContainer').addClass('focus');}).blur(function(){var value=input.val().trim();if(value!==''){addFilter(value,value);}
input.closest('.selectedFilterContainer').removeClass('focus');}).keydown(function(e){var key='which'in e?e.which:e.keyCode;var value=$(this).val().trim();if(value===''&&key===8){var lastFilter=$('.selectedFilterContainer .selectedFilter').last();if(lastFilter.length===1){removeFilter(lastFilter);}}});input.data('uiAutocomplete')._renderItem=renderAutocompleteItem;input.data('uiAutocomplete')._resizeMenu=function(ul,item){this.menu.element.width($(appendTo).outerWidth());};}
function autocompleteSource(request,response,isNps){_autocompleteSearch=null;var url='retrieveFilterStats';if(request.term){var terms=request.term.split(';');var term=terms[terms.length-1].trim();_autocompleteSearch=term;url+='?search='+encodeURIComponent(term);if(terms.length>1){var currentValue='';for(var i=0;i<terms.length-1;i++){if(i>0){currentValue+=';';}
currentValue+=terms[i];}
url+='&current='+encodeURIComponent(currentValue);}}
if(isNps){if(url.indexOf('?')>-1){url+='&';}else{url+='?';}
url+='nps=true';}
$.ajax({type:'GET',url:url,success:function(jsons){var filters=[];var termExists=false;var searching=typeof _autocompleteSearch!=='undefined'&&_autocompleteSearch!==null&&_autocompleteSearch.trim()!=='';for(var i=0;i<jsons.length;i++){var json=jsons[i];if(typeof json.segment!=='undefined'&&json.segment){if(json.filter==='CREATE_SEGMENT'){json.label=json.name;json.value=json.filter;json.separator=true;}else{json.label='<span>'+escapeHtml(json.name)+'</span>';json.value='s_'+json.filter;}}else{if(searching&&json.filter.toLowerCase()==_autocompleteSearch.toLowerCase()){termExists=true;}
json.label='<span>'+escapeHtml(json.filter)+'</span>';json.value=json.filter;}
filters.push(json);}
if(!termExists&&searching){filters.push({label:'<span>'+_autocompleteSearch+'</span>',value:_autocompleteSearch,separator:true});}
response(filters);}});}
function renderAutocompleteItem(ul,item){var label=item.label;if(_autocompleteSearch){var labelHtml=$('<div>').append(label);var span=labelHtml.find('span');if(span.length>0){var text=escapeHtml(span.text());text=text.replace(new RegExp(escapeForRegex(_autocompleteSearch),'ig'),'<b>'+_autocompleteSearch+'</b>');span.html(text);label=labelHtml.html();}}
if(typeof item.segment!=='undefined'&&item.segment){label='<i class="material-icons">filter_list</i>'+label;}else if(typeof item.filter!=='undefined'){label='<i class="material-icons">label</i>'+label;}
if(typeof item.users!=='undefined'&&item.users){var count='<span class="count">('+numberWithCommas(item.users)+' active users)</span>';label+=count;}
var element=$('<li>').data('item.autocomplete',item).append('<a>'+label+'</a>').appendTo(ul);if(typeof item.separator!=='undefined'&&item.separator){element.addClass('separator');}
return element;}
function removeFilter(filterElement){filterElement=$(filterElement);if(!filterElement.is('.selectedFilter')){filterElement=filterElement.closest('.selectedFilter');}
var input=filterElement.closest('.selectedFilterContainer').parent().find('input[type="hidden"]');var filter=filterElement.attr('data-filter');filterElement.remove();var value=input.val().trim();var regex=new RegExp('(?:^|\\b|;)'+escapeForRegex(filter)+'(?:;|\\b|$)','g');value=value.replace(regex,';').replace(';;',';').trim();if(value===';'){value='';}
input.val(value);}
function escapeForRegex(str){return str.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function addFilter(names,filters,segment){names=unescapeHtml(names);var container=_lastActiveInput.closest('.selectedFilterContainer');var valueInput=container.parent().find('input[type="hidden"]');var addFilter=container.find('.addFilter');var nameParts=names.split(';');var filterParts=filters.split(';');for(var i=0;i<filterParts.length;i++){var name=nameParts[i];name=name.replace(/(<span>|<\/span>)/g,'');var filter=filterParts[i];if(name.trim()===''||filter.trim()===''){continue;}
var value=filter+';';var previousVal=valueInput.val().trim();if(previousVal&&previousVal!==''){if(_autocompleteSearch&&previousVal.endsWith(_autocompleteSearch)){previousVal=previousVal.substring(0,previousVal.length-_autocompleteSearch.length);}
if(previousVal!==''){if(!previousVal.endsWith(';')){previousVal+=';';}
value=previousVal+value;}}
valueInput.val(value);var filterElement=$('<div>').addClass('selectedFilter').attr('data-filter',filter);var nameElement=$('<span>').addClass('name').append($('<span>').text(name));if(typeof segment!=='undefined'&&segment){var segmentIcon=$('<i>').addClass('material-icons iconSegment').text('filter_list');nameElement.prepend(segmentIcon);}
filterElement.append(nameElement);var deleteElement=$('<div>').addClass('delete').click(function(){removeFilter(filterElement);});var deleteIcon=$('<i>').addClass('material-icons iconDelete').text('clear');deleteElement.append(deleteIcon);filterElement.append(deleteElement);addFilter.before(filterElement);}
setTimeout(function(){_lastActiveInput.val('');_lastActiveInput.data('uiAutocomplete').search(valueInput.val());},10);}
function numberWithCommas(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
function showSegmentCreation(){var content='<iframe src="/users?reducedView=true"></iframe>';showModal('Create segment filter',content,null,'segmentCreationModal');}
function escapeHtml(unsafe){return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}
function unescapeHtml(unsafe){return unsafe.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&#039;/g,"'");}