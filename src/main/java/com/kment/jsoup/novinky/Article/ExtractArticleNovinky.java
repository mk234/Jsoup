package com.kment.jsoup.novinky.Article;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.novinky.ParseUrlNovinky;
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

    //stejne
    public List<Article> findArticles(String url) throws IOException, ParseException {
        ParseUrlNovinky parseUrlNovinky = new ParseUrlNovinky();
        Document document = parseUrlNovinky.parse(url);
        return findArticles(url, document);
    }

    //stejne
    public List<Article> findArticles(String url, Document document) throws IOException, ParseException {
        List<Article> articleList = new ArrayList<>();

        String selectorContent = "div#sectionBox";
        String selectorArticle = "div.item";
        Element contens = document.select(selectorContent).first();
        Elements selectedDivs = contens.select(selectorArticle);
        articleList.addAll(getArticles(selectedDivs));

        return articleList;
    }


    //castecne predelane
    private List<Article> getArticles(Elements selectedDivs) throws IOException, ParseException {
        List<Article> articleList = new ArrayList<>();
        ParseUrlNovinky parseUrlNovinky = new ParseUrlNovinky();
        extractMetaFromArticleNovinky = new ExtractMetaFromArticleNovinky();
        for (Element div : selectedDivs) {
            Element cell = div;
            Elements name = cell.select("h3");
            Element link = name.select("a").first();
            String absHref = link.attr("abs:href");
            Document documentArticle = parseUrlNovinky.parse(absHref);
            System.out.println(name.text());
            System.out.println(absHref);
            System.out.println(extractMetaFromArticleNovinky.getCreatedDate(documentArticle));
            System.out.println(extractMetaFromArticleNovinky.getKeywors(documentArticle));
            System.out.println(extractMetaFromArticleNovinky.getDescription(documentArticle));
            System.out.println(extractMetaFromArticleNovinky.getNumburOfComment(documentArticle));
            System.out.println(extractMetaFromArticleNovinky.getAuthor(documentArticle));

            articleList.add(new Article(name.text(), absHref,
                    extractMetaFromArticleNovinky.getCreatedDate(documentArticle), new Date(),
                    extractMetaFromArticleNovinky.getKeywors(documentArticle), extractMetaFromArticleNovinky.getDescription(documentArticle),
                    1, extractMetaFromArticleNovinky.getNumburOfComment(documentArticle),
                    extractMetaFromArticleNovinky.getAuthor(documentArticle)));

        }
        return articleList;
    }


}