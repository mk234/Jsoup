package portals

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
        given: "prepare url"
        def url = "https://www.idnes.cz/"
        when: "return parse document from url"
        Document document = parseUrl.parse(url)
        then: "document is not null"
        document != null
    }


    def "parse malformed url and catch exception"() {
        given: "prepare url"
        def url = "chybnaURl"
        when: "return parse document from url"
        Document document = parseUrl.parse(url)
        then: "document is not null"
        Exception e = thrown()
        e.getMessage() == "Malformed URL: " + url
    }

}
