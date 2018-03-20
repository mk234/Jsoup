/*- IE Hack - no active ActiveX Component*/
function activateActiveX() {
    if (document.attachEvent && !window.opera) {
        var object = document.getElementsByTagName('object');
        for (i = 0; i < object.length; i++) {
            object[i].outerHTML = object[i].outerHTML;
        }
        var embed = document.getElementsByTagName('embed');
        for (i = 0; i < embed.length; i++) {
            embed[i].outerHTML = embed[i].outerHTML;
        }
    }
}
