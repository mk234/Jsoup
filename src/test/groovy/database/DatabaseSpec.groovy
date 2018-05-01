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
import spock.lang.Specification

import java.text.SimpleDateFormat

@Transactional
@SpringBootTest(classes = Application.class)
class DatabaseSpec extends Specification {

    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository
    @Autowired
    IPortalSpringDataRepository portalSpringDataRepository

    def "mock save portal"() {
        given:
        def portal = new Portal(name: "iDnes")
        IPortalSpringDataRepository iPortal = Mock()
        when:
        iPortal.save(portal)
        then:
        1 * iPortal.save(portal)
    }


    @Rollback
    def "save article to db and read it"() {
        given:
        String expectedArticleName = "test article"
        Article newArticle = new Article(name: expectedArticleName)
        when:
        Article article = articleSpringDataRepository.save(newArticle)
        String realArticleName = articleSpringDataRepository.findOne(article.getId()).getName()
        then:
        expectedArticleName == realArticleName
    }

    @Rollback
    def "update date of last collection and return new value"() {
        given:
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy")
        final Calendar calendar = Calendar.getInstance()
        calendar.add(Calendar.DATE, -1)
        Date yesterday = calendar.getTime()
        String day = new DateTime(yesterday).toString("dd.MM.yyyy")
        Date oldDate = simpleDateFormat.parse(day)
        when:
        Article article = articleSpringDataRepository.save(new Article(lastCollection: oldDate))
        Date oldDateFromArticle = article.getLastCollection()
        article.setLastCollection(new Date())
        Article updateArticle = articleSpringDataRepository.save(article)
        then:
        oldDateFromArticle.before(updateArticle.getLastCollection())
    }


    @Rollback
    def "find portal by name"() {
        given: "save new portal to db"
        Portal portal = portalSpringDataRepository.save(new Portal(name: "iDNES"))
        when: "finding portal by name"
        List<Portal> portalList = portalSpringDataRepository.findByName("iDNES")
        then: "check if any portal exist"
        portalList.contains(portal)
    }
}
