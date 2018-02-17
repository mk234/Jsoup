Ads.occidendum = [18856127, 18856129, 19141958, 19159511, 19326768, 19326779, 19353803, 19354894, 19405930, 19547269, 19553423, 19604154, 19608572, 19608573, 19620557, 19620581, 19620813, 18914946, 18914947, 19712870, 19712879];

if(!/(emimino|modnipeklo|arome|labuznik|vitalion)\.cz$|localhost$/.test(location.hostname))
{
document.write("<script src=\"//bbcdn.go.idnes.bbelements.com/bb/bb_codesnif.js?v=201801251411\"><\/script>");
document.write("<script src=\"//bbcdn.go.idnes.bbelements.com/bb/bb_one2n.131.65.134.1.js?v=201708301302\"><\/script>");
}
else if(location.hostname.endsWith("expres.cz") || (location.hostname.endsWith("pocasi.idnes.cz") && Unidata.verze == "B"))
{
  (function()
  {
    var s = document.createElement("script");
    s.async = s.defer = true;
    s.onload = function()
    {
      var param = Ads.bmone2Param;
      var list = [];
      for(var n in param)
      {
        var id = param[n].replace(/^@/, "");
        Ads.positions[n] = {
          placeholder: param[n] != id,
          id: id,
          refresh: function() { ibbAds.tag.requestAndPlaceAds("bmone2n-" + this.id); }
        };
        list.push(Ads.positions[n]);
      }

      var adserver = ibbAds.tag.useAdProvider("BbmIdnes");
      for(var n in param)
      {
        var id = param[n].replace(/^@/, "");
        adserver.manageAdSlot("bmone2n-" + id, id);
      }
      ibbAds.tag.on("ADS_WRITTEN_TO_AD_SLOT", function(event)
      {
        var id = event.getData().slotId.replace(/bmone2n\-/, "");
        var r = element("r" + id);
        var newClassName = r.className.replace(/^h(?:id)?\s+|\s+h(?:id)?(\s+)|\s+h(?:id)?$/, "$1");
        if(newClassName != r.className)
          r.className = newClassName;
        else if(r.tagName == "TABLE")
          r.style.display = "inline";
      });
      
      ibbAds.tag.requestAndPlaceAds();
    };
    s.src = "https://bbcdn-static.bbelements.com/scripts/ibb-async/stable/tag.js";
    document.body.insertBefore(s, document.body.firstChild);
    
  })();
  window.bmone2n = { makeAd: Number, moveAd: Number };
  Ads.bmone2 = function(param)
  {
    Ads.bmone2Param = param;
  };
}
else
{
  document.write("<script src=\"https://bbcdn-static.bbelements.com/scripts/ibb-async/stable/tag.js\"></script>");
  Ads.bmone2 = function(param)
  {
    if(!("textContent" in document.createElement("script"))) reload = function(){};
    var list = [];
    for(var n in param)
    {
      var id = param[n].replace(/^@/, "");
      Ads.positions[n] = {
        placeholder: param[n] != id,
        id: id,
        refresh: reload
      };
      list.push(Ads.positions[n]);
    }

    var adserver = ibbAds.tag.useAdProvider("BbmIdnes");
    for(var n in param)
    {
      var id = param[n].replace(/^@/, "");
      adserver.manageAdSlot("bmone2n-" + id, id);
    }
    ibbAds.tag.on("ADS_WRITTEN_TO_AD_SLOT", function(event)
    {
      var id = event.getData().slotId.replace(/bmone2n\-/, "");
      var r = element("r" + id);
      var newClassName = r.className.replace(/^h(?:id)?\s+|\s+h(?:id)?(\s+)|\s+h(?:id)?$/, "$1");
      if(newClassName != r.className)
        r.className = newClassName;
      else if(r.tagName == "TABLE")
        r.style.display = "inline";
    });

    window.bmone2n = { makeAd: Number, moveAd: function()
      {
        ibbAds.tag.requestAndPlaceAds();
      }
    };
    function reload()
    {
      ibbAds.tag.requestAndPlaceAds("bmone2n-" + this.id);
    }
  };
}

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?''.constructor['fr' + 'omoharoode'.replace(/o([ho])/g, 'C$1')](c+29):c['toS' + 'tring'](36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('p X={"2y":"//3F.E.G/3w/3I.2W?q={l}&4v={Q}","1Z":c(J){p 1H="\\4w\\4u\\3R\\4b\\4m\\4i\\4h\\44\\3M\\3P\\4K\\4G\\4V\\4t\\4s\\4o\\4r\\4q\\4F\\4x\\3c";J=J.3a();22(p i=0,1L="";i<J.Z;i++)1L+=(1H.1U(J.1c(i))>-1)?"3x".1c(1H.1U(J.1c(i))):(("3q ".1U(J.1c(i))==-1)?\' \':J.1c(i));z 1L.1Q(/[\\"\\\',\\.]/g," ").3p()},"2s":c(Q,I,P){X[Q]=3s(c(Q){p w=9;9.j=9;p s;9.f;9.k;9.U=D;9.A=0;p 14=[];9.K="";9.t=[];9.2l=c(){22(p i=0;i<I.Z;i++){p e=M(I[i][1]);b(!e)z D;b(!e.y){e.u.31=10;e.y=M(r.1V(r.3v?"3u":"2r"));e.y.3t(0);e.y.15="3o:3j";e.y.u.1F="2c";e.y.u.1d="V";e.y.u.3i="V";e.y.u.31=0;e.2K.1X(e.y)}b(i!=P-1)9.1O(I[i][0],I[i][1])}b(P){9.K=M(I[P-1][0]).1e;9.1P(I[P-1][0],I[P-1][1]);9.f.P()}z 1n};9.1P=c(1b,1a){9.f=M(1b);9.f.j=9;9.f.2i=1n;9.f.2V=c(){w.1E()};9.f.2C=9.34;9.f.3k=c(h){25(c(){w.16()},3n)};b(1J.2f)9.f.2j=9.1G;Y 9.f.2o=9.1G;9.k=M(1a);9.k.2n=9.1z};9.1O=c(1b,1a){b(1b)9.f=M(1b);b(1a)9.k=M(1a);9.f.j=9;9.k.j=9;9.16();9.f.2V=18;9.f.2C=18;9.f.2j=18;9.f.2o=18;9.k.2n=18;9.f.1Y=9.f.1Y||9.f.2m||c(){};9.f.2m=c(){9.1Y();b(9.2i){z}w.1O();w.1P(w.f.2e,w.k.2e);w.K=C.R();w.1E()};9.K=C.R()};9.2w=c(l){r.30(X.2y.1Q("{l}",l).1Q("{Q}",Q))};9.1E=c(){p l=X.1Z(9.f.1e);b(9.K==l||9.U)z;9.K=l;b(14[l]){b(14[l]=="-")9.16(l);Y 9.2B(l,14[l])}Y{b(l)9.2w(l);Y 9.16(l)}};9.16=c(l){b(l)14[l]="-";9.t=[];b(9.k){9.k.u.1d="V";9.k.y.u.1d="V"}};9.2B=c(l,t){14[l]=t;b(l!=X.1Z(9.f.1e))z;9.A=0;9.k.1M="";22(p i=0;i<t.Z;i++)(c(i){p d=r.1V("2r");w.k.1X(d);d.j=w;d.1M=(t[i][1]==3K?"":"<2u>"+t[i][1]+"\\3J 3E\\3z</2u>")+t[i][0];d.3y=c(){w.1z(i+1)};d.2A=c(){w.2P(i)};w.t[i]=t[i][0]})(i);p a=r.1V("a");9.k.1X(a);a.2q="/";a.1M="- 3C\\3B -";a.2A=c(){w.2F();z D};9.k.u.1d="35";9.k.y.u.1A=9.k.3f+"1w";9.k.y.u.1B=9.k.3g+"1w";9.k.y.u.S=9.k.37+"1w";9.k.y.u.T=9.k.3e+"1w";b(!1J.2f)9.k.y.u.1d="35"};9.1z=c(n){b(!9.j)z D;b(9.j.A)9.j.k.2O[9.j.A-1].11="";9.j.A=(n?n+9.j.t.Z+1:0)%(9.j.t.Z+1);b(9.j.A)9.j.k.2O[9.j.A-1].11="A"};9.2P=c(n){9.j.f.1e=9.j.t[n];p o=9.j.f;3b(o.4z!="4A")o=o.2K;b(!o.2N||o.2N())o.4y()};9.2F=c(){9.16();9.U=1n};9.34=c(){b(!9.U)z;9.U=D;9.K=C.R();9.1E()};9.1G=c(e){b(9.j.U)z;p W=(e?e:4C).4D;b(W==13){b(9.j.A)9.j.f.1e=9.j.t[9.j.A-1]}b(W==38||W==40){b(9.j.t.Z==0){1J.4p(0,(W-39)*20);z D}9.j.1z(9.j.A+W-39);z D}};9.2l()})(Q)}};b(H.29!="4Q.E.G"&&(!H.29.12(/L|4R|4S|4P/))){4U{X.2s("h",[[\'4W\',\'t\']],0)}4O(4I){17.2J(H.2q,"4J")}}(c(){c 1N(v){b(H.1t=="4H.E.G"){17.1q(r.1r.11.12(/q-(1p|1u|1v|1s|1R)|$/)[1],"4M\\1h"+["1W","1i","1j","1m","1l","1I","1S","1T"][B.F.O-1]);b(B.F.O>4&&4N 2z=="c")2z()}b(m.36&&!C.1y(C.R()*10)){17.1q(r.1r.11.12(/q-(1p|1u|1v|1s|1R)|$/)[1],"4L"+(H.1t.24("L.E.G")?"L":"")+"4n\\1h"+["1W","1i","1j","1m","1l","1I","1S","1T"][B.F.O-1])}b(!C.1y(C.R()*1D))17.1q(r.1r.11.12(/q-(1p|1u|1v|1s|1R)|$/)[1],(3Y.3V?"3W":"O")+(H.1t.24("L.E.G")?"L":"")+"2k\\1h"+["1W","1i","1j","1m","1l","1I","1S","1T"][B.F.O-1])}b(B.F.O)1N();Y{p 1K=D;p 2d=41.3U.12(/3O\\/(\\d+)/);b(2d&&2d[1]>=45)1K=1n;m.N=1;m.3N=c(){m.N=2;r.1f("<28 15=\\"//32.E.2R.2H//2I/2G/2D/1/1/33/?2E=28\\" 2p=\\"m.N = 3\\" 2g=\\"m.N = (9.S == 3S && 9.T == 3T) ? 5 : 4\\" u=\\"1F: 2c; 1A: -1C; 1B: -1C; 2Z-S: V !1o; S: 2T !1o; 2Z-T: V !1o; T: 2T !1o\\">")};27.2t(c(){25(c(){b(m.N==5)m.N=19?(1K?8:(m.1k?7:5)):6;B.F.O=m.N;1N();B.2h()},2S)});r.1f("<1x 15=\\"//32.E.2R.2H//2I/2G/2D/1/1/33/?2E=23&\\4j=1\\"><\\/1x>");p 19=(2a.4e("19")[0]>8);b(19){m.1k=c(){48 m.1k};r.1f("<49 15=\\"//2x.G/2L/46.2L?47=m.1k\\" 4d=\\"4a/x-4c-19\\" 4k=\\"4l\\" u=\\"1F: 4g; 1A: -4f; 1B: 0; S: 2U; T: 2U\\">")}}c 2b(){b(!C.1y(C.R()*1D))17.1q(r.1r.11.12(/q-(1p|1u|1v|1s)|$/)[1],"3Q"+(H.1t.24("L.E.G")?"L":"")+"2k\\1h"+["1i","1j","1m","1l"][B.F.26-1])}b(B.F.26)2b();Y{m.1g=1;r.1f("<28 15=\\"//3Z.43.1g.42/3X.4T\\" 2p=\\"m.1g = 2\\" 2g=\\"m.1g = (9.S == 1D && 9.T == 21) ? 4 : 3\\" u=\\"1F: 2c; 1A: -1C; 1B: -1C;\\">");27.2t(c(){25(c(){B.F.26=m.1g;2b();B.2h()},2S)})}})();27.4E();b(r.2Q.2M("2Y")==1)r.30("//4B.E.G/3d/2Y.2W");b(2a.2v){2a.2v=D;r.1f("<1x 15=\\"//2x.G/23/3D/3A.23?3L=8\\"></1x>")}b(!C.1y(C.R()*1D))17.2J(H.29.3G(".").2X().3H(0,3).2X().3l("."),"3m\\3h");m.36=(r.2Q.2M("3r")==1);',62,307,'|||||||||this||if|function|||inputElement||||object|wordsElement|word|Ads|||var||document||words|style||that||windowedIframe|return|selected|Storage|Math|false|idnes|data|cz|location|instances|vstup|lastWord|rajce|element|bbmedia|bbmediapokus3|focus|db|random|width|height|muted|none|key|Helper|else|length||className|match||cache|src|clear|Log|null|flash|wordsId|inputId|charAt|display|value|write|gemius|x5F|noimg|errimg|flashTest|ok|badimg|true|important|moz|ping2|documentElement|op|hostname|ie|wk|px|script|floor|select|left|top|10000px|100|hear|position|keypressed|unsafe|noflash|window|flashPaused|vystup|innerHTML|pingPokus|disconnect|connect|replace|eg|blockedflash|pausedflash|indexOf|createElement|nojs|appendChild|originalOnfocus|removeUnsafe|||for|js|endsWith|setTimeout|gemiuspokus|Starter|img|host|Misc|pingGemPokus|absolute|chromej|id|opera|onload|update|nofocus|onkeypress|x100|init|onfocus|onmouseout|onkeydown|onerror|href|div|attach|add|span|pinnedMeta|request|1gr|path|gemius_pokus|onclick|say|ondblclick|84|typkodu|mute|showit|com|please|ping|parentNode|swf|read|onsubmit|childNodes|clickWord|cookies|bbelements|2000|auto|1px|onkeyup|aspx|reverse|beruska|max|loadScript|zIndex|go||unmute|block|proxy|offsetWidth|||toLowerCase|while|u017E|korektura|offsetHeight|offsetLeft|offsetTop|x5Fx100|border|blank|onblur|join|zobrazeni|250|about|trim|abcdefghijklmnopqrstuvwxyz0123456789|adb|new|setOpacity|iframe|all|searchhelper|aaaccdeeeinoorstuuuyz|onmouseover|u00E1no|pinned|u00FDt|skr|uni|hled|tools2|split|slice|HelpMeMore|u00D7|123456789|rnd|u00EB|pokus|Chrome|u00ED|gemiuspokus1|u00E4|640|439|userAgent|touch|bbmediapokust|logo|Unidata|gacz||navigator|pl|hit|u011B||flashtest|nazev|delete|embed|application|u010D|shockwave|type|verze|1000px|fixed|u00E9|u010F|x5Fplain|allowscriptaccess|always|u00E7|x10|u0165|scrollBy|u016F|u00FA|u0161|u0159|u00E1|kde|u0105|u00FD|submit|tagName|FORM|servix|event|keyCode|ready|u00FC|u00F3|tvprogram|exc|uniuklid_naseptavacCatch|u0148|bbmediapokus5|bbmediapokus4|typeof|catch|automodul|klikni|oris|5plus2|gif|try|u00F6|slovo'.split('|'),0,{}));


(function()
{
  function trackAdtrack()
  {
    var link = element("@a[href*='napoveda.sklik.cz']");
    if(!link) return;
    Log.ping(location.href, "wagbender_" + Unidata.ostrov + "_" + (Unidata.zobrazeni || "neznamo") + "_zobrazeni");
    
    var container = link.parentNode.parentNode;
    if(!container) return;
    container.onmousedown = function(e)
    {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      while(target && target.tagName != "A") target = target.parentNode;
      if(!target) return;
      Log.ping(location.href, "wagbender_" + Unidata.ostrov + "_" + (Unidata.zobrazeni || "neznamo") + "_klik");
    };
  }
  if(Unidata.ostrov == "hobby")
    setTimeout(trackAdtrack, 5000);
})();
