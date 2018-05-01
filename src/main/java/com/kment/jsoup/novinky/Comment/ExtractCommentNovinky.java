package com.kment.jsoup.novinky.Comment;

import com.kment.jsoup.entity.Comment;
import com.kment.jsoup.extractor.ExtractMeta;
import com.kment.jsoup.extractor.ParseUrl;
import com.kment.jsoup.novinky.NumberOfPagesNovinky;
import org.apache.commons.lang3.time.DateUtils;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Component
public class ExtractCommentNovinky {

    @Autowired
    ExtractMeta extractMeta;

    public List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException {
        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(urlComment);
        return findComments(urlComment, idArticle, document);
    }


    public List<Comment> findComments(String url, long idArticle, Document document) throws IOException, ParseException {
        List<Comment> commentList = new ArrayList<>();
        String urlForNextPage;
        ParseUrl parseUrl = new ParseUrl();
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
            document = parseUrl.parse(urlForNextPage);
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


    private List<Comment> getCommentsFromElements(Elements selectedDivs, long idArticle) throws ParseException {
        List<Comment> commentList = new ArrayList<>();
        for (Element div : selectedDivs) {
            String name = div.select("h4.name").first().text();
            Date date = getCreatedDate(div.select("div.infoDate").first().select("span").first());
            String content = div.select("div.content").first().text();
            commentList.add(new Comment(name, content, "", idArticle, date));
        }
        return commentList;

    }


    public Date getCreatedDate(Element dateElement) throws ParseException {
        String data = dateElement.text();
        Date date;
        data = data.substring(data.indexOf(",") + 2, data.length());
        if (data.contains(":")) {
            String month = data.substring(data.indexOf(".") + 2, data.lastIndexOf(",") - 5);
            String day = data.substring(0, data.lastIndexOf("."));
            String year = data.substring(data.lastIndexOf(",") - 4, data.lastIndexOf(","));
            String time = data.substring(data.indexOf(",") + 2, data.length());
            date = DateUtils.parseDateStrictly(day + "." + extractMeta.getMonth(month) + " " + year + ", " + time, "dd.MM yyyy, HH:mm:ss");
            return date;
        } else {
            String month = data.substring(data.indexOf(".") + 2, data.length() - 5);
            String day = data.substring(0, data.lastIndexOf("."));
            String year = data.substring(data.length() - 4, data.length());
            date = DateUtils.parseDateStrictly(day + "." + extractMeta.getMonth(month) + " " + year + ", 00:00", "dd.MM yyyy, HH:mm");
            return date;
        }

    }



}
