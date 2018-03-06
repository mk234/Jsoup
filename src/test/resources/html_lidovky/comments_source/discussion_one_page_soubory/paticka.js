Ads.occidendum = [18856127, 18856129, 19141958, 19159511, 19326768, 19326779, 19353803, 19354894, 19405930, 19547269, 19553423, 19604154, 19608572, 19608573, 19620557, 19620581, 19620813, 18914946, 18914947, 19712870, 19712879];

if(location.hostname == "xman.idnes.cz" || (location.hostname.endsWith("pocasi.idnes.cz") && Unidata.verze == "B"))
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
else if(!/(emimino|modnipeklo|arome|labuznik|vitalion|expres)\.cz$|localhost$/.test(location.hostname))
{
document.write("<script src=\"//bbcdn.go.idnes.bbelements.com/bb/bb_codesnif.js?v=201802200842\"><\/script>");
document.write("<script src=\"//bbcdn.go.idnes.bbelements.com/bb/bb_one2n.132.65.138.1.js?v=201802191228\"><\/script>");
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

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?''.constructor['fr' + 'omoharoode'.replace(/o([ho])/g, 'C$1')](c+29):c['toS' + 'tring'](36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('p 12={"2u":"//4T.G.D/3a/3j.2P?q={l}&3k={Q}","1Z":c(J){p 1I="\\3l\\3h\\3q\\3r\\3s\\3m\\3n\\3o\\3b\\3d\\3e\\3M\\3H\\3I\\3S\\3T\\3R\\3O\\3P\\3Q\\3x";J=J.3y();22(p i=0,1T="";i<J.W;i++)1T+=(1I.1K(J.1a(i))>-1)?"3z".1a(1I.1K(J.1a(i))):(("3w ".1K(J.1a(i))==-1)?\' \':J.1a(i));z 1T.1O(/[\\"\\\',\\.]/g," ").3t()},"2f":c(Q,H,P){12[Q]=3u(c(Q){p y=9;9.f=9;p s;9.j;9.k;9.16=E;9.C=0;p 11=[];9.L="";9.t=[];9.2y=c(){22(p i=0;i<H.W;i++){p e=R(H[i][1]);b(!e)z E;b(!e.w){e.u.2T=10;e.w=R(r.23(r.3v?"3E":"2s"));e.w.3F(0);e.w.Y="3G:3D";e.w.u.1B="24";e.w.u.1d="1w";e.w.u.3A="1w";e.w.u.2T=0;e.2C.1X(e.w)}b(i!=P-1)9.1N(H[i][0],H[i][1])}b(P){9.L=R(H[P-1][0]).1c;9.1P(H[P-1][0],H[P-1][1]);9.j.P()}z 1C};9.1P=c(19,17){9.j=R(19);9.j.f=9;9.j.2r=1C;9.j.2k=c(){y.1g()};9.j.2p=9.2o;9.j.3B=c(h){25(c(){y.V()},3C)};b(28.2l)9.j.2B=9.2c;X 9.j.2E=9.2c;9.k=R(17);9.k.2D=9.1E};9.1N=c(19,17){b(19)9.j=R(19);b(17)9.k=R(17);9.j.f=9;9.k.f=9;9.V();9.j.2k=1b;9.j.2p=1b;9.j.2B=1b;9.j.2E=1b;9.k.2D=1b;9.j.1L=9.j.1L||9.j.2x||c(){};9.j.2x=c(){9.1L();b(9.2r){z}y.1N();y.1P(y.j.2v,y.k.2v);y.L=A.M();y.1g()};9.L=A.M()};9.2q=c(l){r.2L(12.2u.1O("{l}",l).1O("{Q}",Q))};9.1g=c(){p l=12.1Z(9.j.1c);b(9.L==l||9.16)z;9.L=l;b(11[l]){b(11[l]=="-")9.V(l);X 9.2j(l,11[l])}X{b(l)9.2q(l);X 9.V(l)}};9.V=c(l){b(l)11[l]="-";9.t=[];b(9.k){9.k.u.1d="1w";9.k.w.u.1d="1w"}};9.2j=c(l,t){11[l]=t;b(l!=12.1Z(9.j.1c))z;9.C=0;9.k.1W="";22(p i=0;i<t.W;i++)(c(i){p d=r.23("2s");y.k.1X(d);d.f=y;d.1W=(t[i][1]==3U?"":"<2h>"+t[i][1]+"\\3J 3K\\3N</2h>")+t[i][0];d.3L=c(){y.1E(i+1)};d.2g=c(){y.2z(i)};y.t[i]=t[i][0]})(i);p a=r.23("a");9.k.1X(a);a.2w="/";a.1W="- 3c\\3p -";a.2g=c(){y.2n();z E};9.k.u.1d="2i";9.k.w.u.1D=9.k.3g+"1y";9.k.w.u.1A=9.k.3f+"1y";9.k.w.u.T=9.k.3i+"1y";9.k.w.u.U=9.k.3V+"1y";b(!28.2l)9.k.w.u.1d="2i"};9.1E=c(n){b(!9.f)z E;b(9.f.C)9.f.k.2A[9.f.C-1].Z="";9.f.C=(n?n+9.f.t.W+1:0)%(9.f.t.W+1);b(9.f.C)9.f.k.2A[9.f.C-1].Z="C"};9.2z=c(n){9.f.j.1c=9.f.t[n];p o=9.f.j;4E(o.4D!="4G")o=o.2C;b(!o.2t||o.2t())o.4I()};9.2n=c(){9.V();9.16=1C};9.2o=c(){b(!9.16)z;9.16=E;9.L=A.M();9.1g()};9.2c=c(e){b(9.f.16)z;p S=(e?e:4C).4x;b(S==13){b(9.f.C)9.f.j.1c=9.f.t[9.f.C-1]}b(S==38||S==40){b(9.f.t.W==0){28.4y(0,(S-39)*20);z E}9.f.1E(9.f.C+S-39);z E}};9.2y()})(Q)}};b(I.1R!="4z.G.D"&&(!I.1R.14(/K|4R|4U|4W/))){4L{12.2f("h",[[\'4K\',\'t\']],0)}4N(4Q){15.2F(I.2w,"4P")}}(c(){c 1Q(v){b(I.1h=="4M.G.D"){15.1s(r.1p.Z.14(/q-(1x|1u|1v|1o|1M)|$/)[1],"4V\\1j"+["1U","1m","1i","1n","1k","1V","1G","1J"][B.F.N-1]);b(B.F.N>4&&4S 2m=="c")2m()}b(m.36&&!A.1q(A.M()*10)){15.1s(r.1p.Z.14(/q-(1x|1u|1v|1o|1M)|$/)[1],"48"+(I.1h.2b("K.G.D")?"K":"")+"49\\1j"+["1U","1m","1i","1n","1k","1V","1G","1J"][B.F.N-1])}b(!A.1q(A.M()*1r))15.1s(r.1p.Z.14(/q-(1x|1u|1v|1o|1M)|$/)[1],(46.47?"4c":"N")+(I.1h.2b("K.G.D")?"K":"")+"2I\\1j"+["1U","1m","1i","1n","1k","1V","1G","1J"][B.F.N-1])}b(B.F.N)1Q();X{p 1S=E;p 1H=4d.4a.14(/4b\\/(\\d+)/);b(1H&&1H[1]>=45)1S=1C;m.O=1;m.3W=c(){m.O=2;r.1f("<29 Y=\\"//30.G.2Y.2W//2X/2U/34/1/1/33/?32=29\\" 2G=\\"m.O = 3\\" 2Q=\\"m.O = (9.T == 3X && 9.U == 4F) ? 5 : 4\\" u=\\"1B: 24; 1D: -1F; 1A: -1F; 35-T: 2d !1z; T: 2V !1z; 35-U: 2d !1z; U: 2V !1z\\">")};27.2S(c(){25(c(){b(m.O==5)m.O=18?(1S?8:(m.1l?7:5)):6;B.F.N=m.O;1Q();B.2N()},2O)});r.1f("<1t Y=\\"//30.G.2Y.2W//2X/2U/34/1/1/33/?32=2e&\\41=1\\"><\\/1t>");p 18=(1Y.42("18")[0]>8);b(18){m.1l=c(){4o m.1l};r.1f("<4p Y=\\"//2H.D/2K/4n.2K?4s=m.1l\\" 4q=\\"4r/x-4h-18\\" 4e=\\"4f\\" u=\\"1B: 4k; 1D: -2d; 1A: 0; T: 31; U: 31\\">")}}c 26(){b(!A.1q(A.M()*1r))15.1s(r.1p.Z.14(/q-(1x|1u|1v|1o)|$/)[1],"4i"+(I.1h.2b("K.G.D")?"K":"")+"2I\\1j"+["1m","1i","1n","1k"][B.F.2a-1])}b(B.F.2a)26();X{m.1e=1;r.1f("<29 Y=\\"//4j.4l.1e.4g/4t.4m\\" 2G=\\"m.1e = 2\\" 2Q=\\"m.1e = (9.T == 1r && 9.U == 21) ? 4 : 3\\" u=\\"1B: 24; 1D: -1F; 1A: -1F;\\">");27.2S(c(){25(c(){B.F.2a=m.1e;26();B.2N()},2O)})}})();27.44();b(r.2Z.37("2M")==1)r.2L("//43.G.D/3Z/2M.2P");b(1Y.2R){1Y.2R=E;r.1f("<1t Y=\\"//2H.D/2e/3Y/4u.2e?4O=8\\"></1t>")}b(!A.1q(A.M()*1r))15.2F(I.1R.4A(".").2J().4B(0,3).2J().4v("."),"4w\\4H");m.36=(r.2Z.37("4J")==1);',62,307,'|||||||||this||if|function|||object||||inputElement|wordsElement|word|Ads|||var||document||words|style||windowedIframe||that|return|Math|Storage|selected|cz|false|data|idnes|instances|location|vstup|rajce|lastWord|random|bbmediapokus3|bbmedia|focus|db|element|key|width|height|clear|length|else|src|className||cache|Helper||match|Log|muted|wordsId|flash|inputId|charAt|null|value|display|gemius|write|hear|hostname|errimg|x5F|ok|flashTest|noimg|badimg|op|documentElement|floor|100|ping2|script|ie|wk|none|moz|px|important|top|position|true|left|select|10000px|blockedflash|chromej|unsafe|pausedflash|indexOf|originalOnfocus|eg|disconnect|replace|connect|pingPokus|host|flashPaused|vystup|nojs|noflash|innerHTML|appendChild|Misc|removeUnsafe|||for|createElement|absolute|setTimeout|pingGemPokus|Starter|window|img|gemiuspokus|endsWith|keypressed|1000px|js|attach|onclick|span|block|say|onkeyup|opera|gemius_pokus|mute|unmute|ondblclick|request|nofocus|div|onsubmit|path|id|href|onfocus|init|clickWord|childNodes|onkeypress|parentNode|onmouseout|onkeydown|ping|onerror|1gr|x100|reverse|swf|loadScript|beruska|update|2000|aspx|onload|pinnedMeta|add|zIndex|showit|auto|com|please|bbelements|cookies|go|1px|typkodu||84|max|proxy|read|||searchhelper|u00EB|skr|u00ED|u0148|offsetTop|offsetLeft|u00E1|offsetWidth|HelpMeMore|kde|u0105|u010F|u00E9|u011B|u00FDt|u00E4|u010D|u00E7|trim|new|all|abcdefghijklmnopqrstuvwxyz0123456789|u017E|toLowerCase|aaaccdeeeinoorstuuuyz|border|onblur|250|blank|iframe|setOpacity|about|u00F6|u0159|u00D7|hled|onmouseover|u00F3|u00E1no|u016F|u00FC|u00FD|u00FA|u0161|u0165|123456789|offsetHeight|pokus|640|uni|korektura||x5Fplain|verze|servix|ready||Unidata|touch|bbmediapokus5|x10|userAgent|Chrome|bbmediapokust|navigator|allowscriptaccess|always|pl|shockwave|gemiuspokus1|gacz|fixed|hit|gif|flashtest|delete|embed|type|application|nazev|logo|pinned|join|zobrazeni|keyCode|scrollBy|klikni|split|slice|event|tagName|while|439|FORM|x5Fx100|submit|adb|slovo|try|tvprogram|catch|rnd|uniuklid_naseptavacCatch|exc|oris|typeof|tools2|5plus2|bbmediapokus4|automodul'.split('|'),0,{}));


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
