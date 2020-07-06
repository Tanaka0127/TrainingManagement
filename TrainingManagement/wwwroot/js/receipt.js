window.onload = function () {

    receipt.init();

    //$(".joiningBtn").attr("class","cantJionBtn");
}

var Tools = {
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
            window.sessionStorage.removeItem("nm_user");
            window.sessionStorage.removeItem("no_user");
            location.replace("/");
        });

        $(".navigationName").click(function(e){
            location.href = "/Trainee/Index";
        })

        $(".backToIndex").click(function(e){
            location.href = "/Trainee/Index";
        })

        $(".detailsMsg").click(function(e){
            location.href = "/Trainee/Guide?no_training=" + Tools.getUrl().no_training;
        })

        $(".joiningBtn").click(function(e){
            
            var type = $(this).data("type");

            if(type == "join"){
                $(".endPopupWindow").css("display","flex");
                $(".endPopupReport").text("参加する");
                $(".endPopupReport").data("type","join");
                
            }else{
                $(".endPopupWindow").css("display","flex");
                $(".endPopupReport").text("取消する");
                $(".endPopupReport").data("type","unjoin");
            }
        })

        $(".endPopupReport").click(function(e){
            var flg = $(this).data("type");

            console.log(flg);
        })

        $(".endPopupBack").click(function(e){
            $(".endPopupWindow").hide();
        })

        $(".endPopupClose").click(function(e){
            $(".endPopupWindow").hide();
        })
    }
};

var receipt = {
    init: function () {

        //登録状態
        if (window.sessionStorage.getItem("nm_user")) {
            $(".navigationUserName").text(window.sessionStorage.getItem("nm_user"));
        } else {
            //登録されてない状態、ログイン画面に戻す
            window.location.replace("/");
        }

        var data = {
            "no_training": Tools.getUrl().no_training,
            "no_user": window.sessionStorage.getItem("no_user")
        };

        this.trainingAjax(data);
    },
    trainingAjax: function (data) {

        var _this = this;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/Trainee/SelectTrainingData",
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
        console.log(res);

        $(".training_name").text(res.data[0].nm_training);
        $(".training_code").text(res.data[0].cd_training);
        $(".teacher_name").text(res.data[0].nm_teacher);
        $(".training_money").text(Tools.fmoney(res.data[0].kin_training) + "円");
        $(".training_venue").text(res.data[0].nm_venue);

        var start_time = res.data[0].dt_starttime.substr(0, 10);
        var now = new Date();
        var now_time = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
        start_time = new Date(start_time).getTime() - (1000 * 60 * 60 * 24 * 3);
        start_time = new Date(start_time);
        now_time = new Date(now_time);

        if (res.data[0].flg_history == 0) {
            $(".joiningBtn").text("取消する");
            $(".joiningBtn").data("type", "cancel");
            $(".joiningBtn").css("background-color", "red");
        } else {
            $(".joiningBtn").data("type", "join");
        }

        if (start_time <= now_time) {
            $(".joiningBtn").attr("class", "cantJionBtn");
        }

        Tools.clickInit();
    }

}
