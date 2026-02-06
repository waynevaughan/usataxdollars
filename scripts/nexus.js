var sguid = 'e57f4bad-71e9-4764-9f39-2b98ca336d9f';
var url = 'http://nexus.smartnetpro.com/t.ashx?s=' + sguid;
var pt = escape(document.title);
var gn = escape((isDefined('GroupName') ? GroupName : ''));
var pn = escape((isDefined('PageName') ? PageName : ''));
var ev = escape((isDefined('WebEvent') ? WebEvent : ''));
var ru = escape(document.referrer);
var kid = sguid.substring(0, 8);

function isDefined(varname) {
    return (typeof (window[varname]) != "undefined" ? true : false);
}

var v1 = false;
var sk = gsS();
var pk = gsP();

url += '&pt=' + pt + '&gn=' + gn + '&pn=' + pn + '&ev=' + ev + '&ru=' + ru + '&sk=' + sk + '&pk=' + pk + '&ka=' + (ka() ? '1' : '0') + (v1 ? '&v1=1' : '&v1=0');
var x;
if (isDefined(window.Images)) {
    x = window.Images.length;
} else {
    x = 0;
    window.Images = new Array();
}
window.Images[x] = new Image();
window.Images[x].src = url;

function gsS() {
    var k = getCookie('sk');
    if (k == "") { k = newguid(); v1 = true; }
    setCookie('sk', k, 30);
    return k;
}

function gsP() {
    var k = getCookie('pk');
    if (k == "") k = newguid();
    setCookie('pk', k, 525948);
    return k;
}

function newguid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result
}

function delCookie(name) {
    document.cookie = name + kid + "=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
}
function setCookie(name, value, mins) {
    var expD = new Date();
    expD.setTime(expD.getTime() + (mins * 60000));
    var cookie = name + kid + "=" + value + ((mins > 0) ? "; path=/; expires=" + expD.toGMTString() : "");
    document.cookie = cookie;
}
function getCookie(name) {
    var cookie = document.cookie;
    var index = cookie.indexOf(name + kid + "=");
    if (index != -1) {
        var start = index + name.length + kid.length + 1;
        var end = cookie.indexOf(";", start);
        if (end == -1) {
            end = cookie.length;
        }
        return cookie.substring(start, end);
    }
    return "";
}
function ka() {
    var name = "tk";
    var expD = new Date();
    var expS = expD.getTime();
    setCookie(name, expS, 1);
    var ck = this.getCookie(name);
    if (expS == ck) {
        delCookie(name);
        return true;
    }
    return false;
}