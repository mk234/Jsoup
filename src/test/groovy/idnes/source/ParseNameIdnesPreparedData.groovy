package idnes.source

class ParseNameIdnesPreparedData {
    def getNameForParse(){
        return "<!--googleoff: all--> <a href=\"http://muj.idnes.cz/Profil.aspx?id=196116\">J<i>39</i>a<i>36</i>n <i>23</i>N<i>57</i>o<i>90</i>v<i>58</i>á<i>40</i>k</a> <sup title=\"Rozlišovací značka diskutujících se stejným jménem\">8<i>49</i>7<i>43</i>6<i>29</i>6</sup> \n" +
                "<!--googleon: all-->"
    }

    def getName(){
        return "Jan Novák"
    }

    def getEmtpyNameForRegex(){
        return "\t<!--googleoff: all-->\n" +
                "\t\t\t\t\t\n" +
                "\t\t\t\t\t<a href=\"http://muj.idnes.cz/Profil.aspx?id=1438983\"></a>\n" +
                "\t\t\t\t\t\n" +
                "\t\t\t\t\t<sup title=\"Rozlišovací značka diskutujících se stejným jménem\">2<i>51</i>5<i>82</i>4<i>75</i>8<i>45</i>3</sup>\n" +
                "\t\t\t\t\t\n" +
                "\t\t\t\t\t<!--googleon: all-->"
    }
}
