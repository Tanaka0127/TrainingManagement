using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrainingManagement.Models;

namespace TrainingManagement.Common
{
    public class Commons
    {
    
        public static void SetResData(ResponseData rd, string status, ArrayList list, string msg)
        {
            rd.status = status;
            rd.data = list;
            rd.message = msg;

        }

        public static ArrayList ResDataFormat(ArrayList list, string[] array)
        {
            ArrayList returnArr = new ArrayList();

            for (int i = 0; i < list.Count; i++)
            {
                JObject jObject = JObject.FromObject(list[0]);


                for (int j = 0; j < array.Length; j++)
                {
                    jObject.Remove(array[j]);
                }

                returnArr.Add(jObject);
            }

            return returnArr;
        }

        public static void SetTableResData(TableResData trd, string status, ArrayList list, string msg, string curPage, Boolean succ, string total)
        {
            trd.status = status;
            trd.data = list;
            trd.message = msg;
            trd.curPage = curPage;
            trd.success = succ;
            trd.totalRows = total;
        }

        public static ArrayList ResTableDataFormat(ArrayList list, string[] array, int curPage, int pageSize)
        {
            int startIndex = (curPage - 1) * pageSize;
            int endIndex = list.Count > (startIndex + pageSize) ? startIndex + pageSize : list.Count;
            ArrayList returnArr = new ArrayList();

            for (int i = startIndex; i < endIndex; i++)
            {
                JObject jObject = JObject.FromObject(list[i]);

                for (int j = 0; j < array.Length; j++)
                {
                    jObject.Remove(array[j]);
                }

                returnArr.Add(jObject);
            }

            return returnArr;

        }
    }
}
