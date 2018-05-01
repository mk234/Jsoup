package com.kment.jsoup.novinky.Article;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.extractor.ParseUrl;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class ExtractArticleNovinky {

    @Autowired
    ExtractMetaFromArticleNovinky extractMetaFromArticleNovinky;


    public List<Article> findArticles(String url) throws IOException, ParseException {
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(url);
        return findArticles(url, document);
    }


    public List<Article> findArticles(String url, Document document) throws IOException {
        List<Article> articleList = new ArrayList<>();

        String selectorContent = "div#sectionBox";
        String selectorArticle = "div.item";
        Element contens = document.select(selectorContent).first();
        Elements selectedDivs = contens.select(selectorArticle);
        articleList.addAll(getArticles(selectedDivs));

        return articleList;
    }


    private List<Article> getArticles(Elements selectedDivs) throws IOException {
        List<Article> articleList = new ArrayList<>();
        ParseUrl parseUrl = new ParseUrl();
        extractMetaFromArticleNovinky = new ExtractMetaFromArticleNovinky();
        for (Element div : selectedDivs) {
            Element cell = div;
            Elements name = cell.select("h3");
            Element link = name.select("a").first();
            String absHref = link.attr("abs:href");
            Document documentArticle = parseUrl.parse(absHref);
            articleList.add(new Article(name.text(), absHref,
                    extractMetaFromArticleNovinky.getCreatedDate(documentArticle), new Date(),
                    extractMetaFromArticleNovinky.getKeywors(documentArticle), extractMetaFromArticleNovinky.getDescription(documentArticle),
                    3, extractMetaFromArticleNovinky.getNumburOfComment(documentArticle),
                    extractMetaFromArticleNovinky.getAuthor(documentArticle)));

        }
        return articleList;
    }


}