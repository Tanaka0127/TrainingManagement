--
-- Table structure for table `ma_training`
--

DROP TABLE IF EXISTS `ma_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ma_training` (
  `no_training` int(11) NOT NULL  COMMENT '研修番号',
  `nm_training` varchar(50) NOT NULL COMMENT '研修名',
  `cd_training` varchar(6) NOT NULL COMMENT '研修コード',
  `dt_starttime` DATE NULL COMMENT '研修開催日',
  `dt_closetime` DATE NULL COMMENT '研修終了日',
  `nm_venue` varchar(100) NULL COMMENT '研修場所',
  `no_teacher` int(11) NULL COMMENT '講師番号',
  `nm_teacher` varchar(50) NULL COMMENT '講師名',
  `kin_training` decimal(10) NULL COMMENT '研修費用',
  `nm_content` varchar(255) NULL COMMENT '研修内容',
  `flg_textorder` int(1) NULL COMMENT 'テキスト発注フラグ', 
  `su_people` int(5) NULL COMMENT '受講者人数',
  `flg_completion` int(1) NULL COMMENT '修了フラグ',
  `flg_claim` int(1) NULL COMMENT '請求フラグ',
  PRIMARY KEY (`no_training`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='研修マスタ';
/*!40101 SET character_set_client = @saved_cs_client */;