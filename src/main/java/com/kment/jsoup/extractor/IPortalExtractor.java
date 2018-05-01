package com.kment.jsoup.extractor;

import com.kment.jsoup.entity.Article;
import com.kment.jsoup.entity.Comment;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

public interface IPortalExtractor {
    /**
     * Returns name of the portal as a String.
     * Using for saving this name to db.
     *
     * @return portal name
     */
    String getPortalName();

    /**
     * Returns an article list from the news server archive for one specific day.
     * If the archive does not contain any items, it returns an empty list, not null.
     *
     * @param url of archive with day in address
     * @return article list from the news server archive for one specific day
     * @throws IOException
     * @throws ParseException
     */
    List<Article> findArticles(String url) throws IOException, ParseException;

    /**
     * Returns the archive address for yesterday's day
     *
     * @return address of the archive for yesterday's day
     */
    String prepareUrlForYesterday();

    /**
     * Return url for archive in String format for one specific day.
     *
     * @param date for specific day
     * @return address of the archive for specific day
     */
    String prepareUrl(Date date);

    /**
     * Returns a comment list for one specific article.
     *
     * @param urlComment from article
     * @param idArticle  for saving to db
     * @return a list of comments that are found on that address
     * @throws IOException
     * @throws ParseException
     */
    List<Comment> findComments(String urlComment, long idArticle) throws IOException, ParseException;

    /**
     * Returns creation date of article.
     *
     * @param document created from article parse by Jsoup
     * @return creation date
     * @throws ParseException
     */
    Date getCreatedDate(Document document) throws ParseException;

    /**
     * Returns keyfords from article.
     *
     * @param document created from article parse by Jsoup
     * @return string with keyword from article
     */
    String getKeywors(Document document);

    /**
     * Returns description for specific article.
     *
     * @param document created from article parse by Jsoup
     * @return string with description
     */
    String getDescription(Document document);

    /**
     * Returns number of comments for one specific article.
     *
     * @param document created from article parse by Jsoup
     * @return number of comment
     */
    int getNumburOfComment(Document document);

    /**
     * Returns the author of the article
     *
     * @param document created from article parse by Jsoup
     * @return string with author
     */
    String getAuthor(Document document);


    /**
     * Returns Jsoup document from specific URL.
     * If document is null, than return null, not empty document.
     *
     * @param urlString
     * @return parsed jsoup document
     * @throws IOException
     */
    Document parse(String urlString) throws IOException;

    /**
     * Returns comments URL from article URL.
     *
     * @param articleUrl
     * @return comment address as a string
     * @throws IOException
     */
    String prepareUrlForCommentPage(String articleUrl) throws IOException;

    /**
     * Returns urtl for specific news portal.
     *
     * @return url of news portal
     */
    String getUrl();
}