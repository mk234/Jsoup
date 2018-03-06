package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.lidovky.PrepareUrlForArchivesLidovky
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification
import spock.lang.Unroll

import java.text.SimpleDateFormat

@SpringBootTest(classes = Application.class)
class PrepareUrlForArchivesSpec extends Specification {

    @Autowired
    PrepareUrlForArchivesLidovky prepareUrlForArchives

    @Unroll
    def "get url for date 1.2.2018"() {
        when:
        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy")
        String dateInString = "01.01.2016"
        Date date = sdf.parse(dateInString)
        String url = prepareUrlForArchives.prepareUrl(date)
        then:
        url == "https://www.lidovky.cz/archiv.aspx?datum=01.01.2016&idostrova=ln_lidovky"
    }

}
