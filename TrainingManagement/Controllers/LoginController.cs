using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TrainingManagement.Common;
using TrainingManagement.Data;
using TrainingManagement.Models;

namespace TrainingManagement.Controllers
{
    public class LoginController : Controller
    {

        public string index()
        {
            return "This is my default action...";
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public string DoLogin(String user_id, String password)
        {
            String json = "";
            ArrayList list = new ArrayList();
            ResponseData responseData = new ResponseData();

            SqlHelper sqlHelper = new SqlHelper();
            MySqlDataReader reader = sqlHelper.GetCommand("select * from ma_user where nm_account = '"+ user_id + "'");

            while (reader.Read())
             {
            
                User user = new User();
            
                 for (int i = 0; i < reader.FieldCount; i++)
                 {
                    user.GetType().GetProperty(reader.GetName(i).Trim()).SetValue(user, reader[i]);
                  }

                 list.Add(user);
             }

             sqlHelper.CloseConn();

             //ユーザーIDが登録されていない時の処理
             if(list.Count == 0)
              {
                Commons.SetResData(responseData, "400", list, "このユーザーIDは登録されていない");
              }
              else
              {
            
                  //パスワードが不正な時の処理
                  if(((User)list[0]).ps_user != password)
                  {
                    Commons.SetResData(responseData, "400", list, "パスワードが不正です");
                  }
                  else
                    {
            
                      string[] removeArr = new string[] { "ps_user", "no_employee", "no_department", "no_employee", "mail" };

                    ArrayList al = Commons.ResDataFormat(list, removeArr);

                    Commons.SetResData(responseData, "200", al, "success");

                   }
               }

              json = JsonConvert.SerializeObject(responseData);

              return json;
        }
    }
}
