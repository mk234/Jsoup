package com.kment.jsoup.idnes.Comment;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

@Component
public class ParseName {
    public String regex(String name) {
        name = name.replaceAll("(?<=<i>).*?(?=</i>)", "");
        name = Jsoup.parse(name).text();
        if (StringUtils.containsWhitespace(name)){
            return name.substring(0, name.lastIndexOf(" "));}
        else
        return "";
    }
}
