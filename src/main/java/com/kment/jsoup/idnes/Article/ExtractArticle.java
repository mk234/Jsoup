package com.kment.jsoup.idnes.Article;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.idnes.NumberOfPages;
import com.kment.jsoup.idnes.ParseUrl;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

@Component
public class ExtractArticle {

    public List<Article> findArticle(String url) throws IOException, ParseException {
        List<Article> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(url);
        NumberOfPages numberOfPage = new NumberOfPages();


        String selectorContributions = "div#content";
        int numberOfPages = numberOfPage.numberOfPages(document, selectorContributions);
        String selectorContribution = "div.art";

        Element contributions = document.select(selectorContributions).first();
        Elements selectedDivs = contributions.select(selectorContribution);
        commentList.addAll(getArticles(selectedDivs));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            document = parseUrl.parse(urlForNextPage);
            contributions = document.select(selectorContributions).first();
            selectedDivs = contributions.select(selectorContribution);
            commentList.addAll(getArticles(selectedDivs));
        }


        return commentList;
    }


    private String getDocumentForNextPage(String url, int i) {
        return url + "&strana=" + i;
    }

    private List<Article> getArticles(Elements selectedDivs) throws ParseException {
        List<Article> commentList = new ArrayList<>();
        String selectorName = "div.cell";
        String selectorDate = "span.time-date";
        for (Element div : selectedDivs) {
            Element cell = div.select(selectorName).first();
            Elements name = cell.select("h3");
            Element date = div.select(selectorDate).first();
            Element link = name.select("a").first();
            String absHref = link.attr("abs:href");
            commentList.add(new Article(name.text(), absHref, date.text(), date.text(), "key"));
        }
        return commentList;
    }


    public String getKeywors(Document document) throws IOException {
        return
                document.select("meta[name=keywords]").first()
                        .attr("content");
    }

    public String getDescription(Document document) throws IOException {
        String description =
                document.select("meta[name=description]").get(0)
                        .attr("content");
        return description;
    }

    public String getAuthor(Document document) throws IOException {
        String selectorName = "div.authors";
        return document.select(selectorName).first().select("span").first().text();
    }

    public int getNumburOfComment(Document document) {
        String numberOfComment = document.select("li.community-discusion").first().select("a#moot-linkin").first().select("span").text();
        return extractDigits(numberOfComment);
    }


    public int extractDigits(String src) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < src.length(); i++) {
            char c = src.charAt(i);
            if (Character.isDigit(c)) {
                builder.append(c);
            }
        }
        return Integer.parseInt(builder.toString());
    }


}
