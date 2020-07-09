using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrainingManagement.Models
{
    public class TextOrder
    {
        public int no_order { get; set; }

        public int no_training { get; set; }

        public decimal kin_order { get; set; }

        public DateTime dt_order { get; set; }

        public int su_order { get; set; }

        public int no_orderer { get; set; }

        public string remarks_order { get; set; }
    }
}
