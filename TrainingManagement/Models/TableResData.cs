using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrainingManagement.Models
{
    public class TableResData
    {
        public string status { get; set; }

        public ArrayList data { get; set; }

        public string message { get; set; }

        public string curPage { get; set; }

        public Boolean success { get; set; }

        public string totalRows { get; set; }
    }
}
