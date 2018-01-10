package com.kment.jsoup.idnes;

import com.kment.jsoup.idnes.Article.ArticleEntity;
import com.kment.jsoup.idnes.Article.ExtractArticle;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public class main {
    public static void main(String[] args) throws IOException, ParseException {

      /*  ExtractComment extractComment = new ExtractComment();
        List<CommentEntity> commentEntities = extractComment.findComments("https://rungo.idnes.cz/diskuse.aspx?iddiskuse=A150801_204413_behani_Pil");
         for (CommentEntity commentEntity : commentEntities) {
            System.out.println(commentEntity);
        }*/


        long time = System.currentTimeMillis();
        PrepareUrlForArchives prepareUrlForArchives = new PrepareUrlForArchives();
        //    ExtractComment extractComment = new ExtractComment();
        ExtractArticle extractArticle = new ExtractArticle();
        PrepareUrlForCommentary prepareUrlForCommentary = new PrepareUrlForCommentary();
        //    List<CommentEntity> commentEntities = new ArrayList<>();
        //  String commentUrl = "";
        List<ArticleEntity> articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrlForYesterday());
        System.out.println(articleEntities.size());
  /*      for (ArticleEntity articleEntity : articleEntities) {
            System.out.println(articleEntity.getUrl());
            commentUrl = prepareUrlForCommentary.prepareUrl(articleEntity.getUrl());
            commentEntities.addAll(extractComment.findComments(commentUrl));
        }
*/    //    System.out.println(commentEntities.size());

        System.out.println((System.currentTimeMillis() - time) * 0.001 + "s");
        ParseUrl parseUrl = new ParseUrl();
        org.jsoup.nodes.Document document = parseUrl.parse("https://zpravy.idnes.cz/osn-guterres-jednani-severni-jizni-korea-kldr-usa-zimni-olympiada-1c7-/zahranicni.aspx?c=A180109_213340_zahranicni_dtt");

        System.out.println(extractArticle.getKeywors(document));

        System.out.println(extractArticle.getDescription(document));

        System.out.println(extractArticle.getAuthor(document));

        System.out.println(extractArticle.getNumburOfComment(document));


    }

}
