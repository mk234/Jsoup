package com.kment.jsoup.springdata;


import com.kment.jsoup.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IArticleSpringDataRepository extends JpaRepository<Article, Integer> {

    @Query("select a from Article a where a.created > CURRENT_DATE-:days")
    List<Article> findByNumberOfDayBeforeToday(@Param("days") int days);
}
