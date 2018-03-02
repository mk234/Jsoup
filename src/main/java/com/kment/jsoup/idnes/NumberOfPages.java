package com.kment.jsoup.idnes;

import com.kment.jsoup.idnes.Article.ExtractMetaFromArticle;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class NumberOfPages {

    @Autowired
    ExtractMetaFromArticle extractMetaFromArticle = new ExtractMetaFromArticle();
    @Autowired
    ParseUrl parseUrl = new ParseUrl();

    public int numberOfPagesArchive(Document document, String selectorContributions) {
        Element contributions = document.select(selectorContributions).first();
        if (contributions == null)
            return 0;
        Element pages = contributions.select("table.nav-n4.ico").first();
        if (pages == null) {
            return 1;
        } else {
            int numberOfPages = 0;
            Element pageCount = pages.select("td.tac").first();
            List<Integer> pageNumber = new ArrayList<>();
            Pattern p = Pattern.compile("-?\\d+");
            Matcher m = p.matcher(pageCount.text());
            while (m.find()) {
                pageNumber.add(Integer.parseInt(m.group()));
                numberOfPages++;
            }
            return numberOfPages;
        }
    }

    public int numberOfPagesComment(Document document) throws IOException {
        String selectorContent = "div.content";
        Element selectContent = document.select(selectorContent).first();
        Elements selectH3 = selectContent.select("h3");
        Element selectLink = selectH3.first();
        if (selectLink == null) {
            return 0;
        }
        String name = selectLink.html();
        Document linkDoc = Jsoup.parse(name);
        Element link = linkDoc.select("a").first();
        String linkHref = link.attr("href");
        // System.out.println("link je " + linkHref);
        Document document1 = parseUrl.parse(linkHref);
        double numberOfComment = extractMetaFromArticle.getNumburOfComment(document1);
        double numbertOfPages = numberOfComment / 50.0;
        return (int) Math.ceil(numbertOfPages);

    }
}