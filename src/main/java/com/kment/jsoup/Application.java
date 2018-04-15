package com.kment.jsoup;

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

    @Autowired
    ScheduledTasks scheduledTasks;
    @Autowired
    Init init;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }


    @Override
    public void run(String... strings) {
//          scheduledTasks.scheduledRun();
//        init.initPortals();
    }


}





