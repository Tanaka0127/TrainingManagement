--
-- Table structure for table `tr_training_history`
--

DROP TABLE IF EXISTS `tr_training_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tr_training_history` (
  `no_training_history` int(11) NOT NULL,
  `no_training` int(11) NOT NULL COMMENT '研修マスタのPK',
  `no_trainee` int(11) NOT NULL COMMENT '利用者マスタのPK',
  `flg_status` int(1) NOT NULL COMMENT '0:申込;1:取消',
  `flg_bill` int(1) NOT NULL COMMENT '0:未請求;1:請求済み',
  `flg_text` int(1) NOT NULL COMMENT '0:未発送;1:送付した',
  `flg_training_guide` int(1) NOT NULL COMMENT '0:未発送;1:送付済み',
  `flg_completion` int(1) NOT NULL COMMENT '0:未判定;1:合格;2:不合格',
  `flg_completion_certificate` int(1) NOT NULL COMMENT '0:未発送;1:送付済み',
  PRIMARY KEY (`no_training_history`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='全ての研修履歴を保有する';
/*!40101 SET character_set_client = @saved_cs_client */;