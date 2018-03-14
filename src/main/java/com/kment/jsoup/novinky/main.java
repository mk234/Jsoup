package com.kment.jsoup.novinky;

import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.novinky.Article.ExtractMetaFromArticleNovinky;
import com.kment.jsoup.novinky.Comment.ExtractCommentNovinky;
import com.kment.jsoup.novinky.Comment.PrepareUrlForCommentaryNovinky;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public class main {
    public static void main(String[] args) throws IOException, ParseException {
        ParseUrlNovinky parseUrlNovinky = new ParseUrlNovinky();
        NumberOfPagesNovinky numberOfPagesNovinky = new NumberOfPagesNovinky();
        Document documentComment = parseUrlNovinky.parse("https://www.novinky.cz/diskuse?id=518688&articleId=/zahranicni/blizky-a-stredni-vychod/465920-valka-v-syrii-ma-uz-pul-milionu-obeti.html&sectionId=743");
        Document documentArchiv = parseUrlNovinky.parse("https://www.novinky.cz/archiv?id=966&date=8.3.2018");
        Document documentArticle = parseUrlNovinky.parse("https://www.novinky.cz/zahranicni/blizky-a-stredni-vychod/465920-valka-v-syrii-ma-uz-pul-milionu-obeti.html");

        Element element = documentComment.select("p.back").first();
//        System.out.println(element.html());
//        String href = element.html();
//        System.out.println(href);
//        String myString = "core/pages/viewemployee.jsff";
//        int html = href.lastIndexOf(".html");
//        int backSlash = href.indexOf( "/");
//        System.out.println(backSlash);
//        System.out.println(html);
//        System.out.println(href.substring(backSlash, html+5));
        //  String newString = myString.substring(myString.lastIndexOf("/")+1, myString.indexOf("."));
        //   String repl = href.replaceAll("<a data-dot="","");
        //  System.out.println(repl);
        //  System.out.println(numberOfPagesNovinky.numberOfPagesComment(documentComment));

//        System.out.println(documentArticle.select("div#discussionEntry").text());
        ExtractMetaFromArticleNovinky extractMetaFromArticleNovinky = new ExtractMetaFromArticleNovinky();
        int numberOfdPage = extractMetaFromArticleNovinky.getNumburOfComment(documentArticle);
//        System.out.println(numberOfdPage);
//        System.out.println(numberOfPagesNovinky.extractMetaFromArticleNovinky.getArticleAddressFromCommentPage(documentComment));
//        System.out.println(numberOfPagesNovinky.numberOfPagesComment(documentComment));

        PrepareUrlForCommentaryNovinky prepareUrlForCommentaryNovinky = new PrepareUrlForCommentaryNovinky();
//         System.out.println(prepareUrlForCommentaryNovinky.prepareUrlForCommentPage("https://www.novinky.cz/zahranicni/blizky-a-stredni-vychod/465920-valka-v-syrii-ma-uz-pul-milionu-obeti.html"));

        Document newDocument = parseUrlNovinky.parse("https://www.novinky.cz/diskuse?id=518772&articleId=/ekonomika/465992-japonci-pred-zamestnavanim-cizincu-uprednostnuji-roboty.html&sectionId=5");
        Elements element1;// = newDocument.select("div#head");


        element1 = newDocument.select("div#contributions");
        element1 = element1.select("div.threadBox");
        Element html = element1.select("div.msgBoxOut").first();

        Element element2 = html.select("h4.name").first();
        String name = element2.select("span").text();
        System.out.println(name);


        Element date = html.select("div.infoDate").first();

        date = date.select("span").first();
        System.out.println(date.text());


        String content = html.select("div.content").first().text();
        System.out.println(content);
        System.out.println("------------------");


        ExtractCommentNovinky extractCommentNovinky = new ExtractCommentNovinky();

        String datum = date.text();
        System.out.println(datum.indexOf(","));
        System.out.println(datum.substring(datum.indexOf(",") + 2, datum.length()));


        System.out.println(extractCommentNovinky.getCreatedDate(date));

        List<Comment> commentList = extractCommentNovinky.findComments("https://www.novinky.cz/diskuse?id=518772&articleId=/ekonomika/465992-japonci-pred-zamestnavanim-cizincu-uprednostnuji-roboty.html&sectionId=5", 1);
        System.out.println(commentList.toString());
    }

}
