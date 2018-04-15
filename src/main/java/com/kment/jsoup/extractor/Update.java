package com.kment.jsoup.extractor;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.entity.Portal;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import com.kment.jsoup.springdata.IPortalSpringDataRepository;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class Update {
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    ICommentSpringDataRepository iCommentSpringDataRepository;
    @Autowired
    IPortalSpringDataRepository iPortalSpringDataRepository;

    public void updateIdnes(int numberOfDayToUpdate, IPortalExtractor portalExtractor) {
        try {
            List<Portal> portals = iPortalSpringDataRepository.findByName(portalExtractor.getPortalName());
            List<Article> articleList = fetchArticleForDays(numberOfDayToUpdate, portals.get(0).getId());
            findArticleWithNewComments(articleList, portalExtractor);
            System.out.println("update done");
        } catch (Exception e) {
            e.printStackTrace();// TODO log exception
        }
    }

    public List<Article> fetchArticleForDays(int days, long portalId) {
        return articleSpringDataRepository.findByNumberOfDayBeforeToday(days, portalId);
    }

    public void findArticleWithNewComments(List<Article> articleList, IPortalExtractor portalExtractor) throws
            IOException, ParseException {
        Date dateLastCollection;
        List<Comment> commentListToSave = new ArrayList<>();
        List<Comment> commentList;
        for (Article article : articleList) {
            dateLastCollection = article.getLastCollection();
            Document document = portalExtractor.parse(article.getUrl());
            int numberOfComment = portalExtractor.getNumburOfComment(document);
            if (numberOfComment > article.getNumberOfComments()) {
                commentList = portalExtractor.findComments(portalExtractor.prepareUrlForCommentPage(article.getUrl()), article.getId());
                for (int i = 0; i < commentList.size(); i++) {
                    if (commentList.get(i).getDate().after((dateLastCollection)))
                        commentListToSave.add(commentList.get(i));
                }
                iCommentSpringDataRepository.save(commentListToSave);
                article.setNumberOfComments(numberOfComment);
                articleSpringDataRepository.save(article);
            }
            article.setLastCollection(new Date());
            System.out.println(article.getNumberOfComments() - numberOfComment + " new comments");
            articleSpringDataRepository.save(article);
        }
    }

}
