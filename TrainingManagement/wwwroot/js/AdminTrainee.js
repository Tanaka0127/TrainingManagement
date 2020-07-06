window.onload = function () {
    traineeTable.init();
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

        $(".backToIndex").click(function(e){
            location.href = "AdminIndex.html";
        })

        $(".sendEnd").click(function(e){
            $(".resultPopupWindow").css("display","flex");
        })

        $(".resultPopupClose").click(function (e) {
            $(".resultPopupWindow").hide();
        });

        $(".resultPopupBack").click(function (e) {
            $(".resultPopupWindow").hide();
        });
    }
};

var traineeTable = {
    // 表格对象
    gridObj: '',
    localData: [{
        "no_training_history" : "182736382",
        "nm_training": "研修01",
        "no_employee": "1006765543",
        "nm_user": "瀬戸山京椰",
        "nm_department": "開発部",
        "mail": "kou.kin@ad-max.co.jp",
        "flg_completion": "1",
        "flg_completion_certificate": "0"
    },{
        "no_training_history" : "182736383",
        "nm_training": "研修01",
        "no_employee": "1006765543",
        "nm_user": "瀬戸山京椰",
        "nm_department": "開発部",
        "mail": "kou.kin@ad-max.co.jp",
        "flg_completion": "1",
        "flg_completion_certificate": "1"
    },{
        "no_training_history" : "182736384",
        "nm_training": "研修01",
        "no_employee": "1006765543",
        "nm_user": "瀬戸山京椰",
        "nm_department": "開発部",
        "mail": "kou.kin@ad-max.co.jp",
        "flg_completion": "2",
        "flg_completion_certificate": "0"
    }],
    init: function () {
        // var car_park_id = sessionStorage.getItem("car_park_id");
        traineeTable.gridObj = $.fn.bsgrid.init('test', {
            // url: '/getMessage.do', //json文件url
            localData: traineeTable.localData,
            ajaxType: 'post', //请求方式
            pageSize: 8, //分页大小，默认20
            pageIncorrectTurnAlert: false,
            rowSelectedColor: false,
            otherParames: {

            },
            pagingLittleToolbar: true,
            additionalAfterRenderGrid: function () {
                $("#totalPage").html(traineeTable.gridObj.getTotalPages());
                $("#totalData").html(traineeTable.gridObj.getTotalRows());

                var nm_training = traineeTable.gridObj.getRecord(0).nm_training;
                $(".traineeShow").text(nm_training + "の受験者一覧");
            }
        });

        //添加分页按钮
        var addHtml = '<td style="text-align:right"><div id="add"><div id="total">全部<span id="totalPage"></span>ページ/<span id="totalData"></span>行' +
            '</div><div id="goPage">第<input class="gotoThePage" type="text">ページ' +
            '<div id="goBtn">GO</div></div></div></td>';

        $('#' + traineeTable.gridObj.options.pagingOutTabId + ' tr:eq(0)').append(addHtml);
        $('#goBtn').click(function () {
            var page = $('#goPage input').val();
            traineeTable.gridObj.gotoPage(page);
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

        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_completion');
        var certificate_flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_completion_certificate');
        if(flg == "2"){
            return '';
        }else if(flg == "1"){

            if(certificate_flg == "0"){
                return '<div class="tableBtn"><div class="endCertificate" data-no="' + rowIndex + '" onclick="traineeTable.sendCertificate(this)">修了証を送付する</div></div>';
            }else{
                return '<div class="tableBtn"><div class="sendedCertificate">送付済み</div></div>';
            }
        }

    },
    completionFlgFormat: function (record, rowIndex, colIndex, options) {
        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_completion');
        return flg == "2" ? "未合格" : "合格";
    },
    certificateFlgFormat: function (record, rowIndex, colIndex, options) {
        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_completion_certificate');
        return flg == "0" ? "未発送" : "発送済み";
    },
    sendCertificate: function (dom) {
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var no_training_history = traineeTable.gridObj.getRecord(rowIndex).no_training_history;
        var nm_user = traineeTable.gridObj.getRecord(rowIndex).nm_user;

        $(".endPopupWindow").css("display", "flex");
        $(".endPopupMain").text(nm_user + "さんに発送しますか");
        $(".endPopupReport").data("no", no_training_history);

    },
    sendEndReport: function (data) {
        console.log(data);
        Tools.messageBox("修了証を発送しました");
        
    }

}