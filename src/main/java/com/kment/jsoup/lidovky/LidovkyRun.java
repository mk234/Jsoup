package com.kment.jsoup.lidovky;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.lidovky.Article.ExtractArticleLidovky;
import com.kment.jsoup.lidovky.Article.ExtractMetaFromArticleLidovky;
import com.kment.jsoup.lidovky.Comment.ExtractCommentLidovky;
import com.kment.jsoup.lidovky.Comment.PrepareUrlForCommentaryLidovky;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import com.kment.jsoup.springdata.IPortalSpringDataRepository;
import org.joda.time.DateTime;
import org.jsoup.nodes.Document;
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
public class LidovkyRun {

    @Autowired
    ExtractArticleLidovky extractArticleLidovky;
    @Autowired
    ExtractCommentLidovky extractCommentLidovky;
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository;
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository;
    @Autowired
    PrepareUrlForArchivesLidovky prepareUrlForArchivesLidovky;
    @Autowired
    PrepareUrlForCommentaryLidovky prepareUrlForCommentary;
    @PersistenceContext
    EntityManager entityManager;
    @Autowired
    ExtractMetaFromArticleLidovky extractMetaFromArticleLidovky;

    final static int batchSize = 250;
    List<Comment> commentEntities = new ArrayList<>();
    List<Article> articleEntities = new ArrayList<>();
    String commentUrl = "";
    long idArticle;

    public void run() throws IOException, ParseException {
        extractAndSaveYesterday();
        extractAndSaveMultipleDaysBefereYesterday(7);
    }


    public void extractAndSaveYesterday() throws IOException, ParseException {
        clearLists();
        articleEntities = extractArticleLidovky.findArticles(prepareUrlForArchivesLidovky.prepareUrlForYesterday());
        saveArticle();
        saveComments();
        flushAndClearEntityManager();
        System.out.println("yesterday done");
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
            articleEntities = extractArticleLidovky.findArticles(prepareUrlForArchivesLidovky.prepareUrl(datum));
            saveArticle();
            saveComments();
            flushAndClearEntityManager();
        }
        System.out.println(numbebOfDaysBeforeYesterday + " done");
    }

    private void flushAndClearEntityManager() {
        entityManager.flush();
        entityManager.clear();
    }

    private void saveComments() {
        System.out.println(commentEntities.size());
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
            commentUrl = prepareUrlForCommentary.prepareUrlForCommentPage(articleEntity.getUrl());
            commentEntities.addAll(extractCommentLidovky.findComments(commentUrl, idArticle));
        }
    }


    private void clearLists() {
        commentEntities.clear();
        articleEntities.clear();
    }

    public void saveOneArticleWithComments(String articleUrl) throws IOException, ParseException {
        clearLists();

        ParseUrlLidovky parseUrlLidovky = new ParseUrlLidovky();
        Document document = parseUrlLidovky.parse(articleUrl);
        articleEntities.add(new Article("Jmeno", articleUrl, extractMetaFromArticleLidovky.getCreatedDate(document), new Date(), extractMetaFromArticleLidovky.getKeywors(document),
                extractMetaFromArticleLidovky.getDescription(document), 1, extractMetaFromArticleLidovky.getNumburOfComment(document), extractMetaFromArticleLidovky.getAuthor(document)));
        saveArticle();
        saveComments();
        flushAndClearEntityManager();
    }
}