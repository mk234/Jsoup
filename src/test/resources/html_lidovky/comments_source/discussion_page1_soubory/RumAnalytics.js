!function(){if(window.localStorage&&window.localStorage.performance){var t=!1,n=function(){function n(t){this.sent=!1,this.contentfulPaintTime=null,this.navigationEvent=null,this.cacheableItems=0,this.cachedItems=0,this.totalResources=0,this.age=0,this.isCurrent=t,this.sent=!1,this.contentfulPaintTime=null,this.navigationEvent=null,this.cacheableItems=0,this.cachedItems=0,this.totalResources=0,this.age=0,this.receivedData=[],this.shouldSendExtended=Math.random()<1/240}return n.prototype.send=function(){var n={age:this.age,responseStart:null,responseEnd:null,transferSize:null,contentfulPaint:null,navigationEnd:null,touch:-1!==document.cookie.indexOf("setver=touch"),ua:navigator.userAgent,location:window.location.toString(),cache:Math.round(this.cachedItems/(this.cacheableItems||1)*100),totalItems:this.totalResources,domInteractive:null,version:"1.0.1"};null!==this.contentfulPaintTime&&(n.contentfulPaint=Math.round(this.contentfulPaintTime)),this.navigationEvent&&(n.responseStart=Math.round(this.navigationEvent.responseStart),n.responseEnd=Math.round(this.navigationEvent.responseEnd),n.transferSize=Math.round(this.navigationEvent.transferSize),n.navigationEnd=Math.round(this.navigationEvent.duration),n.domInteractive=Math.round(this.navigationEvent.domInteractive)),this.shouldSendExtended&&(n.extended=this.getExtended()),fetch("https://idnesperformance.azurewebsites.net/api/analytics-intake?code=TRm2WhLo03DDFCe7EvXMP9tgJxGfOhocscKB0d66Gb57hhNiCFc3bQ==",{method:"POST",body:JSON.stringify(n)}),this.sent=!0,this.isCurrent&&(window.localStorage.performance="",t=!0)},n.prototype.getExtended=function(){var t={},n=[];this.receivedData.forEach(function(e){for(var i in e)e.hasOwnProperty(i)&&(t[i]||n.push(i),t[i]=!0)});var e=this.receivedData.map(function(t){return n.map(function(n){return t[n]}).join("\t")}).join("\n");return n.join("\t")+"\n"+e},n.prototype.onEachEvent=function(t){if(!(t.length<2))try{var n=JSON.parse(t);if("number"==typeof n)this.age=Date.now()-n;else switch(this.receivedData.push(n),n.entryType){case"navigation":this.navigationEvent=n,this.send();break;case"paint":"first-contentful-paint"===n.name&&(this.contentfulPaintTime=n.startTime);break;case"resource":this.totalResources+=1,(null===this.contentfulPaintTime&&"script"===n.intiatorType||"css"===n.initiatorType)&&(this.cacheableItems+=1,0===n.duration&&(this.cachedItems+=1))}}catch(t){console.error(t)}},n}(),e=new n(!0);window.notePerformance=function(n){!1===t&&(window.localStorage.performance+=n+"\n",e.onEachEvent(n))};var i=window.localStorage.performance.split(/-----\n/),a=i.pop();window.localStorage.performance=a,i.forEach(function(t){if(t.length){var e=new n(!1);t.split("\n").forEach(function(t){e.onEachEvent(t)}),e.sent||e.send()}}),a.split("\n").forEach(function(t){e.onEachEvent(t)})}}();