package com.kment.jsoup.lidovky.Article;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ExtractMetaFromArticleLidovky {
    //funguje i pro novinku, u ihned zobrazuje datum spravne, ale cas spatne
    public Date getCreatedDate(Document document) {
        if (document.select("meta[property=article:published_time]").first() == null)
            return new Date();
        String stringDate = document.select("meta[property=article:published_time]").first()
                .attr("content");
        System.out.println("string datw " + stringDate);
        DateTimeZone zone = DateTimeZone.getDefault();
        DateTime dateTime_Utc = new DateTime(stringDate, zone);
        Date date = dateTime_Utc.toDate();
        System.out.println("date " + date);
        return date;
    }

    //funguje i pro novinky, ihned
    public String getKeywors(Document document) {
        if (document.select("meta[name=keywords]").first() == null)
            return "";
        else
            return
                    document.select("meta[name=keywords]").first()
                            .attr("content");
    }

    //funguje i pro novinky, ihned
    public String getDescription(Document document) {
        if (document.select("meta[name=description]").get(0) == null)
            return "";
        String description =
                document.select("meta[name=description]").get(0)
                        .attr("content");
        return description;
    }

    //upraveno, pouze pro lidovky
    public String getAuthor(Document document) {
        String selectorName = "div.authors";
        if (document.select(selectorName).first() == null)
            return "";
        else return document.select(selectorName).text();
      /*  if (document.select(selectorName).first().select("span.h").first() == null)
            return document.select(selectorName).first().select("span").first().text();
        else
            return document.select(selectorName).first().select("span.h").first().text();
   */
    }

    //kompletne predelano
    public int getNumburOfComment(Document document) {
        Element element = document.select("div.disc-top").first();
        if (element == null)
            return 0;
        if (!element.text().matches(".*\\d+.*"))
            return 0;
        else
            return extractDigits(element.text());
    }

    //spolecne pro vsechny
    public int extractDigits(String src) {
        if (src.equals("")) {
            return 0;
        } else {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < src.length(); i++) {
                char c = src.charAt(i);
                if (Character.isDigit(c)) {
                    builder.append(c);
                }
            }
            return Integer.parseInt(builder.toString());
        }
    }


}

