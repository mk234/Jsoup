package lidovky

import org.jsoup.nodes.Document
import spock.lang.Specification

class ParseFromFileSpec extends Specification {

    lidovky.source.ParseFromFile parseFromFile = new lidovky.source.ParseFromFile()

    def "get document from local html page"() {
        when:
        Document document = parseFromFile.getDocumentFromFile("html_lidovky/archiv_source/archive_page1.htm")
        then:
        document != null
    }

}
