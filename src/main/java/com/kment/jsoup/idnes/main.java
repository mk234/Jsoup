package com.kment.jsoup.idnes;

import com.kment.jsoup.idnes.Article.ArticleEntity;
import com.kment.jsoup.idnes.Article.ExtractArticle;
import com.kment.jsoup.idnes.Comment.CommentEntity;
import com.kment.jsoup.idnes.Comment.ExtractComment;

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

        ExtractArticle extractArticle = new ExtractArticle();
        List<ArticleEntity> articleEntities = extractArticle.findArticle("https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes");
        for (ArticleEntity articleEntity : articleEntities) {
            System.out.println(articleEntity);
        }
    }

}
