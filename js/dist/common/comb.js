define("dist/common/dialog/dialog", [ "lib/jquery/jquery/1.8.2/jquery", "./dialog_css.css" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery/1.8.2/jquery");
    require("./dialog_css.css");
    function Dialog(content, options) {
        Dialog.__zindex = 9e3;
        Dialog.__count = 1;
        var defaults = {
            // 默认值。 
            title: "",
            // 标题文本，若不想显示title请通过CSS设置其display为none 
            showTitle: true,
            // 是否显示标题栏。
            closeText: "[关闭]",
            // 关闭按钮文字，若不想显示关闭按钮请通过CSS设置其display为none 
            draggable: true,
            // 是否移动 
            modal: true,
            // 是否是模态对话框 
            center: true,
            // 是否居中。 
            fixed: true,
            // 是否跟随页面滚动。
            time: 0,
            // 自动关闭时间，为0表示不会自动关闭。 
            id: false
        };
        var options = $.extend(defaults, options);
        options.id = options.id ? options.id : "dialog-" + Dialog.__count;
        // 唯一ID
        var overlayId = options.id + "-overlay";
        // 遮罩层ID
        var timeId = null;
        // 自动关闭计时器 
        var isShow = false;
        var isIe = $.browser.msie;
        var isIe6 = $.browser.msie && "6.0" == $.browser.version;
        var wrap = {
            width: $(window).width() + $(document).scrollLeft(),
            height: $(document).height()
        };
        /* 对话框的布局及标题内容。*/
        var barHtml = !options.showTitle ? "" : '<div class="bar"><span class="title">' + (options.title === "" || options.title === false ? "" : options.title) + '</span><a class="close">' + options.closeText + "</a></div>";
        var theDialog = $('<div id="' + options.id + '" class="dialog">' + barHtml + '<div class="Dcontent"></div></div>').hide();
        $("body").append(theDialog);
        /**
         * 重置对话框的位置。
         *
         * 主要是在需要居中的时候，每次加载完内容，都要重新定位
         *
         * @return void
         */
        this.resetPos = function() {
            /* 是否需要居中定位，必需在已经知道了dialog元素大小的情况下，才能正确居中，也就是要先设置dialog的内容。 */
            if (options.center) {
                var width = $(".Dcontent", theDialog).outerWidth();
                /*
                var imgwidth = $("img", theDialog).width();
                if (imgwidth) {
                    if (width < imgwidth) {
                        width = imgwidth;
                    }
                } else {
                    if (width < 200) {
                        width = 200;
                    }
                }

                if (width < 200) {
                      width = 200;
                }*/
                theDialog.css("width", width);
                var left = ($(window).width() - theDialog.width()) / 2;
                var top = ($(window).height() - theDialog.height()) / 2;
                if (top < 0) {
                    top = 0;
                }
                if (!isIe6 && options.fixed) {
                    theDialog.css({
                        top: top,
                        left: left
                    });
                } else {
                    theDialog.css({
                        top: top + $(document).scrollTop(),
                        left: left + $(document).scrollLeft()
                    });
                }
            }
        };
        /**
         * 初始化位置及一些事件函数。
         *
         * 其中的this表示Dialog对象而不是init函数。
         */
        var init = function() {
            /* 是否需要初始化背景遮罩层 */
            if (options.modal) {
                $("body").append('<div id="' + overlayId + '" class="dialog-overlay"></div>');
                $("#" + overlayId).css("width", wrap.width).css("height", wrap.height).css("z-index", ++Dialog.__zindex);
                $("#" + overlayId).css({
                    left: 0,
                    top: 0,
                    position: "absolute"
                }).hide();
            }
            theDialog.css({
                "z-index": ++Dialog.__zindex,
                position: options.fixed ? "fixed" : "absolute"
            });
            /*  IE6 兼容fixed代码 */
            if (isIe6 && options.fixed) {
                theDialog.css("position", "absolute");
                // resetPos();
                $(window).scroll(function() {
                    var dia = {
                        top: $(document).scrollTop() + $(window).height() / 2 - theDialog.height() / 2 + "px",
                        left: $(document).scrollLeft() + $(window).width() / 2 - theDialog.outerWidth() / 2 + "px"
                    };
                    theDialog.css({
                        top: dia.top,
                        left: dia.left
                    });
                });
            }
            /* 以下代码处理框体是否可以移动 */
            var mouse = {
                x: 0,
                y: 0
            };
            function moveDialog(event) {
                var e = window.event || event;
                var top = parseInt(theDialog.css("top")) + (e.clientY - mouse.y);
                var left = parseInt(theDialog.css("left")) + (e.clientX - mouse.x);
                theDialog.css({
                    top: top,
                    left: left
                });
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }
            theDialog.find(".bar").mousedown(function(event) {
                if (!options.draggable) {
                    return;
                }
                var e = window.event || event;
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                $(document).bind("mousemove", moveDialog);
            });
            $(document).mouseup(function(event) {
                $(document).unbind("mousemove", moveDialog);
            });
            /* 绑定一些相关事件。 */
            theDialog.find(".close").bind("click", this.close);
            theDialog.bind("mousedown", function() {
                theDialog.css("z-index", ++Dialog.__zindex);
            });
            // 自动关闭 
            if (0 != options.time) {
                timeId = setTimeout(this.close, options.time);
            }
        };
        /**
         * 设置对话框的内容。 
         *
         * @param string c 可以是HTML文本。
         * @return void
         */
        this.setContent = function(c) {
            var div = theDialog.find(".Dcontent");
            var width = c.width ? c.width : "", height = c.height ? c.height : "";
            var that = this;
            if ("object" == typeof c) {
                switch (c.type.toLowerCase()) {
                  case "id":
                    // 将ID的内容复制过来，原来的还在。
                    div.append($("#" + c.value));
                    $("#" + c.value).css("display", "block");
                    break;

                  case "img":
                    div.html("加载中...");
                    $('<img alt="" />').load(function() {
                        div.empty().append($(this));
                        that.resetPos();
                    }).attr("src", c.value);
                    break;

                  case "url":
                    div.html("加载中...");
                    $.ajax({
                        url: c.value,
                        success: function(html) {
                            div.html(html);
                            that.resetPos();
                        },
                        error: function(xml, textStatus, error) {
                            div.html("出错啦");
                        }
                    });
                    break;

                  case "iframe":
                    div.append($('<iframe src="' + c.value + '" width=' + width + " height=" + height + " />"));
                    break;

                  case "text":
                  default:
                    !!width && div.width(width);
                    !!height && div.height(height);
                    div.html(c.value);
                    break;
                }
            } else {
                div.html(c);
            }
        };
        /**
         * 显示对话框
         */
        this.show = function() {
            $("select").css({
                visibility: "hidden"
            });
            if (undefined != options.beforeShow && !options.beforeShow()) {
                return;
            }
            /**
             * 获得某一元素的透明度。IE从滤境中获得。
             *
             * @return float
             */
            /* 是否显示背景遮罩层 */
            if (options.modal) {
                $("#" + overlayId).css("display", "block");
            }
            theDialog.css("display", "block");
            if (undefined != options.afterShow) {
                options.afterShow();
            }
            isShow = true;
            // 自动关闭 
            if (0 != options.time) {
                timeId = setTimeout(this.close, options.time);
            }
            this.resetPos();
        };
        /*
         * 隐藏对话框。但并不取消窗口内容。
         */
        this.hide = function() {
            if (!isShow) {
                return;
            }
            if (undefined != options.beforeHide && !options.beforeHide()) {
                return;
            }
            theDialog.css("display", "none");
            if (undefined != options.afterHide) {
                options.afterHide();
            }
            if (options.modal) {
                $("#" + overlayId).css("display", "none");
            }
            isShow = false;
        };
        /**
         * 关闭对话框 
         *
         * @return void
         */
        this.close = function(e, real) {
            $("select").css({
                visibility: "visible"
            });
            if (undefined != options.beforeClose && !options.beforeClose()) {
                return;
            }
            if (!real) {
                theDialog.find(".Dcontent:eq(0)").appendTo("body").css("display", "none");
            }
            theDialog.remove();
            isShow = false;
            if (undefined != options.afterClose) {
                options.afterClose();
            }
            if (options.modal) {
                $("#" + overlayId).css("display", "none").remove();
            }
            clearTimeout(timeId);
        };
        this.resetOverlay = function() {
            $("#" + overlayId).css({
                width: $(window).width() + $(document).scrollLeft(),
                height: $(document).height(),
                left: 0,
                top: 0
            });
        };
        init.call(this);
        this.setContent(content);
        Dialog.__count++;
        Dialog.__zindex++;
    }
    module.exports = Dialog;
});
define("dist/common/dialog/dialog_css-debug.css", [], function() {
    seajs.importStyle('@charset "utf-8";.dialog-overlay{opacity:.5;filter:alpha(opacity:50);background:#ccc;width:100%;height:100%}.dialog{border-radius:0;-moz-border-radius:0;-webkit-border-radius:0;padding:5px;background:url(http://cache.house.sina.com.cn/esalesleju/v2/common/popup/bg01.png);_background:none #c6c6c6}.dialog_inner{float:left;border:1px solid #ACACAC;background:#FFF}.dialog .bar{position:relative;cursor:move;height:31px;line-height:31px;padding:0 10px;border:1px solid #FFF;background:url(http://cache.house.sina.com.cn/esalesleju/v2/common/popup/bg02.png);overflow:hidden}.dialog .bar .title{float:left;white-space:nowrap;font-weight:700;color:#5a5a5a}.dialog .bar .close{color:#fff;cursor:pointer;text-decoration:none;text-indent:-9999px;z-index:10;float:right;display:inline;margin:5px 0;width:20px;height:20px;overflow:hidden;background:url(http://cache.house.sina.com.cn/esalesleju/v2/common/popup/bg02.png) 0 -32px}.dialog .Dcontent{float:left;padding:0;background:#fff;border:1px solid #FFF;border-top:0}.dialog .Dcontent iframe{float:left;vertical-align:bottom}');
});
define("dist/common/dialog/dialog_css.css", [], function() {
    seajs.importStyle('@charset "utf-8";.dialog-overlay{opacity:.5;filter:alpha(opacity:50);background:#ccc;width:100%;height:100%}.dialog{border-radius:0;-moz-border-radius:0;-webkit-border-radius:0;padding:5px;background:url(http://cache.house.sina.com.cn/esalesleju/v2/common/popup/bg01.png);_background:none #c6c6c6}.dialog_inner{float:left;border:1px solid #ACACAC;background:#FFF}.dialog .bar{position:relative;cursor:move;height:31px;line-height:31px;padding:0 10px;border:1px solid #FFF;background:url(http://cache.house.sina.com.cn/esalesleju/v2/common/popup/bg02.png);overflow:hidden}.dialog .bar .title{float:left;white-space:nowrap;font-weight:700;color:#5a5a5a}.dialog .bar .close{color:#fff;cursor:pointer;text-decoration:none;text-indent:-9999px;z-index:10;float:right;display:inline;margin:5px 0;width:20px;height:20px;overflow:hidden;background:url(http://cache.house.sina.com.cn/esalesleju/v2/common/popup/bg02.png) 0 -32px}.dialog .Dcontent{float:left;padding:0;background:#fff;border:1px solid #FFF;border-top:0}.dialog .Dcontent iframe{float:left;vertical-align:bottom}');
});
/**
 * Created by Administrator on 15-9-2.
 */
define("dist/common/util/util", [], function(require, exports, module) {
    console.log("hello, this is util.js");
});