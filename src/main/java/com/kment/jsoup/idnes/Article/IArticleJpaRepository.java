package com.kment.jsoup.idnes.Article;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface IArticleJpaRepository extends JpaRepository<ArticleEntity, Long> {

}
