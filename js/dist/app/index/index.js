var define2 = define("dist/app/index/index", [ "lib/jquery/jquery/1.8.2/jquery", "dist/common/dialog/dialog" ], function(require, exports) {
    var $ = require("lib/jquery/jquery/1.8.2/jquery"), Dialog = require("dist/common/dialog/dialog");
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