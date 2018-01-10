import com.kment.jsoup.Application
import com.kment.jsoup.idnes.Article.ArticleEntity
import com.kment.jsoup.idnes.Article.IArticleJpaRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@SpringBootTest
@ContextConfiguration(classes = Application)
class ArticleTest extends Specification {

    @Autowired
    IArticleJpaRepository repository

    @Transactional
    def "save article to database"() {
        when:
        def articleEntity = new ArticleEntity("name", "String url", "String created", "String lastCollection", "String keywords")
        println articleEntity.toString()
        repository.save(articleEntity)
        List<ArticleEntity> articleEntityList = repository.findAll()
        then:
        articleEntityList.size() != null
    }
}
