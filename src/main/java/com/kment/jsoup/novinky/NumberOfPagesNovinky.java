package com.kment.jsoup.novinky;

import com.kment.jsoup.extractor.ParseUrl;
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
    ParseUrl parseUrl = new ParseUrl();

    public int numberOfPagesArchive(Document document, String selectorContributions) {
        return 1;
    }


    public int numberOfPagesComment(Document document) throws IOException {
        String articleAddress = extractMetaFromArticleNovinky.getArticleAddressFromCommentPage(document);
        ExtractMetaFromArticleNovinky meta = new ExtractMetaFromArticleNovinky();
        ExtractMetaFromArticleNovinky Ex = new ExtractMetaFromArticleNovinky();
        int number = meta.getNumburOfComment(parseUrl.parse(articleAddress));
        double numbertOfPages = number / 30.0;
        return (int) Math.ceil(numbertOfPages);
    }

}
