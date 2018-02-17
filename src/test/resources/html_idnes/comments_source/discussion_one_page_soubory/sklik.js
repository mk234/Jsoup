Ads.sklik = (function()
{
  var hash = computeHash();
  var previousZHashes = [];
  var url = (document.querySelector && document.querySelector("link[rel=canonical]") || location).href;
  
  return function(param)
  {
    if(param.sticky && !window.addEventListener) return;
    if(!param.id)
    {
      param.id = "sklik" + Math.floor(Math.random() * 100000);
      document.write("<div id=\"" + param.id + "\"></div>");
    }
    var callback = "sklikCallback" + Math.floor(Math.random() * 100000);
    if(!param.template)
      param.template = "<h3>{creative1}</h3><p>{creative2} {creative3}";
    if(!param.templateDRTG)
      param.templateDRTG = "<h3>{manufacturer} {title}</h3><p>Koupit za {price}";
    
    function createLink(ad, wrapper, impUrl)
    {
      ad.screenshot100 = "https://fimg-resp.seznam.cz/?spec=ft100x75&fast=1&url=" + encodeURIComponent(ad.adUrl);
      ad.screenshot160 = "https://fimg-resp.seznam.cz/?spec=ft160x110&fast=1&url=" + encodeURIComponent(ad.adUrl);
      ad.screenshot280 = "https://fimg-resp.seznam.cz/?spec=ft280x130&fast=1&url=" + encodeURIComponent(ad.adUrl);
      var link = document.createElement("a");
      link.href = ad.clickUrl;
      link.target = "_blank";
      
      if(ad.adType != "ETA" && ad.adType != "DRTG" && ad.adType != "BANNER")
      {
        if(window.console) console.log(ad);
        return;
      }

      if(param.sticky)
      {
        var schema = {
          "light": { color: "#FFF", backdrop: "rgba(102, 102, 102, 0.8)", background: "#000" },
          "dark": { color: "#000", backdrop: "rgba(153, 153, 153, 0.9)", background: "#FFF" }
        }[window.FX ? FX.vzhled.schema : "light"];
        wrapper.style.cssText = "bottom: 0; display: none; z-index: 1000; position: fixed; background: " + schema.backdrop + "; text-align: center; opacity: 0; transition: transform 1s, opacity 1s; -webkit-transition: -webkit-transform 1s, opacity 1s; width: 100%; left: 0; padding-top: 3px; -webkit-transform: translateY(0); transform: translateY(0)";
        var close = document.createElement("a");
        wrapper.appendChild(close);
        close.innerHTML = "Zav\u0159\xedt reklamu";
        close.style.cssText = "padding: 10px 10px 5px; color: " + schema.color + "; background: " + schema.backdrop + "; position: absolute; right: 0; bottom: 100%"
        close.onclick = function()
        {
          wrapper.parentNode.removeChild(wrapper);
          html.classes.remove("sticky-bottom");
          document.body.style.paddingBottom = "";
          document.cookies.write("nosticky", 1, new Date(+new Date() + (param.cookieMin || 90) * 6e4));
        };
        link.style.cssText = "clear: both; color: " + schema.color + "; line-height: 1.5em; font-size: 110%; " + (ad.adType == "BANNER" ? "display: inline-block" : "display: block; padding: 0.4em 0.8em; background: " + schema.background);
      }
      wrapper.appendChild(link);

      if(ad.adType == "BANNER")
      {
        var image = document.createElement("img");
        image.style.cssText = "max-width: 100%; vertical-align: middle" + (param.sticky ? "; max-height: 17vh" : "");
        if(param.sticky) image.onload = initSticky;
        link.appendChild(image);
        image.src = ad.bannerUrl;
      }
      else
      {
        var template = ad.adType == "DRTG" ? param.templateDRTG : param.template;
        link.innerHTML = template.replace(/\{([^\}]+)\}/g, function(m, m1)
        {
          m1 = { "creative1": "headline1", "creative2": "headline2", "creative3": "description" }[m1] || m1;
          return ad[m1] || "";
        });
        if(param.sticky) window.addEventListener("load", initSticky, false);
      }
      if(param.log)
        link.onmousedown = function()
        {
          Log.link(this, param.log);
        };
        

      function initSticky()
      {
        wrapper.style.display = "";
        var height = link.offsetHeight + close.offsetHeight;
        wrapper.style.bottom = -height + "px";
        document.body.style.paddingBottom = link.offsetHeight + "px";
        var n = 0;
        window.addEventListener("scroll", function onscroll()
        {
          if(++n < 5) return;
          window.removeEventListener("scroll", onscroll, false);
          wrapper.style.transform = wrapper.style.WebkitTransform = "translateY(" + -height + "px)";
          wrapper.style.opacity = 1;
          html.classes.add("sticky-bottom");          
          if(impUrl) Log.pingUrl(impUrl);
        }, false);
      }
    }
    
    window[callback] = function(ads, options)
    {
      try { delete window[callback]; } catch (e) {};
      if(!ads || !ads.length) return;
      var wrapper = element(param.id);
      if(!wrapper) return;
      wrapper.className = param.className || "ads-sklik";
      if(param.sticky)
      {
        if(document.cookies.read("nosticky")) return;
        createLink(ads[0], wrapper, options && options.confirmImpUrl);
        return;
      }
      for(var i = 0; i < ads.length; i++)
        if(ads[i].adType == "ETA")
          createLink(ads[i], wrapper);
      if(options && options.confirmImpUrl) measureImpress(wrapper, options.confirmImpUrl, 0.5);
    };
    var scriptLink = "//c.imedia.cz/partnerJsApi/v3?previousZHashes=" + encodeURIComponent(previousZHashes.join(",")) + "&hash=" + hash + "&zHash=" + param.zHash + "&url=" + encodeURIComponent(url) + "&clbk=" + callback;
    document.loadScript(scriptLink);
    previousZHashes.push(param.zHash);
  };
  
  function measureImpress(node, url, percentage)
  {
    if(!node.getBoundingClientRect) { return; }

    var done = false;
    function test()
    {
      if(done) return;
      try {
       var rect = node.getBoundingClientRect();
       if ("width" in rect && !rect.width) { return; }
      } catch (e) { return; }

      var w = rect.right - rect.left;
      var h = rect.bottom - rect.top;
      var W = document.documentElement.clientWidth;
      var H = document.documentElement.clientHeight;

      var x = Math.max(0, Math.min(rect.right, W) - Math.max(rect.left, 0));
      var y = Math.max(0, Math.min(rect.bottom, H) - Math.max(rect.top, 0));
      var p = (x * y) / (w * h);

      if(p > percentage)
      {
        done = true;
        Log.pingUrl(url);
      }
    }
    Starter.scroll(test)();
  }
  
  function computeHash()
  {
    var data = [];
    for(var p in screen) { data.push(screen[p]); }
    if(navigator.plugins && navigator.plugins.length)
    {
      for(var i = 0; i < navigator.plugins.length; i++)
      {
        var plug = navigator.plugins[i];
        data.push(plug.description);
        data.push(plug.filename);
        
        for(var j = 0; j < plug.length; j++)
        {
          var mime = plug[j];
          data.push(mime.description);
          data.push(mime.suffixes);
          data.push(mime.type);
        }
      }
    }
    else if(window.ActiveXObject)
    {
      var DEF = {
        "AcroPDF.PDF": function() { return this.GetVersions(); },
        "PDF.PdfCtrl": function() { return this.GetVersions(); },
        "ShockwaveFlash.ShockwaveFlash": function() { return this.GetVariable("$version"); },
        "QuickTime.QuickTime": function() { return this.QuickTimeVersion; },
        "rmocx.RealPlayer G2 Control": function() { return this.GetVersionInfo(); },
        "rmocx.RealPlayer G2 Control.1": function() { return this.GetVersionInfo(); },
        "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)": function() { return this.GetVersionInfo(); },
        "RealVideo.Rep.CalVideo(tm) ActiveX Control (32-bit)": function() { return this.GetVersionInfo(); },
        "RealPlayer": function() { return this.GetVersionInfo(); },
        "WMPlayer.OCX": function() { return this.versionInfo; },
        "VideoLAN.VLCPlugin": function() { return this.VersionInfo; }
      }
      
      var o, v;
      for(var p in DEF)
      {
        try {
          o = new ActiveXObject(p);
          data.push(p);
        } catch (e) {
          continue;
        }
        
        try {
          v = DEF[p].call(o);
          data.push(v)
        } catch (e) {
          data.push("[unavail]");
        }
      }
    }
    
    var str = data.join("").toLowerCase();
    var hash = [0, 0, 0, 0];
    var index = 0;
    var max = 0xffff;
    
    for(var i = 0; i < str.length; i++)
    {
      hash[index] = (hash[index] + str.charCodeAt(i)) % max;
      index = (index+1) % hash.length;
    }
    return hash.join("");
  }  
})();

Module.ready("Sklik", Ads.sklik);
