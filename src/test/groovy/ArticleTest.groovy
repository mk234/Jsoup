import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@SpringBootTest
@ContextConfiguration(classes = Application)
class ArticleTest extends Specification {

/*
     def ""() {
        when:

        then:

    }
    */
    @Autowired
    IArticleSpringDataRepository repository

    @Transactional
    def "save article to database"() {
        when:
        def articleEntity = new Article("name", "String url", "String created", "String lastCollection", "String keywords")
        println articleEntity.toString()
        repository.save(articleEntity)
        List<Article> articleEntityList = repository.findAll()
        then:
        articleEntityList.size() != null
    }
}
