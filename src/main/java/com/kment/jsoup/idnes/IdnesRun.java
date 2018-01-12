package com.kment.jsoup.idnes;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.idnes.Article.ExtractArticle;
import com.kment.jsoup.idnes.Comment.PrepareUrlForCommentary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@Component
public class IdnesRun {

    @Autowired
    ExtractArticle extractArticle;

    public IdnesRun() {
    }

    public void run() throws IOException, ParseException {


    long time = System.currentTimeMillis();
    PrepareUrlForArchives prepareUrlForArchives = new PrepareUrlForArchives();
    //    ExtractComment extractComment = new ExtractComment();
   // ExtractArticle extractArticle = new ExtractArticle();
    PrepareUrlForCommentary prepareUrlForCommentary = new PrepareUrlForCommentary();
    //    List<Comment> commentEntities = new ArrayList<>();
    //  String commentUrl = "";
    List<Article> articleEntities = extractArticle.findArticle(prepareUrlForArchives.prepareUrlForYesterday());
        System.out.println(articleEntities.size());
  /*      for (Article articleEntity : articleEntities) {
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