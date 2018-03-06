var _satellite = { pageBottom: function(){} };

if(location.host == "jizdnirady.idnes.cz")
{
  var cpex_AAM_conf = {    
      "partner"  :"cpex",
      "publisher":"Mafra",
      "state"    :"publisher", // advertiser
      "private"  :"knihy.idnes.cz", 
      "namespace":3, 
      "shortener":true, // true for production
      "debug"    :false, // false for production
      "noMobile" :true  // disable mobile traffic
  };

  document.write("<script src=\"//assets.adobedtm.com/4beaca54604aa1db7a7d9296a08d83bee398e7fd/satelliteLib-48fbeae0fb292bfc246d8faf8e887c00420fc0c1.js\"><\/script>");
}