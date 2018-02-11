package com.kment.jsoup.idnes;


import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticle;
import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class IdnesUpdate {
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    ExtractComment extractComment;
    @Autowired
    ICommentSpringDataRepository iCommentSpringDataRepository;
    @Autowired
    ExtractMetaFromArticle extractMetaFromArticle;
    @Autowired
    ParseUrl parseUrl;
    @Autowired
    PrepareUrlForCommentary prepareUrlForCommentary;

    public void updateIdnes(int numberOfDayToUpdate) throws IOException, ParseException {
        List<Article> articleList = fetchArticleForDate(numberOfDayToUpdate);
        findArticleWithNewComments(articleList);
    }

    public List<Article> fetchArticleForDate(int days) {
        return articleSpringDataRepository.findByNumberOfDayBeforeToday(days);
    }

    public void findArticleWithNewComments(List<Article> articleList) throws IOException, ParseException {
        System.out.println(articleList.size());
        Date dateLastCollection;
        List<Comment> commentListToSave = new ArrayList<>();
        List<Comment> commentList;
        for (Article article : articleList) {
            dateLastCollection = article.getLastCollection();
            Document document = parseUrl.parse(article.getUrl());
            int numberOfComment = extractMetaFromArticle.getNumburOfComment(document);
            System.out.println(numberOfComment + " + " + article.getNumberOfComments());
            if (numberOfComment > article.getNumberOfComments()) {
                System.out.println("je tam nejaky novy komentar");
                commentList = extractComment.findComments(prepareUrlForCommentary.prepareUrlForCommentPage(article.getUrl()), article.getId());
                System.out.println(article.getUrl());
                System.out.println(prepareUrlForCommentary.prepareUrlForCommentPage(article.getUrl()));
                System.out.println("nalezene komenty maji " + commentList.size() + " polozek");
                for (int i = 0; i < commentList.size(); i++) {
                    if (commentList.get(i).getDate().after((dateLastCollection)))
                        System.out.println("save");
                                      commentListToSave.add(commentList.get(i));
                }
                System.out.println(commentListToSave.size());
                        iCommentSpringDataRepository.save(commentListToSave);
                article.setNumberOfComments(numberOfComment);
                      articleSpringDataRepository.save(article);
            }
            article.setLastCollection(new Date());
               articleSpringDataRepository.save(article);
        }
    }

}
