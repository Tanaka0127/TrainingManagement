using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrainingManagement.Models
{
    public class TrainHistory
    {
        public int no_training_history { get; set; }

        public int no_training { get; set; }

        public int no_trainee { get; set; }

        public int flg_status { get; set; }

        public int flg_bill { get; set; }

        public int flg_text { get; set; }

        public int flg_training_guide { get; set; }

        public int flg_completion { get; set; }

        public int flg_completion_certificate { get; set; }
    }
}
