'use strict';

var server = require('server');
//actionUrl tem que ser igual no isml dele tbm

server.get('faleConosco', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var contactForm = server.forms.getForm('conInfo');//Voltar o frmulario usando o ID do xml
    res.render('/contForm/contactBR', {//isml criado no template
        actionUrl: URLUtils.url('Contact-Subscribe').toString(),//o nme do controler para enviar mensagem
        contactForm:contactForm
    });

    next();
});

//server.post('Subscribe', server.middleware.https, function (req, res, next) {
  //  var Resource = require('dw/web/Resource');
    //var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    //var emailHelper = require('*/cartridge/scripts/helpers/emailHelpers');

    //var myForm = req.form;
    //var customObjMgr = require('dw/object/CustomObjectMgr');
    //customObjMgr.createCustomObject('Newsletter', newsletterForm.contactInfoFields.email.value);

    //var isValidEmailid = emailHelper.validateEmail(myForm.email);
    //if (isValidEmailid) {
      //  var contactDetails = [ myForm.name, myForm.email, myForm.phone];//depois do myForm. colocar o Id

        //res.json({
          //  success: true,
            //msg: Resource.msg('subscribe.to.contact.us.success', 'contactUs', null)
       // });
    /*} else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.to.contact.us.email.invalid', 'contactUs', null)
        });
    }

    next();
});*/
server.post('Subscribe', server.middleware.https, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var contactForm = server.forms.getForm('conInfo');
    var formErrors = require('*/cartridge/scripts/formErrors');

if (contactForm.valid){
    var transaction=require('dw/system/Transaction');
    var customObjMgr = require('dw/object/CustomObjectMgr');
    transaction.wrap(function(){
        var recebe= customObjMgr.createCustomObject('faleconosco', contactForm.email.value);
        /*recebe.custom.Name=contactForm.firstname.value;
        recebe.custom.phone=contactForm.phone.value;
        
        //recebe.custom.Email=contactForm.email.value;*/
        recebe.custom.nome=contactForm.firstname.value;
        recebe.custom.ultimonome=contactForm.lastname.value;
        recebe.custom.comentario=contactForm.comentario.value;
        recebe.custom.tipo=contactForm.issueType.value;
    });
    
    var Site=require('dw/system/Site');
    var recebeObject={
        firstname: contactForm.firstname.value,
        email: contactForm.email.value,
        tipo:contactForm.issueType.value,
        comentario:contactForm.comentario.value,
        url: URLUtils.https('Home-Show')
    };
    var emailObj = {
        to:contactForm.email.value,
        subject:'Solicitacao Enviada com Sucesso',
        from: Site.current.getCustomPreferenceValue('custumerServiceEmail') || 'fale.joanne@gmail.com',
        type: emailHelpers.emailTypes.registration
    };
    
    emailHelpers.send(emailObj,'/contForm/contEmail',recebeObject);
    var emailAnalista = {
        to:Site.current.getCustomPreferenceValue('custumerServiceEmail') || 'grupo4.salesforce@gmail.com',
        subject:'Solicitacao de Contato Com Cliente ',
        from: contactForm.email.value,
        type: emailHelpers.emailTypes.registration
    };
    emailHelpers.send(emailAnalista,'/contForm/contAnalista',recebeObject);
    res.render('/contForm/contactManda', {//isml criado no template
         contactForm:contactForm
    });
    } else {
    res.json({
        success: false,
        fields: formErrors.getFormErrors(contactForm)
    });
}
    return next();
});

module.exports = server.exports();
