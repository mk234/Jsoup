package com.kment.jsoup.idnes;

import org.joda.time.DateTime;

import java.util.Calendar;
import java.util.Date;

public class PrepareUrlForArchives {
    public String prepareUrl(Date date) {
        String prefix = "https://zpravy.idnes.cz/archiv.aspx?datum=";
        String postfix = "&idostrova=idnes";
        String dateString = new DateTime(date).toString("dd.MM.yyyy");
        System.out.println(dateString);
        String url = prefix + dateString + postfix;
        return url;
    }

    public String prepareUrlForYesterday() {
        String prefix = "https://zpravy.idnes.cz/archiv.aspx?datum=";
        String postfix = "&idostrova=idnes";
        final Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1);
        Date yesterday = calendar.getTime();
        String dateString = new DateTime(yesterday).toString("dd.MM.yyyy");
        System.out.println(dateString);
        String url = prefix + dateString + postfix;
        return url;
    }
}
