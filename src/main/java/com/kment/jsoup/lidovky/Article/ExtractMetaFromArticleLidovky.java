package com.kment.jsoup.lidovky.Article;

import com.kment.jsoup.extractor.ExtractMeta;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ExtractMetaFromArticleLidovky {

    @Autowired
    ExtractMeta extractMeta;

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
        else return document.select(selectorName).text();

    }

    public int getNumburOfComment(Document document) {
        Element element = document.select("div.disc-top").first();
        if (element == null)
            return 0;
        if (!element.text().matches(".*\\d+.*"))
            return 0;
        else
            return extractMeta.extractDigits(element.text());
    }


}

