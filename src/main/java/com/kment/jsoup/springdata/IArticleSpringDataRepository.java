package com.kment.jsoup.springdata;


import com.kment.jsoup.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface IArticleSpringDataRepository extends JpaRepository<Article, Integer> {

@Query("SELECT a FROM Article a WHERE a.created = :created")
    List<Article> findByDate(@Param("created") Date created);

     @Query("SELECT a FROM Article a WHERE a.id = :id")
    List<Article> findById(@Param("id") long id);
}
