package com.kment.jsoup.idnes.Article;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.idnes.NumberOfPages;
import com.kment.jsoup.idnes.ParseUrl;
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
public class ExtractArticle {

    @Autowired
    ExtractMetaFromArticle extractMetaFromArticle;

    public List<Article> findArticles(String url) throws IOException, ParseException {
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(url);
        return findArticles(url, document);
    }

    public List<Article> findArticles(String url, Document document) throws IOException, ParseException {
        List<Article> articleList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        NumberOfPages numberOfPage = new NumberOfPages();


        String selectorContent = "div#content";
        int numberOfPages = numberOfPage.numberOfPagesArchive(document, selectorContent);
        String selectorArticle = "div.art";

        Element contens = document.select(selectorContent).first();
        Elements selectedDivs = contens.select(selectorArticle);
        articleList.addAll(getArticles(selectedDivs, document));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            document = parseUrl.parse(urlForNextPage);
            contens = document.select(selectorContent).first();
            selectedDivs = contens.select(selectorArticle);
            articleList.addAll(getArticles(selectedDivs, document));
        }
        return articleList;
    }


    private String getDocumentForNextPage(String url, int i) {
        return url + "&strana=" + i;
    }

    private List<Article> getArticles(Elements selectedDivs, Document document) throws ParseException, IOException {
        List<Article> articleList = new ArrayList<>();
        String selectorName = "div.cell";
        ParseUrl parseUrl = new ParseUrl();
        for (Element div : selectedDivs) {
            Element cell = div.select(selectorName).first();
            Elements name = cell.select("h3");
            Element link = name.select("a").first();
            String absHref = link.attr("abs:href");
            Document documentArticle = parseUrl.parse(absHref);
            articleList.add(new Article(name.text(), absHref,
                    extractMetaFromArticle.getCreatedDate(documentArticle), new Date(),
                    extractMetaFromArticle.getKeywors(documentArticle), extractMetaFromArticle.getDescription(documentArticle),
                    1, extractMetaFromArticle.getNumburOfComment(documentArticle),
                    extractMetaFromArticle.getAuthor(documentArticle)));
        }
        return articleList;
    }


}