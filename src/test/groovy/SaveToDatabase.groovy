import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@Transactional
@SpringBootTest(classes = Application.class)
class SaveToDatabase extends Specification {

    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository

    @Rollback
    def "save article to db and read it"() {
        when:
        String  expectArticleName = "test article"
        Article article = articleSpringDataRepository.save(new Article(name: expectArticleName))
        String realArticleName = article.getName()
        then:
        println realArticleName
       expectArticleName.equals(realArticleName)
    }
}
