package com.kment.jsoup.idnes;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.entity.Portal;
import com.kment.jsoup.idnes.Article.ExtractArticle;
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticle;
import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import com.kment.jsoup.springdata.IPortalSpringDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
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
    @PersistenceContext
    EntityManager entityManager;

    public IdnesRun() {
    }

    public void run() throws IOException, ParseException {


        PrepareUrlForArchives prepareUrlForArchives = new PrepareUrlForArchives();
        PrepareUrlForCommentary prepareUrlForCommentary = new PrepareUrlForCommentary();
        List<Comment> commentEntities = new ArrayList<>();
        String commentUrl = "";
        List<Article> articleEntities = extractArticle.findArticles(prepareUrlForArchives.prepareUrlForYesterday());
        portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()));
        long idArticle;
        for (Article articleEntity : articleEntities) {
            Article savedArticle = articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }

        System.out.println("jde se na ukladani");
        int batchSize = 250;
        for (int i = 0; i < commentEntities.size(); i++) {
            Comment comment = commentEntities.get(i);
            entityManager.persist(comment);
            if (i % batchSize == 0) {
                System.out.println(i);
                entityManager.flush();
                entityManager.clear();
            }
        }
        entityManager.flush();
        entityManager.clear();


        //--------------------------
/*
         PrepareUrlForArchives prepareUrlForArchives = new PrepareUrlForArchives();
        ExtractComment extractComment = new ExtractComment();
        ExtractArticle extractArticle = new ExtractArticle();
        PrepareUrlForCommentary prepareUrlForCommentary = new PrepareUrlForCommentary();
        List<Comment> commentEntities = new ArrayList<>();
        String commentUrl = "";
        List<Article> articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrlForYesterday());
        portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()));
        portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()));
        long idArticle;
        for (Article articleEntity : articleEntities) {
            Article savedArticle = articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }

        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }*/

/*
    Date datum;
    String day;
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy");

        //-------------------
        commentEntities.clear();
        articleEntities.clear();
        day = "15.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            Article savedArticle = articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
//-------------------
        commentEntities.clear();
        articleEntities.clear();
        day = "14.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            Article savedArticle =   articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
//-------------------
        commentEntities.clear();
        articleEntities.clear();
        day = "13.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            Article savedArticle =  articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        commentEntities.clear();
        articleEntities.clear();
        day = "12.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            Article savedArticle =   articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        commentEntities.clear();
        articleEntities.clear();
        day = "11.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            Article savedArticle =  articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        commentEntities.clear();
        articleEntities.clear();
        day = "10.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            Article savedArticle =   articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        commentEntities.clear();
        articleEntities.clear();
        day = "09.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            Article savedArticle =    articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl, idArticle));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }*/

    }
}