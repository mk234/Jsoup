package com.kment.jsoup.idnes.Article;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ExtractMetaFromArticleIdnes {

    public Date getCreatedDate(Document document) {
        if (document.select("meta[property=article:published_time]").first() == null)
            return new Date();
        String stringDate = document.select("meta[property=article:published_time]").first()
                .attr("content");
        DateTimeZone zone = DateTimeZone.getDefault();
        DateTime dateTime_Utc = new DateTime(stringDate, zone);
        Date date = dateTime_Utc.toDate();
        return date;
    }

    public String getKeywors(Document document) {
        if (document.select("meta[name=keywords]").first() == null)
            return "";
        else
            return
                    document.select("meta[name=keywords]").first()
                            .attr("content");
    }

    public String getDescription(Document document) {
        if (document.select("meta[name=description]").get(0) == null)
            return "";
        String description =
                document.select("meta[name=description]").get(0)
                        .attr("content");
        return description;
    }


    public String getAuthor(Document document) {
        String selectorName = "div.authors";
        if (document.select(selectorName).first() == null)
            return "";
        if (document.select(selectorName).first().select("span.h").first() == null)
            return document.select(selectorName).first().select("span").first().text();
        else
            return document.select(selectorName).first().select("span.h").first().text();
    }

    public int getNumburOfComment(Document document) {
        Element element = document.select("li.community-discusion").first();
        if (element == null)
            return 0;
        else {
            Elements numberOfComment = document.select("li.community-discusion").first().select("a#moot-linkin").first().select("span");
            return extractDigits(numberOfComment.text());
        }
    }


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
