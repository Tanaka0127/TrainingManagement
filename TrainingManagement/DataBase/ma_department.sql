--
-- Table structure for table `ma_department`
--

DROP TABLE IF EXISTS `ma_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ma_department` (
  `no_department` int(11) NOT NULL  COMMENT '部門番号',
  `cd_department` int(6) NOT NULL COMMENT '部門コード',
  `nm_department` varchar(40) NOT NULL COMMENT '部門名',
  PRIMARY KEY (`no_department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部門マスタ';
/*!40101 SET character_set_client = @saved_cs_client */;

