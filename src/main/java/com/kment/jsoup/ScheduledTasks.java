package com.kment.jsoup;

import com.kment.jsoup.entity.Portal;
import com.kment.jsoup.extractor.IPortalExtractor;
import com.kment.jsoup.extractor.Run;
import com.kment.jsoup.extractor.Update;
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

    static int NUMBER_OF_DAYS_FOR_UPDATE = 2;
    @Autowired
    private ApplicationContext applicationContext;
    @Autowired
    Run run;
    @Autowired
    Update update;

    // set crone to run every day at 1:30 morning CET
    @Scheduled(cron = "0 30 1 * * *", zone = "Europe/Prague")
    public void scheduledRun() {
        // getting all beans extends IPortalExtractor
        Map<String, IPortalExtractor> extractors = applicationContext.getBeansOfType(IPortalExtractor.class);
        log.info("Time is ", dateFormat.format(new Date()));
        // iteration throught collection
        for (IPortalExtractor portalExtractor : extractors.values()) {
            try {
                // start saving yesterday articles and comments
                run.extractAndSaveYesterday(portalExtractor);
                // start updating comment for 7 days ago
                update.update(NUMBER_OF_DAYS_FOR_UPDATE, portalExtractor);
                Portal portal = portalSpringDataRepository.findByName(portalExtractor.getPortalName()).get(0);
                // seting date of last collection for portal
                portal.setLastCollection(new Date());
                portalSpringDataRepository.save(portal);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
