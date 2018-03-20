package com.kment.jsoup.novinky;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.extractor.IPortalExtractor;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.novinky.Article.ExtractArticleNovinky;
import com.kment.jsoup.novinky.Article.ExtractMetaFromArticleNovinky;
import com.kment.jsoup.novinky.Comment.ExtractCommentNovinky;
import com.kment.jsoup.novinky.Comment.PrepareUrlForCommentaryNovinky;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Component
public class PortalExtractorNovinky implements IPortalExtractor {

    @Autowired
    ExtractArticleNovinky extractArticleNovinky;
    @Autowired
    ExtractMetaFromArticleNovinky extractMetaFromArticleNovinky;
    @Autowired
    ExtractCommentNovinky extractCommentNovinky;
    @Autowired
    PrepareUrlForCommentaryNovinky prepareUrlForCommentaryNovinky;
    @Autowired
    NumberOfPagesNovinky numberOfPagesNovinky;
    @Autowired
    ParseUrl parseUrl;
    @Autowired
    PrepareUrlForArchivesNovinky prepareUrlForArchivesNovinky;

    @Override
    public String getPortalName() {
        return "Novinky";
    }


    @Override
    public List<Article> findArticles(String url) throws IOException, ParseException {
        return extractArticleNovinky.findArticles(url);
    }

    @Override
    public String prepareUrlForYesterday() {
        return prepareUrlForArchivesNovinky.prepareUrlForYesterday();
    }

    @Override
    public String prepareUrl(Date date) {
        return prepareUrlForArchivesNovinky.prepareUrl(date);
    }

    @Override
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        return extractCommentNovinky.findComments(urlComment, idArticle);
    }

    @Override
    public Date getCreatedDate(Document document) throws ParseException {
        return extractMetaFromArticleNovinky.getCreatedDate(document);
    }

    @Override
    public String getKeywors(Document document) {
        return extractMetaFromArticleNovinky.getKeywors(document);
    }

    @Override
    public String getDescription(Document document) {
        return extractMetaFromArticleNovinky.getDescription(document);
    }

    @Override
    public int getNumburOfComment(Document document) {
        return extractMetaFromArticleNovinky.getNumburOfComment(document);
    }

    @Override
    public String getAuthor(Document document) {
        return extractMetaFromArticleNovinky.getAuthor(document);
    }

    @Override
    public Document parse(String urlString) throws IOException {
        return parseUrl.parse(urlString);
    }

    @Override
    public String prepareUrlForCommentPage(String articleUrl) throws IOException {
        return prepareUrlForCommentaryNovinky.prepareUrlForCommentPage(articleUrl);
    }

    @Override
    public String getUrl() {
        return "www.novinky.cz";
    }
}
