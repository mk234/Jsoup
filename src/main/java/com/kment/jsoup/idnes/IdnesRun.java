package com.kment.jsoup.idnes;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.entity.Portal;
import com.kment.jsoup.idnes.Article.ExtractArticle;
import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import com.kment.jsoup.springdata.IPortalSpringDataRepository;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Repository
@Transactional
public class IdnesRun {

    @Autowired
    ExtractArticle extractArticle;
    @Autowired
    ExtractComment extractComment;
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository;
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository;
    @Autowired
    PrepareUrlForArchives prepareUrlForArchives;
    @Autowired
    PrepareUrlForCommentary prepareUrlForCommentary;
    @PersistenceContext
    EntityManager entityManager;

    final static int batchSize = 250;
    List<Comment> commentEntities = new ArrayList<>();
    List<Article> articleEntities = new ArrayList<>();
    String commentUrl = "";
    long idArticle;

    public void run() throws IOException, ParseException {
        extractAndSaveYesterday();
        extractAndSaveMultipleDaysBefereYesterday(3);
    }

    public void extractAndSaveYesterday() throws IOException, ParseException {
        clearLists();
        portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()));
        articleEntities = extractArticle.findArticles(prepareUrlForArchives.prepareUrlForYesterday());
        saveArticle();
        saveComments();
        flushAndClearEntityManager();
    }

    public void extractAndSaveMultipleDaysBefereYesterday(int numbebOfDaysBeforeYesterday) throws ParseException, IOException {
        Date datum;
        String day;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy");
        final Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1);
        for (int i = 0; i < numbebOfDaysBeforeYesterday; i++) {
            clearLists();
            calendar.add(Calendar.DATE, -1);
            Date yesterday = calendar.getTime();
            day = new DateTime(yesterday).toString("dd.MM.yyyy");
            datum = simpleDateFormat.parse(day);
            articleEntities = extractArticle.findArticles(prepareUrlForArchives.prepareUrl(datum));
            saveArticle();
            saveComments();
            flushAndClearEntityManager();
        }
    }

    private void flushAndClearEntityManager() {
        entityManager.flush();
        entityManager.clear();
    }

    private void saveComments() {
        for (int i = 0; i < commentEntities.size(); i++) {
            Comment comment = commentEntities.get(i);
            entityManager.persist(comment);
            if (i % batchSize == 0) {
                flushAndClearEntityManager();
            }
        }
    }

    private void saveArticle() throws IOException, ParseException {
        for (Article articleEntity : articleEntities) {
            Article savedArticle = articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
    }


    private void clearLists() {
        commentEntities.clear();
        articleEntities.clear();
    }
}