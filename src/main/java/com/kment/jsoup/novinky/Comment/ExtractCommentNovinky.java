package com.kment.jsoup.novinky.Comment;

import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.novinky.NumberOfPagesNovinky;
import com.kment.jsoup.novinky.ParseUrlNovinky;
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
public class ExtractCommentNovinky {
    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        ParseUrlNovinky parseUrlNovinky = new ParseUrlNovinky();
        System.out.println(urlComment);
        Document document = parseUrlNovinky.parse(urlComment);
        return findComments(urlComment, idArticle, document);
    }

    //stejne
    public List<Comment> findComments(String url, long idArticle, Document document) throws IOException, ParseException {
        List<Comment> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrlNovinky parseUrlNovinky = new ParseUrlNovinky();
        NumberOfPagesNovinky numberOfPage = new NumberOfPagesNovinky();
        String selectorContributions = "div#contributions";
        int numberOfPages = numberOfPage.numberOfPagesComment(document);
        if (numberOfPages == 0) {
            return commentList;
        }
        String selectorContribution = "div.threadBox";

        Element contributions = document.select(selectorContributions).first();
        Elements selectedDivs = contributions.select(selectorContribution);
        Elements msgBox = selectedDivs.select("div.msgBoxOut");
        commentList.addAll(getCommentsFromElements(msgBox, idArticle));

        for (int i = 2; i <= numberOfPages; i++) {
            urlForNextPage = getDocumentForNextPage(url, i);
            document = parseUrlNovinky.parse(urlForNextPage);
            contributions = document.select(selectorContributions).first();
            selectedDivs = contributions.select(selectorContribution);
            msgBox = selectedDivs.select("div.msgBoxOut");
            commentList.addAll(getCommentsFromElements(msgBox, idArticle));
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
            System.out.println("jmeno " + div.select("h4.name").first().text());
            System.out.println(div.select("div.content").first().text());
            System.out.println(div.select("div.infoDate").first().select("span").first().text());
            String name = div.select("h4.name").first().text();
            Date date = getCreatedDate(div.select("div.infoDate").first().select("span").first());
            String content = div.select("div.content").first().text();
            commentList.add(new Comment(name, content, "", idArticle, date));
        }
        return commentList;

    }


    //stejne
    public Date getCreatedDate(Element dateElement) throws ParseException {
        String data = dateElement.text();
        if (data.contains(":")) {
            SimpleDateFormat sdf = new SimpleDateFormat("EEEE, dd. MMM yyyy, HH:mm:ss");
            Date date = sdf.parse(data);
            return date;
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("EEEE, dd. MMM yyyy");
            Date date = sdf.parse(data);
            return date;
        }
    }

}
