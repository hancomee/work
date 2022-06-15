

# select.bank
SELECT this.*
            FROM bank_data this
            WHERE 1
            [AND this.account = :account{i}]
            [AND this.flag = :flag]
            [AND this.money >= :gt{i}]
            [AND this.money <= :lt{i}]
            [AND this.record REGEXP :record]
            [AND this.memo REGEXP :memo]
            [AND this.kind REGEXP :kind]
            [AND this.branch REGEXP :branch]
            [AND this.tags REGEXP :tags]
            [AND this.datetime BETWEEN :st{st} AND :et{et}];

# count.bank
SELECT COUNT(this.id)
            FROM bank_data this
            WHERE 1
            [AND this.account = :account{i}]
            [AND this.flag = :flag]
            [AND this.money >= :gt{i}]
            [AND this.money <= :lt{i}]
            [AND this.record REGEXP :record]
            [AND this.memo REGEXP :memo]
            [AND this.kind REGEXP :kind]
            [AND this.branch REGEXP :branch]
            [AND this.tags REGEXP :tags]
            [AND this.datetime BETWEEN :st{st} AND :et{et}];

# sum.bank
SELECT SUM(CASE When this.flag = true Then this.money Else 0 End) income,
      SUM(CASE When this.flag = false Then this.money Else 0 End) expense
            FROM bank_data this
            WHERE 1
            [AND this.account = :account{i}]
            [AND this.flag = :flag]
            [AND this.money >= :gt{i}]
            [AND this.money <= :lt{i}]
            [AND this.record REGEXP :record]
            [AND this.memo REGEXP :memo]
            [AND this.kind REGEXP :kind]
            [AND this.branch REGEXP :branch]
            [AND this.tags REGEXP :tags]
            [AND this.datetime BETWEEN :st{st} AND :et{et}];


# get.account
SELECT this.* FROM bank_data_account this;