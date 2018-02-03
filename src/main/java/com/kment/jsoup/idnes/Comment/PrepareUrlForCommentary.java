package com.kment.jsoup.idnes.Comment;

import org.springframework.stereotype.Component;

@Component
public class PrepareUrlForCommentary {
    public String prepareUrlForCommentPage(String articleUrl) {
        String articleId = articleUrl.replaceAll(".*=", "");
        String commentUrlBase = "https://zpravy.idnes.cz/inuite-kanada-led-mereni-moderni-technologie-f3j-/zahranicni.aspx?c=A180103_150757_zahranicni_ert".replaceAll("cz.*", "") + "cz/diskuse.aspx?iddiskuse=";
        String commentUrl = commentUrlBase + articleId + "&razeni=time";
        return commentUrl;
    }

}
