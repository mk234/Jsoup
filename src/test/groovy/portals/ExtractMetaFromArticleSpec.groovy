package portals

import com.kment.jsoup.Application
import com.kment.jsoup.idnes.Article.ExtractMetaFromArticleIdnes
import com.kment.jsoup.lidovky.Article.ExtractMetaFromArticleLidovky
import com.kment.jsoup.novinky.Article.ExtractMetaFromArticleNovinky
import idnes.source.ExtractMetaFromArticleIdnesPreparedData
import lidovky.source.ExtractMetaFromArticleLidovkyPreparedData
import lidovky.source.ParseFromFile
import novinky.source.ExtractMetaFromArticleNovinkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification
import spock.lang.Unroll

import java.text.DateFormat
import java.text.SimpleDateFormat

@SpringBootTest(classes = Application.class)
class ExtractMetaFromArticleSpec extends Specification {

    @Autowired
    ExtractMetaFromArticleLidovky extractMetaFromArticleLidovky
    @Autowired
    ExtractMetaFromArticleNovinky extractMetaFromArticleNovinky
    @Autowired
    ExtractMetaFromArticleIdnes extractMetaFromArticleIdnes

    @Unroll
    def "get keywords from article on #portalName"() {
        given: "prepared extractor"
        def extractor = this."extractMetaFromArticle${portalName}"
        when: "get keywords"
        String keywordsFromArticle = extractor.getKeywors(preparedData.getArticleAsDocument())
        then: "compare keywords from article with real keywords"
        keywordsFromArticle.equals(preparedData.getKeywords())
        where: "parameters for test"
        portalName | preparedData
        "Lidovky"  | new ExtractMetaFromArticleLidovkyPreparedData()
        "Idnes"    | new ExtractMetaFromArticleIdnesPreparedData()
        "Novinky"  | new ExtractMetaFromArticleNovinkyPreparedData()
    }


    @Unroll
    def "get author from article on #portalName"() {
        given:
        def extractor = this."extractMetaFromArticle${portalName}"
        when:
        String authorFromArticle = extractor.getAuthor(articleAsDocument)
        then:
        authorFromArticle.equals(author)
        where:
        portalName | articleAsDocument                                                      | author
        "Lidovky"  | new ExtractMetaFromArticleLidovkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleLidovkyPreparedData().getAuthor()
        "Idnes"    | new ExtractMetaFromArticleIdnesPreparedData().getArticleAsDocument()   | new ExtractMetaFromArticleIdnesPreparedData().getAuthor()
        "Novinky"  | new ExtractMetaFromArticleNovinkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleNovinkyPreparedData().getAuthor()

    }

    @Unroll
    def "get description from article on #portalName"() {
        given:
        def extractor = this."extractMetaFromArticle${portalName}"
        when:
        String descriptionFromArticle = extractor.getDescription(articleAsDocument)
        then:
        descriptionFromArticle.equals(description)
        where:
        portalName | articleAsDocument                                                      | description
        "Lidovky"  | new ExtractMetaFromArticleLidovkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleLidovkyPreparedData().getDescription()
        "Idnes"    | new ExtractMetaFromArticleIdnesPreparedData().getArticleAsDocument()   | new ExtractMetaFromArticleIdnesPreparedData().getDescription()
        "Novinky"  | new ExtractMetaFromArticleNovinkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleNovinkyPreparedData().getDescription()
    }

    @Unroll
    def "get description for empty document on #portalName"() {
        given:
        def extractor = this."extractMetaFromArticle${portalName}"
        when:
        String descriptionFromArticle = extractor.getDescription(articleAsDocument)
        then:
        descriptionFromArticle.equals(description)
        where:
        portalName | articleAsDocument                      | description
        "Lidovky"  | new ParseFromFile().getEmptyDocument() | ""
        "Idnes"    | new ParseFromFile().getEmptyDocument() | ""
        "Novinky"  | new ParseFromFile().getEmptyDocument() | ""

    }

    @Unroll
    def "get number of comment to one specific article on #portalName"() {
        given:
        def extractor = this."extractMetaFromArticle${portalName}"
        when:
        int number = extractor.getNumburOfComment(articleAsDocument)
        then:
        number == numberOfComments
        where:
        portalName | articleAsDocument                                                      | numberOfComments
        "Lidovky"  | new ExtractMetaFromArticleLidovkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleLidovkyPreparedData().getNumberOfComments()
        "Idnes"    | new ExtractMetaFromArticleIdnesPreparedData().getArticleAsDocument()   | new ExtractMetaFromArticleIdnesPreparedData().getNumberOfComments()
        "Novinky"  | new ExtractMetaFromArticleNovinkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleNovinkyPreparedData().getNumberOfComments()
    }

    @Unroll
    def "get created date from article on #portalName"() {
        given:
        def extractor = this."extractMetaFromArticle${portalName}"
        when:
        def dateFromArticle = extractor.getCreatedDate(articleAsDocument)
        println "datum z artikli " + dateFromArticle
        DateFormat df = new SimpleDateFormat("MM/dd/yyyy HH:mm", new Locale("cze", "CZ"))
        String reportDate = df.format(dateFromArticle)
        println "report date " + reportDate
        then:
        reportDate == date
        where:
        portalName | articleAsDocument                                                      | date
        "Lidovky"  | new ExtractMetaFromArticleLidovkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleLidovkyPreparedData().getDate()
        "Idnes"    | new ExtractMetaFromArticleIdnesPreparedData().getArticleAsDocument()   | new ExtractMetaFromArticleIdnesPreparedData().getDate()
        "Novinky"  | new ExtractMetaFromArticleNovinkyPreparedData().getArticleAsDocument() | new ExtractMetaFromArticleNovinkyPreparedData().getDate()

    }
}
