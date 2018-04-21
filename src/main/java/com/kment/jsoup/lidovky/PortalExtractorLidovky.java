package com.kment.jsoup.lidovky;

import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.lidovky.Article.ExtractArticleLidovky;
import com.kment.jsoup.lidovky.Article.ExtractMetaFromArticleLidovky;
import com.kment.jsoup.lidovky.Comment.ExtractCommentLidovky;
import com.kment.jsoup.lidovky.Comment.PrepareUrlForCommentaryLidovky;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PortalExtractorLidovky /*implements IPortalExtractor */ {
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
    ParseUrl parseUrl;
    @Autowired
    PrepareUrlForArchivesLidovky prepareUrlForArchives;

/*
    @Override
    public String getPortalName() {
        return "Lidovky";
    }


    @Override
    public List<Article> findArticles(String url) throws IOException {
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

    @Override
    public String getUrl() {
        return "www.lidovky.cz";
    }*/
}
