//Primary Forminator Functions 
function doFormFields() {
    $(".formValue").each(function () {
        displayName = $(this).attr("data-displayName");
        orientation = $(this).attr('data-orientation') || '';
        displayName = displayName.replace(/&(?!amp;)/g, '&amp;');
        elem = $(this);
        $("table.ms-formtable td").each(function () {
            if (this.innerHTML.indexOf('FieldInternalName="' + displayName + '"') != -1 || this.innerHTML.indexOf('FieldName="' + displayName + '"') != -1){
                var contents = $(this).contents();
                if(orientation == 'horizontal'){
                    reorientContents(orientation,contents);
                    contents = makeHorizontal(contents);
                    contents.appendTo(elem);
                } else {
                    contents.appendTo(elem);
                }
            }
        });
    });
}

function doFormButtons(){

    $('input[type="button"][value="Save"]').hide();
    $('input[type="button"][value="Cancel"]').hide();

    var save = $('input[type="button"][value="Save"]')[0],
        cancel = $('input[type="button"][value="Cancel"]')[0];

    $('span.formSave').append($(save));
    $('span.formCancel').append($(cancel));
    
    $(save).show();
    $(cancel).show();
    
}

function doReadFields() {
    var types = {},
        field;
    types.text = {
        search: 'FieldType="SPFieldText"',
        value: function () {
            return $(field).find('input').val();
        }
    };
    types.date = {
        search: 'FieldType="SPFieldDateTime"',
        value: function () {
            return $(field).find('input').val();
        }
    };
    types.user = {
        search: 'FieldType="SPFieldUser"',
        value: function () {
            return handlePeopleFields(field);
        }
    };
    types.multiuser = {
        search: 'FieldType="SPFieldUserMulti"',
        value: function () {
            return handlePeopleFields(field);
        }
    };
    types.choice = {
        search: 'FieldType="SPFieldChoice"',
        value: function () {
            return handleChoiceFields(field, false);
        }
    };
    types.multichoice = {
        search: 'FieldType="SPFieldMultiChoice"',
        value: function () {
            return handleChoiceFields(field, true);
        }
    };
    types.multiline = {
        search: 'FieldType="SPFieldNote"',
        value: function () {
            return handleMultiLineText(field);
        }
    };
    types.bool = {
        search: 'FieldType="SPFieldBoolean"',
        value: function () {
            return ($(field).find('input').is(':checked')) ? 'Yes' : 'No';
        }
    };
    types.num = {
        search: 'FieldType="SPFieldNumber"',
        value: function () {
            return $(field).find('input').val();
        }
    };
    types.currency = {
        search: 'FieldType="SPFieldCurrency"',
        value: function () {
            return $(field).find('input').val();
        }
    };
    types.link = {
        search: 'FieldType="SPFieldURL"',
        value: function () {
            return handleURLFields(field);
        }
    };
    types.lookup = {
        search: 'FieldType="SPFieldLookup"',
        value: function () {
            return handleChoiceFields(field, false);
        }
    };
    types.multilookup = {
        search: 'FieldType="SPFieldLookupMulti"',
        value: function () {
            return handleChoiceFields(field, true);
        }
    };
    types.meta = {
        search: 'FieldType="SPFieldTaxonomyFieldType"',
        value: function () {
            return handleMetadata(field);
        }
    };
    types.meta = {
        search: 'FieldType="SPFieldTaxonomyFieldTypeMulti"',
        value: function () {
            return handleMetadata(field);
        }
    };

    types.meta = {
        search:'FieldType="SPFieldFile"',
        value: function() {
            return $(field).find('input').val();
        }
    }

    $(".readValue").each(function () {
        dn = $(this).attr("data-displayName");
        dn = dn.replace(/&(?!amp;)/g, '&amp;');
        el = $(this);
        $("table.ms-formtable td").each(function () {
            field = this;
            if (this.innerHTML.indexOf('FieldName="' + dn + '"') != -1 || this.innerHTML.indexOf('FieldInternalName="' + dn + '"') != -1) {
                
                $.map(types, function (prop, key) {
                    if (field.innerHTML.indexOf(prop.search) > -1) {
                        $(el).append(prop.value());
                    }
                });
            }
        });
    });
}

function doLookupFields(){
    var formPage = _spPageContextInfo.serverRequestPath;
    $('.lookupValue').each(function(){
        var fieldData = $(this).data(),
            elem = $(this),
            selectedId;
        if(formPage.indexOf('New')>-1){
            $('select[id^="' + fieldData.parentfield + '"]').change(function(){
                selectedId = this.value;
                getLookupValues(selectedId,fieldData,elem);
            });
        } else if(formPage.indexOf('Edit')>-1){
            var $selected = $('select[id^="' + fieldData.parentfield + '"]');
                selectedId = $selected.val();
            $selected.change(function(){
                selectedId = $selected.val();
                getLookupValues(selectedId,fieldData,elem);
            });
            getLookupValues(selectedId, fieldData, elem);
        } else {
            selectedId = extractItemId(fieldData.parentfield);
            getLookupValues(selectedId,fieldData,elem);
        }
    });
}

//Specific Fields
function handleMultiLineText(field) {
    var $field = $(field);
    if($field.find('textarea').length > 0) {
        return $field.find('textarea').text();
    }else{
        return $field.find('div[id$="TextField_inplacerte"]').html();
    }
    
}

function handlePeopleFields(field) {
    var value = $(field).find('input').val();
    if (value.length) {
        value = JSON.parse(value);
        var html = '';
        value.map(function (o) {
            var id1 = getRandomInt(1, 100),
                id2 = getRandomInt(1, 100);
            html += '<div><span><span class="ms-imnSpan"><a href="#" onclick="IMNImageOnClick(event);return false;" class="ms-imnlink ms-spimn-presenceLink"><span class="ms-spimn-presenceWrapper ms-imnImg ms-spimn-imgSize-10x10"><img name="imnmark" title="" ShowOfflinePawn="1" class="ms-spimn-img ms-spimn-presence-disconnected-10x10x32" src="/_layouts/15/images/spimn.png?rev=23" alt="User Presence" sip="' + o.EntityData.Email + '" id="imn_' + id1 + ',type=sip"/></span></a></span><span><a href="#" onclick="IMNImageOnClick(event);return false;" class="ms-imnlink" tabIndex="-1"><img name="imnmark" ShowOfflinePawn="1" class="ms-hide" src="/_layouts/15/images/spimn.png?rev=23" alt="User Presence" sip="' + o.EntityData.Email + '" id="imn_' + id2 + ',type=sip"/></a>' + o.DisplayText + '</span></span></div>';
        });
        return html;
    }
}

function handleChoiceFields(field, isMulti) {
    var html = '',
        isSelect = $(field).find('select').length;
    if (!isMulti) {
        if (isSelect) {
            return $(field).find('select option:selected').text();
        } else {
            return $(field).find('input:checked').val();
        }
    } else {
        if (isSelect) {
            $(field).find('select[title$="selected values"] option').each(function () {
                html += $(this).text() + ';';
            });
            return html;
        } else {
            $(field).find('input:checked').each(function () {
                if(this.id.indexOf('FillInRadio') > -1) {
                    html += $(this).closest('tr').next().find('input').val() + ';';
                } else {
                    html += $(this).next().text() + ';';
                }
                
            });
            return html;
        }
    }
}

function handleURLFields(field) {
    var fields = $(field).find('input'),
        url = $(fields[0]).val(),
        desc = $(fields[1]).val(),
        html = '<a href="' + url + '">' + desc + '</a>';
    return html;
}

function handleMetadata(field) {
    var v = $(field).find('input').val();
    if (v.indexOf(';') > -1) {
        var arr = [];
        v = v.split(';');
        v = v.map(function (a) {
            var i = a.indexOf('|'),
                r = a.slice(0, i);
            arr.push(r);
        });
        arr = arr.join(';');
        return arr;
    } else {
        v = v.split('|');
        return v[0];
    }
}

//Async Functions

function getLookupValues(id,data,elem){
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + data.parentlist + "')/items(" + id + ")?$select="+data.fieldname,
        type:'GET',
        dataType: "json",
        headers: {
            Accept: "application/json;odata=nometadata"
        }
    }).then(
        function(response,status,jqXHR){
            for(var value in response){
                elem.text(response[value]);
            }
        },
        function(jqXHR,status,err){
            alert(err);
        }
    );
}

//Utility Functions
function extractItemId(displayName){
    var queryString = $('div[data-displayName="' + displayName + '"] a').attr('href').split('?')[1],
        qObject = {};
    queryString.split('&').map(function (pair) {  pair = pair.split('='); qObject[pair[0]] = pair[1]; });
    return qObject.ID;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeHorizontal(html){
    var firstRow = html.find('tbody tr:first-of-type');
    html.find('tbody tr:not(:first-of-type)').each(function(){
        $(this).contents().appendTo(firstRow);
    });
    firstRow.contents().css('padding-right','15px');
    return html;
}

function reorientContents(orientation,contents){
    if(orientation == 'horizontal') {
        return makeHorizontal(contents);
    } else if(orientation.indexOf('columns') > -1 ){
        
    }
}
