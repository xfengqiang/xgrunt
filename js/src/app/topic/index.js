/**
 * Created by Administrator on 15-9-2.
 */
define(function (require, exports) {
    var $ = require("jquery"),
        Dialog = require("dialog");
    $("#btnDialog").bind("click", function () {
        var mapDialog = new Dialog({type: "text", value: 'hello this is topic js', width:'230px', height:'60px'});
        mapDialog.show();
    })
});