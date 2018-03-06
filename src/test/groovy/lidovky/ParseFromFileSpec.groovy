package lidovky

import org.jsoup.nodes.Document
import spock.lang.Specification

class ParseFromFileSpec extends Specification {

    lidovky.source.ParseFromFile parseFromFile = new lidovky.source.ParseFromFile()

    def "get document from local html page"() {
        when:
        Document document = parseFromFile.getDocumentFromFile("html_lidovky/archiv_source/archiv_2.8.2015_strana1.htm")
        then:
        document != null
    }

}
