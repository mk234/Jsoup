import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import org.joda.time.DateTime
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import java.text.SimpleDateFormat

@Transactional
@SpringBootTest(classes = Application.class)
class SaveToDatabaseSpec extends Specification {

    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository

    @Rollback
    def "save article to db and read it"() {
        when:
        String expectedArticleName = "test article"
        Article article = articleSpringDataRepository.save(new Article(name: expectedArticleName))
        String realArticleName = article.getName()
        then:
        println realArticleName
        expectedArticleName == realArticleName
    }

    @Rollback
    def "update date of last collection and return new value"() {
        when:
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy")
        final Calendar calendar = Calendar.getInstance()
        calendar.add(Calendar.DATE, -1)
        Date yesterday = calendar.getTime()
        String day = new DateTime(yesterday).toString("dd.MM.yyyy")
        Date oldDate = simpleDateFormat.parse(day)
        Date newDate = new Date()
        Article article = articleSpringDataRepository.save(new Article(lastCollection: oldDate))
        Date oldDateFromArticle = article.getLastCollection()
        println oldDate
        article.setLastCollection(newDate)
        Article updateArticle = articleSpringDataRepository.save(article)
        println updateArticle.getLastCollection()
        then:
        oldDateFromArticle.before(updateArticle.getLastCollection())


    }


}
