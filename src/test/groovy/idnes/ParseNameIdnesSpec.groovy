package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.idnes.Comment.ParseNameIdnes
import idnes.source.ParseNameIdnesPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ParseNameIdnesSpec extends Specification {
    @Autowired
    ParseNameIdnes parseName
ParseNameIdnesPreparedData preparedData = new ParseNameIdnesPreparedData()

    def "regex for name"() {
        when:
        String result = parseName.regex(preparedData.getNameForParse())
        then:
        result == preparedData.getName()
    }

    def "parse emtpy name"(){
        when:
        String result = parseName.regex(preparedData.getEmtpyNameForRegex())
        then:
        result == ""
    }


}
