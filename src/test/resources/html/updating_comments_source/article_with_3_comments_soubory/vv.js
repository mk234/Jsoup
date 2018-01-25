if(typeof vv_color_link=='undefined'){vv_color_link='green';}
if(typeof vv_color_word=='undefined'){if(vv_color_link!=''){vv_color_word=vv_color_link;}
else{vv_color_word='';}}
if(typeof vv_color_word_bg=='undefined'){vv_color_word_bg='';}
var vv_include_class="bbtext";var vv_exclude_class="not4bbtext";var vv_exclude_tags=new Array("A","H1","H2","H3","H4","H5","H6","SCRIPT");var vv_iframe_width=330;var vv_iframe_height=210;var vv_popup_timeout=300;var vv_hide_timeout=300;var vv_word_separators=new Array(' ',String.fromCharCode(160),',','.',';','-','?','!','"','\'',"\n","\t","\r",'(',')','[',']','{','}','/','„');var vv_text_nodes=new Array();var vv_word_nodes=new Array();var vv_hide_timer=null;function vvi_aa(){return window.location.search.indexOf('&vvdebug=1')>=0;}
function vvi_ba(xa){if(vvi_aa()){if(typeof console!='undefined'){console.log(xa);}
else{if(window.location.search.indexOf('&vvdebug=1')>=0)alert(xa);}}}
function vvi_ca(ya){document.write('<scr'+'ipt type="text/javascript" src="'+ya+'"></scr'+'ipt>');}
function vvi_da(){var za=escape(document.location.href);if(typeof vv_skin!='undefined'&&vv_skin){za=za+'&skin='+vv_skin;}
if(typeof vv_code!='undefined'&&vv_code){za=za+'&code='+vv_code;}
vvi_ca('https://intext.lookit.cz/vyloha.php?url='+za);}
function vvi_ea(Aa,Ba){for(var i=0;i<Aa.length;i++){if(Aa[i]===Ba){return true;}}
return false;}
function vvi_fa(e){var w,h;if(e.clip){w=e.clip.width;h=e.clip.height;}
else if(e.offsetWidth){w=e.offsetWidth;h=e.offsetHeight;}
else{w=e.style.pixelWidth;h=e.style.pixelHeight;}
return{width:parseInt(w),height:parseInt(h)};}
function vvi_ga(e){var p;var Ca={x:0,y:0};if(e.getBoundingClientRect){var Da=e.getBoundingClientRect();var Ea=document.documentElement.scrollTop||document.body.scrollTop;var Fa=document.documentElement.scrollLeft||document.body.scrollLeft;Ca.x=Da.left+Fa;Ca.y=Da.top+Ea;}
else if(document.getBoxObjectFor){Da=document.getBoxObjectFor(e);Ca.x=Da.x;Ca.y=Da.y;}
else{while(e!=null){Ca.x+=e.offsetLeft;Ca.y+=e.offsetTop;if(e!=document.body&&e!=document.documentElement){Ca.x-=e.scrollLeft;Ca.y-=e.scrollTop;}
e=e.offsetParent;}}
return Ca;}
function vvi_ha(Ga){var n;n=Ga;if(n.nodeType==3){n=n.parentNode;}
if(n.style){n.style.fontWeight="bold";}}
function vvi_ia(){css1='';if(vv_color_word_bg!=''){css1=css1+' background-color:'+vv_color_word_bg+' !important;';}
css1=css1+' color:'+vv_color_word+' !important; text-decoration:underline !important; padding-bottom: ';css2='px solid '+vv_color_word+' !important;';rules_css='a.vvword:link {'+css1+'1px; border-bottom: 1'+css2+'}';rules_css=rules_css+'a.vvword:visited {'+css1+'1px; border-bottom: 1'+css2+'}';rules_css=rules_css+'a.vvword:hover {'+css1+'0px; border-bottom: 2'+css2+'}';rules_css=rules_css+'a.vvword:active {'+css1+'0px; border-bottom: 2'+css2+'}';var Ha=document.getElementsByTagName('head')[0],style=document.createElement('style'),rules=document.createTextNode(rules_css);style.type='text/css';if(style.styleSheet){style.styleSheet.cssText=rules.nodeValue;}
else{style.appendChild(rules);}
Ha.appendChild(style);}
vv_iframe=new Array();function vvi_ja(Ia){if(vv_iframe[Ia])return;var Ja=document.createElement("iframe");vv_iframe[Ia]=Ja;Ja.setAttribute("id","vv_iframe"+Ia);Ja.setAttribute("name","vv_iframe"+Ia);src=vv_url[Ia];if(typeof(takeitTracker)!='undefined'){src=takeitTracker._getLinkerUrl(src);}
Ja.setAttribute("src",src);Ja.setAttribute("width",vv_iframe_width);Ja.setAttribute("height",vv_iframe_height);Ja.style.position="absolute";Ja.style.zIndex="9999";Ja.style.left="-1000px";Ja.style.top="-1000px";Ja.style.backgroundColor="#FFFFFF";Ja.style.background="transparent";Ja.allowTransparency=true;Ja.frameBorder=0;Ja.scrolling="no";Ja.style.border=0;Ja.style.display="none";Ja.onmouseover=new Function("vv_popup("+Ia+")");Ja.onmouseout=new Function("vv_hidex("+Ia+")");document.body.appendChild(Ja);}
function vvi_ka(Ka){vv_iframe[Ka].style.left=vv_left+"px";vv_iframe[Ka].style.top=vv_top+"px";vv_iframe[Ka].style.display="inline";vv_iframe[Ka].style.zIndex="9999";}
function vvi_la(){var La=0,scrOfY=0;if(typeof(window.pageYOffset)=='number'){scrOfY=window.pageYOffset;La=window.pageXOffset;}
else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){scrOfY=document.body.scrollTop;La=document.body.scrollLeft;}
else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){scrOfY=document.documentElement.scrollTop;La=document.documentElement.scrollLeft;}
return[La,scrOfY];}
function vv_popupDo(Ma){var e=vv_word_nodes[Ma];var Na=vvi_ga(e);var x=Na.x;var y=Na.y-vv_iframe_height;var Oa=vvi_la();if(y<Oa[1])y=Na.y+2*e.scrollHeight+3;if(y<0)y=0;if(x<0)x=0;vv_left=x;vv_top=y;vvi_ka(Ma);}
vv_lastpopup=false;function vv_popup(Pa){vv_lastpopup=Pa;vvi_ja(Pa);vvi_ma(Pa);setTimeout("vv_popupDo("+Pa+")",vv_popup_timeout);}
function vvi_na(){if(vv_lastpopup){vvi_oa(vv_lastpopup);}}
vv_hide_timer=new Array();function vv_hideDo(Qa){if(vv_hide_timer[Qa]==false)return;vv_hide_timer[Qa]=false;vv_lastpopup=false;vv_iframe[Qa].style.display="none";vv_iframe[Qa].style.left="-1000px";vv_iframe[Qa].style.top="-1000px";}
function vv_hidex(Ra){if(vv_iframe[Ra]){vv_iframe[Ra].style.zIndex="9998";vv_hide_timer[Ra]=setTimeout("vv_hideDo("+Ra+")",vv_hide_timeout);}}
function vvi_ma(Sa){if(vv_hide_timer[Sa]!=false){clearTimeout(vv_hide_timer[Sa]);vv_hide_timer[Sa]=false;}}
function vvi_pa(Ta,Ua,Va,Wa){var Xa,anode;var Ya=Ta.parentNode;var Za=Ta.nodeValue;var $a=Va+Ua.length;var ab=vv_url_target[Wa];var bb=vv_url_onclick[Wa];if(Va>0){Xa=document.createTextNode(Za.substring(0,Va));Ya.insertBefore(Xa,Ta);}
anode=document.createElement("a");anode.className="vvword";anode.href=ab;anode.target="_blank";anode.onmouseover=new Function("vv_popup("+Wa+")");anode.onmouseout=new Function("vv_hidex("+Wa+")");anode.onclick=new Function(bb);Xa=document.createTextNode(Ua);anode.insertBefore(Xa,anode.lastChild);vv_word_nodes[Wa]=anode;Ya.insertBefore(anode,Ta);if($a<Za.length){Xa=document.createTextNode(Za.substring($a,Za.length));Ya.insertBefore(Xa,Ta);}
Ya.removeChild(Ta);}
function vvi_qa(cb){var r=new Array();if(document.getElementsByTagName){var b=document.getElementsByTagName(cb);var j=0;for(var i=0;i<b.length;i++){cn=b[i].className;if(typeof cn=="string"&&cn.indexOf(vv_include_class)>-1&&cn.indexOf(vv_exclude_class)<0){r[j++]=b[i];}}}
return r;}
function vvi_ra(){var r=new Array();if(document.getElementsByTagName){var r=vvi_qa("div");if(r.length<1){r=vvi_qa("span");}
if(r.length<1){r=vvi_qa("p");}}
return r;}
function vvi_sa(db){if(db.nodeType==1){if(vvi_ea(vv_exclude_tags,db.tagName)){return;}
if(db.className&&db.className.indexOf(vv_exclude_class)>-1){return;}}
if(db.hasChildNodes()){for(var i=0;i<db.childNodes.length;i++){vvi_sa(db.childNodes[i]);}}
else{if(db.nodeType==3){vv_text_nodes[vv_text_nodes.length]=db;}}}
function vvi_ta(){vv_text_nodes=new Array();var b=vvi_ra();var i;for(i=0;i<b.length;i++){vvi_sa(b[i]);}}
function vvi_ua(c){return vvi_ea(vv_word_separators,c);}
function vvi_va(){var i,n,node,word,lnode,lword,lpos,lw,wlen,found,fc,frompos,nlen;for(var w=0;w<vv_slovo.length;w++){vvi_ta();word=vv_slovo[w];wlen=word.length;n=vv_vyskyt[w];found=false;fc=0;for(i=0;i<vv_text_nodes.length;i++){node=vv_text_nodes[i];ntext=node.nodeValue;nlen=ntext.length;frompos=0;while(frompos<nlen){pos=ntext.indexOf(word,frompos);if(pos>-1){fc++;frompos=pos+wlen;if((pos==0||vvi_ua(ntext.charAt(pos-1)))&&(pos+wlen>=ntext.length||vvi_ua(ntext.charAt(pos+wlen)))){if(n--==1){found=true;frompos=nlen;vvi_pa(node,word,pos,w);vvi_ba('FOUND "'+word+'": n='+n+' n0='+vv_vyskyt[w]+' fc='+fc+' wlen='+wlen);break;}
lnode=node;lword=word;lpos=pos;}}
else{frompos=nlen;}
if(found)break;}
if(found)break;}
if(!found&&n>0&&lpos){found=true;vvi_pa(lnode,lword,lpos,w);vvi_ba('USE LAST "'+word+'": n='+n+' n0='+vv_vyskyt[w]+' fc='+fc+' wlen='+wlen);}
if(!found){vvi_ba('NOT FOUND "'+word+'": n='+n+' n0='+vv_vyskyt[w]+' fc='+fc+' wlen='+wlen);}}
vvi_ba(vv_slovo);}
function vvi_wa(){vvi_ta();if(vv_text_nodes.length>1){vvi_da();}}
vv_init_called=false;function vv_init(){if(!vv_init_called){vv_init_called=true;vvi_ia();vvi_va();}}
vvi_wa();
