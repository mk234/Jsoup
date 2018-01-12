package com.kment.jsoup.springdata;


import com.kment.jsoup.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IArticleSpringDataRepository extends JpaRepository<Article, Integer> {
}
