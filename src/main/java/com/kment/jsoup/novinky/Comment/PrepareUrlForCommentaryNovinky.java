package com.kment.jsoup.novinky.Comment;

import com.kment.jsoup.idnes.ParseUrl;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class PrepareUrlForCommentaryNovinky {
    //zmenena adresa na lidovky
    public String prepareUrlForCommentPage(String articleUrl) throws IOException {
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(articleUrl);
        Element element = document.select("div#discussionEntry").first();
        Elements element1 = element.select("a");
        String href = element1.outerHtml();
        href = "https://www.novinky.cz" + href.substring(href.indexOf("/"), href.lastIndexOf("\">")) + "&page=1";
        href = href.replace("amp;", "");
        return href;
    }


}
