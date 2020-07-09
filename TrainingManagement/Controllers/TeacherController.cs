using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using TrainingManagement.Common;
using TrainingManagement.Models;

namespace TrainingManagement.Controllers
{
    public class TeacherController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Trainee()
        {
            return View();
        }

        [HttpPost]
        public string GetTrainingTableData(int pageSize, int curPage, int no_teacher)
        {
            String json = "";
            ArrayList list = new ArrayList();
            TableResData tableResData = new TableResData();
            // List<User> list = new List<User>();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("select * from ma_training where no_teacher=" + no_teacher);

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

                string[] removeArr = new string[] { "no_teacher", "kin_training", "nm_content" };
                ArrayList al = Commons.ResTableDataFormat(list, removeArr, curPage, pageSize);

                Commons.SetTableResData(tableResData, "200", al, "success", curPage.ToString(), true, totalRows.ToString());

            }

            json = JsonConvert.SerializeObject(tableResData);

            return json;
        }

        [HttpPost]
        public string SendEndReport(int no_training)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("SELECT * FROM tr_training_history WHERE flg_completion=0 AND no_training='" + no_training + "'");

            while (reader.Read())
            {
                TrainHistory trainHistory = new TrainHistory();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    trainHistory.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(trainHistory, reader[i]);
                }

                list.Add(trainHistory);
            };

            if(list.Count != 0)
            {
                Commons.SetResData(responseData, "204", list, "fail");
            }
            else
            {
                reader = sqlHelper.GetCommand("UPDATE ma_training SET flg_completion=1 WHERE no_training=" + no_training);

                if (reader.RecordsAffected != 0)
                {
                    Commons.SetResData(responseData, "200", list, "success");
                }
                else
                {
                    Commons.SetResData(responseData, "400", list, "Update is fail");
                }
            }

            sqlHelper.CloseConn();

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }

        [HttpPost]
        public string SendTextOrder(int no_training, int no_user, int su_people)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("UPDATE ma_training SET flg_textorder=1 WHERE no_training=" + no_training);

            if (reader.RecordsAffected != 0)
            {
                //重複しない乱数を生成する
                byte[] buffer = Guid.NewGuid().ToByteArray();
                int iSeed = BitConverter.ToInt32(buffer, 0);
                Random random = new Random(iSeed);
                decimal kin = 1000 * su_people;

                DateTime date = DateTime.Now;
                string datetime = date.Year.ToString() + "/" + date.Month + "/" + date.Day;

                reader = sqlHelper.GetCommand("INSERT INTO tr_text_order(no_order,no_training,kin_order,dt_order,su_order,no_orderer,remarks_order) VALUES (" + random.Next() + "," + no_training + "," + kin + ",'" + datetime + "'," + su_people + "," + no_user + ",'')");

                if(reader.RecordsAffected != 0)
                {
                    Commons.SetResData(responseData, "200", list, "success");
                }
                else
                {
                    Commons.SetResData(responseData, "400", list, "Update is fail");
                }
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
        public string GetTextOrder(int no_training)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("select * from tr_text_order where no_training='" + no_training + "'");

            while (reader.Read())
            {

                TextOrder textOrder = new TextOrder();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    textOrder.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(textOrder, reader[i]);
                }

                list.Add(textOrder);
            }

            sqlHelper.CloseConn();

            if (list.Count == 0)
            {
                Commons.SetResData(responseData, "400", list, "Not find training with this no_training");
            }
            else
            {
                string[] removeArr = new string[] {};

                ArrayList al = Commons.ResDataFormat(list, removeArr);

                Commons.SetResData(responseData, "200", al, "success");
            }

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }

        [HttpPost]
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

                string[] removeArr = new string[] { };
                ArrayList al = Commons.ResTableDataFormat(list, removeArr, curPage, pageSize);

                Commons.SetTableResData(tableResData, "200", al, "success", curPage.ToString(), true, totalRows.ToString());

            }

            json = JsonConvert.SerializeObject(tableResData);

            return json;
        }

        [HttpPost]
        public string SendGuide(int no_training)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("UPDATE tr_training_history SET flg_training_guide=1 WHERE no_training='" + no_training + "'");

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
        public string SendText(int no_training)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("UPDATE tr_training_history SET flg_text=1 WHERE no_training='" + no_training + "'");

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
        public string sendPassArr(int[] pass_array, int[] nopass_array)
        {
            Console.WriteLine("pass_array:" + pass_array.Length);
            Console.WriteLine("nopass_array:" + nopass_array.Length);

            string pass_sql = "";
            string nopass_sql = "";
            string zb_sql = "";

            for(int i=0; i< pass_array.Length; i++)
            {
                pass_sql += "WHEN " + pass_array[i] + " THEN 1 ";
                zb_sql += pass_array[i] + ",";
            }

            for(int j=0; j< nopass_array.Length; j++)
            {
                nopass_sql += "WHEN " + nopass_array[j] + " THEN 2 ";
                zb_sql += nopass_array[j] + ",";
            }

            zb_sql = zb_sql.Remove(zb_sql.Length - 1);

            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();
            string sql = "UPDATE tr_training_history SET flg_completion = CASE no_training_history " + pass_sql + nopass_sql + "END WHERE no_training_history IN (" + zb_sql + ")";

            Console.WriteLine(sql);

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand(sql);

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
    }
}
