package com.kment.jsoup.idnes;

import com.kment.jsoup.idnes.Article.ArticleEntity;
import com.kment.jsoup.idnes.Article.ExtractArticle;
import com.kment.jsoup.idnes.Comment.CommentEntity;
import com.kment.jsoup.idnes.Comment.ExtractComment;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

public class main {
    public static void main(String[] args) throws IOException, ParseException {

        ExtractComment extractComment = new ExtractComment();
        List<CommentEntity> commentEntities = extractComment.findComments("https://zpravy.idnes.cz/diskuse.aspx?iddiskuse=A150731_2180917_ekonomika_nio");
         for (CommentEntity commentEntity : commentEntities) {
    //        System.out.println(commentEntity);
        }



/*
        ExtractComment extractComment = new ExtractComment();
        ExtractArticle extractArticle = new ExtractArticle();
        PrepareUrlForCommentary prepareUrlForCommentary = new PrepareUrlForCommentary();
        List<CommentEntity> commentEntities = new ArrayList<>();
        String commentUrl = "";

        List<ArticleEntity> articleEntities = extractArticle.findArticle("https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes");
        System.out.println(articleEntities.size());
        for (ArticleEntity articleEntity : articleEntities) {
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            System.out.println(commentUrl);
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }


        System.out.println(commentEntities.size());*/


    }

}
