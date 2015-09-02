var define2 = define("dist/app/index/index-debug", [ "lib/jquery/jquery/1.8.2/jquery-debug", "dist/common/dialog/dialog-debug" ], function(require, exports) {
    var $ = require("lib/jquery/jquery/1.8.2/jquery-debug"), Dialog = require("dist/common/dialog/dialog-debug");
    $("#btnDialog").bind("click", function() {
        var mapDialog = new Dialog({
            type: "text",
            value: "hello world!",
            width: "230px",
            height: "60px"
        });
        mapDialog.show();
    });
});