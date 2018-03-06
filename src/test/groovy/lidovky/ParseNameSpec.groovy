package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.lidovky.Comment.ParseNameLidovky
import lidovky.source.ParseNameLidovkyPreparedData
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = Application.class)
class ParseNameSpec extends Specification {
    @Autowired
    ParseNameLidovky parseName
    ParseNameLidovkyPreparedData preparedData = new ParseNameLidovkyPreparedData()

    def "regex for name"() {
        when:
        String result = parseName.regex(preparedData.getNameForParse())
        then:
        result == preparedData.getName()
    }

    def "parse emtpy name"() {
        when:
        String result = parseName.regex(preparedData.getEmtpyNameForRegex())
        then:
        result == ""
    }


}
