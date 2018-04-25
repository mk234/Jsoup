package com.kment.jsoup.idnes;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.extractor.IPortalExtractor;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.idnes.Article.ExtractArticleIdnes;
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticleIdnes;
import com.kment.jsoup.idnes.Comment.ExtractCommentIdnes;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentaryIdnes;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Component
public class PortalExtractorIdnes implements IPortalExtractor {

    @Autowired
    ExtractArticleIdnes extractArticleIdnes;
    @Autowired
    ExtractMetaFromArticleIdnes extractMetaFromArticleIdnes;
    @Autowired
    ExtractCommentIdnes extractCommentIdnes;
    @Autowired
    PrepareUrlForCommentaryIdnes prepareUrlForCommentaryIdnes;
    @Autowired
    NumberOfPagesIdnes numberOfPagesIdnes;
    @Autowired
    ParseUrl parseUrl;
    @Autowired
    PrepareUrlForArchivesIdnes prepareUrlForArchivesIdnes;

    @Override
    public String getPortalName() {
        return "iDNES";
    }


    @Override
    public List<Article> findArticles(String url) throws IOException {
        return extractArticleIdnes.findArticles(url);
    }

    @Override
    public String prepareUrlForYesterday() {
        return prepareUrlForArchivesIdnes.prepareUrlForYesterday();
    }

    @Override
    public String prepareUrl(Date date) {
        return prepareUrlForArchivesIdnes.prepareUrl(date);
    }

    @Override
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        return extractCommentIdnes.findComments(urlComment, idArticle);
    }

    @Override
    public Date getCreatedDate(Document document) {
        return extractMetaFromArticleIdnes.getCreatedDate(document);
    }

    @Override
    public String getKeywors(Document document) {
        return extractMetaFromArticleIdnes.getKeywors(document);
    }

    @Override
    public String getDescription(Document document) {
        return extractMetaFromArticleIdnes.getDescription(document);
    }

    @Override
    public int getNumburOfComment(Document document) {
        return extractMetaFromArticleIdnes.getNumburOfComment(document);
    }

    @Override
    public String getAuthor(Document document) {
        return extractMetaFromArticleIdnes.getAuthor(document);
    }

    @Override
    public Document parse(String urlString) throws IOException {
        return parseUrl.parse(urlString);
    }

    @Override
    public String prepareUrlForCommentPage(String articleUrl) {
        return prepareUrlForCommentaryIdnes.prepareUrlForCommentPage(articleUrl);
    }

    @Override
    public String getUrl() {
        return "www.idnes.cz";
    }
}
