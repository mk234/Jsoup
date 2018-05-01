package com.kment.jsoup.extractor;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class ExtractMeta {
    public String getKeywors(Document document) {
        if (document.select("meta[name=keywords]").first() == null)
            return "";
        else
            return
                    document.select("meta[name=keywords]").first()
                            .attr("content");
    }

    public String getDescription(Document document) {
        if (document.select("meta[name=description]").size() != 0) {
            if (document.select("meta[name=description]").get(0) == null)
                return "";
            String description =
                    document.select("meta[name=description]").get(0)
                            .attr("content");
            return description;
        } else
            return "";
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

    public int getMonth(String month) {
        Map<String, Integer> months = fillMapWithMonths();
        return months.get(month);
    }

    private Map<String, Integer> fillMapWithMonths() {
        Map<String, Integer> months = new HashMap<String, Integer>();
        months.put("ledna", 0);
        months.put("února", 1);
        months.put("března", 2);
        months.put("dubna", 3);
        months.put("května", 4);
        months.put("června", 5);
        months.put("července", 6);
        months.put("srpna", 7);
        months.put("září", 8);
        months.put("října", 9);
        months.put("listopadu", 10);
        months.put("prosince", 11);
        return months;
    }


    public Date getCreatedDate(Element dateElement) throws ParseException {
        String data = dateElement.text();
        if (data.contains(":")) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy HH:mm");
            Date date = sdf.parse(data);
            return date;
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
            Date date = sdf.parse(data);
            return date;
        }
    }
}
