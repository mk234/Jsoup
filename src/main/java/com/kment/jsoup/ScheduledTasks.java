package com.kment.jsoup;

import com.kment.jsoup.extractor.IPortalExtractor;
import com.kment.jsoup.extractor.Run;
import com.kment.jsoup.extractor.Update;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.IPortalSpringDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository;
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;

    static int NUMBER_OF_DAYS_FOR_UPDATE = 2;
    @Autowired
    private ApplicationContext applicationContext;
    @Autowired
    Run run;
    @Autowired
    Update update;

    @Scheduled(cron = "0 30 1 * * *", zone = "Europe/Prague")
    public void scheduledRun() {
        Map<String, IPortalExtractor> extractors = applicationContext.getBeansOfType(IPortalExtractor.class);
        log.info("Time is ", dateFormat.format(new Date()));
        for (IPortalExtractor portalExtractor : extractors.values()) {
            try {
                //    if (articleSpringDataRepository.findByNumberOfDayBeforeToday(0).size() == 0) {
                    System.out.println("saving");
                run.extractAndSaveYesterday(portalExtractor);
                update.updateIdnes(NUMBER_OF_DAYS_FOR_UPDATE, portalExtractor);
                //  }
                System.out.println("done");
            } catch (Exception e) {
                e.printStackTrace();// TODO log exception
            }
        }
    }
}
