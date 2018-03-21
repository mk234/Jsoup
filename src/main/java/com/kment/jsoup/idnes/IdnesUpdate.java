package com.kment.jsoup.idnes;


import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticleIdnes;
import com.kment.jsoup.idnes.Comment.ExtractCommentIdnes;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentaryIdnes;
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
    ExtractCommentIdnes extractCommentIdnes;
    @Autowired
    ICommentSpringDataRepository iCommentSpringDataRepository;
    @Autowired
    ExtractMetaFromArticleIdnes extractMetaFromArticleIdnes;
    @Autowired
    ParseUrl parseUrl;
    @Autowired
    PrepareUrlForCommentaryIdnes prepareUrlForCommentaryIdnes;

    public void updateIdnes(int numberOfDayToUpdate) throws IOException, ParseException {
        List<Article> articleList = fetchArticleForDays(numberOfDayToUpdate);
        findArticleWithNewComments(articleList);
        System.out.println("update done");
    }

    public List<Article> fetchArticleForDays(int days) {
        return articleSpringDataRepository.findByNumberOfDayBeforeToday(days, 1);
    }

    public void findArticleWithNewComments(List<Article> articleList) throws IOException, ParseException {
        Date dateLastCollection;
        List<Comment> commentListToSave = new ArrayList<>();
        List<Comment> commentList;
        for (Article article : articleList) {
            dateLastCollection = article.getLastCollection();
            Document document = parseUrl.parse(article.getUrl());
            int numberOfComment = extractMetaFromArticleIdnes.getNumburOfComment(document);
            System.out.println(article.getCreated());
//            System.out.println(numberOfComment);
            if (numberOfComment > article.getNumberOfComments()) {
                commentList = extractCommentIdnes.findComments(prepareUrlForCommentaryIdnes.prepareUrlForCommentPage(article.getUrl()), article.getId());
                for (int i = 0; i < commentList.size(); i++) {
                    if (commentList.get(i).getDate().after((dateLastCollection)))
                        commentListToSave.add(commentList.get(i));
                }
                iCommentSpringDataRepository.save(commentListToSave);
                article.setNumberOfComments(numberOfComment);
                articleSpringDataRepository.save(article);
            }
            article.setLastCollection(new Date());
//            System.out.println(article.getNumberOfComments());
            if ((article.getNumberOfComments() - numberOfComment) > 0) {
                System.out.println(article.getNumberOfComments() - numberOfComment + " new comments --------------------------");
            }
            articleSpringDataRepository.save(article);
        }
    }

}
