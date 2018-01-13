package idnes

import com.kment.jsoup.Application
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

@SpringBootTest
@ContextConfiguration(classes = Application)
class PrepareUrlForArchives extends Specification {

    @Autowired
    PrepareUrlForArchives prepareUrlForArchives

    def "get url for date 1.1.2016"() {
        when:
        Date date = new Date(2016, 1, 1)
        String url = prepareUrlForArchives.prepareUrl(date)
        then:
       // url == "https://zpravy.idnes.cz/archiv.aspx?datum=1.+1.+2016&idostrova=zpravodaj"
        url == "lala"
    }
}
