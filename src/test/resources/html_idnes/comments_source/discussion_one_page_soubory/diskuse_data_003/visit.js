try{var dv_win = window._dv_win || window.parent._dv_win; dv_win['dvCallback_1518877908289728']($dv,window,'dbfac1f64ee848d8a37dc2e36eea8864','tps20208.doubleverify.com');}catch(e){try{var image=window.document.createElement('img');image.src=window.location.protocol+'//tps30.doubleverify.com/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&dvp_cbError='+encodeURIComponent(e.message)}catch(e){}}var newAvoValues = {cto: 5000};if ($dv.tags[$uid].AVO == undefined) $dv.tags[$uid].AVO = {};for (var id in newAvoValues){if (newAvoValues[id] != undefined){$dv.tags[$uid].AVO[id]= newAvoValues[id];}};$dv.tags[$uid].AVO.rpv = 1;$dv.pubSub.subscribe('ImpressionServed', $uid, 'RTN_LatencyTemp', function () {try {var beforeVisitCall = '';var templateStartTime = parent.getCurrentTime();var dv_win = parent.window._dv_win;if (dv_win && dv_win.t2tTimestampData) {if (dv_win.t2tTimestampData.length >= 2) {beforeVisitCall = dv_win.t2tTimestampData[1].beforeVisitCall;}}var latency = 0;if (beforeVisitCall != '' && templateStartTime != '') {latency = templateStartTime - beforeVisitCall;}if(latency > 1000 && latency < 90000) {$dv.registerEventCall($uid, { dvp_ltncy: latency });}} catch (e) {};});$dv.ViewabilityScriptVersion = 697;    	$dv.pubSub.subscribe ('ImpressionServed', $uid, 'SendAdEntitiesForBSBAConsolidation', function() {
            'use strict';
            var stringifyFunc = null;
			if(window.JSON){
				stringifyFunc = window.JSON.stringify;
			} else {
				if(window.parent && window.parent.JSON){
					stringifyFunc = window.parent.JSON.stringify;
				}
			}
			if(!stringifyFunc){
				return;
			}
            var targetWin;
            var tag = $dv.tags[$uid];
            var bsmsg = {
                action : 'notifyBrandShieldAdEntityInformation',
                bsAdEntityInformation : {
                    comparisonItems : [{name : 'cmp', value : 12205692},{name : 'plmt', value : 12205717}], verboseReporting : false  }
            };
            var bsstring = stringifyFunc(bsmsg);

            var findAndSend = function(){
                if(!targetWin) {
                    if (tag) {
                        targetWin = tag.t2tIframeWindow;
                        if (!targetWin) {
                            var t2tIframeId = tag.t2tIframeId;
                            //get t2t window and post the AdEntities to it.
                            if (t2tIframeId) {
                                var iFrame = window.parent.getElementById(t2tIframeId);
                                if (iFrame) {
                                    targetWin = iFrame.contentWindow;
                                }
                            }
                        }
                    }
                }

                if(targetWin){
                    targetWin.postMessage(bsstring, '*');
                }
            };

            findAndSend();
            setTimeout(findAndSend, 100);
            setTimeout(findAndSend, 500);
        });$dv.tags[$uid].set({"billable":{adArea: 100, duration: 100}});$dv.tags[$uid].dc = $dv.tags[$uid].dc || [];$dv.tags[$uid].dc.push({"rq":{"av":98,"ic":true,"fc":true,"adc":100,"mla":true,"ldav":0},"rp":{"mt":"isgmmims","pt":"isgmpims","mr":"GroupMMeasuredImpression","pr":"GroupMPassedImpression","eid":17,"bl":true}});$dv.tags[$uid].dc.push({"rq":{"av":98,"ic":true,"fc":true,"adc":1000,"mla":false,"ldav":50},"rp":{"mt":"isgmv4mims","pt":"isgmv4dpims","eid":17,"bl":true}});
(function() {var dvObj = $dv;var impId = 'dbfac1f64ee848d8a37dc2e36eea8864';var dvParams = {'useDvp': 'false','logRate': '100'};dvObj.pubSub.subscribe(dvObj==window.$dv?"ImpressionServed":"BeforeDecisionRender",impId,"BHL", function() {function f(){var c="true"===dvParams.useDvp?"dvp_":"",d="";this.exec=function(){var a={},b;a:{try{b=history.length;break a}catch(e){d+="|"+e.message}b=void 0}b&&(a[c+"brh"]=b);c&&d&&(a.dvp_brherr=d);try{a&&dvObj.registerEventCall(impId,a)}catch(e){}}}try{(new f).exec()}catch(c){};});})();(function() {var dvObj = $dv;var impId = 'dbfac1f64ee848d8a37dc2e36eea8864';dvObj.pubSub.subscribe(dvObj==window.$dv?"ImpressionServed":"BeforeDecisionRender",impId,"CTITS",function(){var a=-1;try{top.frames&&(a=top.frames.length),dvObj.registerEventCall(impId,{fcifrms:a})}catch(b){}});})();var dvObj = $dv;function np764531(g,i){function d(){function d(){function f(b,a){b=(i?"dvp_":"")+b;e[b]=a}var e={},a=function(b){for(var a=[],c=0;c<b.length;c+=2)a.push(String.fromCharCode(parseInt(b.charAt(c)+b.charAt(c+1),32)));return a.join("")},h=window[a("3e313m3937313k3f3i")];h&&(a=h[a("3g3c313k363f3i3d")],f("pltfrm",a));(function(){var a=e;e={};dvObj.registerEventCall(g,a,2E3,true)})()}try{d()}catch(f){}}try{dvObj.pubSub.subscribe(dvObj==window.$dv?"ImpressionServed":"BeforeDecisionRender",g,"np764531",d)}catch(f){}}
;np764531("dbfac1f64ee848d8a37dc2e36eea8864",false);$dv.tags[$uid].dc = $dv.tags[$uid].dc || [];$dv.tags[$uid].dc.push({"rq":{"av":98,"ic":true,"fc":true,"adc":1000,"mla":false,"ldav":30},"rp":{"mt":"ismms","pt":"ispmxpms"}});$dv.pubSub.subscribe('ImpressionServed', $uid, 'OperaVendorChecker', function(){var eventData = {};var mraidObject = $dv.getMraid();var execMrSaf = function(func) {		var rv;		try {			if (typeof func === 'function') {rv = func.call(mraidObject)}		}catch (e) {			eventData = {'dvp_operr': 1}						}		return rv;};try{	if(mraidObject)	{		var vendor = execMrSaf(mraidObject.getVendor);		var vendor_version = execMrSaf(mraidObject.getVendorVersion);		if(vendor != null && vendor_version != null)		{			eventData = {				dvp_sspv: vendor,				dvp_sspvv: vendor_version			};		}	}}catch (e){	eventData = {		dvp_operr: 2	};}$dv.registerEventCall($uid, eventData);});function IVCallback(ViewAssureBootstrapper) {    if(ViewAssureBootstrapper && typeof(ViewAssureBootstrapper)==='function') {       ViewAssureBootstrapper({ 'serverSettings': { 'protocol': 'https://', 'templateVersion': '11', 'TKH': '1360806074114116608' } });   } else {       new dv_InViewService({ 'protocol': 'https://' }).inViewManager();     }};$dv.CommonData.deviceType = 1;$dv.CommonData.detectedDeliveryType = 1;$dv.pubSub.subscribe('ImpressionServed', $uid, 'createVersionSelector', function () {var version = $dv.ViewabilityScriptVersion;if(!version || ($dv.scriptInjected && $dv.scriptInjected != 2) || true) return;$dv.scriptInjected = 2;if($dv.ViewabilityScriptVersion2 && Math.random()*100 < 50) {   var version = $dv.ViewabilityScriptVersion2; } var script = document.createElement('script'); script.type = 'text/javascript'; script.src = 'https://cdn.doubleverify.com/avs' + version + '.js'; document.body.appendChild(script);});try{$dv.pubSub.publish('ImpressionServed', $uid);$dv.pubSub.publish('ImpressionServed', $frmId);}catch(e){}