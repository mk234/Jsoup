package com.kment.jsoup.novinky.Article;

import org.apache.commons.lang3.time.DateUtils;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.util.Date;

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
//            SimpleDateFormat sdf = new SimpleDateFormat("EEEE dd. MMM yyyy, HH:mm");
//            newDate = sdf.parse(dateString);

            DateTimeFormatter format = DateTimeFormat.forPattern("EEEE dd. MMM yyyy, HH:mm");
            DateTime time = format.parseDateTime(dateString);
            System.out.println("time " + time);
            newDate = time.toDate();
            System.out.println("new date " + newDate);
//            DateFormat df = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, new Locale("cz", "CZ"));
//            String formattedDate = df.format(newDate);
//
//            System.out.println("foramted date " + formattedDate);
//            sdf = new SimpleDateFormat("MMMMM dd, yyyy HH:mm:ss a z", Locale.US);
//            System.out.println("new formated date " + sdf.parse(formattedDate));


//            return sdf.parse(formattedDate);
            return newDate;
        }

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

