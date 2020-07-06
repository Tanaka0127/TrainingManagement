window.onload = function () {
    trainingTable.init();
    //初始化页面的一些点击事件
    Tools.clickInit();
}

var Tools = {
    timeout: null,
    //获取url中的参数
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
    //将金额转换为钱的显示
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
    //初始化一些页面上的点击事件
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
            location.replace("login.html");
        });

        $(".navigationName").click(function (e) {
            location.href = "AdminIndex.html";
        })

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
    // 表格对象
    gridObj: '',
    localData: [{
        "no_training": "10006587415",
        "nm_training": "研修01研修01研修01研修01研修01研修01研修01",
        "cd_training": "KS0001",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "10",
        "flg_textorder": "1",
        "flg_claim" : "0",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587416",
        "nm_training": "研修02",
        "cd_training": "KS0002",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "12",
        "flg_textorder": "1",
        "flg_claim" : "1",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587417",
        "nm_training": "研修03",
        "cd_training": "KS0003",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "5",
        "flg_textorder": "1",
        "flg_claim" : "0",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587415",
        "nm_training": "研修04",
        "cd_training": "KS0004",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "87",
        "flg_textorder": "1",
        "flg_claim" : "0",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587415",
        "nm_training": "研修05",
        "cd_training": "KS0005",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "11",
        "flg_textorder": "1",
        "flg_claim" : "1",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587415",
        "nm_training": "研修06",
        "cd_training": "KS0006",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "99",
        "flg_textorder": "1",
        "flg_claim" : "1",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587415",
        "nm_training": "研修07",
        "cd_training": "KS0007",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "5",
        "flg_textorder": "1",
        "flg_claim" : "1",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587415",
        "nm_training": "研修08",
        "cd_training": "KS0008",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "3",
        "flg_textorder": "1",
        "flg_claim" : "0",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587415",
        "nm_training": "研修09",
        "cd_training": "KS0009",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "11",
        "flg_textorder": "1",
        "flg_claim" : "0",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }, {
        "no_training": "10006587415",
        "nm_training": "研修10",
        "cd_training": "KS0010",
        "dt_starttime": "2020/06/24",
        "dt_closetime": "2020/06/24",
        "su_people": "1111",
        "flg_textorder": "1",
        "flg_claim" : "0",
        "nm_venue": "新宿3-27-5新宿高佐ビル501号室"
    }],
    init: function () {
        // var car_park_id = sessionStorage.getItem("car_park_id");
        trainingTable.gridObj = $.fn.bsgrid.init('test', {
            // url: '/getMessage.do', //json文件url
            localData: trainingTable.localData,
            ajaxType: 'post', //请求方式
            pageSize: 9, //分页大小，默认20
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

        //添加分页按钮
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
    trainee: function (dom) {
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var no_training = trainingTable.gridObj.getRecord(rowIndex).no_training;
        console.log(no_training);

        location.href = "AdminTrainee.html?no_training=" + no_training;
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
    textOrder: function (dom) {
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var no_training = trainingTable.gridObj.getRecord(rowIndex).no_training;
        console.log(no_training);
    },
    sendEndReport: function (data) {
        console.log(data);
        Tools.messageBox("請求書を発送しました");
        
    }

}