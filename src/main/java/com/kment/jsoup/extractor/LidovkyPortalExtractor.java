package com.kment.jsoup.extractor;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;
import com.kment.jsoup.lidovky.Article.ExtractArticleLidovky;
import com.kment.jsoup.lidovky.Article.ExtractMetaFromArticleLidovky;
import com.kment.jsoup.lidovky.Comment.ExtractCommentLidovky;
import com.kment.jsoup.lidovky.Comment.PrepareUrlForCommentaryLidovky;
import com.kment.jsoup.lidovky.NumberOfPagesLidovky;
import com.kment.jsoup.lidovky.ParseUrlLidovky;
import com.kment.jsoup.lidovky.PrepareUrlForArchivesLidovky;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Component
public class LidovkyPortalExtractor implements IPortalExtractor {
    @Autowired
    ExtractArticleLidovky extractArticle;
    @Autowired
    ExtractMetaFromArticleLidovky extractMetaFromArticle;
    @Autowired
    ExtractCommentLidovky extractComment;
    @Autowired
    PrepareUrlForCommentaryLidovky prepareUrlForCommentary;
    @Autowired
    NumberOfPagesLidovky numberOfPages;
    @Autowired
    ParseUrlLidovky parseUrl;
    @Autowired
    PrepareUrlForArchivesLidovky prepareUrlForArchives;


    @Override
    public String getPortalName() {
        return "Lidovky";
    }


    @Override
    public List<Article> findArticles(String url) throws IOException, ParseException {
        return extractArticle.findArticles(url);
    }

    @Override
    public String prepareUrlForYesterday() {
        return prepareUrlForArchives.prepareUrlForYesterday();
    }

    @Override
    public String prepareUrl(Date date) {
        return prepareUrlForArchives.prepareUrl(date);
    }

    @Override
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        return extractComment.findComments(urlComment, idArticle);
    }

    @Override
    public Date getCreatedDate(Document document) {
        return extractMetaFromArticle.getCreatedDate(document);
    }

    @Override
    public String getKeywors(Document document) {
        return extractMetaFromArticle.getKeywors(document);
    }

    @Override
    public String getDescription(Document document) {
        return extractMetaFromArticle.getDescription(document);
    }

    @Override
    public int getNumburOfComment(Document document) {
        return extractMetaFromArticle.getNumburOfComment(document);
    }

    @Override
    public String getAuthor(Document document) {
        return extractMetaFromArticle.getAuthor(document);
    }

    @Override
    public Document parse(String urlString) throws IOException {
        return parseUrl.parse(urlString);
    }

    @Override
    public String prepareUrlForCommentPage(String articleUrl) {
       return prepareUrlForCommentary.prepareUrlForCommentPage(articleUrl);
    }
}
