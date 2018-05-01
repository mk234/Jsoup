package com.kment.jsoup.novinky.Article;

import com.kment.jsoup.extractor.ExtractMeta;
import org.apache.commons.lang3.time.DateUtils;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ExtractMetaFromArticleNovinky {

    @Autowired
    ExtractMeta extractMeta = new ExtractMeta();

    public Date getCreatedDate(Document document) {
        String dateString = document.select("p#articleDate").text();
        Date newDate = new Date();
        if (dateString.contains("-")) {
            dateString = dateString.substring(0, dateString.indexOf("-") - 1);
        }
        if (dateString.contains("Aktualizováno")) {
            dateString = dateString.substring(0, dateString.indexOf("(") - 1);
        }
        if (dateString.contains("Dnes")) {
            dateString = dateString.replaceAll("Dnes", "");
            String hour = dateString.substring(dateString.lastIndexOf(",") + 2, dateString.indexOf(":"));
            String minute = dateString.substring(dateString.indexOf(":") + 1, dateString.length());
            newDate = DateUtils.setHours(newDate, Integer.parseInt(hour));
            newDate = DateUtils.setMinutes(newDate, Integer.parseInt(minute));
            return newDate;
        }
        if (dateString.contains("Včera")) {
            dateString = dateString.replaceAll("Včera", "");
            String hour = dateString.substring(dateString.lastIndexOf(",") + 2, dateString.indexOf(":"));
            String minute = dateString.substring(dateString.indexOf(":") + 1, dateString.length());
            newDate = DateUtils.addDays(newDate, -1);
            newDate = DateUtils.setHours(newDate, Integer.parseInt(hour));
            newDate = DateUtils.setMinutes(newDate, Integer.parseInt(minute));
            return newDate;
        } else {
            dateString = dateString.substring(dateString.indexOf(' ') + 1);
            String day = dateString.substring(0, dateString.indexOf("."));
            String month = dateString.substring(dateString.indexOf(".") + 2, dateString.lastIndexOf(",") - 5);
            String year = dateString.substring(dateString.lastIndexOf(",") - 4, dateString.lastIndexOf(","));
            String hour = dateString.substring(dateString.lastIndexOf(",") + 2, dateString.indexOf(":"));
            String minute = dateString.substring(dateString.indexOf(":") + 1, dateString.length());
            newDate = DateUtils.setDays(newDate, Integer.parseInt(day));
            newDate = DateUtils.setMonths(newDate, extractMeta.getMonth(month));
            newDate = DateUtils.setYears(newDate, Integer.parseInt(year));
            newDate = DateUtils.setHours(newDate, Integer.parseInt(hour));
            newDate = DateUtils.setMinutes(newDate, Integer.parseInt(minute));
            return newDate;
        }

    }



    public String getKeywors(Document document) {
        return extractMeta.getKeywors(document);
    }


    public String getDescription(Document document) {
        return extractMeta.getDescription(document);
    }


    public String getAuthor(Document document) {
        String selectorName = "p.articleAuthors";
        if (document.select(selectorName).first() == null)
            return "";
        else return document.select(selectorName).text();

    }


    public int getNumburOfComment(Document document) {
        Element element = document.select("div#discussionEntry").first();
        if (element == null)
            return 0;
        if (!element.text().matches(".*\\d+.*"))
            return 0;
        else
            return extractMeta.extractDigits(element.text());
    }


    public String getArticleAddressFromCommentPage(Document document) {
        Element element = document.select("p.back").first();
        String href = element.html();
        String myString = "core/pages/viewemployee.jsff";
        int html = href.lastIndexOf(".html");
        int backSlash = href.indexOf("/");
        String address = "https://www.novinky.cz" + href.substring(backSlash, html + 5);
        return address;
    }
}

