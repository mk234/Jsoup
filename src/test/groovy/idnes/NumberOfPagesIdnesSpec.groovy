package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.idnes.NumberOfPagesIdnes
import idnes.source.NumberOfPagesIdnesPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class NumberOfPagesIdnesSpec extends Specification {


    NumberOfPagesIdnesPreparedData preparedData = new NumberOfPagesIdnesPreparedData()
    @Autowired
    NumberOfPagesIdnes numberOfPages

    def "number of pages in archive"() {
        when:
        def pages = numberOfPages.numberOfPagesArchive(preparedData.getDocumentForArchive(), preparedData.getSelectorContent())
        then:
        pages == preparedData.getNumberOFPagesInArchive()
    }

    def "number of comment's pages in one article"() {
        when:
        def pages = numberOfPages.numberOfPagesComment(preparedData.getDocumentForComment())
        then:
        pages == preparedData.getNumberOfPagesInArticle()
    }
}
