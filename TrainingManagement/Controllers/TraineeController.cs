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
    public class TraineeController : Controller
    {
        /// <summary>
        /// メニュー画面（受講者）
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// メニュー画面（受講者）研修データを取得する
        /// </summary>
        /// <param name="pageSize">一ページのデータ数（9）</param>
        /// <param name="curPage">ページ数（初期の時は1）</param>
        /// <returns></returns>
        [HttpPost]
        public string GetTableData(int pageSize, int curPage)
        {
            String json = "";
            ArrayList list = new ArrayList();
            TableResData tableResData = new TableResData();
            // List<User> list = new List<User>();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("select * from ma_training ");

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
                Commons.SetTableResData(tableResData, "400", list, "","1",true,"0");
            }
            else
            {
                int totalRows = list.Count;

                string[] removeArr = new string[] { "nm_venue", "no_teacher", "kin_training", "nm_content", "flg_textorder", "su_people", "flg_completion", "flg_claim" }; 
                ArrayList al = Commons.ResTableDataFormat(list, removeArr, curPage, pageSize);

                Commons.SetTableResData(tableResData, "200", al, "success", curPage.ToString(), true, totalRows.ToString());

            }

            json = JsonConvert.SerializeObject(tableResData);

            return json;
        }

        /// <summary>
        /// 研修案内画面
        /// </summary>
        /// <returns></returns>
        public IActionResult Receipt()
        {
            return View();
        }

        /// <summary>
        /// 案内画面の研修内容を取得する
        /// </summary>
        /// <param name="no_training">研修番号</param>
        /// <param name="no_user">利用者番号</param>
        /// <returns></returns>
        public string SelectTrainingData(string no_training, string no_user)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("select * from ma_training where no_training='"+ no_training +"'");

            while (reader.Read())
            {

                Training training = new Training();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    training.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(training, reader[i]);
                }

                list.Add(training);
            }

            if(list.Count == 0)
            {
                Commons.SetResData(responseData, "400", list, "Not find training with this no_training");
            }
            else
            {
                string[] removeArr = new string[] { "nm_content", "flg_textorder", "su_people", "flg_completion", "flg_claim" };

                ArrayList al = Commons.ResDataFormat(list, removeArr);

                list.Clear();

                reader = sqlHelper.GetCommand("select * from tr_training_history where no_training='" + no_training + "' and no_trainee='" + no_user + "'");

                while (reader.Read())
                {
                    TrainHistory history = new TrainHistory();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        history.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(history, reader[i]);
                    }

                    list.Add(history);
                }

                //履歴があるかどうかのフラグ（0:履歴があるそして申込中;1:は履歴があるそして取消;2:履歴がない）
                int flg_history = 2;

                if (list.Count != 0)
                {
                    flg_history = ((TrainHistory)list[0]).flg_status;
                }
               
                ((JObject)al[0]).Add("flg_history", flg_history);


                Commons.SetResData(responseData, "200", al, "success");
            }

            sqlHelper.CloseConn();

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }


        /// <summary>
        /// 研修の参加
        /// </summary>
        /// <param name="no_training">研修番号</param>
        /// <param name="no_user">利用者番号</param>
        /// <returns></returns>
        [HttpPost]
        public string JoinTraining(int no_training, int no_user)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();
            Boolean succ_flg = true;

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("UPDATE tr_training_history SET flg_status=0 WHERE no_training='" + no_training + "' AND 	no_trainee='" + no_user + "'");

            //取消状態中の時
            if (reader.RecordsAffected == 0)
            {
                //研修履歴トランの中にデータがない時

                //重複しない乱数を生成する
                byte[] buffer = Guid.NewGuid().ToByteArray();
                int iSeed = BitConverter.ToInt32(buffer, 0);
                Random random = new Random(iSeed);

                reader = sqlHelper.GetCommand("INSERT INTO tr_training_history (no_training_history,no_training,no_trainee,flg_status,flg_bill,flg_text,flg_training_guide,flg_completion,flg_completion_certificate) VALUES (" + random.Next() + "," + no_training + "," + no_user + ",0,0,0,0,0,0)");

                //追加が失敗した時
                if (reader.RecordsAffected == 0)
                {
                    succ_flg = false;
                    Commons.SetResData(responseData, "400", list, "Update is fail");
                }

            }

            //受講人数の追加
            if (succ_flg)
            {
                reader = sqlHelper.GetCommand("UPDATE ma_training SET su_people=su_people+1 where no_training='" + no_training + "'");

                //追加が失敗した時
                if(reader.RecordsAffected == 0)
                {
                    Commons.SetResData(responseData, "400", list, "Update is fail");
                }
                else
                {
                    Commons.SetResData(responseData, "200", list, "success");
                }
            }

            sqlHelper.CloseConn();

            json = JsonConvert.SerializeObject(responseData);

            return json;

        }

        [HttpPost]
        public string CancelTraining(int no_training, int no_user)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();
            Boolean succ_flg = true;

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("UPDATE tr_training_history SET flg_status=1 WHERE no_training='" + no_training + "' AND 	no_trainee='" + no_user + "'");

            if (reader.RecordsAffected == 0)
            {
                succ_flg = false;
                Commons.SetResData(responseData, "400", list, "Update is fail");
            }

            if (succ_flg)
            {
                reader = sqlHelper.GetCommand("UPDATE ma_training SET su_people=su_people-1 where no_training='" + no_training + "'");

                if(reader.RecordsAffected == 0)
                {
                    Commons.SetResData(responseData, "400", list, "Update is fail");
                }
                else
                {
                    Commons.SetResData(responseData, "200", list, "success");
                }
            }



            sqlHelper.CloseConn();

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }

        /// <summary>
        /// 研修詳細画面
        /// </summary>
        /// <returns></returns>
        public IActionResult Guide()
        {
            return View();
        }

        /// <summary>
        /// 研修詳細画面のデータ
        /// </summary>
        /// <param name="no_training">研修番号</param>
        /// <returns></returns>
        public string SelectTrainingDetails(string no_training)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("select * from ma_training where no_training='" + no_training + "'");

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

            if (list.Count == 0)
            {
                Commons.SetResData(responseData, "400", list, "Not find training with this no_training");
            }
            else
            {
                string[] removeArr = new string[] {"flg_textorder", "su_people", "flg_completion", "flg_claim" };

                ArrayList al = Commons.ResDataFormat(list, removeArr);

                Commons.SetResData(responseData, "200", al, "success");
            }

            json = JsonConvert.SerializeObject(responseData);

            return json;
        }

    }
}
