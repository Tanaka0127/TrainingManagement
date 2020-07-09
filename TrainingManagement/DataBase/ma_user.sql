--
-- Table structure for table `ma_user`
--

DROP TABLE IF EXISTS `ma_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ma_user` (
  `no_user` int(11) NOT NULL  COMMENT '利用者番号',
  `nm_account` varchar(12) NOT NULL COMMENT '利用者アカウント',
  `ps_user` varchar(12) NOT NULL COMMENT 'パスワード',
  `nm_user` varchar(50) DEFAULT NULL COMMENT '利用者名',
  `flg_user` int(1) DEFAULT NULL COMMENT '利用者種類フラグ',
  `no_department` int(11) DEFAULT NULL COMMENT '所属部門番号',
  `no_employee` int(11) DEFAULT NULL COMMENT '社員番号',
  `mail` varchar(50) DEFAULT NULL COMMENT 'メールアドレス',
  PRIMARY KEY (`no_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='利用者マスタ';
/*!40101 SET character_set_client = @saved_cs_client */;

