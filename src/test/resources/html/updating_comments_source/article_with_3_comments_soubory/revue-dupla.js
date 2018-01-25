setTimeout(function()
{
  if(!VideoPlayer.supportsAutoplay) return;
  if(!element("@.opener-flv-player")) return;
  var original = VideoPlayer.getInstance(0);
  if(!original) return;
  original.events.onfirstrun = function()
  {
    wrapper.parentNode.removeChild(wrapper);
  };
  
  var wrapper = document.createElement("div");
  element("art-text").appendChild(wrapper);
  Misc.video({ data: original.dataLink, ratio: 16/9, writeTo: wrapper, id: "autocopy", initVolume: 0 });
  var running;
  Starter.scroll(function()
  {
    if(running) return;
    var rect = wrapper.getBoundingClientRect();
    var perc = Math.max(0, Math.min(rect.right, document.documentElement.clientWidth) - Math.max(rect.left, 0)) * Math.max(0, Math.min(rect.bottom, document.documentElement.clientHeight) - Math.max(rect.top, 0)) / (rect.right - rect.left) / (rect.bottom - rect.top);
    if(perc > 0.95)
    {
      var copy = VideoPlayer.getInstance("autocopy");
      if(!copy) return;
      running = true;
      var title;
      for(var i = 0; i < original.data.items.length; i++)
      {
        var item = original.data.items[i];
        if(item.type == "video" || item.type == "stream")
        {
          title = item.title;
          break;
        }
      }
      zalogovat(title || "");
      copy.firstRun();
    }
  });
  
  
  function zalogovat(title)
  {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      'event': 'VideoEvent',
      'eventCategory': 'Video',
      'eventAction': 'ArticleBottomPlayerStart',
      'eventLabel': title,
      'eventValue': '0',
      'eventInteraction': 'false'
    });
  }
  
}, 1000);
