package com.kment.jsoup.idnes;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;

public class ParseUrl {

    public Document parse(String urlString) throws IOException {
        return Jsoup.connect(urlString).get();
    }
}
