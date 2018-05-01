package com.kment.jsoup.lidovky.Comment;

import org.springframework.stereotype.Component;

@Component
public class PrepareUrlForCommentaryLidovky {

    public String prepareUrlForCommentPage(String articleUrl) {
        String articleId = articleUrl.replaceAll(".*=", "");
        String commentUrlBase = "https://www.lidovky.cz/diskuse.aspx?iddiskuse=A180201_213723_ln_zahranici_ele".replaceAll("cz.*", "") + "cz/diskuse.aspx?iddiskuse=";
        String commentUrl = commentUrlBase + articleId + "&razeni=time";
        return commentUrl;
    }

}
