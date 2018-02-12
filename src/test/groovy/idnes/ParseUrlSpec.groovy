package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.idnes.ParseUrl
import idnes.source.ExtractArticlesIdnesPreparedData
import org.jsoup.nodes.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ParseUrlSpec extends Specification {

    @Autowired
    ParseUrl parseUrl
    ExtractArticlesIdnesPreparedData preparedData = new ExtractArticlesIdnesPreparedData()

    def "test parse url and retunr as jsoup document"() {
        when:
        Document document = parseUrl.parse(preparedData.getUrlForArchive())
        then:
        document != null
    }
}
