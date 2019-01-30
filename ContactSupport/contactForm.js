function initForm(page){
    if(page.indexOf('newform.aspx') > -1){
        //Rackley the form.
        doFormFields();

        //Sets the event listener on the Category field.
        document.querySelector('select[id^="Category"]').addEventListener('change',checkCategory);
        
        //Silently sets the SiteUrl field.
        setSiteUrlField();

        //Lights up the buttons.
        var b = document.querySelectorAll('.ms-Button');
        for (var i = 0; i < b.length; i++) {
            new fabric['Button'](b[i], actionHandler);
        }

        doFormButtons();
    }else{
        //Rackley the form.
        doFormFields();
    }
}

function actionHandler(){
    showNode('stageThree',false);
    showNode('complete',false);
    showNode('information',false);
    showNode('fail', false);
    if(this.id == "yes"){
        showNode('stageThree',true);
        showNode('complete',true);
        document.querySelector('span.formSave').classList.add('hidden');
        document.querySelector('input[type="button"][value="Cancel"]').value = 'Close';
    }else if(this.id == "no"){
        showNode('fail', true);
        showNode('information',true);
        document.getElementById('title').innerText = 'Please provide a title for your issue:';
        document.getElementById('descriptionText').innerText = 'Describe the issue, in detail, providing links and screenshots where appropriate:';
        showNode('stageThree',true);
    }
}

function checkCategory(){
    //Resets the form on category change. 
    resetForm();

    var titleText = document.getElementById('title'),
        titleField = document.querySelector('input[id^="Title"]');
        descriptionText = document.getElementById('descriptionText');

    switch(this.value){
        case "Access/Permission Issue":
            showNode('access',true);
            showNode('check',true);
            break;

        case "Site/Content Move":
            showNode('information',true);
            var date = new Date().toString('MM/dd/yyyy');
            titleField.value = date + ' - Content Move Request';
            descriptionText.innerText = "In the space below, please describe what content you'd like moved and where you would like us to move it.";
            showNode('stageThree',true);
            break;

        case "ISPAN":
            showNode('ispan',true);
            showNode('check',true);
            break;

        case "Document Check In/Out Issue":
            showNode('document',true);
            showNode('check',true);
            break;

        case "Storage Limit or Document Upload Error":
            showNode('storage',true);
            showNode('check',true);
            break;

        case "Question/Training Request":
            showNode('question',true);
            showNode('check',true);
            break;

        case "Help with Customization":
            showNode('customization', true);
            showNode('check', true);
            break;

        case "New Site Request":
            showNode('newSite', true);
            showNode('check', true);
            break;

        default:
            document.getElementById('title').innerText = 'Please provide a short description of your issue.';
            document.getElementById('descriptionText').innerHTML = '<p>In the space below, please provide as much detail as possible about what you are experiencing.<p>';
            document.getElementById('descriptionBumper').innerHTML += '<p>Someone from the support team will reach out to you shortly.</p>';
            showNode('information', true);
            showNode('stageThree', true);
            break;
    }
}

function resetForm(){
    
    //Hides the stage one text blocks.
    var stageOne = document.getElementById('stageOne'),
        textNodes = stageOne.querySelectorAll('div.stageBlock');
    for(var i = 0;i<textNodes.length;i++){
        showNode(textNodes[i].getAttribute('id'),false);
    }

    //Resets the title and description text (if there) and clears the title field's value.
    document.getElementById('title').innerText = '';
    document.getElementById('descriptionText').innerText = '';
    document.querySelector('input[id^="Title"]').value = '';

    //Hides the information block.
    showNode('information',false);
    showNode('complete',false);
    showNode('fail',false);
}

function showNode(node,state){
    if(state){
        document.getElementById(node).classList.remove('hidden');
    }else{
        document.getElementById(node).classList.add('hidden');
    }
}

function setSiteUrlField() {
    var title = window.parent._spPageContextInfo.webTitle,
        url = window.parent._spPageContextInfo.webAbsoluteUrl;

    document.querySelector('input[id^="SiteURL"][id$="UrlFieldUrl"]').value = url;
    document.querySelector('input[id^="SiteURL"][id$="UrlFieldDescription"]').value = title;
}
