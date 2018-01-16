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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class IdnesRun {

    @Autowired
    ExtractArticle extractArticle;
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository;
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository;

    public IdnesRun() {
    }

    public void run() throws IOException, ParseException {


        long time = System.currentTimeMillis();
        PrepareUrlForArchives prepareUrlForArchives = new PrepareUrlForArchives();
        ExtractComment extractComment = new ExtractComment();
        ExtractArticle extractArticle = new ExtractArticle();
        PrepareUrlForCommentary prepareUrlForCommentary = new PrepareUrlForCommentary();
        List<Comment> commentEntities = new ArrayList<>();
        String commentUrl = "";
        List<Article> articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrlForYesterday());
        portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()));
        for (Article articleEntity : articleEntities) {
            articleSpringDataRepository.save(articleEntity);
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        Date datum;
        String day;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy");
//-------------------
        day = "14.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            articleSpringDataRepository.save(articleEntity);
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
//-------------------
        day = "13.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            articleSpringDataRepository.save(articleEntity);
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        day = "12.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            articleSpringDataRepository.save(articleEntity);
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        day = "11.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            articleSpringDataRepository.save(articleEntity);
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        day = "10.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            articleSpringDataRepository.save(articleEntity);
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }
        //-------------------
        day = "09.01.2018";
        datum = simpleDateFormat.parse(day);
        articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrl(datum));
        for (Article articleEntity : articleEntities) {
            articleSpringDataRepository.save(articleEntity);
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
            commentSpringDataRepository.save(commentEntity);
        }

    }
}