window.onload = function () {
    guide.init();
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

        $(".popupLogout").click(function (e) {
            window.sessionStorage.removeItem("nm_user");
            window.sessionStorage.removeItem("no_user");
            location.replace("/");
        });

        $(".navigationName").click(function (e) {
            location.href = "/Trainee/Index";
        })

        $(".backToIndex").click(function (e) {
            location.href = "/Trainee/Index";
        })

        $(".joiningBtn").click(function (e) {
            location.href = "/Trainee/Receipt?no_training=" + Tools.getUrl().no_training;
        })
    }
};

var guide = {
    init: function () {

        var data = {
            "no_training": Tools.getUrl().no_training
        };

        Tools.clickInit();

        this.trainingDetailsAjax(data);

    },
    trainingDetailsAjax: function (data) {

        //登録状態
        if (window.sessionStorage.getItem("nm_user")) {
            $(".navigationUserName").text(window.sessionStorage.getItem("nm_user"));
        } else {
            //登録されてない状態、ログイン画面に戻す
            window.location.replace("/");
        }

        var _this = this;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/Trainee/SelectTrainingDetails",
            data: data,
            success: function (res) {

                if (res.status == "200") {
                    _this.dataFormat(res);
                }
            },
            error: function (err) {
                alert(err);
            }
        })
    },
    dataFormat: function (res) {

        $(".training_name").text(res.data[0].nm_training);
        $(".training_code").text(res.data[0].cd_training);
        $(".teacher_name").text(res.data[0].nm_teacher);
        $(".training_money").text(Tools.fmoney(res.data[0].kin_training) + "円");
        $(".training_venue").text(res.data[0].nm_venue);
        $(".training_details").text(res.data[0].nm_content);

    }
}
