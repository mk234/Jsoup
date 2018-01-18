package com.kment.jsoup;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.idnes.Article.ExtractArticle;
import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;
import com.kment.jsoup.idnes.IdnesRun;
import com.kment.jsoup.idnes.PrepareUrlForArchives;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.dialect.Dialect;
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
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Controller
@SpringBootApplication
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
    public static void main(String[] args) throws IOException, ParseException {
         SpringApplication.run(Application.class, args);
    }

    @RequestMapping("/")
    String index() {
        return "index";
    }

    @Override
    public void run(String... strings) throws Exception {
      idnesRun.run();
        logger.info("All Articles -> {}", articleSpringDataRepository.findAll());
        logger.info("All Comments -> {}", commentSpringDataRepository.findAll());

    }


}



