package com.kment.jsoup.lidovky.Article;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.lidovky.NumberOfPagesLidovky;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class ExtractArticleLidovky {

    @Autowired
    ExtractMetaFromArticleLidovky extractMetaFromArticleLidovky;


    public List<Article> findArticles(String url) throws IOException {
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(url);
        return findArticles(url, document);
    }


    public List<Article> findArticles(String url, Document document) throws IOException {
        List<Article> articleList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        NumberOfPagesLidovky numberOfPage = new NumberOfPagesLidovky();


        String selectorContent = "div#content";
        int numberOfPages = numberOfPage.numberOfPagesArchive(document, selectorContent);
        String selectorArticle = "div.art";
        Element contens = document.select(selectorContent).first();
        Elements selectedDivs = contens.select(selectorArticle);
        articleList.addAll(getArticles(selectedDivs));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            document = parseUrl.parse(urlForNextPage);
            contens = document.select(selectorContent).first();
            selectedDivs = contens.select(selectorArticle);
            articleList.addAll(getArticles(selectedDivs));
        }
        return articleList;
    }


    private String getDocumentForNextPage(String url, int i) {
        return url + "&strana=" + i;
    }


    private List<Article> getArticles(Elements selectedDivs) throws IOException {
        List<Article> articleList = new ArrayList<>();
        ParseUrl parseUrl = new ParseUrl();
        for (Element div : selectedDivs) {
            Element cell = div;
            Elements name = cell.select("h3");
            Element link = name.select("a").first();
            String absHref = link.attr("abs:href");
            Document documentArticle = parseUrl.parse(absHref);
            articleList.add(new Article(name.text(), absHref,
                    extractMetaFromArticleLidovky.getCreatedDate(documentArticle), new Date(),
                    extractMetaFromArticleLidovky.getKeywors(documentArticle), extractMetaFromArticleLidovky.getDescription(documentArticle),
                    2, extractMetaFromArticleLidovky.getNumburOfComment(documentArticle),
                    extractMetaFromArticleLidovky.getAuthor(documentArticle)));

        }
        return articleList;
    }


}