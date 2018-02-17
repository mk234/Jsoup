var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),__awaiter=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))(function(i,s){function r(t){try{p(o.next(t))}catch(t){s(t)}}function a(t){try{p(o.throw(t))}catch(t){s(t)}}function p(t){t.done?i(t.value):new n(function(e){e(t.value)}).then(r,a)}p((o=o.apply(t,e||[])).next())})},__generator=this&&this.__generator||function(t,e){var n,o,i,s,r={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return s={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function a(s){return function(a){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;r;)try{if(n=1,o&&(i=o[2&s[0]?"return":s[0]?"throw":"next"])&&!(i=i.call(o,s[1])).done)return i;switch(o=0,i&&(s=[0,i.value]),s[0]){case 0:case 1:i=s;break;case 4:return r.label++,{value:s[1],done:!1};case 5:r.label++,o=s[1],s=[0];continue;case 7:s=r.ops.pop(),r.trys.pop();continue;default:if(!(i=(i=r.trys).length>0&&i[i.length-1])&&(6===s[0]||2===s[0])){r=0;continue}if(3===s[0]&&(!i||s[1]>i[0]&&s[1]<i[3])){r.label=s[1];break}if(6===s[0]&&r.label<i[1]){r.label=i[1],i=s;break}if(i&&r.label<i[2]){r.label=i[2],r.ops.push(s);break}i[2]&&r.ops.pop(),r.trys.pop();continue}s=e.call(t,r)}catch(t){s=[6,t],o=0}finally{n=i=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,a])}}};!function(){var t=function(){return function(t){this.key=t}}(),e=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return __extends(e,t),e.prototype.read=function(){var t=this;return window.GlobalStorage?new Promise(function(e){window.GlobalStorage.read(t.key,function(t){e(t.length?t:void 0)})}):Promise.reject("No GlobalStorage present")},e.prototype.write=function(t){var e=this;return window.GlobalStorage?new Promise(function(n,o){window.GlobalStorage.write(e.key,t,function(t){t?n():o(t)})}):Promise.reject("No Globalstorage present")},e}(t),n=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return __extends(e,t),e.prototype.write=function(t){return window.localStorage?(window.localStorage[this.key]=t,Promise.resolve()):Promise.reject("No Localstorage present")},e.prototype.read=function(){return window.localStorage?Promise.resolve(window.localStorage[this.key]):Promise.reject("No Localstorage present")},e}(t),o={sport:["sport.idnes.cz","fotbal.idnes.cz","hokej.idnes.cz","oh.idnes.cz"],expres:["www.expres.cz","expres.cz"],ocko:["ocko.tv","www.ocko.tv"],zpravy:["zpravy.idnes.cz"]},i=function(){function t(t){var i=this;if(this.host=window.location.host,this.isHost(o.expres))this.storage=new n("notifikace-popup-expres");else if(this.isHost(o.ocko))this.storage=new n("notifikace-popup-ocko");else if(this.isHost(o.sport))this.storage=new e("notifikace-popup-sport");else{if(!this.isHost(o.zpravy))return void console.log("Notifications: unknown host: "+this.host);this.storage=new e("notifikace-popup")}this.parentNode=t||document.body,this.createDOM(),window.addEventListener("message",function(t){"notification-result"===t.data.type&&i.onPromptResult(t.data.status,t.data.error)}),this.persistentState={notificationsDecision:"undecided",lastQuery:Date.now(),queryCount:0}}return t.prototype.onYesClick=function(){var t=this;if(this.log("preliminary-success"),"https:"===window.location.protocol){window.onNotificationRegistrationComplete=function(e,n){e?t.onPromptResult("success"):t.onPromptResult("error",n)};var e=document.createElement("script");e.src="https://1gr.cz/js/notifikace/notifikace.min.js",e.async=!0,this.element.appendChild(e)}else window.open("https://zpravy.idnes.cz/Notifikace.aspx","_blank","menubar=0,status=0,toolbar=0,width=400,height=150")},t.prototype.run=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(t){switch(t.label){case 0:return[4,this.getShouldBeDisplayed()];case 1:return t.sent()&&this.display(),[2]}})})},t.prototype.onNoClick=function(){this.persistentState.notificationsDecision="disabled",this.savePersistentState(),this.log("hide"),this.hide()},t.prototype.onPromptResult=function(t,e){this.hide(),"success"===t?(this.log("final-success"),this.persistentState.notificationsDecision="enabled"):(console.log(e),this.log("final-fail"),this.persistentState.notificationsDecision="disabled"),this.savePersistentState()},t.prototype.getVariant=function(){var t=[];return this.isHost(o.sport)?(t.push({question:"Nejd�le�it�j�� sportovn� zpr�vy na va�em monitoru",yesAnswer:"Povolit",noAnswer:"Nepovolit"}),this.variantId="sport"):this.isHost(o.expres)?(t.push({question:"Chci m�t ka�d� den nejd�le�it�j�� zpr�vy ve sv�m prohl�e�i!",yesAnswer:"ANO",noAnswer:"Ne, d�kuji"}),this.variantId="expres"):this.isHost(o.ocko)?(t.push({question:"Chci m�t ka�d� den �hav� novinky, sout�e a zaj�mavosti ve sv�m prohl�e�i",yesAnswer:"ANO",noAnswer:"Ne, d�kuji"}),this.variantId="ocko"):(t.push({question:"Nejd�le�it�j�� zpr�vy na va�em monitoru",yesAnswer:"Povolit",noAnswer:"Nepovolit"}),this.variantId="idnes"),t[0]},t.prototype.display=function(){this.log("display"),this.parentNode.appendChild(this.element)},t.prototype.hide=function(){this.parentNode.removeChild(this.element)},t.prototype.getShouldBeDisplayed=function(){return __awaiter(this,void 0,void 0,function(){var t,e,n,o,i,s;return __generator(this,function(r){switch(r.label){case 0:return[4,this.storage.read()];case 1:return void 0!==(t=r.sent())?(this.persistentState=JSON.parse(t),"undecided"!==this.persistentState.notificationsDecision?(console.log("Notitications: not displaying, decision made: "+this.persistentState.notificationsDecision),[2,!1]):(e=new Date(this.persistentState.lastQuery),n=new Date,o=(n.getTime()-e.getTime())/864e5,i=!1,this.persistentState.queryCount<=3?(s=n.getDate()!==e.getDate(),(o>.25&&s||o>1)&&(console.log("Notifications: displaying, < 3 views, > 1 day"),i=!0)):o>7&&(i=!0,console.log("Notifications: displaying, > 1 week")),!0===i?(this.persistentState.queryCount+=1,this.persistentState.lastQuery=Date.now(),this.savePersistentState()):console.log("Notitications: not displaying, under timeout"),[2,i])):(this.persistentState={notificationsDecision:"undecided",lastQuery:Date.now(),queryCount:0},console.log("Notitications: not displaying, new"),this.savePersistentState(),[2,!1])}})})},t.prototype.isHost=function(t){return t.indexOf(window.location.host)>=0},t.prototype.savePersistentState=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(t){return this.storage.write(JSON.stringify(this.persistentState)),[2]})})},t.prototype.log=function(t){var e="notifikace-"+this.variantId+"-"+t;window.Log&&window.Log.ping(window.location.toString(),e)},t.prototype.createDOM=function(){var t=this;this.element=document.createElement("div"),this.element.id="notifikace-popup";var e=this.getVariant();this.element.innerHTML="<b>"+e.question+'</b>\n                <div class="buttons"></div>',this.yesButton=document.createElement("a"),this.yesButton.href="#",this.yesButton.className="yes-button",this.yesButton.innerHTML=e.yesAnswer,this.yesButton.addEventListener("click",function(e){e.preventDefault(),t.onYesClick()}),this.noButton=document.createElement("a"),this.noButton.href="#",this.noButton.className="no-button",this.noButton.innerHTML=e.noAnswer,this.noButton.addEventListener("click",function(e){e.preventDefault(),t.onNoClick()});var n=this.element.querySelector(".buttons");n.appendChild(this.noButton),n.appendChild(this.yesButton);var i=document.createElement("style"),s=this.isHost(o.expres)?"https://1gr.cz/u/favicon/apple-touch-icon/expres.png":this.isHost(o.ocko)?"http://1gr.cz/u/favicon/apple-touch-icon/ocko.png":"https://1gr.cz/u/favicon/apple-touch-icon.png";i.innerHTML="\n            #notifikace-popup {\n                position: fixed;\n                top: 0;\n                left: 50%;\n                transform: translate(-50%, 0);\n                background: white;\n                border-bottom-left-radius: 3px;\n                border-bottom-right-radius: 3px;\n                padding: 20px 20px;\n                font-size: 14px;\n                color: #666666;\n                font-family: Roboto, 'Fira Sans', helvetica, arial, sans-serif;\n                box-shadow: 0 2px 6px rgba(0,0,0,0.2);\n                line-height: 1.5em;\n                text-align: left;\n                z-index: 9999;\n                cursor: auto;\n                width: calc(100% - 60px);\n                max-width: 500px;\n            }\n            @media screen and (max-width: 1023px) {\n                #notifikace-popup {\n                    top: auto;\n                    bottom: 0;\n                    box-shadow: 0 -2px 6px rgba(0,0,0,0.2);\n                    border-radius: 0;\n                    border-top-left-radius: 3px;\n                    border-top-right-radius: 3px;\n                }\n            }\n            #notifikace-popup::before {\n                content: \"\";\n                position: absolute;\n                top: 20px;\n                left: 20px;\n                background: transparent url('"+s+"');\n                background-size: contain;\n                width: 80px;\n                height: 80px;\n            }\n            #notifikace-popup > b, #notifikace-popup > span {\n                display: block;\n                padding-left: 100px;\n            }\n            #notifikace-popup > b {\n                text-transform: uppercase;\n                font-weight: normal;\n            }\n            @media screen and (max-width: 400px) {\n                #notifikace-popup > b {\n                    min-height: 84px;\n                }\n            }\n            #notifikace-popup .buttons {\n                float: right;\n                margin-top: 1.5em;\n                width: 100%;\n                max-width: 280px;\n            }\n            #notifikace-popup .buttons a {\n                display: block;\n                float: left;\n                text-align: center;\n                text-transform: uppercase;\n                text-decoration: none;\n                color: #4285f4;\n                border-radius: 3px;\n                width: calc(50% - 10px);\n            }\n            #notifikace-popup .buttons a.no-button {\n                padding: 10px 0;\n            }\n            #notifikace-popup .buttons a.no-button:hover {\n                text-decoration: underline;\n            }\n            #notifikace-popup .buttons a.yes-button {\n                padding: 10px 0;\n                margin-left: 20px;\n                background-color: #1976D2;\n                color: white;\n                box-shadow: 0 3px 5px rgba(0,0,0,0.2);\n            }\n            #notifikace-popup .buttons a.yes-button:hover {\n                background-color: #1E88E5;\n            }\n            #notifikace-popup .buttons a.yes-button:active {\n                background-color: #0D47A1;\n            }\n            #notifikace-popup iframe {\n                width: 0;\n                height: 0;\n                visibility: hidden;\n            }\n            ",document.head.appendChild(i)},t}();navigator.serviceWorker&&(window.notifikacePopup=(new i).run())}();