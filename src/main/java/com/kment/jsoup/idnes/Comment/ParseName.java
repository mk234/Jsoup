package com.kment.jsoup.idnes.Comment;

import org.jsoup.Jsoup;

public class ParseName {
    public String regex(String name) {
        name = name.replaceAll("(?<=<i>).*?(?=</i>)", "");
        System.out.println("1 - " + name);
        name = Jsoup.parse(name).text();
        System.out.println("2 - " + name);
        name = name.substring(0, name.lastIndexOf(" "));
        System.out.println(name.length());
        if (name.length() == 0) {
            System.out.println("nic tam neni");
            return "";
        } else {
            System.out.println("3 - " + name);
            return name;
        }
    }
}
