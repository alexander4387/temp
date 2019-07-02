const _serviceUrl = "http://localhost:8000/scanService/";

$(document).ready(function () {
    var timerId;
    $("#scan").click(function () {
        clearInterval(timerId);
        print(_serviceUrl + "version");
        $.getJSON(_serviceUrl + "version", function (version) {
            print("{ version : " + version.version + " }");
            print(_serviceUrl + "start");
            $.post({
                url: _serviceUrl + "start",
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: '{"url": "http\://192.168.1.142\:8080/alfresco/UploadHandler.ashx","cookie":"' + document.cookie + '"}',
                dataType: "json",
                success: function (data) {
                    print("{ result : " + data.result + " }");
                    timerId = setInterval(function () {
                        print(_serviceUrl + "status");
                        $.getJSON(_serviceUrl + "status", function (status) {
                            print("{ isRunning : " + status.isRunning + ", result : " + status.result + " }");
                            if (status.result) {
                                print("File uploaded and saved to path " + status.result);
                                clearInterval(timerId);
                            } else if (!status.isRunning) {
                                print("Nasp2 closed");
                                clearInterval(timerId);
                            }

                        }).fail(function () {
                            print("Error on get version");
                            clearInterval(timerId);
                        });
                    }, 1000);

                }
            }).fail(function () {
                print("Error on start");
            });
        }).fail(function () {
            print("Error on get version");
        });
    });

    $("#close").click(function () {
        print(_serviceUrl + "close");
        $.post({
            url: _serviceUrl + "close",
            type: 'POST',
            dataType: "json",
        });
    });

    function print(text) {
        var textarea = $("#notify")[0];
        textarea.value += text + "\n\r";
        textarea.scrollTop = textarea.scrollHeight;
    }
});
