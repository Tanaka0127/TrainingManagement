using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrainingManagement.Models
{
    public class Bill
    {
        public Int64 su_people { get; set; }

        public string nm_department { get; set; }
        public int no_department { get; set; }

        public decimal kin_training { get; set; }
    }
}
