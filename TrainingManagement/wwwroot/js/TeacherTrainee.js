window.onload = function () {
    traineeTable.init();
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

        $(".navigationName").click(function (e) {
            location.href = "/Teacher/Index";
        })

        $(".endPopupClose").click(function (e) {
            $(".endPopupWindow").hide();
        });

        $(".endPopupBack").click(function (e) {
            $(".endPopupWindow").hide();
        });

        $(".resultPopupBack").click(function (e) {
            $(".resultPopupWindow").hide();
        });

        $(".resultPopupClose").click(function (e) {
            $(".resultPopupWindow").hide();
        });

        $(".endPopupReport").click(function (e) {
            // trainingTable.sendEndReport($(this).data("no"));

            var type = $(this).data("no");

            if (type == "guide") {
                traineeTable.guideSend();
            } else {
                traineeTable.textSend();
            }
        });

        $(".backToIndex").click(function (e) {
            location.href = "/Teacher/Index";
        })

        $(".sendText").click(function (e) {
            $(".endPopupWindow").css("display", "flex");
            $(".endPopupMain").text("テキスト発送しますか");
            $(".endPopupReport").data("no", "text");
        })

        $(".sendGuide").click(function (e) {
            $(".endPopupWindow").css("display", "flex");
            $(".endPopupMain").text("受講案内を発送しますか");
            $(".endPopupReport").data("no","guide")
        })

        $(".sendResult").click(function(e){
            $(".resultPopupWindow").css("display", "flex");
        })

        $(".resultPopupfresh").click(function (e) {
            traineeTable.sendPassArr();
        })
    }
};

var traineeTable = {
    gridObj: '',
    passArray:[],
    noPassArray:[],
    init: function () {

        //登録状態
        if (window.sessionStorage.getItem("nm_user")) {
            $(".navigationUserName").text(window.sessionStorage.getItem("nm_user"));
        } else {
            //登録されてない状態、ログイン画面に戻す
            window.location.replace("/");
        }

        traineeTable.gridObj = $.fn.bsgrid.init('test', {
            url: '/Teacher/GetTraineeTableData', 
            ajaxType: 'post',
            pageSize: 8, 
            pageIncorrectTurnAlert: false,
            rowSelectedColor: false,
            otherParames: {
                "no_training": Tools.getUrl().no_training
            },
            pagingLittleToolbar: true,
            additionalAfterRenderGrid: function () {
                $("#totalPage").html(traineeTable.gridObj.getTotalPages());
                $("#totalData").html(traineeTable.gridObj.getTotalRows());

                if (traineeTable.gridObj.getTotalRows() != 0) {
                    var nm_training = traineeTable.gridObj.getRecord(0).nm_training;
                    $(".traineeShow").text(nm_training + "の受験者一覧");

                    var flg_textorder = traineeTable.gridObj.getRecord(0).flg_textorder;
                    if (flg_textorder == 0) {
                        $(".sendText").hide();
                    }
                } else {
                    $(".sendText").hide();
                }
            }
        });

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
    completionFlgFormat: function (record, rowIndex, colIndex, options) {
        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_completion');
        if (flg == "0") {
            return "未判定";
        } else if (flg == "1") {
            return "合格";
        } else {
            return "未合格";
        }
    },
    guideFlgFormat: function (record, rowIndex, colIndex, options) {
        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_training_guide');
        return flg == "0" ? "未発送" : "発送済み";
    },
    textFlgFormat: function (record, rowIndex, colIndex, options) {
        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_text');
        return flg == "0" ? "未発送" : "発送済み";
    },
    passFormat: function (record, rowIndex, colIndex, options) {
        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_completion');
        if (flg == "0") {
            return '<div><input class="passCheckbox" data-no="' + rowIndex + '" onclick="traineeTable.passClick(this)" type="checkbox"></div>';
        } else if (flg == "1") {
            return '<div><input class="passCheckbox" disabled checked type="checkbox"></div>';
        } else {
            return '<div><input class="passCheckbox" disabled type="checkbox"></div>';
        }
    },
    passClick : function(dom){
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var training_no = traineeTable.gridObj.getRecord(rowIndex).no_training_history;
        if(_this.prop("checked")){
            this.passArray.push(training_no);
            var index = this.noPassArray.findIndex(function(x){
                return x == training_no;
            });
            if(index != "-1"){
                this.noPassArray.splice(index,1);
                console.log($(".noPassCheckbox").eq(rowIndex).data("no"));
                $(".noPassCheckbox").eq(rowIndex).removeAttr("checked");
            }
        }else{
            this.passArray.splice(this.passArray.findIndex(function(x){
                return x == training_no;
            }),1);
        }
    },
    nopassFormat: function (record, rowIndex, colIndex, options) {
        var flg = traineeTable.gridObj.getRecordIndexValue(record, 'flg_completion');
        if (flg == "0") {
            return '<div><input class="noPassCheckbox"  data-no="' + rowIndex + '" onclick="traineeTable.noPassClick(this)" type="checkbox"></div>';
        } else if (flg == "1") {
            return '<div><input class="noPassCheckbox" disabled type="checkbox"></div>';
        } else {
            return '<div><input class="noPassCheckbox" disabled checked type="checkbox"></div>';
        }
    },
    noPassClick: function(dom){
        var _this = $(dom);
        var rowIndex = _this.data('no');
        var training_no = traineeTable.gridObj.getRecord(rowIndex).no_training_history;
        if(_this.prop("checked")){
            this.noPassArray.push(training_no);
            var index = this.passArray.findIndex(function(x){
                return x == training_no;
            });
            if(index != "-1"){
                this.passArray.splice(index,1);
                console.log($(".passCheckbox").eq(rowIndex).data("no"));
                $(".passCheckbox").eq(rowIndex).removeAttr("checked");
            }
        }else{
            this.noPassArray.splice(this.noPassArray.findIndex(function(x){
                return x == training_no;
            }),1);
        }
    },
    guideSend: function () {
        var _this = this;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/Teacher/SendGuide",
            data: {
                no_training: Tools.getUrl().no_training
            },
            success: function (res) {

                if (res.status == "200") {
                    Tools.messageBox("受講案内を発送しました");
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
    },
    textSend: function () {
        var _this = this;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/Teacher/SendText",
            data: {
                no_training: Tools.getUrl().no_training
            },
            success: function (res) {

                if (res.status == "200") {
                    Tools.messageBox("テキストを発送しました");
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
    },
    sendPassArr: function () {

        console.log(this.passArray);
        console.log(this.noPassArray);

        var data = {
            pass_array: this.passArray,
            nopass_array: this.noPassArray
        };

        this.passArrayAjax(data);

    },
    passArrayAjax: function (data) {
        var _this = this;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/Teacher/sendPassArr",
            data: data,
            success: function (res) {

                if (res.status == "200") {
                    Tools.messageBox("合否情報を更新しました");
                    $(".resultPopupWindow").hide();

                    _this.gridObj.refreshPage();
                } else {
                    Tools.messageBox("更新が失敗しました");
                }
            },
            error: function (err) {
                alert(err);
            }
        })
    }
}