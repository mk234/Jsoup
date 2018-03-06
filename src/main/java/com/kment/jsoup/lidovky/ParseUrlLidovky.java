package com.kment.jsoup.lidovky;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.io.IOException;

//univeryalni pro vse
@Component
public class ParseUrlLidovky {

    public Document parse(String urlString) throws IOException {
        return Jsoup.connect(urlString).get();
    }


}
