ALTER TABLE `ma_user` ADD CONSTRAINT `fk_user_department` FOREIGN KEY (`no_department`) REFERENCES `ma_department`(`no_department`);

ALTER TABLE `ma_training` ADD CONSTRAINT `fk_teacher` FOREIGN KEY (`no_teacher`) REFERENCES `ma_user`(`no_user`);

ALTER TABLE `tr_text_order` ADD CONSTRAINT `fk_order_training` FOREIGN KEY (`no_training`) REFERENCES `ma_training`(`no_training`);

ALTER TABLE `tr_text_order` ADD CONSTRAINT `fk_orderer` FOREIGN KEY (`no_orderer`) REFERENCES `ma_user`(`no_user`);

ALTER TABLE `tr_training_history` ADD CONSTRAINT `fk_history_training` FOREIGN KEY (`no_training`) REFERENCES `ma_training`(`no_training`);

ALTER TABLE `tr_training_history` ADD CONSTRAINT `fk_trainee` FOREIGN KEY (`no_trainee`) REFERENCES `ma_user`(`no_user`);

ALTER TABLE `tr_bill` ADD CONSTRAINT `fk_bill_training` FOREIGN KEY (`no_training`) REFERENCES `ma_training`(`no_training`);

ALTER TABLE `tr_bill` ADD CONSTRAINT `fk_bill_department` FOREIGN KEY (`no_department`) REFERENCES `ma_department`(`no_department`);

ALTER TABLE `tr_bill` ADD CONSTRAINT `fk_bill_user` FOREIGN KEY (`no_user`) REFERENCES `ma_user`(`no_user`);