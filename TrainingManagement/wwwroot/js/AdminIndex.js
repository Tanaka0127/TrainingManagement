window.onload = function () {
    trainingTable.init();
    Tools.clickInit();
}

var Tools = {
    timeout: null,
    getUrl: function () {
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
    fmoney: function (s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse();
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("");
    },
    messageBox: function (msg) {
        if (this.timeout != null) {
            return;
        }

        $(".messageBox").show();
        $(".messageBox").text(msg);
        this.timeout = setTimeout(function () {
            $(".messageBox").hide();
            Tools.timeout = null;
        }, 3000);
    },
    clickInit: function () {
        $(".navigationBtn").click(function (e) {
            $(".popupWindow").css("display", "flex");
        });

        $(".popupClose").click(function (e) {
            $(".popupWindow").hide();
        });

        $(".popupBack").click(function (e) {
            $(".popupWindow").hide();
        });

        $(".popupLogout").click(function (e) {
            window.sessionStorage.removeItem("nm_user");
            window.sessionStorage.removeItem("no_user");
            location.replace("/");
        });

        $(".endPopupClose").click(function (e) {
            $(".endPopupWindow").hide();
        });

        $(".endPopupBack").click(function (e) {
            $(".endPopupWindow").hide();
        });

        $(".endPopupReport").click(function (e) {
            trainingTable.sendEndReport($(this).data("no"));
        });
    }
};

var trainingTable = {
    gridObj: '',
    init: function () {

        //登録状態
        if (window.sessionStorage.getItem("nm_user")) {
            $(".navigationUserName").text(window.sessionStorage.getItem("nm_user"));
        } else {
            //登録されてない状態、ログイン画面に戻す
            window.location.replace("/");
        }

        trainingTable.gridObj = $.fn.bsgrid.init('test', {
            url: '/Admin/GetTrainingTableData', 
            ajaxType: 'post', 
            pageSize: 9, 
            pageIncorrectTurnAlert: false,
            rowSelectedColor: false,
            otherParames: {

            },
            pagingLittleToolbar: true,
            additionalAfterRenderGrid: function () {
                $("#totalPage").html(trainingTable.gridObj.getTotalPages());
                $("#totalData").html(trainingTable.gridObj.getTotalRows());
            }
        });

        var addHtml = '<td style="text-align:right"><div id="add"><div id="total">全部<span id="totalPage"></span>ページ/<span id="totalData"></span>行' +
            '</div><div id="goPage">第<input class="gotoThePage" type="text">ページ' +
            '<div id="goBtn">GO</div></div></div></td>';

        $('#' + trainingTable.gridObj.options.pagingOutTabId + ' tr:eq(0)').append(addHtml);
        $('#goBtn').click(function () {
            var page = $('#goPage input').val();
            trainingTable.gridObj.gotoPage(page);
        });

        $("#goPage input").bind("input propertychange",function(e){
            var page = trainingTable.gridObj.getTotalPages();

            var value = $("#goPage input").val();

            value = value.replace(/[^\d]/g,'');

            $("#goPage input").val(value);

            if(value == ""){
                return;
            }

            if(value > page){
                $("#goPage input").val(page);
            }else if(value < 1){
                $("#goPage input").val("1");
            }
        });

    },
    operating: function (record, rowIndex, colIndex, options) {

        var flg = trainingTable.gridObj.getRecordIndexValue(record, 'flg_claim');
        if(flg == "0"){
            return '<div class="tableBtn"><div class="trainee" data-no="' + rowIndex + '" onclick="trainingTable.trainee(this)">受講者一覧</div><div class="adminOrder" data-no="' + rowIndex + '" onclick="trainingTable.adminOrder(this)">請求する</div></div>';
        }else{
            return '<div class="tableBtn"><div class="trainee" data-no="' + rowIndex + '" onclick="trainingTable.trainee(this)">受講者一覧</div><div class="orderedTraining">請求済み</div></div>';
        }

    },
    textFlgFormat: function (record, rowIndex, colIndex, options) {
        var flg = trainingTable.gridObj.getRecordIndexValue(record, 'flg_textorder');
        return flg == "0" ? "未発注" : "発注済み";
    },
    claimFlgFormat: function (record, rowIndex, colIndex, options) {
        var flg = trainingTable.gridObj.getRecordIndexValue(record, 'flg_claim');
        return flg == "0" ? "未請求" : "請求済み";
    },
    startDateFormat: function (record, rowIndex, colIndex, options) {
        var date = trainingTable.gridObj.getRecordIndexValue(record, 'dt_starttime');

        return date.substr(0, 10);
    },
    endDateFormat: function (record, rowIndex, colIndex, options) {
        var date = trainingTable.gridObj.getRecordIndexValue(record, 'dt_closetime');

        return date.substr(0, 10);
    },
    trainee: function (dom) {
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var no_training = trainingTable.gridObj.getRecord(rowIndex).no_training;
        

        location.href = "/Admin/Trainee?no_training=" + no_training;
    },
    nameFormat: function (record, rowIndex, colIndex, options) {
        var name = trainingTable.gridObj.getRecordIndexValue(record, 'nm_training');
        if (name.length > 20) {

            name = name.substr(0, 17) + '...';

        }

        return '<span title="' + trainingTable.gridObj.getRecordIndexValue(record, 'nm_training') + '">' + name + '</span>';

    },
    adminOrder: function (dom) {
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var no_training = trainingTable.gridObj.getRecord(rowIndex).no_training;
        var nm_training = trainingTable.gridObj.getRecord(rowIndex).nm_training;

        $(".endPopupWindow").css("display", "flex");
        $(".endPopupMain").text(nm_training + "の請求書を発送しますか");
        $(".endPopupReport").data("no", no_training);

    },
    sendEndReport: function (data) {

        var mdata = {
            "no_training": data,
            "no_user": window.sessionStorage.getItem("no_user")
        };

        this.sendBillAjax(mdata);
    },
    sendBillAjax: function (data) {

        var _this = this;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/Admin/SendBill",
            data:data,
            success: function (res) {

                if (res.status == "200") {
                    Tools.messageBox("請求書を発送しました");
                    $(".endPopupWindow").hide();

                    _this.gridObj.refreshPage();
                } else {
                    Tools.messageBox("発送が失敗しました");
                }
            },
            error: function (err) {
                alert(err);
            }
        })
    }

}