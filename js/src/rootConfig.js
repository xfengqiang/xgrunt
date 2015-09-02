seajs.config({
    base : "../../js/",
    vars: {
        'env': 'prod'
    },
    alias:{
        "jquery":"lib/jquery/jquery/1.8.2/jquery",
        /*弹窗*/
        "dialog": "src/common/dialog/dialog"
    },
    debug:1
});

var appConfig = {
    env : "prod", //dev|prod
    pkgType : "comb" //types: page|comb|aio
};