package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.extractor.ParseUrl
import org.jsoup.nodes.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ParseUrlSpec extends Specification {

    @Autowired
    ParseUrl parseUrl


    def "parse url and return as jsoup document"() {
        when:
        Document document = parseUrl.parse("https://www.idnes.cz/")
        then:
        document != null
    }
}
