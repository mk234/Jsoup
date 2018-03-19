package lidovky

import com.kment.jsoup.Application
import com.kment.jsoup.springdata.IArticleSpringDataRepository
import com.kment.jsoup.springdata.ICommentSpringDataRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

@Transactional
@SpringBootTest(classes = Application.class)
class LidovkyUpdateSpec extends Specification {

    @Autowired
    IArticleSpringDataRepository articleSpringDataRepository
    @Autowired
    LidovkyRun lidovkyRun
    @Autowired
    ICommentSpringDataRepository commentSpringDataRepository
    @Autowired
    LidovkyUpdate lidovkyUpdate

    @Rollback
    def "find new comment"() {
        given:
        int sizeArticleList = articleSpringDataRepository.findAll().size()
        int sizeCommentList = commentSpringDataRepository.findAll().size()
        when:
        lidovkyUpdate.updateIdnes(1)
        int sizeArticleListAfter = articleSpringDataRepository.findAll().size()
        int sizeCommentListAfter = commentSpringDataRepository.findAll().size()
        then:
        sizeArticleList <= sizeArticleListAfter
        sizeCommentListAfter >= sizeCommentList
    }
}
