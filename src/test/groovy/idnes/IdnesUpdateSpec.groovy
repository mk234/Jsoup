package idnes

import com.kment.jsoup.Application
import com.kment.jsoup.entity.Article
import com.kment.jsoup.idnes.IdnesRun
import com.kment.jsoup.idnes.IdnesUpdate
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import com.kment.jsoup.springdata.ICommentSpringDataRepository
import org.joda.time.DateTime
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@Transactional
@SpringBootTest(classes = Application.class)
class IdnesUpdateSpec extends Specification {

    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository
    @Autowired
    IdnesRun idnesRun
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository
    @Autowired
    IdnesUpdate idnesUpdate

    @Rollback
    def "find new comment"() {
        given:
        int sizeArticleList = articleSpringDataRepository.findAll().size()
        int sizeCommentList = commentSpringDataRepository.findAll().size()
        when:
        idnesUpdate.updateIdnes(1)
        int sizeArticleListAfter = articleSpringDataRepository.findAll().size()
        int sizeCommentListAfter = commentSpringDataRepository.findAll().size()
        then:
        sizeArticleList <= sizeArticleListAfter
        sizeCommentListAfter >= sizeCommentList
    }
}
