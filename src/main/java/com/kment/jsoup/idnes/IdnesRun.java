package com.kment.jsoup.idnes;

import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public class IdnesRun {
/*
    @Autowired
    ExtractArticleIdnes extractArticleIdnes;
    @Autowired
    ExtractCommentIdnes extractCommentIdnes;
    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository;
    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository;
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository;
    @Autowired
    PrepareUrlForArchivesIdnes prepareUrlForArchivesIdnes;
    @Autowired
    PrepareUrlForCommentaryIdnes prepareUrlForCommentaryIdnes;
    @PersistenceContext
    EntityManager entityManager;
    @Autowired
    ExtractMetaFromArticleIdnes extractMetaFromArticleIdnes;

    final static int batchSize = 250;
    List<Comment> commentEntities = new ArrayList<>();
    List<Article> articleEntities = new ArrayList<>();
    String commentUrl = "";
    long idArticle;

    public void run() throws IOException, ParseException {
        extractAndSaveYesterday();
        extractAndSaveMultipleDaysBefereYesterday(7);
    }


    public void extractAndSaveYesterday() throws IOException, ParseException {
        clearLists();
        articleEntities = extractArticleIdnes.findArticles(prepareUrlForArchivesIdnes.prepareUrlForYesterday());
        saveArticle();
        saveComments();
        flushAndClearEntityManager();
        System.out.println("yesterday done");
    }

    public void extractAndSaveMultipleDaysBefereYesterday(int numbebOfDaysBeforeYesterday) throws ParseException, IOException {
        Date datum;
        String day;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy");
        final Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1);
        for (int i = 0; i < numbebOfDaysBeforeYesterday; i++) {
            clearLists();
            calendar.add(Calendar.DATE, -1);
            Date yesterday = calendar.getTime();
            day = new DateTime(yesterday).toString("dd.MM.yyyy");
            datum = simpleDateFormat.parse(day);
            articleEntities = extractArticleIdnes.findArticles(prepareUrlForArchivesIdnes.prepareUrl(datum));
            saveArticle();
            saveComments();
            flushAndClearEntityManager();
        }
        System.out.println(numbebOfDaysBeforeYesterday + " done");
    }

    public void extractAndSaveOneDay(String date) throws IOException, ParseException {
        clearLists();
        articleEntities = extractArticleIdnes.findArticles(prepareUrlForArchivesIdnes.prepareUrlFromString(date));
        saveArticle();
        saveComments();
        flushAndClearEntityManager();
        System.out.println(date + " done");
    }

    private void flushAndClearEntityManager() {
        entityManager.flush();
        entityManager.clear();
    }

    private void saveComments() {
        System.out.println(commentEntities.size());
        for (int i = 0; i < commentEntities.size(); i++) {
            Comment comment = commentEntities.get(i);
            //     entityManager.persist(comment);
            if (i % batchSize == 0) {
                flushAndClearEntityManager();
            }
        }
    }

    private void saveArticle() throws IOException, ParseException {
        for (Article articleEntity : articleEntities) {
            Article savedArticle = articleSpringDataRepository.save(articleEntity);
            idArticle = savedArticle.getId();
            commentUrl = prepareUrlForCommentaryIdnes.prepareUrlForCommentPage(articleEntity.getUrl());
            commentEntities.addAll(extractCommentIdnes.findComments(commentUrl, idArticle));
        }
    }


    private void clearLists() {
        commentEntities.clear();
        articleEntities.clear();
    }

    public void saveOneArticleWithComments(String articleUrl) throws IOException, ParseException {
        clearLists();

        ParseUrl parseUrl = new ParseUrl();
        Document document = parseUrl.parse(articleUrl);
        articleEntities.add(new Article("Jmeno", articleUrl, extractMetaFromArticleIdnes.getCreatedDate(document), new Date(), extractMetaFromArticleIdnes.getKeywors(document),
                extractMetaFromArticleIdnes.getDescription(document), 1, extractMetaFromArticleIdnes.getNumburOfComment(document), extractMetaFromArticleIdnes.getAuthor(document)));
        saveArticle();
        saveComments();
        flushAndClearEntityManager();
    }
*/
}