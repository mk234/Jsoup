import java.io.IOException;
import java.text.ParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    public static void main(String[] args) throws IOException, ParseException {
    //    Comment comment = new Comment();
      //  comment.komenty();
        Pattern p = Pattern.compile("-?\\d+");
        Matcher m = p.matcher("There are more than -2 and less than 12 numbers here");
        while (m.find()) {
            System.out.println(m.group());
        }
    }
}
