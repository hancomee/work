package com.hancomee.web;

import com.boosteel.http.HTTP;
import com.boosteel.nativedb.NativeDB;
import com.boosteel.util.support.Patterns;
import com.hancomee.web.domain.Lotto;
import org.apache.catalina.LifecycleState;
import org.junit.Test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class LottoTest {

    Pattern p = Pattern.compile("result\">.*?(\\d+)회.*?(\\d+)년.*?(\\d+)월.*?(\\d+)일.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?1등.*?(\\d+)<\\/td.*?\"tar\">(.*?)원");

    boolean load = false;
    NativeDB nativeDB;
    Connection con;
    Statement stmt;

    @Test
    public void run() throws Exception {

        update();

    }

    public void loadDB() throws SQLException {
        if(load) return;

        nativeDB = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hellofunc?useOldAliasMetadataBehavior=true", "root", "ko9984");
        con = nativeDB.getCon();
        stmt = con.createStatement();
        load = true;
    }


    public void update() throws Exception {
        loadDB();
        Lotto lotto = read();
        update(lotto.id);
    }

    public void update(int id) throws Exception {
        List<String> values = new ArrayList<>();
        while(id > 0) {
            try(ResultSet rs = stmt.executeQuery("SELECT id FROM lotto WHERE id = " + id)) {
                if(rs.next()) break;
                out(id);
                Lotto lotto = read(id--);
                if(lotto != null) values.add(lotto.toString());
            }
        }

        stmt.executeUpdate("INSERT INTO lotto (id, date, num1, num2, num3, num4, num5, num6, bonus, count, money) VALUES " +
                String.join(", ", values));
    }


    public Lotto read() throws Exception {
        return read("https://www.dhlottery.co.kr/gameResult.do?method=byWin");
    }

    public Lotto read(int id) throws Exception {
        return read("https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=" + id);
    }

    public Lotto read(String url) throws Exception {
        String html = HTTP.get(url, "euc-kr");
        Lotto[] lotto = new Lotto[1];
        Patterns.forEach(p, html, (i, g, id, y, m, d, n1, n2, n3, n4, n5, n6, bonus, count, money) -> {
            String date = y + "-" + m + "-" + d;
            money = money.replaceAll("[^\\d]", "");
            lotto[0] = new Lotto(id, date, n1, n2, n3, n4, n5, n6, bonus, count, money);

        });
        return lotto[0];
    }

    private void out(Object obj) {
        System.out.println(obj);
    }

}
