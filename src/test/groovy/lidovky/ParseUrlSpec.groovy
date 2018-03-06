package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.lidovky.ParseUrlLidovky
import lidovky.source.ExtractArticlesLidovkyPreparedData
import org.jsoup.nodes.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ParseUrlSpec extends Specification {

    @Autowired
    ParseUrlLidovky parseUrl
    ExtractArticlesLidovkyPreparedData preparedData = new ExtractArticlesLidovkyPreparedData()

    def "test parse url and retunr as jsoup document"() {
        when:
        Document document = parseUrl.parse(preparedData.getUrlForArchive())
        then:
        document != null
    }
}
