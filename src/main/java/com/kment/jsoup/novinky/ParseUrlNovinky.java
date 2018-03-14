package com.kment.jsoup.novinky;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.io.IOException;

//univeryalni pro vse
@Component
public class ParseUrlNovinky {

    public Document parse(String urlString) throws IOException {
        return Jsoup.connect(urlString).get();
    }


}
