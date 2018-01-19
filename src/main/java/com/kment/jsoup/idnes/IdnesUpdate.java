package com.kment.jsoup.idnes;


import com.kment.jsoup.entity.Article;
import com.kment.jsoup.springdata.IArticleSpringDataRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

public class IdnesUpdate {
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;

    public List<Article> fetchArticleForDate(Date date) {
        return articleSpringDataRepository.findByDate(date);
    }

    public List<Article> findArticleWithNewComments(List<Article> articleList) {
    return  articleList;
    }


}
