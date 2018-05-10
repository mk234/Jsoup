package portals

import com.kment.jsoup.Application
import com.kment.jsoup.idnes.Comment.ParseNameIdnes
import idnes.source.ParseNameIdnesPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ParseNameSpec extends Specification {
    @Autowired
    ParseNameIdnes parseNameIdnes

    def "regex for name"() {
        given:
        def parser = this."parseName${portalName}"
        when:
        String result = parser.regex(instance.getNameForParse())
        then:
        result == instance.getName()
        where:
        portalName | instance
        "Idnes"    | new ParseNameIdnesPreparedData()
    }

    def "parse emtpy name"() {
        given:
        def parser = this."parseName${portalName}"
        when:
        String result = parser.regex(instance.getEmtpyNameForRegex())
        then:
        result == ""
        where:
        portalName | instance
        "Idnes"    | new ParseNameIdnesPreparedData()
    }


}