sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("com.emc.fin.ap.Component",{
        metadata: {
            manifest: "json"
        },
        init : function(){
            //UIComponent is the base class, here we will call base class constructor
            //super->constructor() --- ABAP
            UIComponent.prototype.init.apply(this);
             //get the router object from base class
             var oRouter = this.getRouter();
             //Call initialize - it will look manifest json for configuration
             oRouter.initialize();
        },
       
        destroy: function(){

        }
    });
});