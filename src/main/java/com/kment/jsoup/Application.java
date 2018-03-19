package com.kment.jsoup;

import com.kment.jsoup.extractor.Run;
import com.kment.jsoup.extractor.Update;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;

@Controller
@SpringBootApplication
@EnableScheduling
public class Application implements CommandLineRunner {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    ScheduledTasks scheduledTasks;
    @Autowired
    Run run;
    @Autowired
    Update update;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }


    @Override
    public void run(String... strings) {
        // scheduledTasks.init();
//        scheduledTasks.scheduledRun();

    }


}



