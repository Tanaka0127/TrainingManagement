window.onload = function () {
    trainingTable.init();
    //初始化页面的一些点击事件
    Tools.clickInit();
}

var Tools = {
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
            window.sessionStorage.removeItem("nm_user");
            window.sessionStorage.removeItem("no_user");
            location.replace("/");
        });
    }
};

var trainingTable = {
    // 表格对象
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
            url: '/Trainee/GetTableData', 
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

        //添加分页按钮
        var addHtml = '<td style="text-align:right"><div id="add"><div id="total">全部<span id="totalPage"></span>ページ/<span id="totalData"></span>行' +
            '</div><div id="goPage">第<input class="gotoThePage" type="text">ページ' +
            '<div id="goBtn">GO</div></div></div></td>';

        $('#' + trainingTable.gridObj.options.pagingOutTabId + ' tr:eq(0)').append(addHtml);
        $('#goBtn').click(function () {
            var page = $('#goPage input').val();
            trainingTable.gridObj.gotoPage(page);
        });

        $("#goPage input").bind("input propertychange", function (e) {
            var page = trainingTable.gridObj.getTotalPages();

            var value = $("#goPage input").val();

            value = value.replace(/[^\d]/g, '');

            $("#goPage input").val(value);

            if (value == "") {
                return;
            }

            if (value > page) {
                $("#goPage input").val(page);
            } else if (value < 1) {
                $("#goPage input").val("1");
            }
        });

    },
    operating: function (record, rowIndex, colIndex, options) {

        return '<div class="tableBtn"><div class="receipt" data-no="' + rowIndex + '" onclick="trainingTable.receipt(this)">受付</div><div data-no="' + rowIndex + '" onclick="trainingTable.guide(this)">詳細</div></div>';
    },
    TitleFormat: function (record, rowIndex, colIndex, options) {
        var name = trainingTable.gridObj.getRecordIndexValue(record, 'nm_training');
        if (name.length > 20) {

            name = name.substr(0, 17) + '...';

        }

        return '<span title="' + trainingTable.gridObj.getRecordIndexValue(record, 'nm_training') + '">' + name + '</span>';

    },
    startDateFormat: function(record, rowIndex, colIndex, options) {
        var date = trainingTable.gridObj.getRecordIndexValue(record, 'dt_starttime');

        return date.substr(0, 10);
    },
    endDateFormat: function (record, rowIndex, colIndex, options) {
        var date = trainingTable.gridObj.getRecordIndexValue(record, 'dt_closetime');

        return date.substr(0, 10);
    },
    receipt: function (dom) {
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var no_training = trainingTable.gridObj.getRecord(rowIndex).no_training;

        location.href = "/Trainee/Receipt?no_training=" + no_training;
    },
    guide: function (dom) {
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var no_training = trainingTable.gridObj.getRecord(rowIndex).no_training;

        location.href = "/Trainee/Guide?no_training=" + no_training;
    }

}