package com.hancomee.web.lotto;

import com.boosteel.http.HTTP;
import com.boosteel.nativedb.NativeDB;
import com.boosteel.util.support.Patterns;
import org.junit.Test;
import org.springframework.boot.test.context.TestComponent;

import javax.security.auth.callback.CallbackHandler;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;
import java.util.regex.Pattern;

import static java.lang.System.arraycopy;

public class LottoManager {

    Pattern p = Pattern.compile("result\">.*?(\\d+)회.*?(\\d+)년.*?(\\d+)월.*?(\\d+)일.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?ball_645.*?(\\d+)<\\/span.*?1등.*?(\\d+)<\\/td.*?\"tar\">(.*?)원");

    boolean load = false;
    NativeDB nativeDB;
    Connection con;
    Statement stmt;
    List<Lotto> list;

    @Test
    public void run() throws Exception {

        /*get(1, 211560);*/

        for(Lotto lotto : list()) {
            out(lotto.id + " / " + count(lotto.nums, new Random(1)));
        }
    }

    @Test
    public void update() throws Exception {
        loadDB();
        com.hancomee.web.domain.Lotto lotto = read();
        update(lotto.id);
        //t();
    }

    public int count(int[] val, Random random) {
        int i = 0;
        do {
            i++;
        } while(!equals(val, random(random)));
        return i;
    }

    /*
     *  입력해준 값만큼 루프를 돌린 후에 로또 번호를 뽑아준다.
     */
    public void get(long seed, int loop) throws Exception {
        Random random = new Random(seed);
        int i = 0;
        int[] values = null;
        while (i++ < loop) {
            values = random(random);
        }
        matched(values);
        out("\n\n" + toString(values));
    }


    /*
     *
     *  어떤 번호가
     *  count 횟수만큼 반복된 번호가 나왔을때,
     *  해당 회전수를 알려준다.
     */
    public int getPos(int count, Random random) throws Exception {
        Map<Integer, Integer> map = new HashMap<>();
        Integer v;
        int i = 0;
        while (i++ < 9999999) {
            int[] values = random(random);
            for (Lotto ln : list()) {
                if (ln.matched(values) == 6) {
                    v = map.get(ln.id);
                    if (v == null) v = 0;
                    v++;
                    out(v + " / " + i + ") " + ln);
                    if (v == count) return i;
                    map.put(ln.id, v);
                }
            }
        }
        throw new RuntimeException(p + "번째 매치가 없습니다.");
    }


    HashMap<String, LottoNum> CACHE = new HashMap<>();


    @Test
    public void mm() throws Exception {
        out(toString(matched(new int[]{1, 2, 3, 4, 5, 6})));
    }

    public boolean equals(int[] v1, int[] v2) {
        int i = 0;
        for (int a : v1)
            if (v2[i++] != a) return false;
        return true;
    }

    public boolean equals(int... values) throws Exception {
        for (Lotto lotto : list()) {
            if (lotto.equals(values)) return true;
        }

        return false;
    }

    /*
     *  지금까지 당첨번호들을 대상으로 자릿수를 맞춰본다.
     *  매치된 갯수를 알려준다.
     */
    public int[] matched(int... values) throws Exception {

        int[] matched = new int[]{0, 0, 0, 0, 0, 0};

        for (LottoNum num : com(values, new HashSet<>())) {

            for (Lotto lotto : list()) {
                num.count(lotto);
            }
            if (num.count() > 0) {
                matched[num.values().length - 1] += num.count();
                out(num + " (" + num.count() + ")");

                if (num.values().length > 3)
                    out(num + " (" + num.count() + ") / " + num.matchedStr());
            }
        }

        return matched;
    }


    @Test
    public void t() throws Exception {

        List<Lotto> list = list();
        for (Lotto num : list) {
            Set<LottoNum> set = com(num.nums, new HashSet<>());
            for (LottoNum s : set) {
                for (Lotto n : list)
                    s.count(n);
            }
        }

        Set<LottoNum> lottoNums = new TreeSet<>(CACHE.values());
        List<String> values = new ArrayList<>();
        for (LottoNum n : lottoNums) {

            values.add("(" + n.count() + ", '" + n + "', " + n.values().length + ")");

            if (n.count() > 1)
                out(n.count() + ")\t\t\t" + n);
        }

        String sql = "INSERT INTO lotto_nums (count, nums, volumne) VALUES " +
                String.join(", ", values);

        stmt.executeUpdate("DELETE FROM lotto_nums");
        out(stmt.executeUpdate(sql));
    }

    // 모든 경우의 수를 통합해 관리한다.
    public LottoNum cache(int... values) {
        String s = LottoNum.toString(values);
        LottoNum lottoNum = CACHE.get(s);
        if (lottoNum == null)
            CACHE.put(s, lottoNum = new LottoNum(values));
        return lottoNum;
    }

    public Set<LottoNum> com(int[] values, Set<LottoNum> result) {

        int l = values.length;

        // 자릿수 루프
        for (int i = 0; i < l; i++) {
            // 고정수
            int v = values[i];
            result.add(cache(v));
            com(v, Arrays.copyOfRange(values, i + 1, values.length), result);
        }
        return result;
    }


    public void com(int num, int[] values, Set<LottoNum> result) {
        int l = values.length;

        for (int i = 0; i < l; i++) {

            // 자릿수
            int s = i + 1;

            for (int ii = 0; ii < l; ii++) {
                int[] r = new int[s + 1];
                r[0] = num;

                if (ii + s <= l) {
                    arraycopy(values, ii, r, 1, s);  // 고정수 삽입
                    result.add(cache(r));
                }
            }
        }
    }

    /*
     *  겹치지 않는 숫자를 뽑아준다.
     */
    public int[] safeRandom() throws Exception {
        int[] lotto = random();
        if (equals(lotto)) return safeRandom();
        return lotto;
    }

    // 로또 추첨번호 하나를 뽑아준다.
    public int[] random() {
        return random(new Random());
    }

    public int[] random(Random random) {
        // 숫자 정렬을 위해 Set을 쓴다.
        Set<Integer> values = new TreeSet<>();
        while (values.size() != 6) {
            values.add(getNum(random));
        }
        return toArray(values);
    }

    // 1...45 중 숫자 하나를 뽑아준다.
    public int getNum() {
        return getNum(new Random());
    }

    public int getNum(Random random) {
        return random.nextInt(45) + 1;
    }

    public void loadDB() throws SQLException {
        if (load) return;

        nativeDB = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hellofunc?useOldAliasMetadataBehavior=true", "root", "ko9984");
        con = nativeDB.getCon();
        stmt = con.createStatement();
        load = true;
    }

    // 342203
    // 11008337

    public List<Lotto> list() throws Exception {
        if (list != null) return list;

        loadDB();
        List<Lotto> values = new ArrayList<>();
        try (ResultSet rs = stmt.executeQuery("SELECT id, date, num1, num2, num3, num4, num5, num6, bonus " +
                "FROM lotto ORDER BY id DESC")) {
            while (rs.next()) {
                values.add(new Lotto(rs.getInt("id"), rs.getString("date"),
                        rs.getInt("num1"), rs.getInt("num2"), rs.getInt("num3"),
                        rs.getInt("num4"), rs.getInt("num5"), rs.getInt("num6"),
                        rs.getInt("bonus")));
            }
        }
        return list = values;
    }


    public void update(int id) throws Exception {
        List<String> values = new ArrayList<>();
        while (id > 0) {
            try (ResultSet rs = stmt.executeQuery("SELECT id FROM lotto WHERE id = " + id)) {
                if (rs.next()) break;
                out(id);
                com.hancomee.web.domain.Lotto lotto = read(id--);
                if (lotto != null) values.add(lotto.toString());
            }
        }

        stmt.executeUpdate("INSERT INTO lotto (id, date, num1, num2, num3, num4, num5, num6, bonus, count, money) VALUES " +
                String.join(", ", values));
    }


    public com.hancomee.web.domain.Lotto read() throws Exception {
        return read("https://www.dhlottery.co.kr/gameResult.do?method=byWin");
    }

    public com.hancomee.web.domain.Lotto read(int id) throws Exception {
        return read("https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=" + id);
    }

    public com.hancomee.web.domain.Lotto read(String url) throws Exception {
        String html = HTTP.get(url, "euc-kr");
        com.hancomee.web.domain.Lotto[] lotto = new com.hancomee.web.domain.Lotto[1];
        Patterns.forEach(p, html, (i, g, id, y, m, d, n1, n2, n3, n4, n5, n6, bonus, count, money) -> {
            String date = y + "-" + m + "-" + d;
            money = money.replaceAll("[^\\d]", "");
            lotto[0] = new com.hancomee.web.domain.Lotto(id, date, n1, n2, n3, n4, n5, n6, bonus, count, money);

        });
        return lotto[0];
    }


    protected static void out(Object obj) {
        System.out.println(obj);
    }

    public static String toString(int... nums) {
        return nums[0] + " " + nums[1] + " " + nums[2] + " " + nums[3] + " " + nums[4] + " " + nums[5];
    }

    public static int matched(int[] nums, int[] numbers) {
        int result = 0, i = 0;
        for (; i < 6; i++)
            if (nums[i] == numbers[i]) result++;
        return result;
    }

    public static int[] toArray(Iterable<Integer> nums) {
        int i = 0;
        for (Integer num : nums) i++;
        int[] values = new int[i];
        i = 0;
        for (Integer num : nums)
            values[i++] = num;
        return values;
    }


}
