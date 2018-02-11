package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.idnes.Article.ExtractArticle
import idnes.source.ExtractArticlesIdnesPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ExtractArticlesFromArchiveSpec extends Specification {

    @Autowired
    ExtractArticle extractArticle

    ExtractArticlesIdnesPreparedData preparedData = new ExtractArticlesIdnesPreparedData()

    def "number of article in archive for one day"() {
        when:
        List<Article> articleList = extractArticle.findArticles(preparedData.getUrlForArchive())
        then:
        articleList.size() == preparedData.getNumberOfArticlesInArchive()
    }

}
