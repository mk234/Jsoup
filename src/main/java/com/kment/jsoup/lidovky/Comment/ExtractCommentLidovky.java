package com.kment.jsoup.lidovky.Comment;

import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.lidovky.NumberOfPagesLidovky;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Component
public class ExtractCommentLidovky {
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        ParseUrl parseUrl = new ParseUrl();
        // System.out.println(urlComment);
        Document document = parseUrl.parse(urlComment);
        return findComments(urlComment, idArticle, document);
    }

    //stejne
    public List<Comment> findComments(String url, long idArticle, Document document) throws IOException, ParseException {
        List<Comment> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
        NumberOfPagesLidovky numberOfPage = new NumberOfPagesLidovky();
        String selectorContributions = "div#disc-list";
        int numberOfPages = numberOfPage.numberOfPagesComment(document);
        if (numberOfPages == 0) {
            return commentList;
        }
        String selectorContribution = "div.contribution";

        Element contributions = document.select(selectorContributions).first();
        Elements selectedDivs = contributions.select(selectorContribution);
        commentList.addAll(getCommentsFromElements(selectedDivs, idArticle));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            document = parseUrl.parse(urlForNextPage);
            contributions = document.select(selectorContributions).first();
            selectedDivs = contributions.select(selectorContribution);
            commentList.addAll(getCommentsFromElements(selectedDivs, idArticle));
        }


        return commentList;
    }

    private String getDocumentForNextPage(String url, int i) {
        return url + "&strana=" + i;
    }

    //predelano
    private List<Comment> getCommentsFromElements(Elements selectedDivs, long idArticle) throws ParseException {
        List<Comment> commentList = new ArrayList<>();
        for (Element div : selectedDivs) {
            System.out.println("jmeno " + div.select("span.name").first().text());
//            System.out.println("second span " + div.select("span").set(1, div).text());
            System.out.println(div.select("td.right").first().select("p").set(1, div).text());
            System.out.println(getCreatedDate(div.select("span").set(1, div)));
            String name = div.select("span.name").first().text();
            Date date = getCreatedDate(div.select("span").set(1, div));
            String content = div.select("td.right").first().select("p").set(1, div).text();
            commentList.add(new Comment(name, content, "", idArticle, date));
        }
        return commentList;

    }


    //stejne
    public Date getCreatedDate(Element dateElement) throws ParseException {
        String data = dateElement.text();
        if (data.contains(":")) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy HH:mm");
            Date date = sdf.parse(data);
            return date;
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
            Date date = sdf.parse(data);
            return date;
        }
    }

}
