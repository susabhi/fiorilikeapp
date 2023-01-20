sap.ui.define([
    'com/emc/fin/ap/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController, MessageBox, MessageToast, Fragment,Filter,FilterOperator) {
    'use strict';
    return BaseController.extend("com.emc.fin.ap.controller.View2", {
        onInit: function () {
        this.oRouter= this.getOwnerComponent().getRouter();
        this.oRouter.getRoute("superman").attachMatched(this.herculis,this);
        },

        herculis:function(oEvent){   // route match handler function 
            
            var fruitId= oEvent.getParameter("arguments").fruitID;
            var sPath = '/' + fruitId;
            this.getView().bindElement(sPath, {
                expand: 'To_Supplier'
            });
        },

        onBack: function () {
            this.getView().getParent().to("idView1");
        },
        onSave: function () {
            var oResourceModel = this.getView().getModel("i18n");
            var oBundle = oResourceModel.getResourceBundle();
            var msgSuccess = oBundle.getText('msgSuccess', ["858585"]);
            var msgError = oBundle.getText('msgError');


            MessageBox.confirm(
                "Do you want  to save?", {
                icon: MessageBox.Icon.INFORMATION,
                title: "Confirmation",
                onClose: function (status) {
                    if (status === "OK") {
                        MessageToast.show(msgSuccess);
                    }
                    else {
                        MessageBox.error(msgError);
                    }
                }
            });


        },

        oPopupSupplier: null, //(take a global variable for dynamic fragment only)

        onFilter: function () {

            var that = this;  // we cannot use this into callback or promise function
            if (!this.oPopupSupplier) {
                Fragment.load({
                    name: 'com.emc.fin.ap.fragments.popup',
                    id: 'supplier',
                    controller: this
                }).then(function (oFragment) {
                    that.oPopupSupplier = oFragment;
                    that.oPopupSupplier.setTitle("Suppliers List");
                    //grant the access of the fragment from view to the model
                    that.getView().addDependent(that.oPopupSupplier);

                    // syntax or bind aggregation
                    that.oPopupSupplier.bindAggregation("items", {
                        path: "fruit>/suppliers",
                        template: new sap.m.ObjectListItem({
                            title: '{fruit>name}',
                            intro: '{fruit>sinceWhen}',
                            number: '{fruit>contactNo}'
                        })
                    });
                    that.oPopupSupplier.open();
                });
            } else {
                this.oPopupSupplier.open();
            }
        },

        oCityPopup: null,   // global variable
        oField: null,
        onF4Help: function (oEvent) {
            // MessageBox.alert("This section is under maintenance");
            this.oField= oEvent.getSource();
            var that = this;  // we cannot use this into callback or promise function
            if (!this.oCityPopup) {
                Fragment.load({
                    name: 'com.emc.fin.ap.fragments.popup',
                    id: 'city',
                    controller: this
                }).then(function (oFragment) {
                    that.oCityPopup = oFragment;
                    that.oCityPopup.setTitle("Suppliers List");
                    that.oCityPopup.setMultiSelect(false);
                    //grant the access of the fragment from view to the model
                    that.getView().addDependent(that.oCityPopup);

                    // syntax or bind aggregation
                    that.oCityPopup.bindAggregation("items", {
                        path: "fruit>/cities",
                        template: new sap.m.ObjectListItem({
                            title: '{fruit>name}',
                            intro: '{fruit>famousFor}',
                            number: '{fruit>otherName}'
                        })
                    });
                    that.oCityPopup.open();
                });
            } else {
                this.oCityPopup.open();
            }
        },

        onConfirmPopup: function(oEvent){
            var sId= oEvent.getSource().getId();
            if (sId.indexOf("city")!=-1){
            var oSelectedItemObject = oEvent.getParameter("selectedItem");
            var sText= oSelectedItemObject.getTitle();
            this.oField.setValue(sText);
        }else{
           
          var aItems=  oEvent.getParameter("selectedItems");  
         
          var aFilter= [];
          // Loop over those items & get the data for each item
            for(let i=0; i<aItems.length; i++){
                const element= aItems[i];
                // get the title of the supplier
                var sTitle = element.getTitle();
                //construct the filter object
                var oFilter =  new Filter("name", FilterOperator.EQ, sTitle);
              
                aFilter.push(oFilter);
                
            }
            // create a filter object with or creation
            var oFinalFilter= new Filter({
                filters: aFilter,
                and: false
            });
            this.getView().byId('idTable').getBinding("items").filter(oFinalFilter);
            
        }
        },
        onCancel: function () {

        },
        onSearchDialog:function(oEvent){
          // get the value entered into the search field
            var sVal= oEvent.getParameter("value");
            // get the id of source or fragment
            var sId= oEvent.getSource().getId();
            // condition for checking the id of fragment
            if (sId.indexOf("supplier")!=-1){
                // create the filter object
            var oFilter= new Filter("name", FilterOperator.Contains, sVal);
            // inkjet filter for binding of items
            oEvent.getSource().getBinding("items").filter(oFilter);
        }else{
            var oFilter= new Filter("otherName", FilterOperator.Contains, sVal);
            oEvent.getSource().getBinding("items").filter(oFilter);
        }

        },

        onItemPressSupp: function(oEvent){
            debugger;
            var sPath= oEvent.getParameter("listItem").getBindingContextPath();
            var sIndex= sPath.split("/")[sPath.split("/").length-1];
                
            this.oRouter.navTo("ironman",{
                suppId : sIndex
            });
        }

    });
});
