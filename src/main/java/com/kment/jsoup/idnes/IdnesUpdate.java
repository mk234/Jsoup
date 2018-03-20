package com.kment.jsoup.idnes;


import org.springframework.stereotype.Component;

@Component
public class IdnesUpdate {
/*    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    ExtractCommentIdnes extractCommentIdnes;
    @Autowired
    ICommentSpringDataRepository iCommentSpringDataRepository;
    @Autowired
    ExtractMetaFromArticleIdnes extractMetaFromArticleIdnes;
    @Autowired
    ParseUrl parseUrl;
    @Autowired
    PrepareUrlForCommentaryIdnes prepareUrlForCommentaryIdnes;

    public void updateIdnes(int numberOfDayToUpdate) throws IOException, ParseException {
        List<Article> articleList = fetchArticleForDays(numberOfDayToUpdate);
        findArticleWithNewComments(articleList);
        System.out.println("update done");
    }

    public List<Article> fetchArticleForDays(int days) {
        return articleSpringDataRepository.findByNumberOfDayBeforeToday(days, 1);
    }

    public void findArticleWithNewComments(List<Article> articleList) throws IOException, ParseException {
        Date dateLastCollection;
        List<Comment> commentListToSave = new ArrayList<>();
        List<Comment> commentList;
        for (Article article : articleList) {
            dateLastCollection = article.getLastCollection();
            Document document = parseUrl.parse(article.getUrl());
            int numberOfComment = extractMetaFromArticleIdnes.getNumburOfComment(document);
            System.out.println(article.getCreated());
//            System.out.println(numberOfComment);
            if (numberOfComment > article.getNumberOfComments()) {
                commentList = extractCommentIdnes.findComments(prepareUrlForCommentaryIdnes.prepareUrlForCommentPage(article.getUrl()), article.getId());
                for (int i = 0; i < commentList.size(); i++) {
                    if (commentList.get(i).getDate().after((dateLastCollection)))
                        commentListToSave.add(commentList.get(i));
                }
                iCommentSpringDataRepository.save(commentListToSave);
                article.setNumberOfComments(numberOfComment);
                articleSpringDataRepository.save(article);
            }
            article.setLastCollection(new Date());
//            System.out.println(article.getNumberOfComments());
            if ((article.getNumberOfComments() - numberOfComment) > 0) {
                System.out.println(article.getNumberOfComments() - numberOfComment + " new comments --------------------------");
            }
            articleSpringDataRepository.save(article);
        }
    }
*/
}
