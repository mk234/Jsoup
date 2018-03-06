(function() {
    function ajax(url, data, callback) {
        var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4)
                callback(eval("(" + xhr.responseText + ")"));
        };
        var params = [];
        for (var n in data)
            params.push(encodeURIComponent(n, "windows-1250") + "=" + encodeURIComponent(data[n], "windows-1250"));
        xhr.send(params.join("&"));
    }

    document.frm_registrace.onsubmit = function() {
        var data = {}, tr, small;
        var form = this;
        for (var i = 0, element; element = form.elements[i]; i++) {
            if (element.name) data[element.name] = element.value;

            tr = element.parentNode;
            while (tr && tr.tagName != "TR") tr = tr.parentNode;
            if (!tr) continue;
            tr.className = "";

            small = element.nextSibling;
            if (small) small.parentNode.removeChild(small);
        }

        ajax("/_ajax_reg.aspx", data, function (errors) {
            var first, element, tr, small;
            for (var name in errors) {
                element = form.elements[name];
                tr = element.parentNode;
                while (tr && tr.tagName != "TR") tr = tr.parentNode;
                if (tr) tr.className = "error";
                small = document.createElement("small");
                small.innerHTML = errors[name];
                element.parentNode.insertBefore(small, element.nextSibling);
                if (!first) first = element;
            }
            if (first)
                first.focus();
            else
                form.submit();
        });

        return false;
    }
})();