window.onload = function() {
    //初始化页面的一些点击事件
    Tools.clickInit();
}

var Tools = {
    //获取url中的参数
    getUrl: function() {
        var url = decodeURI(decodeURI(location.search));
        var num = url.indexOf("?");
        var theRequest = new Object();
        if (num != -1) {
            var str = url.substr(Number(num) + 1);
            strs = str.split("&");
            for (var i = 0, l = strs.length; i < l; i++) {
                var urlArr = strs[i].split("=");
                theRequest[urlArr[0]] = (urlArr[1]);
            }
        }
        return theRequest;
    },
    //将金额转换为钱的显示
    fmoney: function(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse();
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("");
    },
    //初始化一些页面上的点击事件
    clickInit: function() {
        $(".navigationBtn").click(function(e){
            $(".popupWindow").css("display","flex");
        });

        $(".popupClose").click(function(e){
            $(".popupWindow").hide();
        });

        $(".popupBack").click(function(e){
            $(".popupWindow").hide();
        });


        $(".popupLogout").click(function(e){
            location.replace("login.html");
        });

        $(".navigationName").click(function(e){
            location.href = "TrainingIndex.html";
        })

        $(".backToIndex").click(function(e){
            location.href = "TrainingIndex.html";
        })

        $(".joiningBtn").click(function(e){
            location.href = "receipt.html?no_training=" + Tools.getUrl().no_training;
        })
    }
};
