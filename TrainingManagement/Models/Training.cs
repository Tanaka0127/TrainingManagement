using System;

namespace TrainingManagement.Models
{
    public class Training
    {
        public int no_training { get; set; }

        public string nm_training { get; set; }

        public string cd_training { get; set; }

        public DateTime dt_starttime { get; set; }

        public DateTime dt_closetime { get; set; }

        public string nm_venue { get; set; }

        public int no_teacher { get; set; }

        public string nm_teacher { get; set; }

        public decimal kin_training { get; set; }

        public string nm_content { get; set; }

        public int flg_textorder { get; set; }

        public int su_people { get; set; }

        public int flg_completion { get; set; }

        public int flg_claim { get; set; }
    }
}
