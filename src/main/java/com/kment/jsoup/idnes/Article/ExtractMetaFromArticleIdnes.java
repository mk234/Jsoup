package com.kment.jsoup.idnes.Article;

import com.kment.jsoup.extractor.ExtractMeta;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ExtractMetaFromArticleIdnes {
    @Autowired
    ExtractMeta extractMeta = new ExtractMeta();

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
        return extractMeta.getKeywors(document);
    }

    public String getDescription(Document document) {
        return extractMeta.getDescription(document);
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
            return extractMeta.extractDigits(numberOfComment.text());
        }
    }


}

