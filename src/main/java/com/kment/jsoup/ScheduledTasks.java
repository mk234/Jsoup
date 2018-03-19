package com.kment.jsoup;

import com.kment.jsoup.entity.Portal;
import com.kment.jsoup.idnes.IdnesRun;
import com.kment.jsoup.idnes.IdnesUpdate;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.IPortalSpringDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository;
    @Autowired
    IdnesRun idnesRun;
    @Autowired
    IdnesUpdate idnesUpdate;
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    static int NUMBER_OF_DAYS = 30;
    static int NUMBER_OF_DAYS_FOR_UPDATE = 2;

    //upravit vyhledavani articlu podle created
    @Scheduled(cron = "0 30 1 * * *", zone = "Europe/Prague")
    public void scheduledRun() throws IOException, ParseException {
        log.info("Time is ", dateFormat.format(new Date()));
        if (portalSpringDataRepository.findByName("iDNES").size() == 0) {
            portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()));
            idnesRun.extractAndSaveYesterday();
            idnesRun.extractAndSaveMultipleDaysBefereYesterday(NUMBER_OF_DAYS);
        }
        if (articleSpringDataRepository.findByNumberOfDayBeforeToday(0).size() == 0) {
            System.out.println("saving");
            idnesRun.extractAndSaveYesterday();
            idnesUpdate.updateIdnes(NUMBER_OF_DAYS_FOR_UPDATE);
        }
        System.out.println("done");
    }

    public void init() throws IOException, ParseException {
        if (portalSpringDataRepository.findByName("iDNES").size() == 0) {
            portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()));
            idnesRun.extractAndSaveYesterday();
            idnesRun.extractAndSaveMultipleDaysBefereYesterday(NUMBER_OF_DAYS);
        }
    }
}