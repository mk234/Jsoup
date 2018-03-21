package com.kment.jsoup;

import com.kment.jsoup.entity.Portal;
import com.kment.jsoup.extractor.IPortalExtractor;
import com.kment.jsoup.extractor.Run;
import com.kment.jsoup.springdata.IPortalSpringDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Component
public class Init {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    static int NUMBER_OF_DAYS = 7;
    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository;
    @Autowired
    private ApplicationContext applicationContext;
    @Autowired
    Run run;

    public void initPortals() {

        Map<String, IPortalExtractor> extractors = applicationContext.getBeansOfType(IPortalExtractor.class);
        log.info("Time is ", dateFormat.format(new Date()));
        for (IPortalExtractor portalExtractor : extractors.values()) {
            try {
                if (portalSpringDataRepository.findByName(portalExtractor.getPortalName()).size() == 0) {
                    portalSpringDataRepository.save(new Portal(portalExtractor.getPortalName(), portalExtractor.getUrl(), new Date()));
                    System.out.println("add " + portalExtractor.getPortalName());
                    run.extractAndSaveYesterday(portalExtractor);
                    run.extractAndSaveMultipleDaysBefereYesterday(NUMBER_OF_DAYS, portalExtractor);
                    System.out.println("done");
                }
                System.out.println("done");
            } catch (Exception e) {
                e.printStackTrace();// TODO log exception
            }
        }
    }
}
