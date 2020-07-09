using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TrainingManagement.Common;
using TrainingManagement.Models;

namespace TrainingManagement.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Trainee()
        {
            return View();
        }

        public string GetTraineeTableData(int pageSize, int curPage, int no_training)
        {

            String json = "";
            ArrayList list = new ArrayList();
            TableResData tableResData = new TableResData();

            SqlHelper sqlHelper = new SqlHelper();

            var sql_string = "SELECT a.no_training_history,a.no_training,a.flg_completion,a.flg_completion_certificate,a.flg_training_guide,a.flg_text,b.nm_training,b.flg_textorder,c.no_employee,c.nm_user,c.mail,d.nm_department"
                              + " FROM tr_training_history a,ma_training b, ma_user c,ma_department d"
                              + " WHERE a.no_training = b.no_training"
                              + " AND a.no_trainee = c.no_user"
                              + " AND c.no_department = d.no_department"
                              + " AND a.no_training = '" + no_training.ToString() + "'";

            MySqlDataReader reader = sqlHelper.GetCommand(sql_string);

            while (reader.Read())
            {

                TraineeHistory traineeHistory = new TraineeHistory();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    traineeHistory.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(traineeHistory, reader[i]);
                }

                list.Add(traineeHistory);
            }

            sqlHelper.CloseConn();

            //データがない時
            if (list.Count == 0)
            {
                Commons.SetTableResData(tableResData, "400", list, "", "1", true, "0");
            }
            else
            {
                int totalRows = list.Count;

                string[] removeArr = new string[] {};
                ArrayList al = Commons.ResTableDataFormat(list, removeArr, curPage, pageSize);

                Commons.SetTableResData(tableResData, "200", al, "success", curPage.ToString(), true, totalRows.ToString());

            }

            json = JsonConvert.SerializeObject(tableResData);

            return json;
        }

        [HttpPost]
        public string PersonlCertificateUpdate(int no_training_history)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("UPDATE tr_training_history SET flg_completion_certificate=1 WHERE no_training_history='" + no_training_history + "'");

            if (reader.RecordsAffected == 1)
            {
                Commons.SetResData(responseData, "200", list, "success");
            }
            else
            {
                Commons.SetResData(responseData, "400", list, "Update is fail");
            }

            sqlHelper.CloseConn();

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }

        [HttpPost]
        public string AllCertificateUpdate(int no_training)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("UPDATE tr_training_history SET flg_completion_certificate=1 WHERE no_training='" + no_training + "'");

            if (reader.RecordsAffected != 0)
            {
                Commons.SetResData(responseData, "200", list, "success");
            }
            else
            {
                Commons.SetResData(responseData, "400", list, "Update is fail");
            }

            sqlHelper.CloseConn();

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }

        [HttpPost]
        public string GetTrainingTableData(int pageSize, int curPage)
        {
            String json = "";
            ArrayList list = new ArrayList();
            TableResData tableResData = new TableResData();
            // List<User> list = new List<User>();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("select * from ma_training where flg_completion=1");

            while (reader.Read())
            {

                Training training = new Training();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    training.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(training, reader[i]);
                }

                list.Add(training);
            }

            sqlHelper.CloseConn();

            //データがない時
            if (list.Count == 0)
            {
                Commons.SetTableResData(tableResData, "400", list, "", "1", true, "0");
            }
            else
            {
                int totalRows = list.Count;

                string[] removeArr = new string[] { "no_teacher", "kin_training", "nm_content"};
                ArrayList al = Commons.ResTableDataFormat(list, removeArr, curPage, pageSize);

                Commons.SetTableResData(tableResData, "200", al, "success", curPage.ToString(), true, totalRows.ToString());

            }

            json = JsonConvert.SerializeObject(tableResData);

            return json;
        }

        [HttpPost]
        public string SendBill(int no_training, int no_user)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();
            Boolean succ_flg = true;

            string sql = "SELECT COUNT(a.no_training_history) as su_people ,b.nm_department, b.no_department,COUNT(a.no_training_history)*d.kin_training as kin_training"
                        + " FROM tr_training_history a, ma_department b, ma_user c, ma_training d"
                        + " WHERE a.no_trainee = c.no_user"
                        + " AND b.no_department = c.no_department"
                        + " AND a.no_training = d.no_training"
                        + " AND a.no_training = '" + no_training + "'"
                        + " GROUP BY b.no_department";

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand(sql);

            while (reader.Read())
            {

                Bill bill = new Bill();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    bill.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(bill, reader[i]);
                }

                list.Add(bill);
            }

            if(list.Count == 0)
            {
                Commons.SetResData(responseData, "400", list, "Update is fail");
            }
            else
            {
                //重複しない乱数を生成する
                byte[] buffer = Guid.NewGuid().ToByteArray();
                int iSeed = BitConverter.ToInt32(buffer, 0);
                Random random = new Random(iSeed);

                DateTime date = DateTime.Now;
                string datetime = date.Year.ToString() + "/" + date.Month + "/" + date.Day;


                for (int i = 0; i < list.Count; i++)
                {
                    reader = sqlHelper.GetCommand("INSERT INTO tr_bill(no_bill,no_training,kin_bill,dt_bill,no_department, no_user) VALUES (" + random.Next() + "," + no_training + "," + ((Bill)list[i]).kin_training + ",'"+ datetime +"'," + ((Bill)list[i]).no_department + "," + no_user + ")");

                    if(reader.RecordsAffected == 0)
                    {
                        Commons.SetResData(responseData, "400", new ArrayList(), "Update is fail");
                        succ_flg = false;
                        break;
                    }
                }

                list.Clear();

                if (succ_flg)
                {
                    reader = sqlHelper.GetCommand("UPDATE tr_training_history SET flg_bill=1 WHERE no_training=" + no_training);

                    //更新が失敗した時
                    if (reader.RecordsAffected == 0)
                    {
                        Commons.SetResData(responseData, "400", list, "Update is fail");
                    }
                    else
                    {
                        reader = sqlHelper.GetCommand("UPDATE ma_training SET flg_claim=1 WHERE no_training=" + no_training);

                        //更新が失敗した時
                        if (reader.RecordsAffected == 0)
                        {
                            Commons.SetResData(responseData, "400", list, "Update is fail");
                        }
                        else
                        {
                            Commons.SetResData(responseData, "200", list, "success");
                        }
                    }
                }
            }

            sqlHelper.CloseConn();

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }
    }
}
