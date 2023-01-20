sap.ui.define([
    'com/emc/fin/ap/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",

], function (BaseController, JSONModel, MessageBox, MessageToast) {
    'use strict';
    return BaseController.extend("com.emc.fin.ap.controller.Add", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("addView").attachMatched(this.herculis, this);

            this.oLocalModel = new JSONModel(); //making this.LocalMOdel as a global variable instead of taking var oModel
            this.oLocalModel.setData({
                "prodData": {
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "PR",
                    "CATEGORY": "Notebooks",
                    "NAME": "",
                    "DESCRIPTION": "",
                    "SUPPLIER_ID": "0100000051",
                    "SUPPLIER_NAME": "TECUM",
                    "TAX_TARIF_CODE": "1",
                    "MEASURE_UNIT": "EA",
                    "PRICE": "0.00",
                    "CURRENCY_CODE": "EUR",
                    "DIM_UNIT": "CM",
                    "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/NV-2022.jpg"
                }
            });
            this.getView().setModel(this.oLocalModel, "prod");
        },
        herculis: function (oEvent) { // route match handler function 
            this.setMode("Create");
        },

        mode: "Create",

        setMode: function (sMode) {

            this.mode = sMode;
            if (this.mode === "Create") {
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("prodId").setEnabled(true);
                this.getView().byId("idDelete").setEnabled(false);
            } else {
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("prodId").setEnabled(false);
                this.getView().byId("idDelete").setEnabled(true);
            }
        },
        productId: "",
        onEnter: function (oEvent) {
            //step 1: get the value entered by user on input field
            this.productId = oEvent.getParameter("value");
            // step 2: get the oData Model Object
            var oDataModel = this.getView().getModel();
            //step 3: call the sap odata to call single product
            // we need to create a local variable which holds this object 
            var that = this;
            //Get request
            oDataModel.read("/ProductSet('" + this.productId + "')", {
                success: function (data) {
                    that.oLocalModel.setProperty("/prodData", data);
                    that.setMode("Update");
                },
                error: function (oError) {
                    MessageToast.show("Product not found, please create it");
                    that.setMode("Create");
                }

            });

        this.getImageForProduct(this.productId, oDataModel);

        },

        getImageForProduct:function(sProdId, oDataModel){
        this.getView().byId("MyImage").setSrc("/sap/opu/odata/sap/ZNOV_ODATA_SRV/ProductImgSet('"+ sProdId +"')/$value");
        },


        onClear: function () {
            //var oModel= this.getView().getModel("prod");
            // as we are taking global variable so we don't need to take above line
            this.setMode("Create");
            this.oLocalModel.setProperty("/prodData", {
                "PRODUCT_ID": "",
                "TYPE_CODE": "PR",
                "CATEGORY": "Notebooks",
                "NAME": "",
                "DESCRIPTION": "",
                "SUPPLIER_ID": "0100000051",
                "SUPPLIER_NAME": "TECUM",
                "TAX_TARIF_CODE": "1",
                "MEASURE_UNIT": "EA",
                "PRICE": "0.00",
                "CURRENCY_CODE": "EUR",
                "DIM_UNIT": "CM",
                "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/NV-2022.jpg"

            })

        },

        onDelete: function () {
            //step 1 : get the VALUE from UI for the product ID
            //var ProductID = this.oLocalModel.getProperty("/prodData/PRODUCT_ID");
            // STEP 2 : Validate - if possible id is empty -error
            if (this.productId === "") {
                MessageBox.error("Please enter a Valid Product ID to delete");
                return;
            }
            // step 3: Get the Odata Model Object 
            var oDataModel = this.getView().getModel();
            // step 4 : Take confirmation from user 
            var that = this;
            MessageBox.confirm("Do you wish to Delete?", {
                onClose: function (status) {
                    if (status === "OK") {
                        var that2= that;
                        oDataModel.remove("/ProductSet('" + that.productId + "')", {
                            success: function () {
                                MessageBox.success("Delete is now done");
                                that2.onClear();
                            }
                        });
                    }
                }
            });
        },

        onSave: function () {
            //step 1 : prepare payloads
            var payload = this.oLocalModel.getProperty("/prodData");

            // step 2: pre checks or validation 
            if (payload.PRODUCT_ID === "") {
                MessageBox.error("Kindly enter the product ID");
                return;
            }
            //step 3 : Get the odata model object
            var oDataModel = this.getView().getModel();
            //step 4: Post this data to backend 
            if (this.mode === "Create") {
                //post request
                oDataModel.create("/ProductSet", payload, {
                    // get the response success and error 
                    success: function (data) {
                        MessageToast.show("Congratualations!! data has been posted successfully!!!");
                    },
                    error: function (oError) {
                        //debugger;

                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    },

                });
            } else {
                // put request
                oDataModel.update("/ProductSet('" + this.productId + "')", payload, {
                    // get the response success and error 
                    success: function (data) {
                        MessageToast.show("Hey Amigo!! data has been updated successfully!!!");
                    },
                    error: function (oError) {
                        //debugger;

                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    },

                });
            }

        },

        onExpensive:function(){

            //ste 1 : get category from the UI

            var category = this.getView().byId("category").getSelectedKey();
            //step 2: get the Odata Model Object 

            var oDataModel = this.getView().getModel();

            //step 3: call function import

            var that=this;
            oDataModel.callFunction("/GetMostExpensiveProduct",{

                urlParameters:{
                    "I_CATEGORY": category
                },
                success:function(data){
                    that.oLocalModel.setProperty("/prodData",data);
                     that.productId=data.PRODUCT_ID;
                    that.setMode("Update");
                }
            })
        }
    




    });
});