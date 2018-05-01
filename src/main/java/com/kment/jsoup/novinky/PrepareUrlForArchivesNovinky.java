package com.kment.jsoup.novinky;

import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;


@Component
public class PrepareUrlForArchivesNovinky {

    public String prepareUrl(Date date) {
        String prefix = "https://www.novinky.cz/archiv?id=966&date=";
        String dateString = new DateTime(date).toString("dd.MM.yyyy");
        String url = prefix + dateString /*+ postfix*/;
        return url;
    }

    public String prepareUrlForYesterday() {
        String prefix = "https://www.novinky.cz/archiv?id=966&date=";
        final Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1);
        Date yesterday = calendar.getTime();
        String dateString = new DateTime(yesterday).toString("dd.MM.yyyy");
        String url = prefix + dateString/* + postfix*/;
        return url;
    }
}
