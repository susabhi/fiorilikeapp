sap.ui.define([
    'com/emc/fin/ap/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController,Filter,FilterOperator) {
    'use strict';
    return BaseController.extend("com.emc.fin.ap.controller.View1",{
        onInit: function(){
            this.oRouter= this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("superman").attachMatched(this.herculis,this);
           
        },
        herculis:function(oEvent){   // route match handler function 
            
            var fruitId= oEvent.getParameter("arguments").fruitID;
            var sPath = '/' + fruitId;
            var oList= this.getView().byId("idMylist");
            // get all items of list
            var aItems=  oList.getItems();
            //loop over them
            for(let i=0; i<aItems.length; i++){
                const element = aItems[i];
                if(element.getBindingContextPath()===sPath){
                    var oItemObject = element;
                    break;
                }
            }
            oList.setSelectedItem(oItemObject); 
        },

        onNext:function(myFruitId){
            this.oRouter.navTo("superman",{
                fruitID : myFruitId
            });
          
            //step 1 : get the app contoller container object - mother object 
           // var oCurrentView = this.getView();
           // var oAppCon = oCurrentView.getParent();

            // step 2 : we can use to (function) to navigate between views
            //oAppCon.to("idView2");
        },
       

        onSearch: function(oEvent){

            var sVal= oEvent.getParameter("query");
            if(!sVal){
             sVal= oEvent.getParameter("newValue");
            }
            var oFilter1= new Filter("CATEGORY", FilterOperator.Contains, sVal);
            // var oFilter2= new Filter("type", FilterOperator.Contains, sVal);
            // var aFilter= [oFilter1,oFilter2];
            // var oFilter= new Filter({
            //     filters: aFilter,
            //     and: false
            // });
            this.getView().byId('idMylist').getBinding("items").filter(oFilter1);
        },

        onItemDelete:function(oEvent){
            // Step 1 : object of the item to be deleted from event parameters
            var oItemToBeDeleted = oEvent.getParameter("listItem");
            //step 2: print the data
            console.log(oItemToBeDeleted.getTitle()+ " will be deleted");
            //step 3: get object of list control
            //var oList= this.getView().byId("idMylist");
            var oList= oEvent.getSource();
            //step 4: delete the item from the list
            oList.removeItem(oItemToBeDeleted);
        },

        onItemSelect: function(oEvent){
            
            // step 1  : get the path of selected control inside the list item
                var sPath= oEvent.getParameter("listItem").getBindingContextPath();
                // step 2 : get the view object (codes for app container )
                // var oAppcon = this.getView().getParent();

                // var oV2= oAppcon.getPages()[1];

               // step 2 : codes for splitapp container 
              // var oV2 = this.getView().getParent().getParent().getDetailPage("idView2");
                // get the element bind with whole of V2
              //  oV2.bindElement(sPath);
                // use navigation to move to next page 
                //oAppcon.to("idView2");   [use this code or beow function]
                var myId= sPath.split("/")[sPath.split("/").length-1];
                 this.onNext(myId);
                 
        },

        onItemsDelete: function(){
            var oList= this.getView().byId("idMylist");
            var aSelectedItems= oList.getSelectedItems();
           
            aSelectedItems.forEach(element=>{
                oList.removeItem(element); 

            });
        },

        onAdd:function(){
        this.oRouter.navTo("addView");
        }

    
        });
    });

