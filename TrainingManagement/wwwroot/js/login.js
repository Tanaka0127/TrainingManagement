"use strict";
window.onload = function () {
    login.init();

    $("html").on("keydown", function (o) {
        if (13 == o.keyCode) {
            login.checkFormat();
        }
    });
}

var login = {
    init: function () {

        $(".login_input").val("");
        $(".password_input").val("");

        window.sessionStorage.clear();

        this.clickInit();
    },
    checkFormat: function () {
        $(".hit").empty();

        var user_id = $(".login_input").val().trim();
        var password = $(".password_input").val().trim();

        if (0 == user_id.length && 0 == password.length) {
            this.hitMsg("ユーザーIDとパスワードを入力してください");
        } else if (0 == user_id.length) {
            this.hitMsg("ユーザーIDを入力してください");
        } else if (0 == password.length) {
            this.hitMsg("パスワードを入力してください")
        } else {
            var user_data = {
                "user_id": user_id,
                "password": password
            };

            this.getLogin(user_data);
        }
    },
    hitMsg: function (msg) {
        $(".hit").append('<span>' + msg + '</span>');
    },
    getLogin: function (user_data) {

         $.ajax({
             type: "post",
             dataType: "json",
             url: "/Login/DoLogin",
             data: user_data,
             success: function (res) {
                 console.log(res);

                 if (res.status == "200") {

                     window.sessionStorage.setItem("no_user", res.data[0].no_user);
                     window.sessionStorage.setItem("nm_user", res.data[0].nm_user);

                     login.toIndexPage(res.data[0].flg_user);
                 } else {
                     $(".hit").append('<span>ユーザーID、パスワードに誤りがないか、もう一度ご確認ください</span>');
                 }
             },
             error: function (err) {
                 alert(err);
             }
         })
    },
    toIndexPage: function (flg) {
        if (flg == 0) {
            location.href = "/Trainee/Index";
        } else if (flg == 1) {

        } else {

        }
    },
    clickInit: function () {
        $(".user_name").on("click", function () {
            $(".login_input").focus()
        });

        $(".password").on("click", function () {
            $(".password_input").focus()
        });

        $(".login_input").blur(function () {
            var o = $(this).parent(".user_name");
            o.css("border", "1px solid rgba(206, 206, 206, 1)");
        });

        $(".password_input").focus(function () {
            var o = $(this).parent(".password");
            o.css("border", "1px solid #00ABEE");
        });

        $(".login_input").focus(function () {
            var o = $(this).parent(".user_name");
            o.css("border", "1px solid #00ABEE");
        });


        $(".password_input").blur(function () {
            var o = $(this).parent(".password");
            o.css("border", "1px solid rgba(206, 206, 206, 1)");
        });

        $(".btn").on("click", function () {
            login.checkFormat()
        });

        $(".login_input").bind("input propertychange", function (e) {
            var value = $(this).val();
            value = value.replace(/[^\w_.]/g, '');
            $(this).val(value);
        });

        $(".password_input").bind("input propertychange", function (e) {
            var value = $(this).val();
            value = value.replace(/[^\w_.]/g, '');
            $(this).val(value);
        });
    }
};