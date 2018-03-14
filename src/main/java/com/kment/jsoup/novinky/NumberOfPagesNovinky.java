package com.kment.jsoup.novinky;

import com.kment.jsoup.novinky.Article.ExtractMetaFromArticleNovinky;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class NumberOfPagesNovinky {

    @Autowired
    ExtractMetaFromArticleNovinky extractMetaFromArticleNovinky = new ExtractMetaFromArticleNovinky();
    @Autowired
    ParseUrlNovinky parseUrlNovinky = new ParseUrlNovinky();

    //predelano, odstraneny elementy, zustalo   vse od ifu
    //neni potrebne, vzdy je pouze jedna stranka
    public int numberOfPagesArchive(Document document, String selectorContributions) {
//        Element element = document.select("div.navig").first();
//        if (element == null)
//            return 1;
//        int numberOfPages = 0;
//        List<Integer> pageNumber = new ArrayList<>();
//        Pattern p = Pattern.compile("-?\\d+");
//        Matcher m = p.matcher(element.text());
//        while (m.find()) {
//            pageNumber.add(Integer.parseInt(m.group()));
//            numberOfPages++;
//        }
//        return numberOfPages;
        return 1;
    }


    //kompletne predelano
    public int numberOfPagesComment(Document document) throws IOException {
        String articleAddress = extractMetaFromArticleNovinky.getArticleAddressFromCommentPage(document);
        ExtractMetaFromArticleNovinky meta = new ExtractMetaFromArticleNovinky();
        ExtractMetaFromArticleNovinky Ex = new ExtractMetaFromArticleNovinky();
        int number = meta.getNumburOfComment(parseUrlNovinky.parse(articleAddress));
        double numbertOfPages = number / 30.0;
        return (int) Math.ceil(numbertOfPages);
    }

}
