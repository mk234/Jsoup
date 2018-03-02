package com.kment.jsoup;

import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.idnes.IdnesRun;
import com.kment.jsoup.idnes.IdnesUpdate;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
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
    IdnesRun idnesRun;
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository;
    @Autowired
    ExtractComment extractComment;
    @Autowired
    IdnesUpdate idnesUpdate;
    @Autowired
    ScheduledTasks scheduledTasks;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... strings) throws Exception {
        // scheduledTasks.init();
        scheduledTasks.scheduledRun();
    }


}



