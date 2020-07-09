--
-- Table structure for table `tr_text_order`
--

DROP TABLE IF EXISTS `tr_text_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tr_text_order` (
  `no_order` int(11) NOT NULL,
  `no_training` int(11) NOT NULL COMMENT '研修マスタのPK',
  `kin_order` decimal(20,0) NOT NULL,
  `dt_order` datetime(0) NOT NULL COMMENT '(yyyy/mm/dd)',
  `su_order` int(5) NOT NULL COMMENT '発注のテキストの数量',
  `no_orderer` int(11) NOT NULL COMMENT '利用者マスタのPK',
  `remarks_order` varchar(255) NOT NULL COMMENT '発注の備考',
  PRIMARY KEY (`no_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='全ての発注履歴を保有する';
/*!40101 SET character_set_client = @saved_cs_client */;