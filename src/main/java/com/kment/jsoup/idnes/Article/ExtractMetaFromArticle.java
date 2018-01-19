package com.kment.jsoup.idnes.Article;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;

@Component
public class ExtractMetaFromArticle {

    public Date getCreatedDate(Document document) throws ParseException {
        if (document.select("meta[property=article:published_time]").first() == null)
            return new Date();
        String stringDate = document.select("meta[property=article:published_time]").first()
                .attr("content");
        DateTimeZone zone = DateTimeZone.forID("America/Montreal");
        DateTime dateTime_Utc = new DateTime(stringDate + "Z", zone);
        Date date = dateTime_Utc.toDate();
        return date;
    }

    public String getKeywors(Document document) throws IOException {
        if (document.select("meta[name=keywords]").first() == null)
            return "";
        else
            return
                    document.select("meta[name=keywords]").first()
                            .attr("content");
    }

    public String getDescription(Document document) throws IOException {
        if (document.select("meta[name=description]").get(0) == null)
            return "";
        String description =
                document.select("meta[name=description]").get(0)
                        .attr("content");
        return description;
    }


    public String getAuthor(Document document) throws IOException {
        String selectorName = "div.authors";
        if (document.select(selectorName).first() == null)
            return "";
        else
            return document.select(selectorName).first().select("span").first().text();
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

