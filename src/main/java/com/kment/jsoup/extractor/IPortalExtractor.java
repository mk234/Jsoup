package com.kment.jsoup.extractor;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

public interface IPortalExtractor {
    String getPortalName();

    List<Article> findArticles(String url) throws IOException, ParseException;

    String prepareUrlForYesterday();

    String prepareUrl(Date date);

    List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException;

    Date getCreatedDate(Document document);

    String getKeywors(Document document);

    String getDescription(Document document);

    int getNumburOfComment(Document document);

    String getAuthor(Document document);

    Document parse(String urlString) throws IOException;

    String prepareUrlForCommentPage(String articleUrl);
}