package com.kment.jsoup;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.kment.jsoup.idnes.IdnesRun;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Scheduled(cron="0 30 1 * * *", zone="Europe/Prague")
    public void reportCurrentTime() {
            log.info("The time is now {}", dateFormat.format(new Date()));
    }
}