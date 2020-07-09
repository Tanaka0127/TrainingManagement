using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrainingManagement.Models
{
    public class TraineeHistory
    {
        public int no_training_history { get; set; }

        public int no_training { get; set; }

        public int flg_completion { get; set; }

        public int flg_completion_certificate { get; set; }

        public int flg_training_guide { get; set; }

        public int flg_text { get; set; }

        public string nm_training { get; set; }

        public int no_employee { get; set; }

        public int flg_textorder { get; set; }

        public string nm_user { get; set; }

        public string mail { get; set; }

        public string nm_department { get; set; }

    }
}
