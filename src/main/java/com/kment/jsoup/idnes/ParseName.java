package com.kment.jsoup.idnes;

import org.jsoup.Jsoup;

public class ParseName {
    String regex(String name) {
        name = name.replaceAll("(?<=<i>).*?(?=</i>)", "");
        name = Jsoup.parse(name).text();
        name = name.substring(0, name.lastIndexOf(" "));
        return name;
    }
}
