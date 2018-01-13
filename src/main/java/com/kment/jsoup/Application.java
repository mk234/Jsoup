package com.kment.jsoup;

import com.kment.jsoup.idnes.IdnesRun;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.text.ParseException;

@Controller
@SpringBootApplication
public class Application implements CommandLineRunner {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    IArticleSpringDataRepository repository;

    public static void main(String[] args) throws IOException, ParseException {
        ApplicationContext applicationContext = SpringApplication.run(Application.class, args);
        IdnesRun idnesRun = applicationContext.getBean(IdnesRun.class);
        idnesRun.run();
    }

    @RequestMapping("/")
    String index() {
        return "index";
    }

    @Override
    public void run(String... strings) throws Exception {
           logger.info("All Article -> {}", repository.findAll());

    }
}