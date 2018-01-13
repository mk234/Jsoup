package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.idnes.PrepareUrlForArchives
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import java.text.SimpleDateFormat

@SpringBootTest
@ContextConfiguration(classes = Application)
class PrepareUrlForArchivesSpec extends Specification {

    @Autowired
    PrepareUrlForArchives prepareUrlForArchives

    def "get url for date 1.1.2016"() {
        when:
        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy")
        String dateInString = "01.01.2016"
        Date date = sdf.parse(dateInString)
         String url = prepareUrlForArchives.prepareUrl(date)
        then:
        url == "https://zpravy.idnes.cz/archiv.aspx?datum=01.01.2016&idostrova=zpravodaj"
    }

}
