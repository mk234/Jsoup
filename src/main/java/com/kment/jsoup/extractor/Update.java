package com.kment.jsoup.extractor;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import org.jsoup.nodes.Document;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class Update implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    ICommentSpringDataRepository iCommentSpringDataRepository;

    public void updateIdnes(int numberOfDayToUpdate) throws IOException, ParseException {
        Map<String, IPortalExtractor> extractors = applicationContext.getBeansOfType(IPortalExtractor.class);
        for (IPortalExtractor portalExtractor : extractors.values()) {
            try {
                List<Article> articleList = fetchArticleForDays(numberOfDayToUpdate, portalExtractor.getPortalName());
                findArticleWithNewComments(articleList, portalExtractor);
                System.out.println("update done");
            } catch (Exception e) {
                e.printStackTrace();// TODO log exception
            }
        }
    }

    public List<Article> fetchArticleForDays(int days, String portalName) {
        return articleSpringDataRepository.findByNumberOfDayBeforeToday(days, portalName);
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
            System.out.println(article.getCreated());
            System.out.println(numberOfComment);
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
            System.out.println(article.getNumberOfComments());
            System.out.println(article.getNumberOfComments() - numberOfComment + " new comments");
            articleSpringDataRepository.save(article);
        }
    }


    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {

    }
}
