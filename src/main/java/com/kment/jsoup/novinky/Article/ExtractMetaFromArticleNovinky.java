package com.kment.jsoup.novinky.Article;

import org.apache.commons.lang3.time.DateUtils;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class ExtractMetaFromArticleNovinky {
    //done
    public Date getCreatedDate(Document document) {
        String dateString = document.select("p#articleDate").text();
        Date newDate = new Date();
        if (dateString.contains("-")) {
            System.out.println("removew sub");
            dateString = dateString.substring(0, dateString.indexOf("-") - 1);
        }
        if (dateString.contains("Aktualizováno")) {
            System.out.println("remove aktualizovano");
            dateString = dateString.substring(0, dateString.indexOf("(") - 1);
            System.out.println("aktualiz " + dateString);
        }
        if (dateString.contains("Dnes")) {
            dateString = dateString.replaceAll("Dnes", "");
            System.out.println(dateString);
            String hour = dateString.substring(dateString.lastIndexOf(",") + 2, dateString.indexOf(":"));
            String minute = dateString.substring(dateString.indexOf(":") + 1, dateString.length());
            System.out.println("time " + hour + ":" + minute);
            System.out.println(newDate);
            newDate = DateUtils.setHours(newDate, Integer.parseInt(hour));
            System.out.println(newDate);
            newDate = DateUtils.setMinutes(newDate, Integer.parseInt(minute));
            System.out.println(newDate);
            return newDate;
        }
        if (dateString.contains("Včera")) {
            System.out.println("vcera");
            dateString = dateString.replaceAll("Včera", "");
            System.out.println(dateString);
            String hour = dateString.substring(dateString.lastIndexOf(",") + 2, dateString.indexOf(":"));
            String minute = dateString.substring(dateString.indexOf(":") + 1, dateString.length());
            System.out.println("time " + hour + ":" + minute);
            System.out.println(newDate);
            newDate = DateUtils.addDays(newDate, -1);
            System.out.println(newDate);
            newDate = DateUtils.setHours(newDate, Integer.parseInt(hour));
            System.out.println(newDate);
            newDate = DateUtils.setMinutes(newDate, Integer.parseInt(minute));
            System.out.println(newDate);
            return newDate;
        } else {

            System.out.println("old date " + dateString);
/*
            dateString = dateString.substring(dateString.indexOf(' ') + 1);

            DateTimeFormatter format = DateTimeFormat.forPattern("dd. MMM yyyy, HH:mm");
            LocalDateTime time = format.parseLocalDateTime(dateString);
            System.out.println("time " + time);
            newDate = time.toDate();
            System.out.println("new date " + newDate);
*/

            String day = dateString.substring(0, dateString.indexOf("."));
            String month = dateString.substring(dateString.indexOf(".") + 2, dateString.lastIndexOf(",") - 5);
            String year = dateString.substring(dateString.lastIndexOf(",") - 4, dateString.lastIndexOf(","));
            String hour = dateString.substring(dateString.lastIndexOf(",") + 2, dateString.indexOf(":"));
            String minute = dateString.substring(dateString.indexOf(":") + 1, dateString.length());
            System.out.println("time " + day + "." + month + " " + year + " " + hour + ":" + minute);
            newDate = DateUtils.setDays(newDate, Integer.parseInt(day));
            System.out.println(newDate);
            Map<String, Integer> months = new HashMap<String, Integer>();
            months.put("ledna", 1);
            months.put("února", 2);
            months.put("března", 3);
            months.put("dubna", 4);
            months.put("května", 5);
            months.put("června", 6);
            months.put("července", 7);
            months.put("srpna", 8);
            months.put("září", 9);
            months.put("října", 10);
            months.put("listopadu", 11);
            months.put("prosince", 12);
            newDate = DateUtils.setMonths(newDate, months.get(month));
            System.out.println(newDate);
            newDate = DateUtils.setYears(newDate, Integer.parseInt(year));

            newDate = DateUtils.setHours(newDate, Integer.parseInt(hour));
            System.out.println(newDate);
            newDate = DateUtils.setMinutes(newDate, Integer.parseInt(minute));
            System.out.println(newDate);
            return newDate;
        }

    }

    public static void main(String[] args) {
        String dateString = "20. března 2018, 8:47";
        Date newDate = new Date();
        System.out.println(dateString);
        String day = dateString.substring(0, dateString.indexOf("."));
        String month = dateString.substring(dateString.indexOf(".") + 2, dateString.lastIndexOf(",") - 5);
        String year = dateString.substring(dateString.lastIndexOf(",") - 4, dateString.lastIndexOf(","));
        String hour = dateString.substring(dateString.lastIndexOf(",") + 2, dateString.indexOf(":"));
        String minute = dateString.substring(dateString.indexOf(":") + 1, dateString.length());
        System.out.println("time " + day + "." + month + " " + year + " " + hour + ":" + minute);
        newDate = DateUtils.setDays(newDate, Integer.parseInt(day));
        System.out.println(newDate);
        Map<String, Integer> months = new HashMap<String, Integer>();
        months.put("ledna", 1);
        months.put("února", 2);
        months.put("března", 3);
        months.put("dubna", 4);
        months.put("května", 5);
        months.put("června", 6);
        months.put("července", 7);
        months.put("srpna", 8);
        months.put("září", 9);
        months.put("října", 10);
        months.put("listopadu", 11);
        months.put("prosince", 12);
        newDate = DateUtils.setMonths(newDate, months.get(month));
        System.out.println(newDate);
        newDate = DateUtils.setYears(newDate, Integer.parseInt(year));

        newDate = DateUtils.setHours(newDate, Integer.parseInt(hour));
        System.out.println(newDate);
        newDate = DateUtils.setMinutes(newDate, Integer.parseInt(minute));
        System.out.println(newDate);

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
        String selectorName = "p.articleAuthors";
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
    //novinky done
    public int getNumburOfComment(Document document) {
        Element element = document.select("div#discussionEntry").first();
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

