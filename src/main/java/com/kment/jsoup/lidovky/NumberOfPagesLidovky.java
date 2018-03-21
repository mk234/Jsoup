package com.kment.jsoup.lidovky;

import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.lidovky.Article.ExtractMetaFromArticleLidovky;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class NumberOfPagesLidovky {

    @Autowired
    ExtractMetaFromArticleLidovky extractMetaFromArticleLidovky = new ExtractMetaFromArticleLidovky();
    @Autowired
    ParseUrl parseUrl = new ParseUrl();

    //predelano, odstraneny elementy, zustalo   vse od ifu
    public int numberOfPagesArchive(Document document, String selectorContributions) {
        Element element = document.select("div.navig").first();
        if (element == null)
            return 1;
        int numberOfPages = 0;
        List<Integer> pageNumber = new ArrayList<>();
        Pattern p = Pattern.compile("-?\\d+");
        Matcher m = p.matcher(element.text());
        while (m.find()) {
            pageNumber.add(Integer.parseInt(m.group()));
            numberOfPages++;
        }
        return numberOfPages;
    }


    //kompletne predelano
    public int numberOfPagesComment(Document document) {
        Element element = document.select("div.disc-list").first();
        ExtractMetaFromArticleLidovky Ex = new ExtractMetaFromArticleLidovky();
// nutno osetrin na null
        Elements elements = element.select("ul.itemrow").select("li");
        int number = Ex.extractDigits(elements.first().text());
        double numbertOfPages = number / 30.0;
        return (int) Math.ceil(numbertOfPages);
    }
}