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
import java.util.ArrayList;
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
        portalSpringDataRepository.save(new Portal());
        System.out.println(articleEntities.size());
        for (Article articleEntity : articleEntities) {
            articleEntity.setIdPortal(1);
            articleSpringDataRepository.save(articleEntity);
              commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
        for (Comment commentEntity : commentEntities) {
             commentSpringDataRepository.save(commentEntity);
        }



    }
}