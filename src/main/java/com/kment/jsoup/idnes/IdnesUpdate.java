package com.kment.jsoup.idnes;


import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import com.kment.jsoup.springdata.ICommentSpringDataRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class IdnesUpdate {
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    ExtractComment extractComment;
    @Autowired
    ICommentSpringDataRepository iCommentSpringDataRepository;

   public List<Article> fetchArticleForDate(Date date) {
        return articleSpringDataRepository.findByDate(date);
    }

    public void findArticleWithNewComments(List<Article> articleList) throws IOException, ParseException {
        Date dateLastCollection;
        List<Comment> commentListToSave = new ArrayList<>();
        List<Comment> commentList;
        for (Article article : articleList) {
            dateLastCollection = article.getLastCollection();
            commentList = extractComment.findComments(article.getUrl(), article.getId());
            for (int i = 0; i < commentList.size(); i++) {
                if (commentList.get(i).getDate().after((dateLastCollection)))
                    commentListToSave.add(commentList.get(i));
            }
            iCommentSpringDataRepository.save(commentList);
            article.setLastCollection(new Date());
            articleSpringDataRepository.save(article);
        }
    }

}
