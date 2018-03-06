package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.lidovky.Article.ExtractMetaFromArticleLidovky
import lidovky.source.ExtractMetaFromArticleLidovkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

import java.text.DateFormat
import java.text.SimpleDateFormat

@SpringBootTest(classes = Application.class)
class ExtractMetaFromArticleSpec extends Specification {

    ExtractMetaFromArticleLidovkyPreparedData preparedData = new ExtractMetaFromArticleLidovkyPreparedData()
    @Autowired
    ExtractMetaFromArticleLidovky extractMetaFromArticle = new ExtractMetaFromArticleLidovky()

    def "get keywords from article"() {
        when:
        String keywords = extractMetaFromArticle.getKeywors(preparedData.articleAsDocument)
        then:
        keywords.equals(preparedData.getKeywors())
    }

    def "get author from article"() {
        when:
        String author = extractMetaFromArticle.getAuthor(preparedData.articleAsDocument)
        then:
        author.equals(preparedData.getAuthor())
    }

    def "get description from article"() {
        when:
        String description = extractMetaFromArticle.getDescription(preparedData.articleAsDocument)
        then:
        description.equals(preparedData.getDescription())
    }

    def "get number of comment to one specific article"() {
        when:
        int number = extractMetaFromArticle.getNumburOfComment(preparedData.articleAsDocument)
        then:
        number == preparedData.getNumberOfComments()
    }

    def "get created date from article"() {
        when:
        def date = extractMetaFromArticle.getCreatedDate(preparedData.articleAsDocument)
        DateFormat df = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")
        String reportDate = df.format(date)
        then:
        reportDate == preparedData.getDate()
    }
}
