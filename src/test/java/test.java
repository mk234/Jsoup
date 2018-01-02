import com.kment.jsoup.idnes.ParseName;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class test {
    @Test
    public void testConcatenate() {
        ParseName parseName = new ParseName();
        String result = parseName.regex("<!--googleoff: all--> <a href=\\\"http://muj.idnes.cz/Profil.aspx?id=1184186\\\">P<i>97</i>e<i>91</i>t<i>81</i>r <i>34</i>H<i>35</i>a<i>81</i>r<i>26</i>i<i>24</i>p<i>92</i>r<i>11</i>a<i>46</i>s<i>55</i>a<i>64</i>d <i>28</i>H<i>50</i>a<i>97</i>j<i>97</i>i<i>53</i>č</a> <sup title=\\\"Rozlišovací značka diskutujících se stejným jménem\\\">8<i>49</i>3<i>31</i>0<i>77</i>4<i>50</i>7</sup> \\n\" +\n" +
                "                \"<!--googleon: all-->\"");
        String expected = "Petr Hariprasad Hajič 83047 \\n\" +";
        assertEquals(expected, result);
    }
}
