--
-- Table structure for table `tr_bill`
--

DROP TABLE IF EXISTS `tr_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tr_bill` (
  `no_bill` int(11) NOT NULL,
  `no_training` int(11) NOT NULL COMMENT '研修マスタのPK',
  `kin_bill` decimal(20,0) NOT NULL COMMENT '金額＝講義費用*各部門受注人数',
  `dt_bill` datetime(0) NOT NULL COMMENT '(yyyy/mm/dd)',
  `no_department` int(11) NOT NULL COMMENT '部門マスタのPK',
  `no_user` int(11) NOT NULL COMMENT '利用者マスタのPK',
  PRIMARY KEY (`no_bill`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='全ての請求履歴を保有する';
/*!40101 SET character_set_client = @saved_cs_client */;