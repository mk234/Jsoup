package com.kment.jsoup.idnes;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public class main {
    public static void main(String[] args) throws IOException, ParseException {
        ExtractComment extractComment = new ExtractComment();
        List<CommentEntity> commentEntities = extractComment.findComments("https://zpravy.idnes.cz/diskuse.aspx?iddiskuse=A150730_143206_zahranicni_aba");
        for (CommentEntity commentEntity : commentEntities) {
            System.out.println(commentEntity);
        }

    }
}
