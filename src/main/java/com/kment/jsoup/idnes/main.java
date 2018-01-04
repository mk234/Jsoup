package com.kment.jsoup.idnes;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

public class main {
    public static void main(String[] args) throws IOException, ParseException {
    /*    ExtractComment extractComment = new ExtractComment();
        List<CommentEntity> commentEntities = extractComment.findComments("https://zpravy.idnes.cz/diskuse.aspx?iddiskuse=A150730_143206_zahranicni_aba");
        for (CommentEntity commentEntity : commentEntities) {
            System.out.println(commentEntity);
        }*/
/*
        ExtractArticle extractArticle = new ExtractArticle();
        List<ArticleEntity> articleEntities = extractArticle.findArticle("https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes");
        for (ArticleEntity articleEntity : articleEntities) {
            System.out.println(articleEntity);
        }*/

        String urlString = "https://zpravy.idnes.cz/archiv.aspx?datum=2.%208.%202015&idostrova=idnes";
        Document doc = Jsoup.connect(urlString).get();

        String selectorContributions = "div#content";
        String selectorContribution = "div.art";

        Element contributions = doc.select(selectorContributions).first();


        Elements selectedDivs = contributions.select(selectorContribution);

        String selectorName = "div.cell";
        String selectorDate = "span.time-date";
         for (Element div : selectedDivs) {
            Element cell = div.select(selectorName).first();
            Elements name = cell.select("h3");
            Element date = div.select(selectorDate).first();
            System.out.println(name.text());
            System.out.println(date.text());
            Element  link = name.select("a").first();
            String absHref = link.attr("abs:href");
            System.out.println(absHref);
            System.out.println("=====================================");
        }

    }
}
