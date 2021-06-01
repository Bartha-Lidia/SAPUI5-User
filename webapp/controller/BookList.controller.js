sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/odata/v2/ODataModel'

], function (Controller, ODataModel) {
    "use strict";

    return Controller.extend("org.ubb.books.controller.BookList", {
        onInit: function () {
            let oModel, oView;

            oModel = new ODataModel("/sap/opu/odata/SAP/Z801_LIBRARY1_LIBA_SRV/", {
                json: true,
                defaultCountMode: "Inline",
            });
            oView = this.getView();
            oView.setModel(oModel);
        },

        onBeforeExport: function (oEvt) {
            const mExcelSettings = oEvt.getParameter("exportSettings");
            mExcelSettings.worker = false;
        },

        checkout: function (oEvent) {
            const oDataModel = this.getView().getModel();
            const path = oEvent.getSource().getBindingContext().getPath()
            const book = oEvent.getSource().getBindingContext().getObject();
            if (book.NrAvailableBook === 0)
                sap.m.MessageToast.show("This Book is not available at the moment.");
            else {
                book.NrAvailableBook = book.NrAvailableBook - 1;
                oDataModel.update(path, book);
                const oDataModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/SAP/Z801_LIBRARY2_LIBA_SRV/")
                const oData = {};
                const today = new Date();
                let dd = today.getDate();
                let mm = today.getMonth() + 1;
                let mm1 = today.getMonth() + 2;
                const yyyy = today.getFullYear();
                if(dd<10) {
                    dd='0'+dd
                }

                if(mm<10) {
                    mm='0'+mm
                }

                if(mm1<10) {
                    mm1='0'+mm1
                }

                let hour = today.getHours();
                let minutes = today.getMinutes();
                let seconds = today.getSeconds();
                if(hour<10) {
                    hour='0'+hour
                }
                if(minutes<10) {
                    minutes='0'+minutes
                }
                if(seconds<10) {
                    seconds ='0'+seconds
                }
                oData.DateOfCheckout = yyyy + "-" + mm + "-" + dd + "T" + hour + ":" + minutes + ":" + seconds;
                oData.DateOfReturn = yyyy + "-" + mm1 + "-" + dd + "T" + hour + ":" + minutes + ":" + seconds;
                oData.FirstName = "";
                oData.LastName = "";
                oData.Username = "";
                oData.Isbn = book.Isbn;
                oData.Title = book.Title;
                oData.Author = book.Author;

                oDataModel1.create("/Borrows", oData, {
                        success: function (data) {
                            sap.m.MessageToast.show("Book checked out successfully.");
                        },
                        error: function (e) {
                            sap.m.MessageToast.show("An error appeared when checking out the book.");
                        }
                    }
                );
            }
        }
    });
});
