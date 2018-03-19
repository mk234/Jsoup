package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.idnes.Article.ExtractArticleIdnes
import com.kment.jsoup.lidovky.Article.ExtractArticleLidovky
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import com.kment.jsoup.springdata.ICommentSpringDataRepository
import com.kment.jsoup.springdata.IPortalSpringDataRepository
import idnes.source.ExtractArticlesIdnesPreparedData
import lidovky.source.ExtractArticlesLidovkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.stereotype.Repository
import spock.lang.Specification
import spock.lang.Unroll

@SpringBootTest(classes = Application.class)
@Repository
class ExtractArticlesFromArchiveSpec extends Specification {

    @Autowired
    ExtractArticleLidovky extractArticleLidovky
    @Autowired
    ExtractArticleIdnes extractArticleIdnes
    @Autowired
    IArticleSpringDataRepository articleRepository
    @Autowired
    ICommentSpringDataRepository commentRepository
    @MockBean
    IPortalSpringDataRepository portalRepository


    ExtractArticlesLidovkyPreparedData lidovkyPreparedData = new ExtractArticlesLidovkyPreparedData()
    ExtractArticlesIdnesPreparedData idnesPreparedData = new ExtractArticlesIdnesPreparedData()

    @Unroll
    def "number of articles in #portalName archive for one day"() {
        given:
        def extractor = this."extractArticle${portalName}"
        when:
        List<Article> articleList = extractor.findArticles(url)
        println articleList.size()
        then:
        articleList.size() == result
        where:
        portalName | url                                                         | result
        "Lidovky"  | new ExtractArticlesLidovkyPreparedData().getUrlForArchive() | new ExtractArticlesLidovkyPreparedData().getNumberOfArticlesInArchive()
        "Idnes"    | new ExtractArticlesIdnesPreparedData().getUrlForArchive()   | new ExtractArticlesIdnesPreparedData().getNumberOfArticlesInArchive()
//        "Novinky" | new ExtractArticlesNovinkyPreparedData().getUrlForArchive()   | new ExtractArticlesNovinkyPreparedData().getNumberOfArticlesInArchive()
    }


}
