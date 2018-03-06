package com.kment.jsoup.lidovky;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.lidovky.Article.ExtractArticleLidovky;
import com.kment.jsoup.lidovky.Article.ExtractMetaFromArticleLidovky;
import com.kment.jsoup.lidovky.Comment.ExtractCommentLidovky;
import com.kment.jsoup.lidovky.Comment.PrepareUrlForCommentaryLidovky;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class main {
    public static void main(String[] args) throws IOException, ParseException {
        PrepareUrlForArchivesLidovky prepareUrlForArchivesLidovky = new PrepareUrlForArchivesLidovky();
        // System.out.println(prepareUrlForArchivesLidovky.prepareUrlForYesterday());
        //System.out.println(prepareUrlForArchivesLidovky.prepareUrl(new Date()));

        ParseUrlLidovky parseUrlLidovky = new ParseUrlLidovky();
        //  System.out.println(parseUrlLidovky.parse("https://www.lidovky.cz/americke-prezidentske-volby-pod-vlivem-ruska-vysledna-zprava-republikanu-vyjde-v-patek-g6d-/zpravy-svet.aspx?c=A180201_213723_ln_zahranici_ele"));

        NumberOfPagesLidovky numberOfPagesLidovky = new NumberOfPagesLidovky();
        //   System.out.println(numberOfPagesLidovky.numberOfPagesComment(parseUrlLidovky.parse("https://www.lidovky.cz/diskuse.aspx?iddiskuse=A180201_213723_ln_zahranici_ele&razeni=time")));
        Document document = parseUrlLidovky.parse("https://www.lidovky.cz/diskuse.aspx?iddiskuse=A180201_135042_ln_kultura_ape");

        Element element = document.select("div.disc-list").first();
        // System.out.println(element.html());
        ExtractMetaFromArticleLidovky Ex = new ExtractMetaFromArticleLidovky();
        Elements elements = element.select("ul.itemrow").select("li");
        //  System.out.println(elements.first().text());
        int number = Ex.extractDigits(elements.first().text());
        //     System.out.println(elements.first().html());
        //  System.out.println(number);
        double numbertOfPages = number / 30.0;
        //  System.out.println((int) Math.ceil(numbertOfPages));


        document = parseUrlLidovky.parse("https://www.lidovky.cz/archiv.aspx?datum=1.+2.+2018&idostrova=ln_lidovky");
        Document document1 = parseUrlLidovky.parse("https://www.lidovky.cz/slovenska-policie-obvinila-cechy-z-pouziti-padelanych-bankovek-pwf-/zpravy-svet.aspx?c=A180201_140023_ln_zahranici_ele");
        Element element1 = document.select("div.navig").first();
        //  System.out.println(element1.html());
        //  if (element1 == null)
        //         System.out.println(1);
        int numberOfPages = 0;
        List<Integer> pageNumber = new ArrayList<>();
        Pattern p = Pattern.compile("-?\\d+");
//        Matcher m = p.matcher(element1.text());
        //      while (m.find()) {
        //        pageNumber.add(Integer.parseInt(m.group()));
        //      numberOfPages++;
        //  }
        //  System.out.println(numberOfPages);
        //   System.out.println(numberOfPagesLidovky.numberOfPagesArchive(document, ""));
        ExtractMetaFromArticleLidovky extractMetaFromArticleLidovky = new ExtractMetaFromArticleLidovky();
        // System.out.println("datum " +extractMetaFromArticleLidovky.getCreatedDate(document1));
        // System.out.println("keywords " + extractMetaFromArticleLidovky.getKeywors(document1));
        // System.out.println("description " + extractMetaFromArticleLidovky.getDescription(document1));
        // System.out.println("author " + extractMetaFromArticleLidovky.getAuthor(document1));
        // System.out.println("pages " +extractMetaFromArticleLidovky.getNumburOfComment(document1));
        //  System.out.println("cislo " +extractMetaFromArticleLidovky.extractDigits("Příspěvků: 0"));
        int cilso = extractMetaFromArticleLidovky.extractDigits("Příspěvků: 0");
        //  System.out.println("********");
        //    element =  document.select("div.disc-top").first();
        //      System.out.println(element.text());
//        System.out.println(extractMetaFromArticleLidovky.extractDigits(element.text()));

        element = document1.select("div.disc-top").first();
        //    System.out.println(element.text().matches(".*\\d+.*"));
        //if (element == null)
        //      System.out.println("nic");
        // else {
        //    System.out.println(element.text());
        // }


        ExtractArticleLidovky extractArticleLidovky = new ExtractArticleLidovky();

        List<Article> articleList = new ArrayList<>();
        String urlForNextPage;
        NumberOfPagesLidovky numberOfPage = new NumberOfPagesLidovky();
        String selectorContent = "div#content";
        numberOfPages = numberOfPage.numberOfPagesArchive(document, selectorContent);
        String selectorArticle = "div.art";
        Element contens = document.select(selectorContent).first();
        Elements selectedDivs = contens.select(selectorArticle);
        // System.out.println(selectedDivs);
        //   articleList.addAll(getArticles(selectedDivs, document));

        PrepareUrlForCommentaryLidovky prepareUrlForCommentaryLidovky = new PrepareUrlForCommentaryLidovky();
        System.out.println("comment url " + prepareUrlForCommentaryLidovky.prepareUrlForCommentPage("https://www.lidovky.cz/ceska-advokatni-komora-pirati-jakub-michalek-mikulas-ferjencik-tomas-sokol-16g-/zpravy-domov.aspx?c=A180306_103330_ln_domov_rsa"));


        ExtractCommentLidovky commentLidovky = new ExtractCommentLidovky();
        List<Comment> commentList = commentLidovky.findComments("https://www.lidovky.cz/diskuse.aspx?iddiskuse=A180306_103330_ln_domov_rsa", 10);
        System.out.println(commentList.toString());
        //    articleList = extractArticleLidovky.findArticles("https://www.lidovky.cz/archiv.aspx?datum=1.+2.+2018&idostrova=lidovky");
        //   System.out.println("*************");
        //    System.out.println(articleList.toString());
    }

}
/*
* <div class="art">
 <div class="art-info">
  <span class="time"> 1. února 2018&nbsp;5:00 </span>
  <span class="domicil">PRAHA</span>
  <a class="author" href="//www.lidovky.cz/novinar.aspx?idnov=3554">Martin Shabu</a>
 </div>
 <h3> <a href="https://www.lidovky.cz/spd-poslala-7-4-milionu-korun-majiteli-agentury-sanep-ta-pred-volbami-favorizovala-okamuru-gs9-/noviny.aspx?c=A180131_222831_ln_domov_ele" title="SPD poslala miliony majiteli agentury SANEP. Ta před volbami favorizovala Okamuru | Noviny | Lidovky.cz">SPD poslala miliony majiteli agentury SANEP. Ta před volbami favorizovala Okamuru</a> </h3>
 <a href="https://www.lidovky.cz/spd-poslala-7-4-milionu-korun-majiteli-agentury-sanep-ta-pred-volbami-favorizovala-okamuru-gs9-/noviny.aspx?c=A180131_222831_ln_domov_ele" title="SPD poslala miliony majiteli agentury SANEP. Ta před volbami favorizovala Okamuru | Noviny | Lidovky.cz" class=""> <img src="//1gr.cz/fotky/lidovky/17/103/lnp210/PEV6ee976_163424_8577687.jpg" alt="Tomio Okamura | na serveru Lidovky.cz | aktuální zprávy" width="210" height="119"> </a>
 <p class="perex"> Největší důvěře se ze šestnácti lídrů politických stran a hnutí těší Tomio Okamura následován Andrejem Babišem,“ zněla první věta článku s titulkem... </p>
 <div class="fc0"></div>
</div>
*
*
* */