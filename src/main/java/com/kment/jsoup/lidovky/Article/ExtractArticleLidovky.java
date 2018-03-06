package com.kment.jsoup.lidovky.Article;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.lidovky.NumberOfPagesLidovky;
import com.kment.jsoup.lidovky.ParseUrlLidovky;
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
public class ExtractArticleLidovky {

    @Autowired
    ExtractMetaFromArticleLidovky extractMetaFromArticleLidovky;

    //stejne
    public List<Article> findArticles(String url) throws IOException, ParseException {
        ParseUrlLidovky parseUrlLidovky = new ParseUrlLidovky();
        Document document = parseUrlLidovky.parse(url);
        return findArticles(url, document);
    }

    //stejne
    public List<Article> findArticles(String url, Document document) throws IOException {
        List<Article> articleList = new ArrayList<>();
        String urlForNextPage;
        ParseUrlLidovky parseUrlLidovky = new ParseUrlLidovky();
        NumberOfPagesLidovky numberOfPage = new NumberOfPagesLidovky();


        String selectorContent = "div#content";
        int numberOfPages = numberOfPage.numberOfPagesArchive(document, selectorContent);
        String selectorArticle = "div.art";
        Element contens = document.select(selectorContent).first();
        Elements selectedDivs = contens.select(selectorArticle);
        articleList.addAll(getArticles(selectedDivs));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            document = parseUrlLidovky.parse(urlForNextPage);
            contens = document.select(selectorContent).first();
            selectedDivs = contens.select(selectorArticle);
            articleList.addAll(getArticles(selectedDivs));
        }
        return articleList;
    }

    //stejne
    private String getDocumentForNextPage(String url, int i) {
        return url + "&strana=" + i;
    }

    //castecne predelane
    private List<Article> getArticles(Elements selectedDivs) throws IOException {
        List<Article> articleList = new ArrayList<>();
        ParseUrlLidovky parseUrlLidovky = new ParseUrlLidovky();
        for (Element div : selectedDivs) {
            Element cell = div;
            Elements name = cell.select("h3");
            Element link = name.select("a").first();
            String absHref = link.attr("abs:href");
            Document documentArticle = parseUrlLidovky.parse(absHref);
            articleList.add(new Article(name.text(), absHref,
                    extractMetaFromArticleLidovky.getCreatedDate(documentArticle), new Date(),
                    extractMetaFromArticleLidovky.getKeywors(documentArticle), extractMetaFromArticleLidovky.getDescription(documentArticle),
                    1, extractMetaFromArticleLidovky.getNumburOfComment(documentArticle),
                    extractMetaFromArticleLidovky.getAuthor(documentArticle)));

        }
        return articleList;
    }


}