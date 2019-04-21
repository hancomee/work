package com.hancomee.web.domain;

import java.util.Date;

import static java.lang.Integer.parseInt;
import static java.lang.String.valueOf;

public class Lotto {


    public int id;
    public String date;
    public int count;
    public long money;

    public int num1;
    public int num2;
    public int num3;
    public int num4;
    public int num5;
    public int num6;
    public int bonus;

    public Lotto(String id, String date, String n1, String n2, String n3,
                 String n4, String n5, String n6, String bonus, String count, String money) {
        this.id = parseInt(id);
        this.date = date;
        this.count = parseInt(count);
        this.money = Long.parseLong(money);
        this.num1 = parseInt(n1);
        this.num2 = parseInt(n2);
        this.num3 = parseInt(n3);
        this.num4 = parseInt(n4);
        this.num5 = parseInt(n5);
        this.num6 = parseInt(n6);
        this.bonus = parseInt(bonus);
    }

    public Lotto(int id, String date, int n1, int n2, int n3,
                 int n4, int n5, int n6, int bonus, int count, long money) {
        this.id = id;
        this.date = date;
        this.count = count;
        this.money = money;
        this.num1 = n1;
        this.num2 = n2;
        this.num3 = n3;
        this.num4 = n4;
        this.num5 = n5;
        this.num6 = n6;
        this.bonus = bonus;
    }

    public String SQL() {
        String[] values = {
                valueOf(id), "'" + date + "'",
                valueOf(num1), valueOf(num2), valueOf(num3), valueOf(num4), valueOf(num5), valueOf(num6),
                valueOf(bonus), valueOf(count), valueOf(money)
        };
        return "(" + String.join(", ", values) + ")";
    }


    @Override
    public String toString() {
        return SQL();
    }
}
