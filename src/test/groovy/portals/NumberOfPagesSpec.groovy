package portals

import com.kment.jsoup.Application
import com.kment.jsoup.idnes.NumberOfPagesIdnes
import com.kment.jsoup.lidovky.NumberOfPagesLidovky
import com.kment.jsoup.novinky.NumberOfPagesNovinky
import idnes.source.NumberOfPagesIdnesPreparedData
import lidovky.source.NumberOfPagesLidovkyPreparedData
import novinky.source.NumberOfPagesNovinkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification
import spock.lang.Unroll

@SpringBootTest(classes = Application.class)
class NumberOfPagesSpec extends Specification {


    @Autowired
    NumberOfPagesLidovky numberOfPagesLidovky

    @Autowired
    NumberOfPagesIdnes numberOfPagesIdnes

    @Autowired
    NumberOfPagesNovinky numberOfPagesNovinky

    @Unroll
    def "number of pages in #portalName archive"() {
        given:
        def extractor = this."numberOfPages${portalName}"
        when:
        def pages = extractor.numberOfPagesArchive(instance.getDocumentForArchive(), instance.getSelectorContent())
        then:
        pages == result
        where:
        portalName | instance                               | result
        "Lidovky"  | new NumberOfPagesLidovkyPreparedData() | new NumberOfPagesLidovkyPreparedData().getNumberOFPagesInArchive()
        "Idnes"    | new NumberOfPagesIdnesPreparedData()   | new NumberOfPagesIdnesPreparedData().getNumberOFPagesInArchive()
    }

    @Unroll
    def "number of comment's pages in one article for #portalName"() {
        given:
        def extractor = this."numberOfPages${portalName}"
        when:
        def pages = extractor.numberOfPagesComment(instance.getDocumentForComment())
        then:
        pages == result
        where:
        portalName | instance                               | result
        "Lidovky"  | new NumberOfPagesLidovkyPreparedData() | new NumberOfPagesLidovkyPreparedData().getNumberOfPagesInArticle()
        "Idnes"    | new NumberOfPagesIdnesPreparedData()   | new NumberOfPagesIdnesPreparedData().getNumberOfPagesInArticle()
        "Novinky"  | new NumberOfPagesNovinkyPreparedData() | new NumberOfPagesNovinkyPreparedData().getNumberOfPagesInArticle()

    }
}
