using MySql.Data.MySqlClient;
using System;
using System.Data;

namespace TrainingManagement.Models
{
    public class SqlHelper
    {

        private static string server = "localhost";
        private static string user = "root";
        private static string password = "";
        private static string database = "training_managerment";

        public static MySqlConnection conn;

        public static MySqlConnection GetConn()
        {
            conn = new MySqlConnection("server=" + server + ";user=" + user + ";database=" + database + ";");
            conn.Open();
            return conn;
        }

        public void CloseConn()
        {
            if (conn.State == ConnectionState.Open)
            {
                conn.Close();
                conn.Dispose();
            }
        }

        public MySqlDataReader GetCommand(string sqlStr)
        {
            MySqlDataReader reader = null;


            try
            {
                GetConn();

                MySqlCommand cmd = new MySqlCommand(sqlStr, conn);

                reader = cmd.ExecuteReader();

            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex);
            }

            return reader;

        }

    }
}
