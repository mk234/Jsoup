package com.kment.jsoup.springdata;

import com.kment.jsoup.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICommentSpringDataRepository extends JpaRepository<Comment, Integer> {
}
