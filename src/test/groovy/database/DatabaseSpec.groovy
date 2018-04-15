package database

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.entity.Portal
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import com.kment.jsoup.springdata.IPortalSpringDataRepository
import org.joda.time.DateTime
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import spock.lang.Ignore
import spock.lang.Specification

import java.text.SimpleDateFormat

@Ignore
@Transactional
@SpringBootTest(classes = Application.class)
class DatabaseSpec extends Specification {

    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository
    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository

    @Rollback
    def "save article to db and read it"() {
        when:
        articleSpringDataRepository.flush()
        String expectedArticleName = "test article"
        Article article = articleSpringDataRepository.save(new Article(name: expectedArticleName))
        String realArticleName = article.getName()
        then:
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


    @Rollback
    def "find portal by name"() {
        given:
        Portal portal = portalSpringDataRepository.save(new Portal("iDNES", "www.idnes.cz/", new Date()))
        when:
        List<Portal> portalList = portalSpringDataRepository.findByName("iDNES")
        then:
        portalList.contains(portal)
    }


    def "find yesterday articles"() {
        when:
        List<Article> articleList = articleSpringDataRepository.findByNumberOfDayBeforeToday(1)
        then:
        articleList.size() != 0
    }
}
