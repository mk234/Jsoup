package com.kment.jsoup.idnes;


import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticle;
import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import org.joda.time.DateTime;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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

    public void updateIdnes(int numberOfDayToUpdate) throws IOException, ParseException {
        Date datum = null;
        String day;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy");
        final Calendar calendar = Calendar.getInstance();
        numberOfDayToUpdate++;
        for (int i = 0; i < numberOfDayToUpdate; i++) {
            System.out.println(datum);
            calendar.add(Calendar.DATE, -1);
            Date yesterday = calendar.getTime();
            day = new DateTime(yesterday).toString("dd.MM.yyyy");
            datum = simpleDateFormat.parse(day);
            List<Article> articleList = fetchArticleForDate(datum);
            findArticleWithNewComments(articleList);
        }
    }

    public List<Article> fetchArticleForDate(Date date) {
        return articleSpringDataRepository.findByDate(date);
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
                commentList = extractComment.findComments(article.getUrl(), article.getId());
                for (int i = 0; i < commentList.size(); i++) {
                    if (commentList.get(i).getDate().after((dateLastCollection)))
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
