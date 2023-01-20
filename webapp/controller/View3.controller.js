sap.ui.define([
    'com/emc/fin/ap/controller/BaseController',
    "sap/ui/core/routing/History"
], function(BaseController,History) {
    'use strict';
    return BaseController.extend("com.emc.fin.ap.controller.View3",{
        onInit: function(){
            this.oRouter= this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("ironman").attachMatched(this.herculis,this);
           
        },

        herculis:function(oEvent){   // route match handler function 
            
            var suppId= oEvent.getParameter("arguments").suppId;
            var sPath = 'fruit>/suppliers/' + suppId;
            this.getView().bindElement(sPath);
        },
        onBack: function(){
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("spiderman", {}, true);
            }

        },

        onchartchange: function(oEvent){
           var sKey= oEvent.getSource().getSelectedKey();
           this.getView().byId("idVizFrame").setVizType(sKey);
        }
    });
});