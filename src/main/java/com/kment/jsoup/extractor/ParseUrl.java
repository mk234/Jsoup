package com.kment.jsoup.extractor;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ParseUrl {

    public Document parse(String urlString) throws IOException {
        return Jsoup.connect(urlString).get();
    }


}
