package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.lidovky.Article.ExtractArticleLidovky
import lidovky.source.ExtractArticlesLidovkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ExtractArticlesFromArchiveSpec extends Specification {

    @Autowired
    ExtractArticleLidovky extractArticle

    lidovky.source.ExtractArticlesLidovkyPreparedData preparedData = new ExtractArticlesLidovkyPreparedData()

    def "number of article in archive for one day"() {
        when:
        List<Article> articleList = extractArticle.findArticles(preparedData.getUrlForArchive())
        then:
        articleList.size() == preparedData.getNumberOfArticlesInArchive()
    }

}
